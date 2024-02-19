import sqlite3
import string
import itertools

# 데이터베이스 연결 생성
conn = sqlite3.connect('saver.db')
c = conn.cursor()


# a-z, A-Z로 구성된 4자리 문자열 생성
letters = string.ascii_letters  # a-z, A-Z
for combo in itertools.product(letters, repeat=4):
    four_letters = ''.join(combo)

    # 문자열 삽입
    c.execute('''
        INSERT INTO code_table (codes) VALUES (?)
    ''', (four_letters,))

# 변경 사항 커밋
conn.commit()

# 연결 해제
conn.close()
