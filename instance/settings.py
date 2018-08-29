from enum import IntEnum
import os

from instance.utils import load_conf

class Mode(IntEnum):
    Testing = 0x00
    Development = 0x01
    Production = 0x02


RUNNING_MODE = Mode.Testing
"""
Defines which mode is currently running in order to predefine somes
values.
"""

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# load from current project's settings (instance/settings/*)
load_conf(
    os.path.join(os.path.dirname(__file__), 'settings'),
    globals = globals()
)


