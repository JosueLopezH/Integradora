from flask import Flask, render_template, request, jsonify
from controllers.users import users_bp
import serial
import serial.tools.list_ports
from threading import Thread
import time

app = Flask(__name__)
app.config['STATIC_FOLDER'] = 'static'
app.config['STATIC_URL_PATH'] = '/static'
app.secret_key = 'your_secret_key'
app.config['DEBUG'] = True

# Registro del blueprint de usuarios
app.register_blueprint(users_bp, url_prefix='/crud')

# ----------------------- Arduino Controller -----------------------
class ArduinoController:
    def __init__(self):
        self.arduino = None
        self.running = False
        self.lock_mode = False
        self.logs = []
        self.port = "COM16"  # Cambia si tu Arduino está en otro puerto
        self.connect()  # Conexión automática al iniciar

    def connect(self):
        if not self.arduino:
            try:
                self.arduino = serial.Serial(self.port, 115200, timeout=1)
                self.running = True
                Thread(target=self.read_serial, daemon=True).start()
                self.add_log("Conectado al Arduino")
                return True
            except Exception as e:
                self.add_log(f"Error de conexión: {str(e)}")
                return False
        return True

    def disconnect(self):
        if self.arduino:
            self.running = False
            self.arduino.close()
            self.arduino = None
            self.lock_mode = False
            self.add_log("Desconectado del Arduino")
            return True
        return False

    def read_serial(self):
        while self.running and self.arduino:
            try:
                if self.arduino.in_waiting > 0:
                    line = self.arduino.readline().decode('utf-8').strip()
                    if line:
                        self.add_log(line)
                        if "Modo apertura activado" in line:
                            self.lock_mode = True
                        elif "Modo CRUD activado" in line:
                            self.lock_mode = False
            except Exception as e:
                self.add_log(f"Error de lectura: {str(e)}")
            time.sleep(0.1)

    def send_command(self, cmd):
        if self.arduino and self.running:
            self.arduino.write(f"{cmd}\n".encode('utf-8'))
            self.add_log(f"Comando enviado: {cmd}")
            return True
        self.add_log("Error: Arduino no conectado")
        return False

    def add_log(self, message):
        self.logs.append(message)
        if len(self.logs) > 50:
            self.logs.pop(0)

# Instancia del controlador
controller = ArduinoController()

# ----------------------- Rutas -----------------------

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/crud/')
def crud():
    return render_template('crud.html')

@app.route('/control')
def control():
    return render_template('control.html', 
                         connected=controller.arduino is not None,
                         lock_mode=controller.lock_mode)

@app.route('/control/connect', methods=['POST'])
def connect():
    success = controller.connect()
    return jsonify({'success': success, 'logs': controller.logs})

@app.route('/control/disconnect', methods=['POST'])
def disconnect():
    success = controller.disconnect()
    controller.logs = []  # Limpia los logs
    return jsonify({'success': success, 'logs': controller.logs})


@app.route('/control/enroll', methods=['POST'])
def enroll():
    id = request.form.get('id')
    if id not in ['1', '2']:
        return jsonify({'status': 'error', 'message': 'ID inválido. Usa 1 o 2.', 'logs': controller.logs})
    controller.send_command('1')
    controller.send_command(id)
    response = f"Iniciando registro para ID #{id}. Coloca el dedo en el sensor."
    return jsonify({'status': 'success', 'message': response, 'logs': controller.logs})

@app.route('/control/delete', methods=['POST'])
def delete():
    id = request.form.get('id')
    if id not in ['1', '2']:
        return jsonify({'status': 'error', 'message': 'ID inválido. Usa 1 o 2.', 'logs': controller.logs})
    controller.send_command('2')
    controller.send_command(id)
    return jsonify({'status': 'success', 'message': f"Huella ID #{id} borrada", 'logs': controller.logs})

@app.route('/control/mode', methods=['POST'])
def mode():
    if controller.lock_mode:
        success = controller.send_command("m")
        message = "Modo CRUD activado"
    else:
        success = controller.send_command("3")
        message = "Modo apertura activado"
    return jsonify({'status': 'success' if success else 'error', 
                    'message': message, 
                    'logs': controller.logs, 
                    'lock_mode': controller.lock_mode})

@app.route('/control/serial_output', methods=['GET'])
def serial_output():
    return jsonify({'logs': controller.logs})

# ----------------------- Run App -----------------------
if __name__ == '__main__':
    app.run(debug=True, port=8081)
