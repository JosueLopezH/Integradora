import firebase_admin
from firebase_admin import credentials, firestore

FIREBASE_CREDENTIALS = "casilleros-1721c-firebase-adminsdk-fbsvc-2a7164cc80.json"

def dbConnection():
    try:
        # Verifica si Firebase ya está inicializado para evitar errores
        if not firebase_admin._apps:
            cred = credentials.Certificate(FIREBASE_CREDENTIALS)
            firebase_admin.initialize_app(cred)
            print("Conexión a Firebase exitosa.")
        
        return firestore.client()
    
    except Exception as e:
        print(f"Error en la conexión a Firebase: {e}")
        return None
