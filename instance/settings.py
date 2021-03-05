from enum import IntEnum
import os

from pepr.settings import load_conf

class Mode(IntEnum):
    Testing = 0x00
    Development = 0x01
    Production = 0x02

ModeName = {
    Mode.Testing: 'test',
    Mode.Development: 'dev',
    Mode.Production: 'prod',
}


# TODO: get from cli + default
RUNNING_MODE = Mode.Development
"""
Defines which mode is currently running in order to predefine somes
values.
"""
RUNNING_MODE_NAME = ModeName[RUNNING_MODE]

DEBUG = RUNNING_MODE in (Mode.Development, Mode.Testing)

BASE_DIR = os.path.abspath(
    os.path.dirname(os.path.dirname(__file__))
)

# load from current project's settings (instance/settings/*)
load_conf(
    os.path.join(os.path.dirname(__file__), 'settings'),
    globals=globals()
)

