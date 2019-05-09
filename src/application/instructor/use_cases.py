from persistance.persistance import db
from core.instructor.instructor import Instructor

from flask import request
from pony.orm import *


def get_instructors_list():
    with db_session:
        return{
            {
                'ID': instructor.ID,
                'Name': instructor.name,
                'License Number': instructor.license_number,
                'Address': instructor.address,
                'Birth Date': instructor.birth_date,
                'Course': instructor.course_name,
                'Graduation Date': instructor.graduation_date,
                'Institution': instructor.institution
            }
            # essa sintaxe (com select, sem argumentos adicionais) percorre todos os items do tipo db_Tarefa
            for instructor in Instructor.select()
        }

def insert_new_instructor(ID : int, name: str, license_number : int, address : str, birth_date : str, 
                            course_name : str, graduation_date : str, institution : str):
    with db_session:
        Instructor(ID = ID, name= name, license_number = license_number, address = address, 
                    birth_date = birth_date, course_name = course_name, graduation_date = graduation_date,
                    institution = institution)
