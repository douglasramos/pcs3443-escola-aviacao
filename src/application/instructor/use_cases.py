from persistance.persistance import db
from core.models import Instructor, Lesson

from pony.orm import *
from pony.orm.serialization import to_dict
from datetime import datetime, date, time

from core.schemas import InstructorSchema, LessonSchema

from flask import abort


@db_session
def get_instructors_list():
    '''retorna uma lista de dicts com informações de cada instrutor'''

    instructors = Instructor.select()
    schema = InstructorSchema(many=True)
    return schema.dump(list(instructors)).data


@db_session
def get_instructor(id: int):
    """Retorna um instrutor dado um ID"""
    try:
        instr = Instructor[id]
        if instr:
            # Deserializa objeto através do InstructorSchema
            schema = InstructorSchema()
            return schema.dump(instr).data
    except ObjectNotFound:
        abort(404)


@db_session
def insert_new_instructor(name: str, license_number: int, address: str, birth_date: date, email: str, password: str,
                          course_name: str, graduation_date: date, institution: str):

    instr = Instructor(name=name, license_number=license_number, address=address, email=email, password=password,
                       birth_date=birth_date, course_name=course_name, graduation_date=graduation_date,
                       institution=institution)
    commit()
    return {"endpoint": "/api/instructors/" + str(instr.ID)}


@db_session
def delete_instructor(ID: int):
    '''Given an ID, remove an instructor'''

    try:
        instr = Instructor[ID]
        if instr:
            instr.delete()
            commit()
            return 'Instrutor removido com sucesso'
    except ObjectNotFound:
        abort(404)


@db_session
def update_instructor(id: int, **args):

    # nem sempre deseja-se alterar todos os parâmetros, por isso uso o dict **args
    # o args só vai conter os campos que eu desejo alterar

    try:  # verifica-se, inicialmente se o instrutor consta no BD
        instr = Instructor[id]
    except ObjectNotFound:
        abort(404)
    # altera somente os argumentos cujas chaves estão explícitas no args
    instr.set(**args)
    commit()
    return {"endpoint": "/api/instructors/" + str(instr.ID)}


@db_session
def get_lesson_list(id: int):

    try:  # verifica-se, inicialmente se o instrutor consta no BD
        instr = Instructor[id]
    except ObjectNotFound:
        abort(404)

    lessons = select(l for l in Lesson if l.instructor.ID == id)
    schema = LessonSchema(many=True)
    return schema.dump(list(lessons)).data
