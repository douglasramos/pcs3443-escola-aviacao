from marshmallow import Schema, fields, post_dump


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
