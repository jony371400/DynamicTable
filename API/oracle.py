import os
import configparser
from flask import Flask, request, jsonify
import cx_Oracle

app = Flask(__name__)

ConfigPath=os.getcwd() + "\\config.ini" 
print('PATH : ' , ConfigPath)

config = configparser.ConfigParser()
# config.read('config.ini')
config.read(ConfigPath)

# config.read('config.ini')

# Oracle database connection settings
# dsn = cx_Oracle.makedsn("10.249.2.21", 1523, service_name="SFCSD")
# conn = cx_Oracle.connect(user="CIMSFC", password="CIMSFC", dsn=dsn)

SFCS_Conn=config['DbConnection']['sfcsOraConnStr_QAS']
conn = cx_Oracle.connect(SFCS_Conn)

# API endpoints
@app.route('/', methods=['GET'])
def index():
    return "Welcome to JTB Info API"

@app.route('/api/jtb_info', methods=['GET'])
def get_jtb_info():
    cursor = conn.cursor()
    query = "SELECT * FROM jtb_info"
    cursor.execute(query)
    rows = cursor.fetchall()
    data = []
    for row in rows:
        data.append({
            "id": row[0],
            "name": row[1],
            "age": row[2]
        })
    return jsonify(data)

@app.route('/api/jtb_info', methods=['POST'])
def add_jtb_info():
    data = request.json
    cursor = conn.cursor()
    query = "INSERT INTO jtb_info (name, age) VALUES (:name, :age)"
    cursor.execute(query, {"name": data["name"], "age": data["age"]})
    conn.commit()
    return jsonify({"message": "JTB info added successfully."})

@app.route('/api/jtb_info/<int:id>', methods=['PUT'])
def update_jtb_info(id):
    data = request.json
    cursor = conn.cursor()
    query = "UPDATE jtb_info SET name = :name, age = :age WHERE id = :id"
    cursor.execute(query, {"name": data["name"], "age": data["age"], "id": id})
    conn.commit()
    return jsonify({"message": "JTB info updated successfully."})

@app.route('/api/jtb_info/<int:id>', methods=['DELETE'])
def delete_jtb_info(id):
    cursor = conn.cursor()
    query = "DELETE FROM jtb_info WHERE id = :id"
    cursor.execute(query, {"id": id})
    conn.commit()
    return jsonify({"message": "JTB info deleted successfully."})

if __name__ == '__main__':
    app.run(debug=True)
