from flask import Blueprint, jsonify, request
from flask_cors import cross_origin
from flask_jwt_extended import get_jwt_identity, jwt_required
from mysql.connector import cursor

from db.connect import getdb
from db.disconnect import close_db

feedback = Blueprint("feedback", __name__, url_prefix="/feedback")


@feedback.route("/add", methods=["POST"])
@cross_origin(allow_headers=["Content-Type", "Authorization"])
@jwt_required()
def add_feedback():
    data = request.get_json()
    user_id = get_jwt_identity()
    print(user_id)
    model_id = data.get("modelId")
    brand_id = data.get("brandId")
    feedback_text = data.get("feedback")

    if not model_id and not brand_id:
        return jsonify({"message": "modelId or brandId is required"}), 400

    connection = getdb()
    cursor = connection.cursor()

    try:
        # Check if feedback already exists for given userId, modelId or brandId
        cursor.execute(
            "SELECT * FROM Feedback WHERE userId = %s AND (modelId = %s OR brandId = %s)",
            (user_id, model_id, brand_id),
        )
        existing_feedback = cursor.fetchone()

        if existing_feedback:
            return (
                jsonify({"message": "Feedback already exists for this user "}),
                400,
            )
        cursor.execute("SELECT Name from users where userId = %s", (user_id,))
        name = cursor.fetchone()
        name = name[0]
        # Insert new feedback into the database
        cursor.execute(
            "INSERT INTO Feedback (userId, Name, modelId, brandId, description) VALUES (%s, %s,%s, %s, %s)",
            (user_id, name, model_id, brand_id, feedback_text),
        )
        connection.commit()

        return jsonify({"message": "Feedback added successfully"}), 201

    except Exception as e:
        return jsonify({"message": "Failed to add feedback: " + str(e)}), 500

    finally:
        cursor.close()
        close_db(connection)


@feedback.route("/listFeedback", methods=["GET"])
@cross_origin(allow_headers=["Content-Type", "searchKey", "Key"])
def list_feedback():
    connection = getdb()
    feedback_type = request.headers.get("searchKey", "")
    key = request.headers.get("Key", "")
    try:
        cursor = connection.cursor(dictionary=True)
        query = ""
        if feedback_type == "brand":
            query = """SELECT name, description FROM Feedback WHERE modelId IS NULL AND brandId = %s"""
        else:
            query = """SELECT name, description FROM Feedback WHERE brandId IS NULL AND modelId = %s"""
        cursor.execute(query, (key,))
        feedback = cursor.fetchall()

        return jsonify(feedback), 200

    except Exception as e:
        return jsonify({"message": "Failed to retrieve feedback: " + str(e)}), 500
    finally:
        if "cursor" in locals():
            cursor.close()
        close_db(connection)
