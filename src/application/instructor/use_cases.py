from persistance.persistance import db
from core.instructor.instructor import Instructor

from flask import request
from pony.orm import *
from pony.orm.serialization import to_dict

def get_instructors_list(): # retorna uma lista de dicts com informações de cada instrutor
    with db_session:
        instructor_list = [] # lista de instrutores
        for instr in Instructor.select(): # essa sintaxe (com select, sem argumentos adicionais) percorre todos os elementos do tipo Instructor
            instr_dict = to_dict(instr)
            instructor_list.append(instr_dict)
        return instructor_list

def insert_new_instructor(name: str, license_number : int, address : str, birth_date : str, 
                            course_name : str, graduation_date : str, institution : str):
    with db_session:
        Instructor(name= name, license_number = license_number, address = address, 
                    birth_date = birth_date, course_name = course_name, graduation_date = graduation_date,
                    institution = institution)
        return ("Novo instrutor adicionado com sucesso")

def delete_instructor(ID : int):
    with db_session:
        try:
            instr = Instructor[ID]
            if instr:
                instr.delete()
                return 'Instrutor removido com sucesso!'
        except ObjectNotFound:
                return 'Instrutor não encontrado'

def alter_instructor(**args): # nem sempre deseja-se alterar todos os parâmetros, por isso uso o dict **args
    with db_session:
        # o args só vai conter os campos que eu desejo alterar
        ID = args['ID']
        try: # verifica-se, inicialmente se o instrutor consta no BD
            instr = Instructor[ID]
        except ObjectNotFound:
            return 'Instrutor não encontrado'
        instr.set(**args) # altera somente os argumentos cujas chaves estão explícitas no args
        return ("Informações do instrutor alteradas com sucesso")