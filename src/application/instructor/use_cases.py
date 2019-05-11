from persistance.persistance import db
from core.instructor.model import Instructor

from flask import jsonify
from pony.orm import *
from pony.orm.serialization import to_dict
from datetime import datetime, date

from core.instructor.schema import InstructorSchema


@db_session
def get_instructors_list():
    '''retorna uma lista de dicts com informações de cada instrutor'''

    instructors = Instructor.select()

    schema = InstructorSchema(many=True)

    return schema.dump(list(instructors))


@db_session
def get_instructor(id: int):
    """Retorna um instrutor dado um ID"""

    instr = Instructor[id]

    # Deserializa objeto através do InstructorSchema
    schema = InstructorSchema()

    return schema.dump(instr)


@db_session
def insert_new_instructor(name: str, license_number: int, address: str, birth_date: date,
                          course_name: str, graduation_date: date, institution: str):

    instr = Instructor(name=name, license_number=license_number, address=address,
                       birth_date=birth_date, course_name=course_name, graduation_date=graduation_date,
                       institution=institution)

    commit()

    return {"endpoint": "/api/instructors/" + str(instr.ID)}


@db_session
def delete_instructor(ID: int):
    '''Given an ID, remove a instructor'''

    try:
        instr = Instructor[ID]
        if instr:
            instr.delete()
            return 'Instrutor removido com sucesso!'
    except ObjectNotFound:
        return 'Instrutor não encontrado'


@db_session
def update_instructor(id, **args):

    # nem sempre deseja-se alterar todos os parâmetros, por isso uso o dict **args
    # o args só vai conter os campos que eu desejo alterar

    try:  # verifica-se, inicialmente se o instrutor consta no BD
        instr = Instructor[id]
    except ObjectNotFound:
        return 'Instrutor não encontrado', 404
    # altera somente os argumentos cujas chaves estão explícitas no args
    instr.set(**args)
    return {"endpoint": "/api/instructors/" + str(instr.ID)}
