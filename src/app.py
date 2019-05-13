from flask import Flask, Blueprint
from flask_restplus import Resource, Api
from api.endpoints.instructors import ns as instructors_namespace
from api.endpoints.students import ns as students_namespace
from persistance.persistance import db, initialize_database
from settings import *
from test_functions import populate_database

app = Flask(__name__)
api = Api(app)


def configure_app(app):
    app.config['SERVER_NAME'] = FLASK_SERVER_NAME
    app.config['SWAGGER_UI_DOC_EXPANSION'] = RESTPLUS_SWAGGER_UI_DOC_EXPANSION
    app.config['RESTPLUS_VALIDATE'] = RESTPLUS_VALIDATE
    app.config['RESTPLUS_MASK_SWAGGER'] = RESTPLUS_MASK_SWAGGER
    app.config['ERROR_404_HELP'] = RESTPLUS_ERROR_404_HELP


def initialize_app(app):

    configure_app(app)

    # Blueprint
    blueprint_api = Blueprint('api', __name__, url_prefix='/api')
    api.init_app(blueprint_api)

    # Namespaces
    api.add_namespace(instructors_namespace)
    api.add_namespace(students_namespace)
    app.register_blueprint(blueprint_api)

    initialize_database()
    populate_database()  # preenche as tabelas Student e Instructor caso estejam vazias


def main():
    initialize_app(app)
    app.run(debug=FLASK_DEBUG)

if __name__ == "__main__":
    main()
