import os

from flask import Blueprint, jsonify, request
from flask.helpers import get_root_path
from flask_cors import cross_origin

from db.connect import getdb
from db.disconnect import close_db

car = Blueprint("car", __name__, url_prefix="/car")

UPLOAD_FOLDER = os.path.join(
    os.getcwd(), "model/pictures"
)  # specify the path to the upload folder


@car.route("listCars", methods=["GET"])
@cross_origin(allow_headers=["Content-Type", "brandId"])
def list_cars():
    connection = getdb()
    brand_id = request.headers.get("brandId", "")

    try:
        cursor = connection.cursor()
        query = """
        SELECT m.name, m.model, m.variant, m.image, c.transmission, c.price, c.engine_size, c.description, c.CarId
        FROM Model m
        JOIN Car c ON m.modelId = c.modelid
        WHERE m.modelId= %s
        """

        cursor.execute(query, (brand_id,))
        cars = cursor.fetchall()

        car_list = []
        for row in cars:
            car = {
                "carName": row[0],
                "carModel": row[1],
                "carVariant": row[2],
                "carImage": f"/model/logo/{row[3]}",
                "carTransmission": row[4],
                "carPrice": row[5],
                "carEngineSize": row[6],
                "carDescription": row[7],
                "carId": row[8],
            }
            car_list.append(car)

        response = {"status": "success", "cars": car_list}
        return jsonify(response), 200

    except Exception as e:
        response = {"status": "error", "message": str(e)}
        return jsonify(response), 500

    finally:
        if "cursor" in locals():
            cursor.close()
        close_db(connection)


@car.route("/addMod", methods=["POST"])
@cross_origin(allow_headers=["Content-Type"])
def add_mod():
    name = request.form.get("modName")
    price = request.form.get("modPrice")
    car_id = request.form.get("carId")

    if not name or not price:
        return jsonify({"message": "Missing information. Fill out all fields"}), 401
    connection = getdb()

    try:
        cursor = connection.cursor()
        cursor.execute("SELECT * FROM Mods WHERE name=%s", (name,))
        existing_mod = cursor.fetchone()

        if existing_mod:
            response = {
                "status": "error",
                "message": "Mod already exists",
            }
            return jsonify(response), 400

        insert_query = "INSERT INTO Mods (CarId,name,price) VALUES (%s,%s,%s)"
        cursor.execute(insert_query, (car_id, name, price))
        connection.commit()

        response = {"status": "success", "message": "Mod added"}
        return jsonify(response), 201
    except Exception as e:
        response = {"status": "error", "message": "Failed to add mod" + str(e)}
        return jsonify(response), 500
    finally:
        if "cursor" in locals():
            cursor.close()
        close_db(connection)


@car.route("/listMods", methods=["GET"])
@cross_origin(allow_headers=["Content-Type", "brandId"])
def list_brand():
    connection = getdb()
    brand_id = request.headers.get("brandId", "")
    print(f"Received brandId: '{brand_id}'")  # Log the received brandId

    try:
        cursor = connection.cursor()
        cursor.execute("SELECT CarId FROM Car WHERE modelId = %s", (brand_id,))
        car_row = cursor.fetchone()
        if not car_row:
            response = {
                "status": "error",
                "message": "No car found for the given modelId",
            }
            return jsonify(response), 404

        car_id = car_row[0]
        cursor.execute("SELECT * FROM Mods WHERE CarId = %s", (car_id,))
        mod_list = cursor.fetchall()

        # Fetch column names for better JSON formatting
        column_names = [desc[0] for desc in cursor.description]

        # Convert rows to dictionaries
        mods = [dict(zip(column_names, row)) for row in mod_list]

        response = {"status": "success", "mods": mods}
        return jsonify(response), 200
    except Exception as e:
        response = {"status": "error", "message": str(e)}
        return jsonify(response), 500
    finally:
        if "cursor" in locals():
            cursor.close()
        close_db(connection)
