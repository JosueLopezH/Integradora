//componente para perfil de usuario
import { useState, useEffect } from 'react'
import { StyleSheet, View, Alert, TextInput, Button, Text, Pressable } from 'react-native'
import { TouchableOpacity } from 'react-native'
import { signOut, updateProfile, User } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { firebase_db } from '@/lib/firebase' // Your Firebase initialization
import { Link } from 'expo-router'
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { HoverEffect } from 'react-native-gesture-handler'

export function ProfileView() {
  const [loading, setLoading] = useState(true)
  const [name, setName] = useState('')
  const [user, setUser] = useState<User | null>(null)

  const logout = () => {
    setName("")
    setUser(null)
    
    signOut(auth)
  }

  /*     if (user) {
      // El usuario está autenticado
      console.log("Usuario autenticado:", user.uid); // UID del usuario
      console.log("Email del usuario:", user.email); // Email del usuario (si está disponible)
      console.log("Nombre del usuario autenticado: ", user.displayName);
      
      // ... otras propiedades del usuario (displayName, photoURL, etc.) ...
  
      // Ahora puedes usar el UID (user.uid) para acceder a la información del usuario en tu base de datos (Firestore, Realtime Database, etc.)
      } else {
      // El usuario no está autenticado
      console.log("Usuario no autenticado");
      } */

  /*     async function getUserDocumentId(email: string) {
          try {
              const usersRef = collection(firebase_db, 'users'); // Nombre de tu colección en Firestore
              const q = query(usersRef, where('email', '==', email));
              const querySnapshot = await getDocs(q);
  
              if (!querySnapshot.empty) {
                  const userDoc = querySnapshot.docs[0]; // Tomamos el primer documento que coincida
                  return userDoc.id;
              } else {
                  throw new Error('No se encontró el usuario en Firestore');
              }
          } catch (error) {
              console.error('Error buscando el documento:', error);
              return null;
          }
      } */

  const saveProfile = async () => {
    if (!auth.currentUser) return;
    try {
      await updateProfile(auth.currentUser, {
        displayName: name,
        photoURL: "https://example.com/jane-q-user/profile.jpg",
      });
      Alert.alert("Datos actualizados correctamente")

    } catch (error) {
      Alert.alert(`Error: ${error}`);
    }
  };

  //obtener la informacion del usuario
  useEffect(() => {
    if (auth.currentUser) {
      setUser(auth.currentUser)
      setName(auth.currentUser.displayName || "");
    }
  }, [])

  return (
    <View style={styles.container}>
      <View style={styles.spcae}>
        <View style={styles.contentTitle}>
          <Text style={styles.title}>Datos del usuario</Text>
        </View>
        <View>
          <View>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.contentInput}
              placeholder="Email"
              value={user?.email || ""}
              readOnly
            />
          </View>

          <View>
            <Text style={styles.label}>Nombre</Text>
            <TextInput
              style={styles.contentInput}
              placeholder="Sin nombre"
              value={name || ''}
              onChangeText={(text) => setName(text)} />
          </View>

          <View style={styles.contentBotones}>
            <View style={styles.orientacionBotones}>
              <TouchableOpacity
                style={[styles.botones, styles.botonActualizar]}
                onPress={() => saveProfile()}
                disabled={!user}
              >
                <Text style={styles.textBoton}>{!user ? 'Cargando ...' : 'Actualizar'}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.botones, styles.botonCerrar]}
                onPress={logout} >
                <Text style={styles.textBoton}>Cerrrar sesión</Text>
              </TouchableOpacity>
            </View>
            <Link href="/changePass/change" asChild>
              <Pressable style={styles.button}>
                <Text style={styles.textButton}>Cambiar contraseña</Text>
              </Pressable>
            </Link>
          </View>

        </View>
      </View>
    </View>

  );
}

const styles = StyleSheet.create(
  {
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "black"
    },
    contentTitle: {
      width: "auto",
      height: "20%",
    },
    title: {
      fontSize: 22,
      fontWeight: "500",
    },
    spcae: {
      width: "90%",
      height: "60%",
      borderRadius: 16,
      borderWidth: 2,
      padding: 15,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "rgb(242, 255, 253)"
    },
    spaceContent: {
      width: "80%",
      height: "auto",
      padding: 5,
      gap: 3,
    },
    contentInput: {
      fontSize: 16,
      borderBottomColor: "gray",
      borderBottomWidth: 2,
      backgroundColor: "rgb(242, 241, 241)",
    },
    label: {
      fontSize: 18,
      fontFamily: "monospace",
      color: "gray"
    },
    contentBotones: {
      justifyContent: "center",
      alignItems: "center",
    },
    orientacionBotones: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-around",
      width: "100%",
      height: "auto",
      padding: 5,
      marginTop: 15,
      marginBottom: 15,
    },
    botones: {
      width: "48%",
      height: "auto",
      padding: 7,
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 16,
      borderWidth: 2,
    },
    botonActualizar: {
      backgroundColor: "rgb(221, 233, 255)"
    },
    botonCerrar: {
      backgroundColor: "rgb(255, 208, 188)"
    },
    textBoton: {
      fontSize: 14,
      fontFamily: "monospace",
      color: "black"
    },
    button: {
      width: "50%",
      height: "auto",
      padding: 5,
      borderBottomWidth: 2,
      borderBottomColor: "gray",
      textAlign: "center",
      // backgroundColor: "rgba(126, 160, 252, 0.76)",
    },
    textButton: {
      fontSize: 12,
      fontWeight: "bold",
      textAlign: "center",
      color: "blue",

    },
  }
)