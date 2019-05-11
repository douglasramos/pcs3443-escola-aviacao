from persistance.persistance import db
from core.student.model import Student

from flask import jsonify
from pony.orm import *
from pony.orm.serialization import to_dict
from datetime import datetime, date

from core.student.schema import StudentSchema

@db_session
def get_students_list():
    '''Retorna uma lista de dicts com informções de cada aluno'''
    
    students = Student.select()
    schema = StudentSchema(many = True)
    return schema.dump(list(students))

@db_session
def get_student(id : int):
    """Retorna um aluno dado um ID"""
    try:
        stud = Student[id]
        if stud:
            # Deserializa objeto através do InstructorSchema
            schema = StudentSchema()
            return schema.dump(stud)
    except ObjectNotFound:
        return 'Aluno não encontrado'
    

@db_session
def insert_new_student(name : str, address : str, birth_date : date):
    stud = Student(name = name, address = address, birth_date = birth_date)
    commit()

    return {"endpoint" : "api/students/" + str(stud.ID)}

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
        return 'Aluno não encontrado'

@db_session
def update_student(id, **args):

    # nem sempre deseja-se alterar todos os parâmetros, por isso uso o dict **args
    # o args só vai conter os campos que eu desejo alterar

    try:  # verifica-se, inicialmente se o instrutor consta no BD
        stud = Student[id]
    except ObjectNotFound:
        return 'Aluno não encontrado', 404
    # altera somente os argumentos cujas chaves estão explícitas no args
    stud.set(**args)
    commit()
    return {"endpoint": "/api/students/" + str(stud.ID)}