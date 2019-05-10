import os.path
import glob

def load_conf(*source_dirs, globals = None):
    """
    Load config files from given directory
    """
    for src in source_dirs:
        files = glob.glob(os.path.join(src, '*.conf.py'))
        files.sort()
        for f in files:
            print("config ", f)
            exec(open(f).read(), globals)

