from flask import request
from flask_restplus import Resource
from api.api import api
from application.instructor.use_cases import insert_new_instructor, delete_instructor, get_instructors_list, alter_instructor

ns = api.namespace(
    'instructors', description='Operations related to instructor CRUD')

@ns.route('/')
class instructorList(Resource):

    def get(self):
        """Returns list of instructors legal"""
        return get_instructors_list()

    def post(self):
        json_data = request.get_json(force = True)
        name = json_data['name']
        license_number = json_data['license_number']
        address = json_data['address']
        birth_date = json_data['birth_date']
        course_name = json_data['course_name']
        graduation_date = json_data['graduation_date']
        institution = json_data['institution']
        return insert_new_instructor(name, license_number, address, birth_date,
                                    course_name, graduation_date, institution)

    def delete(self): # assume-se que o ID do instrutor a ser removido seja conhecido
        json_data = request.get_json(force = True)
        ID = json_data['ID']
        return delete_instructor(ID)

    def put(self): # ID é o único argumento obrigatório para um requisição de PUT
        json_data = request.get_json(force = True)        
        return alter_instructor(**json_data)        

# @ns.route('/<int:id>')
# @api.response(404, 'Instructor not found.')
# class CategoryItem(Resource):

#     def get(self, id):
#         """Returns details of a instructor."""
#         return get_category(id)
