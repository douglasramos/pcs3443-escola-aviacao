from pony.orm import *
from persistance.persistance import db

class Instructor(db.Entity):
    ID = PrimaryKey(int, auto=True) # o ID será gerado automaticamente
    name = Required(str)
    license_number = Required(int)  # número do brevê
    address = Required(str)
    birth_date = Required(str) # depois temos que ver como faz para se usar date ao invés de string
    course_name = Required(str)
    graduation_date = Required(str)  # data de obtenção do diploma. Depois temos que ver como faz para se usar date ao invés de string
    institution = Required(str)
