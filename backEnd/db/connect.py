import os

import mysql.connector
from flask import g


def getdb():
    print(os.getenv("DB_PASSWORD"))
    if "db" not in g or not g.db.is_connected():

        g.db = mysql.connector.connect(
            host=os.getenv("DB_HOST"),
            user=os.getenv("DB_USER"),
            password=os.getenv("DB_PASSWORD"),
            database=os.getenv("DB_DATABASE"),
        )
    return g.db
