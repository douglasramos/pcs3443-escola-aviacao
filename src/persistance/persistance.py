from pony.orm import *
from pony.orm.serialization import to_dict

db = Database()

def initialize_database():
    db.bind(provider = 'postgres', user = 'postgres', password = 'fabio2306@', host = 'localhost', database = 'postgres')
    db.generate_mapping(create_tables = True)