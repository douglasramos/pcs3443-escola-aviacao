from flask import request
from flask_restplus import Resource
from api.api import api
from application.instructor.use_cases import get_instructors_list

ns = api.namespace(
    'instructors', description='Operations related to instructor CRUD')


@ns.route('/')
class instructorList(Resource):

    def get(self):
        """Returns list of instructors legal"""
        return get_instructors_list()


# @ns.route('/<int:id>')
# @api.response(404, 'Instructor not found.')
# class CategoryItem(Resource):

#     def get(self, id):
#         """Returns details of a instructor."""
#         return get_category(id)
