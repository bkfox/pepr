import os
from setuptools import setup, find_packages

def to_rst(path):
    try:
        from pypandoc import convert
        return convert(path, 'rst')
    except ImportError:
        print("pypandoc module not found, can not convert Markdown to RST")
        return open(path, 'r').read()

def to_array(path):
    with open(path, 'r') as file:
        return [r for r in file.read().split('\n') if r]

setup(
    name='pepr',
    version='0.1',
    license='AGPLv3+',
    author='bkfox',
    description='Social media plateform and framework using Django',
    long_description=to_rst('README.md'),
    url='https://bitbucket.org/pepr-project/pepr/src',
    packages=find_packages(),
    include_package_data=True,
    install_requires=to_array('requirements.txt'),
    classifiers=[
        'License :: OSI Approved :: GNU Affero General Public License v3 or later (AGPLv3+)',
        'Framework :: Django :: 2.2',
        'Programming Language :: Python :: 3.5',
        'Programming Language :: Python :: 3.6',
        'Programming Language :: Python :: 3.7',
        'Topic :: Communications :: BBS',
        'Topic :: Internet :: WWW/HTTP :: Dynamic Content :: Content Management System',
        'Topic :: Internet :: WWW/HTTP :: Dynamic Content :: Message Boards',
        'Topic :: Internet :: WWW/HTTP :: Dynamic Content :: News/Diary',
    ],
)

