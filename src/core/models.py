from pony.orm import *
from datetime import datetime, date, time, timedelta
from persistance.persistance import db


class Admin(db.Entity):
    """Admin Entity"""
    _table_ = "Administradores"
    ID = PrimaryKey(int, auto=True)
    email = Required(str, unique=True)
    password = Required(str)


class Student(db.Entity):
    """Students Entity"""

    # Define o nome da tabela
    _table_ = "Alunos"

    ID = PrimaryKey(int, auto=True)
    email = Required(str, unique=True)
    password = Required(str)
    name = Required(str)
    address = Required(str)
    birth_date = Required(date)
    lessons = Set('Lesson')
    flightTime = Optional(timedelta)
    licenseAvailable = Required(bool)
    courseDuration = Required(int)  # duração. em horas, do curso pretendido


class Instructor(db.Entity):
    """Instructors Entity"""

    # Define nome da tabela
    _table_ = "Instrutores"

    ID = PrimaryKey(int, auto=True)
    email = Required(str, unique=True)
    password = Required(str)
    name = Required(str)
    license_number = Required(int)  # número do brevê
    address = Required(str)
    birth_date = Required(date)
    course_name = Required(str)
    graduation_date = Required(date)
    institution = Required(str)
    lessons = Set('Lesson')


class Lesson(db.Entity):
    """Lesson entity"""

    # Define o nome da tabela
    _table_ = "Aulas"

    # o ID será gerado automaticamente, mas pela classe Login
    ID = PrimaryKey(int, auto=True)
    day = Required(date)
    expected_start = Required(time)
    expected_finish = Required(time)
    actual_duration = Optional(time)
    # 1 (a fazer), 2 (ocorrendo), 3 (feita),  4 (avaliada)
    status = Required(int)
    student = Required(Student)
    instructor = Required(Instructor)
    grade = Optional(int)
    comment = Optional(str)
