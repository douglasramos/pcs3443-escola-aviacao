from marshmallow import Schema, fields, post_dump
from core.lesson.schema import LessonSchema

class StudentSchema(Schema):
    ID = fields.Int()
    name = fields.Str()
    address = fields.Str()
    birth_date = fields.Date()
    lessons = fields.Nested(LessonSchema, many=True)

    ordered = True

    # We add a post_dump hook to add an envelope to responses
    @post_dump(pass_many=True)
    def wrap(self, data, many):

        return data