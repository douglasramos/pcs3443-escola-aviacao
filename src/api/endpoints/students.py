from flask import request, jsonify
from flask_restplus import Resource
from api.api import api
from application.student.use_cases import get_students_list, insert_new_student, get_student, delete_student, update_student, get_lesson_list
from datetime import datetime, date

ns = api.namespace('students',
                   description='Operations related to student CRUD')


@ns.route('/')
@api.response(404, 'Request Invalid')
@api.response(200, 'Success')
class student(Resource):
    def get(self):
        """Returns a list of all students"""

        response = jsonify(get_students_list())
        response.headers.add("Access-Control-Allow-Origin", "*")
        return response

    def post(self):
        """Create a new student"""

        json_data = request.get_json(force=True)
        name = json_data['name']
        address = json_data['address']
        birth_date = datetime.strptime(
            json_data['birth_date'], "%Y-%m-%d").date()
        courseDuration = json_data['courseDuration']

        response = jsonify(insert_new_student(
            name, address, birth_date, courseDuration))
        response.headers.add("Access-Control-Allow-Origin", "*")
        return response


@ns.route('/<int:id>')
@api.response(404, 'Request Invalid.')
@api.response(200, 'Success')
class studentByID(Resource):
    def get(self, id):
        """Returns details of a student"""

        response = jsonify(get_student(id))
        response.headers.add("Access-Control-Allow-Origin", "*")
        return response

    def delete(self, id):  # assume-se que o ID do aluno a ser removido seja conhecido
        """Delete a student"""

        response = jsonify(delete_student(id))
        response.headers.add("Access-Control-Allow-Origin", "*")
        return response

    def put(self, id):
        """Update a student"""
        json_data = request.get_json(force=True)

        response = jsonify(update_student(id, **json_data))
        response.headers.add("Access-Control-Allow-Origin", "*")
        return response


@ns.route('/<int:id>/lessons')
@api.response(404, 'Request Invalid.')
@api.response(200, 'Success')
class studentLessonList(Resource):

    def get(self, id):
        """Returns a student's lesson list"""
        response = jsonify(get_lesson_list(id))
        response.headers.add("Access-Control-Allow-Origin", "*")
        return response
