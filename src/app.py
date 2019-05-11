from flask import Flask, Blueprint
from flask_restplus import Resource, Api
from api.endpoints.instructors import ns as instructors_namespace
from persistance.persistance import db, initialize_database

app = Flask(__name__)
api = Api(app)


def initialize_app(app):
    blueprint_api = Blueprint('api', __name__)
    api.init_app(blueprint_api)
    api.add_namespace(instructors_namespace)
    app.register_blueprint(blueprint_api, url_prefix='/api')
    initialize_database()


def main():
    initialize_app(app)
    # app.run(debug=True)
    app.run()

if __name__ == "__main__":
    main()
