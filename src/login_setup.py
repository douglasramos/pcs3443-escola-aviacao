from flask_login import LoginManager


def initialize_login():
    login_manager = LoginManager()
    login_manager.login_view = 'http://localhost:3000/login'
    return login_manager
