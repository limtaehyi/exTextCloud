from sqlalchemy import create_engine, text, Table, MetaData
from sqlalchemy.orm import sessionmaker
from datetime import datetime
import schedule
import threading
import time
import logging


logging.basicConfig()
logging.getLogger('sqlalchemy.engine').setLevel(logging.INFO)
engine = create_engine('sqlite:///saver.db')

Session = sessionmaker(bind=engine)
session = Session()

metadata = MetaData()

text_table = Table('text_table', metadata, autoload_with=engine)
code_table = Table('code_table', metadata, autoload_with=engine)

def job():
    logging.info('Running scheduled job.')
    nowt = datetime.now()
    print(nowt)
    with session.begin():
        filter_condition = text("datetime(delete_at) < :nowt").bindparams(nowt=nowt.strftime('%Y-%m-%d %H:%M:%S'))
        rows = session.query(text_table).filter(filter_condition).all()
        session.query(text_table).filter(filter_condition).delete()

        for row in rows:
            insert = code_table.insert().values(codes=row.code)
            session.execute(insert)

        session.commit()

def run_schedule():
    while True:
        schedule.run_pending()
        time.sleep(1)

schedule.every(1).minutes.do(job)  # 매 분마다 실행

background_thread = threading.Thread(target=run_schedule)
background_thread.start()
