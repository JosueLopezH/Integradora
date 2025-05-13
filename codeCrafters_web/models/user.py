class User:
    def __init__(self, admin, nombre, casilleroHuella, correo, contrasenna, uid_usuario):
        self.admin = admin
        self.nombre = nombre
        self.casilleroHuella = casilleroHuella
        self.correo = correo
        self.contrasenna = contrasenna
        self.uid_usuario = uid_usuario


    def toDBCollection(self):
        return {
            'admin': self.admin,
            'nombre': self.nombre,
            'casilleroHuella': self.casilleroHuella,
            'correo': self.correo,
            'contrasenna': self.contrasenna,
            'uid_usuario':self.uid_usuario
        }
