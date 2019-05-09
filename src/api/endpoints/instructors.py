from flask import request
from flask_restplus import Resource
from api.api import api
from application.instructor.use_cases import *

ns = api.namespace(
    'instructors', description='Operations related to instructor CRUD')


@ns.route('/')
class instructorList(Resource):

    def get(self):
        """Returns list of instructors legal"""
        return get_instructors_list()

    def post(self):
        json_data = request.get_json(force = True)
        ID = json_data['ID']
        name = json_data['name']
        license_number = json_data['license_number']
        address = json_data['address']
        birth_date = json_data['birth_date']
        course_name = json_data['course_name']
        graduation_date = json_data['graduation_date']
        institution = json_data['institution']
        return insert_new_instructor(ID, name, license_number, address, birth_date,
                                    course_name, graduation_date, institution)

# @ns.route('/<int:id>')
# @api.response(404, 'Instructor not found.')
# class CategoryItem(Resource):

#     def get(self, id):
#         """Returns details of a instructor."""
#         return get_category(id)
