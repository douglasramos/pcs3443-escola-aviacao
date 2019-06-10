from flask import request, jsonify
from flask_restplus import Resource
from api.api import api
from application.admin.use_cases import register_admin

ns = api.namespace('admins',
                   description='Operations related to admin CRUD')


@ns.route('/')
@api.response(404, 'Request Invalid')
@api.response(200, 'Success')
class admin(Resource):
    def post(self):
        """Create a new student"""

        json_data = request.get_json(force=True)
        email = json_data['email']
        password = json_data['password']
        response = jsonify(register_admin(email=email, password=password))
        response.headers.add("Access-Control-Allow-Origin", "*")
        return response
