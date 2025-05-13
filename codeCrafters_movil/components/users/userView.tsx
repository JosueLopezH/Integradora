import { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, SafeAreaView, Alert } from "react-native";
import { getAuth, User } from "firebase/auth";
import { getDocs, collection } from "firebase/firestore";
import { firebase_db } from "@/lib/firebase";

export default function UserView() {
    const [usuarios, setUsuarios] = useState<User[]>([]);
    const auth = getAuth();

    async function getAllDocs(): Promise<User[]> {
        try {
            const usersRef = collection(firebase_db, "users");
            const querySnapshot = await getDocs(usersRef);
            const users: User[] = querySnapshot.docs.map((doc) => ({
                uid: doc.id,
                ...doc.data(),
            })) as User[];
            return users;
        } catch (error) {
            console.error("Error getting documents:", error);
            return [];
        }
    }

    useEffect(() => {
        getAllDocs()
            .then((results) => {
                setUsuarios(results);
            })
            .catch((error) => {
                Alert.alert(`Error: ${error.message}`);
            });
    }, []);

    const renderUsers = ({ item }: { item: User }) => (
        <View style={styles.row}>
            <Text style={styles.cell}>{item.uid || "Sin UID"}</Text>
            <Text style={styles.cell}>{item.displayName || "Sin nombre"}</Text>
            <Text style={styles.cell}>{item.email || "Sin email"}</Text>
        </View>
    );

    return (
        <SafeAreaView style={styles.content}>
            <Text style={styles.title}>Usuarios registrados</Text>
            <View style={styles.container}>
                <View style={styles.row}>
                    <Text style={[styles.cell, styles.header]}>UID</Text>
                    <Text style={[styles.cell, styles.header]}>Nombre</Text>
                    <Text style={[styles.cell, styles.header]}>Email</Text>
                </View>
                <FlatList
                    data={usuarios}
                    renderItem={renderUsers}
                    keyExtractor={(item) => item.uid?.toString() || ""}
                />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    content: {
        flex: 1,
        alignItems: "center",
        backgroundColor: "white",
        paddingBottom: 100,
    },
    title: {
        marginTop: 10,
        fontSize: 18,
        fontWeight: "bold",
        fontFamily: "monospace",
    },
    container: {
        margin: 10,
        borderWidth: 2,
        borderColor: "gray",
        borderRadius: 5,
        overflow: "hidden",
        width: "95%",
    },
    row: {
        flexDirection: "row",
        borderBottomWidth: 1,
        borderBottomColor: "gray",
        backgroundColor: "rgb(222, 249, 227)",
    },
    cell: {
        flex: 1,
        padding: 8,
        textAlign: "center",
    },
    header: {
        fontWeight: "bold",
        backgroundColor: "#f1f1f1",
    },
});
