from persistance.persistance import db
from core.models import Student, Instructor, Lesson
from pony.orm import *


@db_session
def populate_database():
    if not (Student.select().exists()):
        stud1 = Student(name = 'Fábio', address = 'Av. Angélica, 728',
                        birth_date = '1998-10-28')
        stud2 = Student(name = 'Gabriel', address = 'Rua Timbiras, 879',
                        birth_date = '1997-06-15')
        stud3 = Student(name = 'Douglas', address = 'Alameda Santos, 134',
                        birth_date = '1996-12-01')
        stud4 = Student(name = 'Enrique', address = 'Rua Cactos, 867',
                        birth_date = '1997-1-25')
        stud5 = Student(name = 'Gabriel', address = 'Rua Incas, 1378',
                        birth_date = '1996-2-28')

    if not(Instructor.select().exists()):
        instr1 = Instructor(name = 'Jerônimo', license_number = 9853294,
                            address = 'Rua dos camelos, 1386', birth_date = '1985-4-23',
                            course_name = 'Pilotagem de helicópteros', graduation_date = '2014-01-20',
                            institution = 'Escola XX de Julho')

        instr2 = Instructor(name = 'Luciana', license_number = 7548125,
                            address = 'Av. Kennedy, 12', birth_date = '1974-2-21',
                            course_name = 'Mecânica e pilotagem de aeronaves de pequeno porte',
                            graduation_date = '2002-1-31', institution = 'Escola de vôo de Cotia')

        instr3 = Instructor(name = 'Alberto', license_number = 1324578,
                            address = 'Estrada do jaguar, km 72', birth_date = '1990-7-18',
                            course_name = 'Especialização em aviões de grande porte',
                            graduation_date = '2016-12-14', institution = 'Centro de aviação CVT')

        instr4 = Instructor(name = 'Juvenal', license_number = 8987456,
                            address = 'Av. Osnir Santos, 445', birth_date = '1973-5-11',
                            course_name = 'Instruções de vôo gerais', graduation_date = '2008-10-28',
                            institution = 'Escola de pilotagem de Rio Branco')

        instr5 = Instructor(name = 'Acácio', license_number = 7894561,
                            address = 'Rua das nações, 404', birth_date = '1987-9-9',
                            course_name = 'Pilotagem comercial', graduation_date = '2017-8-16',
                            institution = 'Escola holandesa de aviação civil')

    commit()

@db_session
def delete_database():
    db.drop_all_tables(with_all_data = True)