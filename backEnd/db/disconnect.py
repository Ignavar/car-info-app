from flask import g


def close_db(e=None):
    db = g.pop("db", None)

    if db is not None and db.is_connected():
        db.close()
