from pony.orm import *
from pony.orm.serialization import to_dict


db = Database()


def initialize_database():
    # db na nuvem
    # db.bind(provider='postgres', user='postgres', password='password', host='database-1.c754ay7ps34a.us-east-1.rds.amazonaws.com', database='escola_aviacao')
    db.bind(provider='postgres', user='postgres', password='password',
            host='localhost', database='escola_aviacao')
    db.generate_mapping(create_tables=True)
