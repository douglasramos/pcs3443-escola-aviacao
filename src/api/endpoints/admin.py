from flask import request, jsonify, send_from_directory
from flask_restplus import Resource
from api.api import api
from application.admin.use_cases import register_admin, license_Emit

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


@ns.route('/license/<int:id>')
@api.response(404, 'Request Invalid')
@api.response(200, 'Success')
class license(Resource):
    def get(self, id):
        "Get student information for license emittion"

        names = license_Emit(id=id)
        return send_from_directory(directory=names[0], filename=names[1], as_attachment=True)
