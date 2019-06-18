#!/usr/bin/env python
# -*- coding:utf-8 *-*
import os
import zipfile

from app import setup_app, db
from flask.ext.script import Manager, Shell
from datetime import datetime as dte


BASE_DIR = os.path.abspath(os.path.dirname(__file__))
app = setup_app()
manager = Manager(app)


def make_shell_context():
    return dict(app=app, db=db)

manager.add_command("shell", Shell(make_context=make_shell_context))




if __name__ == '__main__':
    manager.run()
