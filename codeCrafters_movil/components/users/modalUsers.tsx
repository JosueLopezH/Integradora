import { useEffect, useState } from "react";
import { Modal, StyleSheet, View, TextInput, Button, Text } from "react-native";

//propiedades para el modal
type Props = {
    // note: Note | null;
    open: boolean,
    // onSave: (note: Note) => void;
    onClose: () => void;
}

export function ModalUsers({
    // note,
    open,
    // onSave,
    onClose
}: Props
) {

    return (
        <Modal
            visible={open}
            transparent={true}
            animationType="slide"
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalCard}>
                    <View style={styles.infoBox}>
                        <View>
                            <Text style={styles.label}>Nombre: </Text>
                            <Text style={styles.nameText}>Miguel Angel Perez</Text>
                        </View>
                        <Text style={styles.label}>Correo: </Text>
                        <Text style={styles.nameText}>miguelperez@gmail.com</Text>
                        <Text style={styles.label}>Telefono: </Text>
                        <Text style={styles.nameText}>243-144-5376</Text>
                        <Text style={styles.label}>Area: </Text>
                        <Text style={styles.nameText}>Auditoria</Text>
                        <Text style={styles.label}>Hora de Check: </Text>
                        <Text style={styles.nameText}>08:01 am</Text>
                        <Text style={styles.label}>Estatus: </Text>
                        <Text style={styles.nameText}>Asistio</Text>
                        <Text style={styles.label}>Fecha de contratación: </Text>
                        <Text style={styles.nameText}>28/01/2025</Text>
                    </View>
                    <View>
                        <Button title="Cancelar"
                            onPress={onClose}
                            color="#888" />
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalCard: {
        width: "80%",
        backgroundColor: "#fff",
        padding: 20,
        borderRadius: 10,
        gap: 5,
    },
    infoBox: {
        borderRadius: 12,
        borderWidth: 2,
        width: "auto",
        height: "auto",
        padding: 15,

    },
    label: {
        color: "rgb(139, 136, 136)",
        fontSize: 16,
        fontFamily: "monospace",
    },
    nameText: {
        fontSize: 18,
        color: "#000",
        fontFamily: "monospace", // Android
    },
    inputTitle: {
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
        marginBottom: 10,
        padding: 8,
        fontSize: 16,
    },
    inputNote: {
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 8,
        minHeight: 100,
        textAlignVertical: "top",
        marginBottom: 10,
    },
});
