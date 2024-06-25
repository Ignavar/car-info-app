import os

from flask import Blueprint, jsonify, request, send_from_directory
from flask_cors import cross_origin
from werkzeug.utils import secure_filename

from db.connect import getdb
from db.disconnect import close_db

brand = Blueprint("brand", __name__, url_prefix="/brand")

UPLOAD_FOLDER = os.path.join(
    os.getcwd(), "brand/pictures"
)  # specify the path to the upload folder
print(UPLOAD_FOLDER)
ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "gif"}


def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


@brand.route("/addBrand", methods=["POST"])
@cross_origin(allow_headers=["Content-Type"])
def add_brand():
    if "modelLogo" not in request.files:
        return jsonify({"message": "No file part"}), 400
    file = request.files["modelLogo"]
    if file.filename == "":
        return jsonify({"message": "No selected file"}), 400
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file.save(os.path.join(UPLOAD_FOLDER, filename))
        logo_path = filename
    else:
        return jsonify({"message": "File type not allowed"}), 400

    name = request.form.get("modelName")
    country = request.form.get("modelCountry")

    if not name or not country or not logo_path:
        return jsonify({"message": "Missing information. Fill out all fields"}), 401

    connection = getdb()

    try:
        cursor = connection.cursor()
        cursor.execute("SELECT * FROM Brand WHERE Name = %s", (name,))
        existing_user = cursor.fetchone()

        print(existing_user)
        if existing_user:
            response = {
                "status": "error",
                "message": "Brand already exists",
            }
            return jsonify(response), 400

        insert_query = (
            "INSERT INTO Brand (Name, countryOfOrigin, logo) VALUES (%s, %s, %s)"
        )
        cursor.execute(insert_query, (name, country, logo_path))
        connection.commit()

        response = {"status": "success", "message": "Brand added successfully"}
        return jsonify(response), 201
    except Exception as e:
        response = {"status": "error", "message": "Failed to add brand: " + str(e)}
        return jsonify(response), 500
    finally:
        if "cursor" in locals():
            cursor.close()
        close_db(connection)


@brand.route("/listBrands", methods=["GET"])
@cross_origin(allow_headers=["Content-Type", "searchKey"])
def list_brand():
    connection = getdb()
    search_key = request.headers.get("searchKey", "")
    search_key = f"{search_key}%"
    print(f"Received searchKey: '{search_key}'")  # Log the received searchKey
    try:
        cursor = connection.cursor()
        cursor.execute("SELECT * FROM Brand WHERE Name LIKE %s", (search_key,))
        brand_list = cursor.fetchall()

        # Fetch column names for better JSON formatting
        column_names = [desc[0] for desc in cursor.description]

        # Convert rows to dictionaries
        brands = [dict(zip(column_names, row)) for row in brand_list]

        # Add logo URL to each brand
        for brand in brands:
            brand["logo"] = f"/brand/logo/{brand['logo']}"

        response = {"status": "success", "brandList": brands}
        return jsonify(response), 200
    except Exception as e:
        response = {"status": "error", "message": str(e)}
        return jsonify(response), 500
    finally:
        if "cursor" in locals():
            cursor.close()
        close_db(connection)


@brand.route("/logo/<filename>", methods=["GET"])
@cross_origin(allow_headers=["Content-Type"])
def get_logo(filename):
    return send_from_directory(UPLOAD_FOLDER, filename)
