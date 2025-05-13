import { Alert, StyleSheet, Text, TouchableOpacity, View, Image } from "react-native";
import { auth, firebase_db } from '@/lib/firebase'
import { addDoc, collection } from "firebase/firestore";
import { LogType } from "../entities/log";
import { useState } from "react";

export function Unlock() {
    const [user, setUser] = useState<LogType | null>(null)

    const date = new Date();

    async function agregarDatos() {
        try {
            const docRef = await addDoc(collection(firebase_db, "logs"), {
                casillero: 1, /* user?.casillero */
                fecha: date,
                nombre: auth.currentUser?.displayName,
                sensor_id: 1,
                usuario_id: auth.currentUser?.uid,
            });
            Alert.alert("Documento agregado con ID: ", docRef.id);
        } catch (e) {
            Alert.alert("Error al agregar documento: ");
            console.log(e);
        }
    }

    return (
        <View style={styles.content}>
            <View style={styles.spcae}>
                <View style={styles.contentTitle}>
                    <Text style={styles.title}>Desbloquear casillero remotamente</Text>
                </View>
                <Image 
                    source={{ uri: "https://imgs.search.brave.com/w7jWaDxDWTrbQ4bMABdrfdnWhQzHVl6TbuTTxlH2mkc/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/dmVjdG9yLXByZW1p/dW0vcGVyc29uYS1t/b2NoaWxhLXBpZS1m/cmVudGUtY2FzaWxs/ZXJvLXBlcnNvbmEt/cGllLWRlbGFudGUt/ZWxsb3NfMTAxODM5/NS0yNDU5LmpwZz9z/ZW10PWFpc19oeWJy/aWQ" }} 
                    style={styles.image} 
                />
                <View style={{ alignItems: "center" }}>
                    <View style={{ gap: 7 }}>
                        <Text style={styles.text}></Text>
                        <Text style={styles.text}>🔹Asegúrate de estar presente al desbloquear.</Text>
                        <Text style={[styles.text]}>🔹Colocate frente a tu casillero para no interferir con los demas usuarios.</Text>
                        
                    </View>
                    <TouchableOpacity onPress={() => agregarDatos()} style={styles.boton}>
                        <Text style={styles.text}> Desbloquear </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create(
    {
        content: {
            width: "100%",
            height: "100%",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "black",
        },
        spcae: {
            width: "90%",
            height: "75%",
            borderRadius: 16,
            borderWidth: 2,
            padding: 15,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(225, 255, 251, 0.97)"
        },
        contentTitle: {
            width: "auto",
            height: "20%",
        },
        title: {
            fontSize: 22,
            fontWeight: "500",
            textAlign: "center"
        },
        text: {
            fontSize: 14,
            fontFamily: "monospace",
        },
        boton: {
            width: "60%",
            height: "auto",
            padding: 7,
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 16,
            borderWidth: 2,
            backgroundColor: "rgb(255, 0, 0)",
            marginTop: 20
        },
        image: {
            width: 150, 
            height: 150,
            borderRadius: 100,
            resizeMode: "contain", 
            marginBottom: 10, // Espacio entre la imagen y el texto
        },
    }
);