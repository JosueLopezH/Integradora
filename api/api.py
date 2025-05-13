from flask import Flask, jsonify, request
import requests

app = Flask(__name__)

ARDUINO_IP = "192.168.0.115"  # Cambia por la IP real del ESP32
ARDUINO_PORT = 80

@app.route('/api/rele', methods=['POST', 'GET'])  # Añadimos GET aquí
def controlar_rele():
    if request.method == 'POST':
        data = request.get_json()
        rele = data.get('rele')
        estado = data.get('estado')
    else:  # GET
        rele = request.args.get('rele')
        estado = request.args.get('estado')

    if not rele or not estado or int(rele) not in [1, 2]:
        return jsonify({"error": "Parámetros inválidos. Usa rele: 1 o 2, estado: on/off"}), 400

    comando = f"http://{ARDUINO_IP}:{ARDUINO_PORT}/rele?numero={rele}&estado={estado}"
    try:
        response = requests.get(comando, timeout=5)
        if response.status_code == 200:
            return jsonify({"mensaje": f"Relé {rele} cambiado a {estado}"}), 200
        else:
            return jsonify({"error": "Error en el ESP32"}), 500
    except requests.exceptions.RequestException as e:
        return jsonify({"error": f"No se pudo conectar al ESP32: {str(e)}"}), 500

@app.route('/api/estado', methods=['GET'])
def obtener_estado():
    try:
        response = requests.get(f"http://{ARDUINO_IP}:{ARDUINO_PORT}/estado", timeout=5)
        return jsonify(response.json()), 200
    except requests.exceptions.RequestException as e:
        return jsonify({"error": f"No se pudo obtener estado: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)