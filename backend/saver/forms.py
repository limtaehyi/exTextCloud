from flask_wtf import FlaskForm
from wtforms import TextAreaField, PasswordField, RadioField, StringField
from wtforms.validators import DataRequired, Length, EqualTo


class WriteText(FlaskForm):
    wrtext = TextAreaField('text', validators=[DataRequired()])
    wrpassword = PasswordField('password', validators=[Length(min=4, max=13)])
    wrdelete_at = RadioField('delete_at', choices=[('10min', '10min'), ('1h', '1h'), ('3h', '3h')])

class LoadText(FlaskForm):
    ldcode = StringField('code', validators=[DataRequired()])
    ldpassword = PasswordField('password')
    