from persistance.persistance import db
from core.models import Lesson, Instructor, Student

from pony.orm import *
from pony.orm.serialization import to_dict
from datetime import datetime, date, time, timedelta

from flask import abort

from application.student.use_cases import update_flightTime
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
    try:
        student = Student[student_id]
    except ObjectNotFound:
        abort(404)
    # definirei essas variáveis para encurtar a notação
    nl_s = expected_start  # new_lesson expected start
    nl_f = expected_finish  # new_lesson expected finish

    # primeiramente verificamos se o instrutor realmente está livre naquele momento. Pensando que vários usuários podem usar o sistema ao mesmo tempo
    # query com todas as aulas do instrutor
    lesson_query = select(l for l in Lesson if (
        l.instructor.ID == instructor_id))

    for l in lesson_query:
        if(l.day == day):
            l_s = l.expected_start  # expected start for the current lesson of the loop
            l_f = l.expected_finish  # expected finish for the lesson of the current loop
            if (((l_s <= nl_f) and (nl_f <= l_f)) or ((l_s <= nl_s) and (nl_s <= l_f)) or ((nl_s < l_s) and (l_f < nl_f))):
                abort(409, 'Conflito instrutor')

    # em seguida, verificamos se a aula que o aluno deseja agendar não gera conflitos em sua grade
    for lesson in student.lessons:
        if (lesson.day == day):
            l_s = lesson.expected_start
            l_f = lesson.expected_finish
            if (((l_s <= nl_f) and (nl_f <= l_f)) or ((l_s <= nl_s) and (nl_s <= l_f)) or ((nl_s < l_s) and (l_f < nl_f))):
                abort(409, 'Conflito aluno')

    new_lesson = Lesson(day=day, expected_start=expected_start,
                        expected_finish=expected_finish, status=1,
                        student=Student[student_id], instructor=Instructor[instructor_id],
                        grade=0, comment='A aula ainda não foi avaliada')
    commit()
    return {"endpoint": "/api/lessons/" + str(new_lesson.ID)}


@db_session
def get_lesson(id: int):
    """Returns a lesson, given its ID"""
    try:
        lesson = Lesson[id]
        if lesson:
            schema = LessonSchema()
            return schema.dump(lesson).data
    except ObjectNotFound:
        abort(404)


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
        abort(404)


@db_session
# um dos parâmetros pode ser o ID do instrutor, ao invés do objeto instrutor
def update_lesson(id: int, **args):
    try:
        lesson = Lesson[id]
    except ObjectNotFound:
        abort(404)

    # primeiro verifico se é necesário alterar o instrutor
    if 'instructor_id' in args.keys():
        update_instructor = True
        new_instructor = Instructor[args['instructor_id']]
        # removo instructor_id do dict
        new_instructor_id = args.pop('instructor_id', None)
    else:
        update_instructor = False
        new_instructor = lesson.instructor

    # semelhante ao que acontece no create, é necessário verificar a disponibilidade do aluno/professor
    # para tal, preciso saber se a data e os horários da aula mudarão ou não nesse update
    if 'day' in args.keys():
        new_day = datetime.strptime(args['day'], '%Y-%m-%d').date()
    else:
        new_day = lesson.day

    if 'start' in args.keys():
        # para adotar a mesma notação do POST
        nl_s = datetime.strptime(args['start'], '%H:%M:%S').time()
    else:
        nl_s = lesson.expected_start

    if 'finish' in args.keys():
        # para adotar a mesma notação do POST
        nl_f = datetime.strptime(args['finish'], '%H:%M:%S').time()
    else:
        nl_f = lesson.expected_finish
    # não faz sentido querer atualizar o aluno porque ele quem faz a requisição de update
    # semelhante ao que ocorre no create, preciso verificar a disponibilidade do instrutor e do aluno

    # verificando a disponibilidade do instrutor
    # query com todas as aulas de dado instrutor
    lesson_query = select(l for l in Lesson if (
        l.instructor.ID == new_instructor.ID))
    for l in lesson_query:
        if l.day == new_day and l.ID != id:  # a segunda condição existe porque não faz sentido gerar conflito com a própria aula que se quer mudar
            l_s = l.expected_start  # expected start for the current lesson of the loop
            l_f = l.expected_finish  # expected finish for the lesson of the current loop
            if (((l_s <= nl_f) and (nl_f <= l_f)) or ((l_s <= nl_s) and (nl_s <= l_f)) or ((nl_s < l_s) and (l_f < nl_f))):
                return 'O instrutor selecionado não está disponível'

    # verificando a disponibilidade do aluno
    student = Student[Lesson[id].student.ID]
    for lesson in student.lessons:
        # a segunda condição existe porque não faz sentido gerar conflito com a própria aula que se quer mudar
        if lesson.day == new_day and lesson.ID != id:
            l_s = lesson.expected_start
            l_f = lesson.expected_finish
            if (((l_s <= nl_f) and (nl_f <= l_f)) or ((l_s <= nl_s) and (nl_s <= l_f)) or ((nl_s < l_s) and (l_f < nl_f))):
                return 'O agendamento dessa aula gera conflito na grade horária'

    # agora é necessário adicionar o objeto instructor ao dicionário args, que será utilizado pelo método set
    if update_instructor:
        args['instructor'] = new_instructor

    # Um método PUT é utilizado inclusive para avaliar uma aula
    # A avaliação inclui inserir uma nota e um comentário (opcional)
    # Se o put tiver como argumentos status = 4, é necessário recontar as horas de voo do aluno
    if ('status' in args.keys()) and ('grade' in args.keys()) and ('actual_duration' in args.keys()):
        if args['status'] == 4 and lesson.status != 4:
            # a segunda condição impede que, ao se avaliar a mesma aula 2 vezes, some-se 2 vezes a duração
            duration = datetime.strptime(
                args['actual_duration'], '%H:%M:%S').time()
            additionalTime = timedelta(
                hours=duration.hour, minutes=duration.minute, seconds=duration.second)
            update_flightTime(id=student.ID, timeToAdd=additionalTime)

    lesson.set(**args)
    commit()
    return {"endpoint": "/api/lessons/" + str(id)}


@db_session
def get_available_instructors(day: date, start: time, finish: time):
    """Returns a list of instructors IDs for those instuctors who have no classes scheduled between start and finish on a given day"""
    instructor_query = Instructor.select()
    available_instructors = []
    for instructor in instructor_query:
        available = True
        for lesson in instructor.lessons:
            l_s = lesson.expected_start
            l_f = lesson.expected_finish
            if (((l_s <= finish) and (finish <= l_f)) or ((l_s <= start) and (start <= l_f)) or ((start < l_s) and (l_f < finish))):
                available = False
                break
        if available:
            available_instructors.append(
                str(instructor.ID) + '- ' + str(instructor.name))

    return available_instructors
