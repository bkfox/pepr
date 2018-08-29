from django.contrib import auth
from django.test import Client, TestCase

# tests use `pepr.content` models in order to have concrete classes.
from pepr.content.models import Container, Content
from pepr.perms.models import Authorization, Context, Subscription
from pepr.perms.roles import Roles

import pepr.perms.defaults as defaults

# TODO:
# - test authorizations/permissions with *and* without a model


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
        if user.is_anonymous: return defaults.AnonymousRole
        if user.is_superuser: return defaults.AdminRole

        role = next(Roles.iter().filter(name = user.username))
        return role if role.access >= defaults.MemberRole.access \
                    else defaults.DefaultRole

    def setup_user(self, role):
        access = role.access

        # user
        user = auth.models.User(username = role.name, password='-')
        self.users.append(user)
        user.save()

        # member subscription
        if access >= defaults.MemberRole.access:
            Subscription(
                context = self.context, access = access, user = user
            ).save()

    def setup_role(self, role):
        Content(context = self.context, access = role.access).save()
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
        for role in Roles.iter():
            self.setup_role(role)


class ContextCase(BaseCase):
    def do_get_special_role(self, user, expected):
        role = self.context.get_special_role(user)
        if expected:
            self.assertEqual(role, expected,
                'role {} expected for user {}'.format(expected.name, user.username)
            )
        else:
            self.assertIsNone(role, 'no role expected')

    def test_get_special_role(self):
        self.do_get_special_role(self.super_user, defaults.AdminRole)
        self.do_get_special_role(self.anonymous_user, defaults.AnonymousRole)

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
        self.do_get_role(self.super_user, defaults.AdminRole)
        self.do_get_role(self.anonymous_user, defaults.AnonymousRole)

        # - self.users
        for user in self.users:
            role = self.user_role(user)
            self.do_get_role(user, role)


class AccessibleCase(BaseCase):
    def do_qs_user(self, user, max_access):
        qs = Content.objects.user(user)
        qs_ = qs.filter(access__gt = max_access)

        self.assertNotEqual(qs.count(), 0,
            "there should be some content"
        )
        self.assertEqual(qs_.count(), 0,
            "presence of objects with to high access: {}"
            .format(qs_)
        )

    def test_qs_user(self):
        for user in self.users:
            role = self.user_role(user)
            self.do_qs_user(user, role.access)


# TODO: provides case with Role.defaults set
class RoleCase(BaseCase):
    def setup_authorizations(self, role):
        access = role.access

        # authorizations (from 0 to access)
        Authorization(context = self.context, access = access,
                      codename = str(access), model = None).save()

        Authorization.objects.bulk_create([
            Authorization(
                context = self.context, access = access,
                codename = str(role.access), model = None,
                is_allowed = role.access == access
            )
            for role in Roles.iter()
        ])

    def setup_role(self, role):
        super().setup_role(role)
        self.setup_authorizations(role)


    def do_permissions(self, role):
        perms = role.permissions
        self.assertEqual(len(perms), len(Roles.register),
             'wrong permission count for role {}'.format(role.name)
        )

        for perm in perms.values():
            expected = perm.codename == str(role.access)
            self.assertEqual(perm.is_allowed, expected)

    def test_permissions(self):
        for user in self.users:
            role = self.context.get_role(user)
            if isinstance(role, defaults.AdminRole):
                continue
            self.do_permissions(role)



