from pony.orm import *
from persistance.persistance import db
from datetime import datetime, date
from core.lesson.model import Lesson

class Student(db.Entity):
    """Students Entity"""

    # Define o nome da tabela
    _table_ = "students"

    ID = PrimaryKey(int, auto=True)  # o ID será gerado automaticamente
    name = Required(str)
    address = Required(str)
    birth_date = Required(date)
    lesson = Optional(Lesson)