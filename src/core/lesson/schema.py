from marshmallow import Schema, fields, post_dump
from core.student.schema import StudentSchema

class LessonSchema(Schema):
    ID = fields.Int()
    day = fields.Date()
    start = fields.Date()
    finish = fields.Date()
    student = fields.Nested(StudentSchema)

    ordered = True

    # We add a post_dump hook to add an envelope to responses
    @post_dump(pass_many=True)
    def wrap(self, data, many):

        return data