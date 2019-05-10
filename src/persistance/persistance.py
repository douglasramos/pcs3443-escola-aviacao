from pony.orm import *
from pony.orm.serialization import to_dict

db = Database()

def initialize_database():
    db.bind(provider = 'postgres', user = 'postgres', password = 'password', host = 'localhost', database = 'escola_aviacao')
    db.generate_mapping(create_tables = True)