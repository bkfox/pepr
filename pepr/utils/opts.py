"""
Utlity module used to ease the use of configuration classes like the
django's Model's Meta classes.

The fine-grained inheritance of options is taken in account by declaring
which classes inherit from parent classes.

There are three base classes that can be used:
    - Opts: the class that contain options.
    - Optable: the class for which options are available. It
        holds instances of the different Opts classes, such as
        it is under attribute `'_' + opts_class_snake_name`
    - OptableMeta: metaclass responsible for instanciation and
        inheritances of all Opts presents in an optable.

Example:

    ```
    class MyOptable(opts.Optable):
        class SomeOpts(opts.Opts):
            # only "groups" is inheritable
            _inherited_attr = ('groups',)
            groups = 'group_a'
            abstract = False

    class ChildOptable(MyOptable):
        class SomeOpts:
            abstract = True

    # MyOptable._some_opts is an instance of SomeOpts
    # ChildOptable._some_opts is an instance of another SomeOpts
    # with groups = MyOptable.groups
    ```

"""
from inspect import isclass

# TODO: test complete mechanism & attributes inheritance
#       update module doc (not _some_opts, but SomeOpts) => check also impact
from django.db import models

import foxcms.utils.utils as utils
import foxcms.utils.metaclass as metaclass


class OptableMeta(metaclass.GenericMeta):
    """
    Metaclass for Optable objects. It can handle both model and non-model
    classes.
    """
    def __new__(cls, name, bases, attrs):
        cl = super().__new__(cls, name, bases, attrs)

        # existing opts in parent
        sources = {}
        for base in reversed(bases):
            sources.update({ k: v
                for k, v in base.__dict__.items()
                    if isinstance(v, Opts)
            })

        # run over *all* class attrs to init the Opts
        for k in dir(cl):
            try:
                # on abstract models, may raise exceptions
                v = getattr(cl, k)
            except:
                continue

            if isinstance(v, Opts):
                # when inherited, Opts is an instance
                v = type(v)
            elif not isclass(v) or not issubclass(v, Opts):
                continue

            # create a new type and inherit from parent if there is one
            # in parent (if present only in parent, we skip
            # copy for the child, cause we need to set optable from
            # there).
            source = sources.get(k)
            if source and v is not source:
                v = type(k, (type(source),), dict(v.__dict__ ))

            # set as instance of declared Opts class: allows lot of
            # customization (__init__, properties, etc.)
            setattr(cl, k, v(cl))
        return cl


class Opts:
    """
    Holds the options for a parent containing class. It is instanciated
    by the OptableMeta when creating that parent class.

    An options is an non-private attribute on this
    """
    optable = None
    """
    Back reference to optable class
    """

    def match(self, **opts):
        """
        Return True if the given **opts match self's attributes.
        """
        for opt, value in opts.items():
            if not hasattr(self, opt) or getattr(self, opt) != value:
                return False
        return True

    def __init__(self, optable, **kwargs):
        self.optable = optable
        self.__dict__.update(kwargs)


class Optable(metaclass=OptableMeta):
    pass

class OptableModel(models.Model,metaclass=OptableMeta):
    class Meta:
        abstract = True



