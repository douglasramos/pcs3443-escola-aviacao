from flask import request
from flask_restplus import Resource, fields
from api.api import api
from application.instructor.use_cases import insert_new_instructor, delete_instructor, get_instructors_list, update_instructor, get_instructor
from datetime import datetime, date
from core.models import Instructor

ns = api.namespace(
    'instructors', description='Operations related to instructor CRUD')


@ns.route('/')
@api.response(404, 'Request Invalid.')
@api.response(200, 'Success')
class instructor(Resource):

    def get(self):
        """Returns a list of all instructors"""

        return get_instructors_list()

    def post(self):
        """Create a new instructor"""

        json_data = request.get_json(force=True)

        name = json_data['name']
        license_number = json_data['license_number']
        address = json_data['address']
        birth_date = datetime.strptime(json_data['birth_date'], "%Y-%m-%d").date()
        course_name = json_data['course_name']
        graduation_date = datetime.strptime(json_data['graduation_date'], "%Y-%m-%d").date()
        institution = json_data['institution']

        return insert_new_instructor(name, license_number, address, birth_date,
                                     course_name, graduation_date, institution)


@ns.route('/<int:id>')
@api.response(404, 'Request Invalid.')
@api.response(200, 'Success')
class instructorByID(Resource):

    def get(self, id):
        """Returns details of an instructor."""
        return get_instructor(id)

    def delete(self, id):  # assume-se que o ID do instrutor a ser removido seja conhecido
        """Delete an instructor"""

        return delete_instructor(id)

    def put(self, id):  # ID é o único argumento obrigatório para um requisição de PUT
        """Update an instructor"""

        json_data = request.get_json(force=True)

        return update_instructor(id, **json_data)
