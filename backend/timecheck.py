from sqlalchemy import create_engine, text, Table, MetaData
from sqlalchemy.orm import sessionmaker
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
    with session.begin():
        # 지난 1분 이전의 행을 가져옵니다.
        rows = session.query(text_table).filter(text('datetime(delete_at) < datetime("now")')).all()

        # 지난 1분 이전의 행을 삭제합니다.
        session.query(text_table).filter(text('datetime(delete_at) < datetime("now")')).delete()

        # 삭제된 코드를 code_table에 삽입합니다.
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

