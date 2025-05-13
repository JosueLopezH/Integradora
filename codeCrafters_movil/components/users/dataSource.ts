import { Alert } from "react-native";
import { getFirestore, doc, getDoc, collection, getDocs, SetOptions, setDoc } from "firebase/firestore";
import { User } from "firebase/auth";
import { firebase_db } from "@/lib/firebase";


//dataSource.ts
export class DataSource {
    constructor() { }
    //crear metodo
    async helloEmployee() {
        return Alert.alert("Mensaje del dataSource");
    }

    async getUserData(uid: string) {
        const userDocRef = doc(firebase_db, "users", uid);
        const docSnap = await getDoc(userDocRef);
        if (docSnap.exists()) {
            return docSnap.data();
        } else {
            console.log("No such document!");
            return null;
        }
    }

    async getAllDocs(): Promise<User[]> {
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



    async updateDocumentMerge(documentId: string, updatedData: any) {
        try {
            const documentRef = doc(firebase_db, 'users', documentId);
            const options: SetOptions = { merge: true };
            await setDoc(documentRef, updatedData, options);
            console.log('Document updated successfully!');
        } catch (error) {
            console.error('Error updating document:', error);
        }
    }
}