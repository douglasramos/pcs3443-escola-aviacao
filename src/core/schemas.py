from marshmallow import Schema, fields, post_dump


class LessonSchema(Schema):
    ID = fields.Int()
    day = fields.Date()
    start = fields.Date()
    finish = fields.Date()

    ordered = True

    # We add a post_dump hook to add an envelope to responses
    @post_dump(pass_many=True)
    def wrap(self, data, many):

        return data


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


class InstructorSchema(Schema):
    ID = fields.Int()
    name = fields.Str()
    license_number = fields.Int()
    address = fields.Str()
    birth_date = fields.Date()
    course_name = fields.Str()
    graduation_date = fields.Date()
    institution = fields.Str()

    ordered = True

    # We add a post_dump hook to add an envelope to responses
    @post_dump(pass_many=True)
    def wrap(self, data, many):

        return data
