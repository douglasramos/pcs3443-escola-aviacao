from persistance.persistance import db
from core.models import Student, Lesson

from flask import jsonify, abort
from pony.orm import *
from pony.orm.serialization import to_dict
from datetime import datetime, date, timedelta

from core.schemas import StudentSchema, LessonSchema


@db_session
def get_students_list():
    '''Retorna uma lista de dicts com informções de cada aluno'''

    students = Student.select()
    schema = StudentSchema(many=True)
    return schema.dump(list(students)).data


@db_session
def get_student(id: int):
    """Retorna um aluno dado um ID"""
    try:
        stud = Student[id]
        if stud:
            # Deserializa objeto através do InstructorSchema
            schema = StudentSchema()
            return schema.dump(stud).data
    except ObjectNotFound:
        abort(404)


@db_session
def insert_new_student(name: str, address: str, birth_date: date):
    flightTimeZero = timedelta(days=0, seconds=0, microseconds=0,
                               milliseconds=0, minutes=0, hours=0, weeks=0)
    stud = Student(name=name, address=address,
                   birth_date=birth_date, flightTime=flightTimeZero)
    commit()

    return {"endpoint": "api/students/" + str(stud.ID)}


@db_session
def delete_student(ID: int):
    '''Given an ID, remove a student'''

    try:
        stud = Student[ID]
        if stud:
            stud.delete()
            commit()
            return 'Aluno removido com sucesso!'
    except ObjectNotFound:
        abort(404)


@db_session
def update_student(id, **args):

    # nem sempre deseja-se alterar todos os parâmetros, por isso uso o dict **args
    # o args só vai conter os campos que eu desejo alterar

    try:  # verifica-se, inicialmente se o instrutor consta no BD
        stud = Student[id]
    except ObjectNotFound:
        abort(404)
    # altera somente os argumentos cujas chaves estão explícitas no args
    stud.set(**args)
    commit()
    return {"endpoint": "/api/students/" + str(stud.ID)}


@db_session
def update_flightTime(id: int, timeToAdd: timedelta):
    stud = Student[id]
    stud.flightTime += timeToAdd
    commit()


@db_session
def get_lesson_list(id: int):
    lessons = []
    lesson_query = Lesson.select()
    try:  # verifica-se, inicialmente se o instrutor consta no BD
        stud = Student[id]
    except ObjectNotFound:
        abort(404)

    for l in lesson_query:
        if l.student.ID == id:
            e_s = l.expected_start.strftime('%H:%M:%S')
            e_f = l.expected_finish.strftime('%H:%M:%S')
            lessons.append(l)
    schema = LessonSchema(many=True)
    return schema.dump(list(lessons)).data
