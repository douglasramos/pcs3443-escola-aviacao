from pony.orm import *
from persistance.persistance import db
from datetime import datetime, date


class Instructor(db.Entity):
    """Instructors Entity"""

    # Define nome da tabela
    _table_ = "instructors"

    ID = PrimaryKey(int, auto=True)  # o ID será gerado automaticamente
    name = Required(str)
    license_number = Required(int)  # número do brevê
    address = Required(str)
    birth_date = Required(date)  # depois temos que ver como faz para se usar date ao invés de string
    course_name = Required(str)
    graduation_date = Required(date)  # data de obtenção do diploma. Depois temos que ver como faz para se usar date ao invés de string
    institution = Required(str)
