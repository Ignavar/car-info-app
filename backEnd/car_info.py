from datetime import timedelta

from flask import Flask, jsonify, request
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token

from brand.brand import brand
from car.car import car
from db.connect import getdb
from db.disconnect import close_db
from feedback.feedback import feedback
from model.model import model

app = Flask(__name__)
CORS(
    app,
    resources={
        r"/*": {
            "origins": "*",
        }
    },
    expose_headers=["searchKey", "brandId"],
)
app.register_blueprint(brand)
app.register_blueprint(model)
app.register_blueprint(car)
app.register_blueprint(feedback)

app.config["SECRET_KEY"] = "jPrch6qFdiyhBlTRBdssQw"
app.config["JWT_SECRET_KEY"] = "8JHjZhijn-UzYl8RdsxnOg"
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=1)

jwt = JWTManager(app)
bcrypt = Bcrypt(app)


@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"msg": "Missing email or password"}), 400

    connection = getdb()
    cursor = connection.cursor(dictionary=True)

    try:
        cursor.execute("SELECT * FROM users WHERE EmailAddress = %s", (email,))
        user = cursor.fetchone()

        if not user or not bcrypt.check_password_hash(user["Password"], password):
            return jsonify({"msg": "Invalid credentials"}), 401

        access_token = create_access_token(identity=user["UserId"], fresh=True)

        response = {
            "access_token": access_token,
            "user": {
                "Name": user["Name"],
                "EmailAddress": user["EmailAddress"],
                "isAdmin": user["isAdmin"],
            },
        }
        return jsonify(response), 200

    except Exception as e:
        return jsonify({"msg": "Failed to log in: " + str(e)}), 500

    finally:
        cursor.close()
        close_db(connection)


@app.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    name = data["name"]
    email = data["email"]
    password = data["password"]

    connection = getdb()

    try:
        # Check if the email already exists
        cursor = connection.cursor()
        cursor.execute("SELECT * FROM users WHERE EmailAddress = %s", (email,))
        existing_user = cursor.fetchone()

        if existing_user:
            response = {
                "status": "error",
                "message": "Email address already exists. Please choose a different email.",
            }
            return jsonify(response), 400

        # Hash the password
        hashed_password = bcrypt.generate_password_hash(password).decode("utf-8")

        # Insert new user into the database
        insert_query = (
            "INSERT INTO users (Name, EmailAddress, Password ) VALUES (%s, %s, %s )"
        )
        cursor.execute(insert_query, (name, email, hashed_password))
        connection.commit()

        response = {"status": "success", "message": "User added successfully"}
        return jsonify(response), 201

    except Exception as e:
        response = {"status": "error", "message": "Failed to add user: " + str(e)}
        return jsonify(response), 500

    finally:
        if "cursor" in locals():
            cursor.close()
        close_db(connection)


if __name__ == "__main__":
    app.run(debug=True)
