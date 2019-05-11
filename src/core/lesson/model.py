from pony.orm import *
from datetime import datetime, date
from persistance.persistance import db

# só adotei o nome lesson para não usar class
class Lesson(db.Entity):
    """Lesson entity"""

    # Define o nome da tabela
    _table_ = "lessons"
    
    ID = PrimaryKey(int, auto=True)
    day = Required(date)
    start = Required(date)
    finish = Required(date)
    student = Set('Student')