from django.contrib import auth
from django.core.exceptions import PermissionDenied
from django.test import Client, TestCase

# tests use `pepr.content` models in order to have concrete classes.
from ..content.models import Content
from ..perms import roles
from ..perms.models import Authorization, Context, Subscription
from ..perms.roles import Roles


# TODO:
# - test authorizations/permissions with *and* without a model


# - models & queryset:
#   x Context
#   x Accessible
#   - OwnedAccessible
#   - Subscription: get_role
#   - Authorization: as_permission
# x Role
# o Permissions:
# - Consumers:
#   - ContextObserver
# - Serializers:
#   - AccessibleSerializer
# - Forms:
#   - AccessibleForm
# - Mixins:
#   - PermissionMixin
#   - ContextMixin
#   - AccessibleMixin
#   - AcessibleGenericApiMixin
# 



class BaseCase(TestCase):
    context = None
    contents = None

    super_user = None
    anonymous_user = None
    users = None

    def user_role(self, user):
        """
        Return Role expected for the given user
        """
        if user.is_anonymous:
            return roles.AnonymousRole
        if user.is_superuser:
            return roles.AdminRole

        role = next(filter(lambda r: r.name == user.username,
                           Roles.values()))

        role = role if role.access >= roles.MemberRole.access else \
               roles.DefaultRole
        return role(self.context, user, user.subscription)

    def setup_user(self, role):
        access = role.access

        # user
        user=auth.models.User(username=role.name, password='-')
        self.users.append(user)
        user.save()

        # member subscription
        if access >= roles.MemberRole.access:
            user.subscription = Subscription(
                context=self.context, access=access, owner=user
            )
            user.subscription.save()
        else:
            user.subscription = None

    def setup_role(self, role):
        Content(context=self.context, access=role.access).save()
        self.setup_user(role)

    def setUp(self):
        self.context = Context()
        self.context.save()

        self.super_user = auth.models.User.objects.create_superuser(
            'super_user', 'none', password='-'
        )
        self.super_user.save()

        self.anonymous_user = auth.get_user(Client())

        self.users = []
        for role in Roles.values():
            self.setup_role(role)


class ContextCase(BaseCase):
    """
    TestCase for Context model.
    """
    def do_get_special_role(self, user, expected):
        role = self.context.get_special_role(user)
        if expected:
            self.assertEqual(
                role, expected, 'role {} expected for user {}'
                .format(expected.name, user.username)
            )
        else:
            self.assertIsNone(role, 'no role expected')

    def test_get_special_role(self):
        self.do_get_special_role(self.super_user, roles.AdminRole)
        self.do_get_special_role(self.anonymous_user, roles.AnonymousRole)

        for user in self.users:
            self.do_get_special_role(user, None)


    def do_get_role(self, user, expected):
        role = self.context.get_role(user)
        if expected:
            self.assertEqual(role.name, expected.name,
                'role {} expected for user {}'
                .format(expected.name, user.username)
            )
            self.assertEqual(role.user, user)
        else:
            self.assertIsNone(role, 'no role expected')

    def test_get_role(self):
        # - special roles: admin, anonymous, default
        self.do_get_role(self.super_user, roles.AdminRole)
        self.do_get_role(self.anonymous_user, roles.AnonymousRole)

        # - self.users
        for user in self.users:
            role = self.user_role(user)
            self.do_get_role(user, role)


class AccessibleBaseCase(BaseCase):
    """
    TestCase for AccessibleBase model through Accessible
    """
    model = Authorization
    items = None

    def setUp(self):
        super().setUp()
        self.setup_items()

    def setup_items(self, **initkwargs):
        items = [self.model(context=self.context, access=role.access,
                            **initkwargs)
                 for role in Roles.values()]
        for item in items:
            item.save()
        self.items = items

    # queryset
    def do_qs_user(self, user, max_access):
        qs = self.model.objects.user(user)
        qs_ = qs.filter(access__gt=max_access)

        self.assertNotEqual(
            qs.count(), 0, "there should be some content"
        )
        self.assertEqual(
            qs_.count(), 0,
            "presence of objects with to high access: {}".format(qs_)
        )

    def test_qs_user(self):
        for user in self.users:
            role = self.user_role(user)
            self.do_qs_user(user, role.access)

    # delete/save-_by()
    def delete_by_should_raise(self, instance, role, user):
        return not role.has_perm('delete')

    def do_delete_by(self, instance, role, user):
        if role.access < instance.access:
            return True
        if self.delete_by_should_raise(instance, role, user):
            self.assertRaises(
                PermissionDenied, instance.delete_by, role, user
            )
        else:
            instance.delete_by(role, user)

    def test_delete(self):
        for user in self.users:
            role = self.user_role(user)

            for instance in self.items:
                instance.save()
                self.do_delete_by(instance, role, user)

    def save_by_should_raise(self, instance, role, user):
        if role.access < instance.access:
            return True
        return not role.has_perm('update' if instance.id else 'create')

    def do_save_by(self, instance, role, user):
        if self.save_by_should_raise(instance, role, user):
            self.assertRaises(
                PermissionDenied, instance.save_by, role, user
            )
        else:
            instance.save_by(role, user)

    def test_save_by(self):
        for user in self.users:
            role = self.user_role(user)

            for instance in self.items:
                id = instance.id

                # create
                instance.id = None
                self.do_save_by(instance, role, user)

                # update
                instance.id = id
                self.do_save_by(instance, role, user)


class RoleCase(BaseCase):
    def setup_authorizations(self, role):
        access = role.access

        # authorizations (from 0 to access)
        Authorization(context=self.context, access=access,
                      codename=str(access), model=None).save()

        Authorization.objects.bulk_create([
            Authorization(
                context=self.context, access=access,
                codename=str(role.access), model=None,
                granted=role.access == access
            )
            for role in Roles.values()
        ])

    def setup_role(self, role):
        super().setup_role(role)
        self.setup_authorizations(role)

    def do_permissions(self, role):
        perms = role.permissions
        self.assertEqual(
            len(perms), len(Roles.register),
            'wrong permission count for role {}'.format(role.name)
        )

        for perm in perms.values():
            expected = perm.codename == str(role.access)
            self.assertEqual(perm.granted, expected)

    def test_permissions(self):
        for user in self.users:
            role = self.context.get_role(user)
            if isinstance(role, roles.AdminRole):
                continue
            self.do_permissions(role)

    def test_register_unregister_perm(self):
        for user in self.users:
            role = self.context.get_role(user)

            # without instance
            role.register('test_perm', None)
            self.assertTrue(role.has_perm('test_perm', None))
            role.unregister('test_perm', None)
            self.assertFalse(role.has_perm('test_perm', None))

            # with instance
            perm = role.register('test_perm', None)
            self.assertTrue(role.has_perm('test_perm', None))
            role.unregister(instance=perm)
            self.assertFalse(role.has_perm('test_perm', None))


