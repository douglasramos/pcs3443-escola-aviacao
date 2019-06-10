# for debugging purposes
from __future__ import print_function
import sys

from flask import request, jsonify
from flask_restplus import Resource
from api.api import api

from application.login.use_cases import loginURL

ns = api.namespace(
    'login', description='Operations related to the login (for students, instructors and admins)')


@ns.route('/')
@api.response(404, 'Request Invalid')
@api.response(200, 'Success')
class login(Resource):
    def post(self):
        json_data = request.get_json(force=True)
        email = json_data['email']
        password = json_data['password']
        print(str(email) + ' ' + str(password), file=sys.stderr)
        response = jsonify(loginURL(email=email, password=password))
        response.headers.add("Access-Control-Allow-Origin", "*")
        return response
