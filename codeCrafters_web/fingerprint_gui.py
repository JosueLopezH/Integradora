from flask import Flask, render_template, request, jsonify
import serial
import serial.tools.list_ports
from threading import Thread
import time

app = Flask(__name__)

class ArduinoController:
    def __init__(self):
        self.arduino = None
        self.running = False
        self.lock_mode = False
        self.logs = []
        self.port = "COM16"  

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

controller = ArduinoController()

# Rutas de Flask
@app.route('/')
def index():
    return render_template('control.html', 
                         connected=controller.arduino is not None,
                         lock_mode=controller.lock_mode)

@app.route('/connect', methods=['POST'])
def connect():
    success = controller.connect()
    return jsonify({'success': success, 'logs': controller.logs})

@app.route('/disconnect', methods=['POST'])
def disconnect():
    success = controller.disconnect()
    return jsonify({'success': success, 'logs': controller.logs})

@app.route('/enroll', methods=['POST'])
def enroll():
    id = request.form.get('id')
    if id in ['1', '2']:
        success = controller.send_command(f"1\n{id}")
        return jsonify({'success': success, 'logs': controller.logs})
    return jsonify({'success': False, 'error': 'Solo se permiten IDs 1 o 2', 'logs': controller.logs})

@app.route('/delete', methods=['POST'])
def delete():
    id = request.form.get('id')
    if id in ['1', '2']:
        success = controller.send_command(f"2\n{id}")
        return jsonify({'success': success, 'logs': controller.logs})
    return jsonify({'success': False, 'error': 'Solo se permiten IDs 1 o 2', 'logs': controller.logs})

@app.route('/toggle_lock', methods=['POST'])
def toggle_lock():
    if controller.lock_mode:
        success = controller.send_command("m")
    else:
        success = controller.send_command("3")
    return jsonify({'success': success, 'logs': controller.logs, 'lock_mode': controller.lock_mode})

@app.route('/get_logs', methods=['GET'])
def get_logs():
    return jsonify({'logs': controller.logs})

# Plantilla HTML
@app.route('/templates/control.html')
def serve_template():
    return render_template('control.html')

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)