import sqlite3
import time
import schedule
import threading

def job():
    conn = sqlite3.connect('saver.db')
    c = conn.cursor()
    c.execute("DELETE FROM table_name WHERE date_column < datetime('now', '-1 minute')")
    conn.commit()
    conn.close()

def run_schedule():
    while True:
        schedule.run_pending()
        time.sleep(1)

schedule.every(1).minutes.do(job) # 매 분마다 실행

background_thread = threading.Thread(target=run_schedule)
background_thread.start()
