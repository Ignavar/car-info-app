import os

from flask import Blueprint, jsonify, request, send_from_directory
from flask_cors import cross_origin
from werkzeug.utils import secure_filename

from db.connect import getdb
from db.disconnect import close_db

model = Blueprint("model", __name__, url_prefix="/model")

UPLOAD_FOLDER = os.path.join(
    os.getcwd(), "model/pictures"
)  # specify the path to the upload folder
ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "gif"}


def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


@model.route("/addModel", methods=["PUT"])
@cross_origin(allow_headers=["Content-Type"])
def add_model():
    file = request.files["modelLogo"]
    if file.filename == "":
        return jsonify({"message": "No selected file"}), 400
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file.save(os.path.join(UPLOAD_FOLDER, filename))
        logo_path = filename
    else:
        return jsonify({"message": "File type not allowed"}), 400

    brand_id = request.form.get("brandId")
    name = request.form.get("modelName")
    brand_model = request.form.get("model")
    variant = request.form.get("modelVariant")
    transmission = request.form.get("modelTransmission")
    description = request.form.get("modelDescription")
    price = request.form.get("modelPrice")
    engine_size = request.form.get("modelEngineSize")
    connection = getdb()

    try:
        cursor = connection.cursor()
        # Check for existing model with the same attributes
        cursor.execute(
            """
            SELECT * FROM Model m
            JOIN Car c ON m.modelId = c.modelId
            WHERE m.name = %s AND m.model = %s AND m.variant = %s 
            AND c.engine_size = %s AND c.transmission = %s
        """,
            (name, brand_model, variant, engine_size, transmission),
        )
        existing_model = cursor.fetchall()
        if existing_model:
            response = {
                "status": "error",
                "message": "Model already exists",
            }
            return jsonify(response), 400

        # Insert new model
        insert_query_model = "INSERT INTO Model (brandId, name, model, variant, image) VALUES (%s, %s, %s, %s, %s)"
        cursor.execute(
            insert_query_model, (brand_id, name, brand_model, variant, logo_path)
        )
        connection.commit()  # Commit the insert to get the ID

        # Retrieve modelId
        cursor.execute("SELECT LAST_INSERT_ID()")
        model_id_tuple = cursor.fetchone()
        if model_id_tuple:
            model_id = model_id_tuple[0]
        else:
            response = {
                "status": "error",
                "message": "Failed to retrieve model ID after insertion",
            }
            return jsonify(response), 500

        # Insert new car
        insert_query_car = "INSERT INTO Car (modelId, description, price, transmission, engine_size) VALUES (%s, %s, %s, %s, %s)"
        cursor.execute(
            insert_query_car, (model_id, description, price, transmission, engine_size)
        )
        connection.commit()

        response = {"status": "success", "message": "Model added successfully"}
        return jsonify(response), 201
    except Exception as e:
        response = {"status": "error", "message": "Failed to add model: " + str(e)}
        return jsonify(response), 500
    finally:
        if "cursor" in locals():
            cursor.close()
        close_db(connection)


@model.route("listModels", methods=["GET"])
@cross_origin(allow_headers=["Content-Type", "searchKey", "brandId", "Key", "option"])
def list_models():
    connection = getdb()
    search_key = request.headers.get("searchKey", "")
    brand_id = request.headers.get("brandId", "")
    search_key = f"{search_key}%"
    feedback_type = request.headers.get("option", "")
    key = request.headers.get("Key", "")
    try:
        cursor = connection.cursor()
        query = """
            SELECT m.modelId, m.brandId, m.name, m.model, m.variant, m.image, c.transmission
            FROM Model m
            JOIN Car c ON m.modelId = c.modelid
            WHERE m.brandId = %s AND m.name LIKE %s
        """
        cursor.execute(
            query,
            (
                brand_id,
                search_key,
            ),
        )
        model_list = cursor.fetchall()

        models = []
        for row in model_list:
            model1 = {
                "modelId": row[0],
                "brandId": row[1],
                "modelName": row[2],
                "model": row[3],
                "variant": row[4],
                "image": f"/model/logo/{row[5]}",
                "transmission": row[6],
            }
            models.append(model1)

        query = ""
        if feedback_type == "brand":
            query = """SELECT name, description FROM Feedback WHERE modelId IS NULL AND brandId = %s"""
        else:
            query = """SELECT name, description FROM Feedback WHERE brandId IS NULL AND modelId = %s"""
        cursor.execute(query, (key,))
        feedback = cursor.fetchall()
        feedbacks = []
        for row in feedback:
            feedback1 = {
                "name": row[0],
                "description": row[1],
            }
            feedbacks.append(feedback1)
        response = {"status": "success", "modelList": models, "feedback": feedbacks}
        return jsonify(response), 200
    except Exception as e:
        response = {"status": "error", "message": str(e)}
        return jsonify(response), 500
    finally:
        if "cursor" in locals():
            cursor.close()
        close_db(connection)


@model.route("/logo/<filename>", methods=["GET"])
@cross_origin(allow_headers=["Content-Type"])
def get_logo(filename):
    return send_from_directory(UPLOAD_FOLDER, filename)
