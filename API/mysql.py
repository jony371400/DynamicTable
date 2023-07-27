from flask import Flask, request, jsonify
from flask_mysqldb import MySQL
from flask_cors import CORS

app = Flask(__name__)
# CORS(app)
cors = CORS(app, resources={r"/api/*": {"origins": "*"}})

# MySQL Configuration
app.config['MYSQL_HOST'] = '127.0.0.1'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = '1234qwer'
app.config['MYSQL_DB'] = 'AMR'

mysql = MySQL(app)

# API endpoints
@app.route('/api/robots', methods=['GET'])
def get_robots():
    cur = mysql.connection.cursor()
    cur.execute("SELECT ID, NAME FROM Robots")
    rows = cur.fetchall()
    cur.close()
    robots = [{"ID": row[0], "NAME": row[1]} for row in rows]
    return jsonify(robots)

@app.route('/api/robots', methods=['POST'])
def add_robot():
    data = request.json
    id = data.get('ID')
    name = data.get('NAME')
    if id is None or name is None:
        return jsonify({"message": "Invalid data. ID and NAME are required."}), 400

    cur = mysql.connection.cursor()
    cur.execute("INSERT INTO Robots (ID, NAME) VALUES (%s, %s)", (id, name))
    mysql.connection.commit()
    cur.close()
    return jsonify({"message": "Robot added successfully."}), 201

@app.route('/api/robots/<int:id>', methods=['PUT'])
def update_robot(id):
    data = request.json
    name = data.get('NAME')
    if name is None:
        return jsonify({"message": "Invalid data. NAME is required."}), 400

    cur = mysql.connection.cursor()
    cur.execute("UPDATE Robots SET NAME = %s WHERE ID = %s", (name, id))
    mysql.connection.commit()
    cur.close()
    return jsonify({"message": "Robot updated successfully."})

@app.route('/api/robots/<int:id>', methods=['DELETE'])
def delete_robot(id):
    cur = mysql.connection.cursor()
    cur.execute("DELETE FROM Robots WHERE ID = %s", (id,))
    mysql.connection.commit()
    cur.close()
    return jsonify({"message": "Robot deleted successfully."})

if __name__ == '__main__':
    app.run(debug=True)
