from persistance.persistance import db
from core.models import Admin

from flask import abort
from pony.orm import *


@db_session
def register_admin(email: str, password: str):
    if((Admin.get(email=email)) != None):
        abort(400, 'Email já cadastrado')

    adm = Admin(email=email, password=password)
    commit()

    return{"endpoint": "/api/admins/" + str(adm.ID)}
