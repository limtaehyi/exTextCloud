from saver import db

class TextTable(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    code = db.Column(db.String(4), nullable=False, unique=True)
    text = db.Column(db.String(3000), nullable=False)
    password = db.Column(db.String(13), nullable=True)
    created_on = db.Column(db.DateTime(), nullable=False)
    delete_at = db.Column(db.DateTime(), nullable=False)

class CodeTable(db.Model):
    codes = db.Column(db.String(4), nullable=False, unique=True, primary_key=True)