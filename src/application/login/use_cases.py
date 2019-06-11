# for debugging purposes
from __future__ import print_function
import sys

from pony.orm import *
from pony.orm.serialization import to_dict
from datetime import datetime, date, time, timedelta
from core.models import Student, Instructor, Admin

from flask import abort


@db_session
def loginURL(email: str, password: str):
    student = Student.get(email=email)
    instructor = Instructor.get(email=email)
    admin = Admin.get(email=email)

    login_params = {}
    if(not(student == None) and not(instructor == None) and not(admin == None)):
        abort(404, 'Email não cadastrado')

    if not(student == None):
        if(not(student.password == password)):
            abort(400, 'Senha incorreta')
        else:
            login_params = {
                "ID": student.ID,
                "email": student.email,
                "password": student.password,
                "type": 'student',
                "name": student.name,
                "url": "/dashboard-student/"
            }
            return login_params

    if(not (instructor == None)):
        if(not(instructor.password == password)):
            abort(400, 'Senha incorreta')
        else:
            login_params = {
                "ID": instructor.ID,
                "email": instructor.email,
                "password": instructor.password,
                "type": 'instructor',
                "name": instructor.name,
                "url": "/dashboard-instructor/"
            }
            return login_params

    if(not (admin == None)):
        if(not(admin.password == password)):
            abort(400, 'Senha incorreta')
        else:
            login_params = {
                "ID": admin.ID,
                "email": admin.email,
                "password": admin.password,
                "type": 'admin',
                "name": 'Administrador',
                "url": "/dashboard-administrator/"
            }
            return login_params
