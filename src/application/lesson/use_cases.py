from persistance.persistance import db
from core.models import Lesson, Instructor, Student

from pony.orm import *
from pony.orm.serialization import to_dict
from datetime import datetime, date, time

from core.schemas import LessonSchema, InstructorSchema


@db_session
def get_lessons_list():
    '''retorna uma lista de dicts com informações de cada aula'''

    lessons = Lesson.select()
    schema = LessonSchema(many=True)
    return schema.dump(list(lessons)).data


@db_session
def schedule_class(day: date, expected_start: time, expected_finish: time,
                   student_id: int, instructor_id: int):
    """Agenda uma nova aula, assumindo conhecidos todos os parâmetros"""
    
    # primeiramente verificamos se o instrutor realmente está livre naquele momento. Pensando que vários usuários podem usar o sistema ao mesmo tempo
    query = select(l for l in Lesson if (l.instructor.ID == instructor_id)) # query com todas as aulas do instrutor
    schema = LessonSchema(many=True)
    lesson_list = schema.dump(list(query)).data # lista com todos as aulas do instrutor 

    # definirei as variáveis para encurtar a notação
    nl_s = expected_start # new_lesson expected start
    nl_f = expected_finish # new_lesson expected finish
    
    for l in lesson_list:
        l_s = datetime.strptime(l['expected_start'], "%H:%M:%S").time() # current loop expected start
        l_f = datetime.strptime(l['expected_finish'], "%H:%M:%S").time() # current loop expected finish
        if (((l_s <= nl_f) and (nl_f <= l_f)) or ((l_s <= nl_s) and (nl_s <= l_f)) or ((nl_s < l_s) and (l_f < nl_f))):
            return 'O instrutor selecionado não está disponível'

    new_lesson = Lesson(day = day, expected_start = expected_start,
                        expected_finish = expected_finish, status = 1,
                        student = Student[student_id], instructor = Instructor[instructor_id])
    commit()
    return {"endpoint": "/api/lessons"}

@db_session
def get_lesson(id : int):
    """Returns a lesson, given its ID"""
    try:
        lesson = Lesson[id]
        if lesson:
            schema = LessonSchema()
            return schema.dump(lesson).data
    except ObjectNotFound:
        return 'Aula não encontrada'

@db_session
def delete_lesson(id: int):
    """Deletes a lesson, given its ID"""
    try:
        lesson = Lesson[id]
        if lesson:
            lesson.delete()
            commit()
            return 'Aula removida com sucesso'
    except ObjectNotFound:
        return 'Aula não encontrada'

@db_session
def update_lesson(id : int, **args):
    try:
        lesson = Lesson[id]
    except ObjectNotFound:
        return 'Aula não encontrada'
    # os objetos do tipo datetime requerem um tratamento especial, uma vez que
    # a formatação adotada não é reconhecida automaticamente quando se faz .set(**args)

    lesson.set(**args)
    commit()
    return {"endpoint": "/api/instructors/" + str(lesson.ID)}

@db_session
def get_available_instructors(day: date, start: time, finish: time):
    """Returns a list of instructors IDs for those instuctors who have no classes scheduled between start and finish on a given day"""
    available_instructors_ID = []
    instructor_list = Instructor.select() 
    for instructor in instructor_list:
        available = True
        for lesson in instructor.lessons:
            l_s = lesson.expected_start
            l_f = lesson.expected_finish
            if (((l_s <= finish) and (finish <= l_f)) or ((l_s <= start) and (start <= l_f)) or ((start < l_s) and (l_f < finish))):
                available = False
        if available:
            available_instructors_ID.append(int(instructor.ID))

    return available_instructors_ID