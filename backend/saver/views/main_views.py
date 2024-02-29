from datetime import datetime, timedelta

from flask import Blueprint, render_template, request, url_for, g, flash, jsonify

from sqlalchemy import func
from werkzeug.utils import redirect
from werkzeug.security import generate_password_hash, check_password_hash

from .. import db
from ..forms import WriteText, LoadText
from ..models import TextTable, CodeTable

bp = Blueprint('main', __name__, url_prefix='/')


@bp.route('/')
def index():
    form1 = WriteText()
    form2 = LoadText()
    form1.wrdelete_at.data = '10min'
    return render_template('base.html', form1=form1, form2=form2)


@bp.route('/write/', methods=('GET', 'POST'))
def write():
    form = WriteText()
    data = request.get_json()
    if form.wrdelete_at.data == "10min":
        deltime = datetime.now() + timedelta(minutes=10)
    elif form.wrdelete_at.data == "1h":
        deltime = datetime.now() + timedelta(hours=1)
    elif form.wrdelete_at.data == "3h":
        deltime = datetime.now() + timedelta(hours=3)
    else:
        deltime = datetime.now() + timedelta(minutes=10)

    randomrow = CodeTable.query.order_by(func.random()).first()
    db.session.delete(randomrow)


    if form.wrpassword.data:
        query = TextTable(code=randomrow.codes, text=form.wrtext.data, password=generate_password_hash(form.wrpassword.data), created_on=datetime.now(), delete_at=deltime)
    else:
        query = TextTable(code=randomrow.codes, text=form.wrtext.data, created_on=datetime.now(), delete_at=deltime)

    db.session.add(query)
    db.session.commit()
    return jsonify({'status': 'success','message': randomrow.codes})
    

@bp.route('/load/', methods=['GET', 'POST'])
def load():
    form = LoadText()
    data = request.get_json()

    ischeck = TextTable.query.filter_by(code=form.ldcode.data).first()

    if ischeck:
        if ischeck.password == None:
            return jsonify({'status': 'success','message': ischeck.text})
        else:
            if check_password_hash(ischeck.password, form.ldpassword.data):
                return jsonify({'status': 'success','message': ischeck.text})
            else:
                return jsonify({'status': 'error','message': 'pw not match'})
    else:
        return jsonify({'status': 'error','message': 'not exist'})

'''
def delete_old_data():
    old_data = YourModel.query.filter(YourModel.created_at <= datetime.now() - timedelta(hours=1)).all()

    for data in old_data:
        db.session.delete(data)

    db.session.commit()
    '''