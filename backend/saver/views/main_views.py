from datetime import datetime, timedelta

from flask import Blueprint, render_template, request, url_for, g, flash, jsonify

from sqlalchemy import func
from werkzeug.utils import redirect
from werkzeug.security import generate_password_hash, check_password_hash

from .. import db
from ..forms import WriteText, LoadText
from ..models import TextTable, CodeTable

from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

bp = Blueprint('main', __name__, url_prefix='/')

'''class MockApp: 
    def __init__(self):
        self.config = {'LIMITER_STORAGE_URI': 'memory://'} 
mock_app = MockApp()
limiter = Limiter(app=mock_app, key_func=get_remote_address)
'''
@bp.route('/')
#@limiter.limit("5 per minute")
def index():
    form1 = WriteText()
    form2 = LoadText()
    form1.wrdelete_at.data = '10min'
    return render_template('base.html', form1=form1, form2=form2)


@bp.route('/write/', methods=('GET', 'POST'))
#@limiter.limit("10 per minute")
def write():
    data = request.get_json()

    wrtext = data['wrtext']
    wrpassword = data['wrpassword']
    wrdelete_at = data['wrdelete_at']

    if wrdelete_at == "10min":
        deltime = datetime.now() + timedelta(minutes=10)
    elif wrdelete_at == "1h":
        deltime = datetime.now() + timedelta(hours=1)
    elif wrdelete_at == "3h":
        deltime = datetime.now() + timedelta(hours=3)
    else:
        deltime = datetime.now() + timedelta(minutes=10)

    randomrow = CodeTable.query.order_by(func.random()).first()
    db.session.delete(randomrow)


    if wrpassword:
        query = TextTable(code=randomrow.codes, text=wrtext, password=generate_password_hash(wrpassword), created_on=datetime.now(), delete_at=deltime)
    else:
        query = TextTable(code=randomrow.codes, text=wrtext, created_on=datetime.now(), delete_at=deltime)

    db.session.add(query)
    db.session.commit()
    return jsonify({'status': 'success','message': randomrow.codes})


@bp.route('/load/', methods=['GET', 'POST'])
#@limiter.limit("10 per minute")
def load():
    data = request.get_json()
    ldpassword = data['ldpassword']
    ldcode = data['ldcode']

    ischeck = TextTable.query.filter_by(code=ldcode).first()

    if ischeck:
        if ischeck.password == None:
            return jsonify({'status': 'success','message': ischeck.text})
        else:
            if check_password_hash(ischeck.password, ldpassword):
                return jsonify({'status': 'success','message': ischeck.text})
            else:
                return jsonify({'status': 'error','message': 'pw not match'})
    else:
        return jsonify({'status': 'error','message': 'not exist'})