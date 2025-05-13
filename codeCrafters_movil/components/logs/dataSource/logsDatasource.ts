//logsDatasource.ts

import { firebase_db } from "@/lib/firebase";
import { LogType } from "../entities/log";
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";

export class LogsDatasource {
    constructor() { }

    async getLogs(): Promise<LogType[]> {
        //donde poner los logs leidos
        const items: LogType[] = []
        // armar el query 
        const q = query(collection(firebase_db, "logs")/* , where("capital", "==", true) */);
        // ejecutar el query
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            // console.log(doc.id, " => ", doc.data());
            //tomar la info del documento
            const docData = doc.data();
            //transformar o mapear de firebase doc o objeto
            const item: LogType = {
                id: "",
                casillero: docData.casillero,
                date: docData.fecha ? docData.fecha.toDate() : new Date(),  // Usa el nombre correcto
                nombre: docData.nombre,
                usuario_id: doc.id
            };
            items.push(item);
        });
        return items;
    }
}