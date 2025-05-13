import { StyleSheet, View, Alert, TextInput, Button, Text } from 'react-native'
import { TouchableOpacity } from 'react-native'
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { auth } from '@/lib/firebase'; // Tu configuración de Firebase
import { useState } from 'react';

export function ChangePasswordView() {
    const [email, setEmail] = useState("");
    const handleResetPassword = () => {
        const auth = getAuth(); // Obtiene la instancia de autenticación

        sendPasswordResetEmail(auth, email)
            .then(() => {
                Alert.alert("Éxito", "Se envió un correo de restablecimiento de contraseña.");
                setEmail("")
            })
            .catch((error) => {
                Alert.alert("Error", error.message);
            })
            .finally(() => {
            })
    };

    return (
        <View style={styles.container}>
            <View style={styles.spcae}>
                <View style={styles.contentTitle}>
                    <Text style={styles.title}>Cambiar contraseña</Text>
                </View>

                <View style={styles.ancho}>
                    <View style={styles.separacion}>
                        <View style={{gap:5, width:"auto"}}>
                            <Text style={styles.label}>Email</Text>
                            <TextInput
                                style={styles.contentInput}
                                placeholder="Ingresa tu correo"
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                        </View>

                        <TouchableOpacity style={styles.botonesrest} onPress={handleResetPassword}>
                            <Text style={styles.textBoton}>Restablecer contraseña</Text>
                        </TouchableOpacity>
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
            fontWeight: "bold",
            fontFamily: "monospace",
        },
        separacion: {
            width: "auto",
            height: "auto",
            gap: 20,
            justifyContent:"center",
            alignItems:"center",
        },
        spcae: {
            width: "90%",
            height: "50%",
            borderRadius: 16,
            borderWidth: 2,
            padding: 5,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgb(242, 255, 253)"
        },
        ancho: {
            width: "100%",
            padding: 10,
            height: "60%",
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
        botonesrest: {
            width: "90%",
            height: "auto",
            padding: 7,
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 16,
            borderWidth: 2,
            backgroundColor:"rgb(215, 238, 242)"
        },
        spaceContent: {
            width: "80%",
            height: "auto",
            padding: 5,
            gap: 3,
        },
        contentInput: {
            width:320, 
            fontSize: 14,
            borderBottomColor: "gray",
            borderBottomWidth: 2,
            backgroundColor: "rgb(242, 241, 241)",
            marginBottom: 10,
            fontFamily: "monospace",
        },
        label: {
            fontSize: 18,
            fontFamily: "monospace",
            color: "gray"
        },
        textBoton: {
            fontSize: 14,
            fontFamily: "monospace",
            color: "black"
        },
    }
)
