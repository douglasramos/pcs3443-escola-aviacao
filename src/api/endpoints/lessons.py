from flask import request, jsonify
from flask_restplus import Resource, fields
from api.api import api
from application.lesson.use_cases import (get_lessons_list, schedule_class, 
                                          get_available_instructors, get_lesson,
                                          delete_lesson, update_lesson)
from datetime import datetime, date, time
from core.models import Lesson

ns = api.namespace(
    'lessons', description='Operations related to instructor CRUD')


@ns.route('/')
@api.response(404, 'Request Invalid.')
@api.response(200, 'Success')
class lesson(Resource):
    def get(self):
        """Returns a list of all lessons"""

        response = jsonify(get_lessons_list())
        response.headers.add("Access-Control-Allow-Origin", "*")
        return response

    def post(self):
        """Schedules a new lesson"""

        json_data = request.get_json(force=True)

        day = datetime.strptime(
            json_data['day'], "%Y-%m-%d").date()
        expected_start = datetime.strptime(
            json_data['expected_start'], "%H:%M:%S").time()
        expected_finish = datetime.strptime(
            json_data['expected_finish'], "%H:%M:%S").time()
        student_id = json_data['student_id']
        instructor_id = json_data['instructor_id']
        response = jsonify(schedule_class(day, expected_start, expected_finish, student_id, instructor_id))
        response.headers.add("Access-Control-Allow-Origin", "*")
        return response

@ns.route('/<int:id>')
@api.response(404, 'Request Invalid.')
@api.response(200, 'Success')
class lessonByID(Resource):

    def get(self, id):
        """Returns details of a lesson"""
        response = jsonify(get_lesson(id))
        response.headers.add("Access-Control-Allow-Origin", "*")
        return response

    def delete(self, id):
        """Deletes a lesson"""
        response = jsonify(delete_lesson(id))
        response.headers.add("Access-Control-Allow-Origin", "*")
        return response

    def put(self, id):
        """Updates a lesson"""
        json_data = request.get_json(force = True)
        response = jsonify(update_lesson(id, **json_data)) # indico o instrutor indiretamente, pelo seu ID, ao invés de ter o objeto instrutor como argumento
        response.headers.add("Access-Control-Allow-Origin", "*")
        return response

@ns.route('/availableinstructors') # só para testar se a função get_available_instructors funciona
@api.response(404, 'Request Invalid.')
@api.response(200, 'Success')
class available_instructors_class(Resource):
    def get(self):
        """Returns a list with the ID of all the available instructors for given date and start/finish times"""

        json_data = request.get_json(force=True)

        day = datetime.strptime(
                        json_data['day'], "%Y-%m-%d").date()
        start = datetime.strptime(
                        json_data['start'], "%H:%M:%S").time()
        finish = datetime.strptime(
                        json_data['finish'], "%H:%M:%S").time()
        
        response = jsonify(get_available_instructors(day, start, finish))
        return response