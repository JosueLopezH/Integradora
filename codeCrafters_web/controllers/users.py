from flask import Blueprint, render_template, request, jsonify, redirect, url_for, session
from firebase_admin import auth, firestore, exceptions
from firebase_admin_init import dbConnection
import requests

db = dbConnection()

FIREBASE_WEB_API_KEY = "AIzaSyDhiDuWlVeTTvHHp4ljgnRrwX_GA4xVOzI"

users_bp = Blueprint('users', __name__, url_prefix='/crud')

@users_bp.route('/', methods=['GET'])
def get_firebase_users():
    try:
        users = []
        docs = db.collection("users").stream()
        for doc in docs:
            user_data = doc.to_dict()
            user_data['id'] = doc.id
            users.append(user_data)

        # Obtener casilleros asignados
        assigned_lockers = [user.get('casilleroHuellas') for user in users if 'casilleroHuellas' in user]
        
        # Lista de casilleros posibles (puedes expandirla)
        all_lockers = [1, 2]
        # Casilleros disponibles
        available_lockers = [locker for locker in all_lockers if locker not in assigned_lockers]

        return render_template('crud.html', users=users, available_lockers=available_lockers)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@users_bp.route('/add', methods=['POST'])
def add():
    try:
        data = request.get_json()

        required_fields = ['nombre', 'correo', 'password', 'admin']
        if not all(field in data for field in required_fields):
            return jsonify({'error': 'Faltan campos obligatorios'}), 400

        nombre = data['nombre']
        correo = data['correo']
        password = data['password']
        admin = bool(data['admin'])
        casilleroHuellas = data.get('casilleroHuellas')

        if not admin and casilleroHuellas is None:
            return jsonify({'error': 'Los no administradores deben tener un casillero asignado'}), 400

        if casilleroHuellas is not None:
            try:
                casilleroHuellas = int(casilleroHuellas)
                # Verificar si el casillero ya está asignado
                if db.collection('users').where('casilleroHuellas', '==', casilleroHuellas).get():
                    return jsonify({'error': 'Este casillero ya está asignado'}), 400
            except (ValueError, TypeError):
                return jsonify({'error': 'El casillero debe ser un número entero'}), 400

        try:
            user = auth.create_user(email=correo, password=password, display_name=nombre)
        except exceptions.FirebaseError as e:
            return jsonify({'error': 'El correo ya está registrado o hay un error en los datos'}), 400

        users_ref = db.collection('users')
        user_data = {
            'admin': admin,
            'nombre': nombre,
            'correo': correo,
            'uid_usuario': user.uid,
        }
        if casilleroHuellas is not None:
            user_data['casilleroHuellas'] = casilleroHuellas

        users_ref.document(user.uid).set(user_data)
        return jsonify({'message': 'Usuario registrado exitosamente'}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@users_bp.route('/delete_user/<string:uid_usuario>', methods=['GET'])
def delete_user(uid_usuario):
    try:
        auth.delete_user(uid_usuario)
        db.collection('users').document(uid_usuario).delete()
        return redirect(url_for('users.get_firebase_users'))
    except Exception as e:
        return jsonify({'error': str(e)}), 500

def firebase_sign_in(email, password):
    url = f"https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key={FIREBASE_WEB_API_KEY}"
    payload = {
        "email": email,
        "password": password,
        "returnSecureToken": True
    }
    response = requests.post(url, json=payload)
    return response.json()

@users_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    user_data = firebase_sign_in(email, password)
    if "idToken" in user_data:
        uid = user_data['localId']
        user_doc = db.collection('users').where('uid_usuario', '==', uid).stream()
        user_data = next(user_doc, None)
        if user_data and user_data.to_dict().get('admin', False):
            session['user_id'] = uid
            session['admin'] = True
            return jsonify({'success': True, 'redirect': url_for('users.get_firebase_users')})
        return jsonify({'error': 'No eres administrador'}), 403
    return jsonify({'error': 'Credenciales inválidas'}), 401