'use client';
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyCOV7WVE3c8rPHRFpv-WOdzUhZmJRJ-gh4",
  authDomain: "air-system-35852.firebaseapp.com",
  projectId: "air-system-35852",
  storageBucket: "air-system-35852.firebasestorage.app",
  messagingSenderId: "1070853411",
  appId: "1:1070853411:web:67c4173f02db945ac33096",
  measurementId: "G-JEXVWQ9ZBZ"
};




export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

const auth = getAuth(app); 
const db = getFirestore(app);


export async function criarUser(email: string, password: string, nome: string,) {

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        console.log("Deu certo", userCredential.user.email);

        await setDoc(doc(db, "users_air_system", user.uid), {
            nome: nome,
            email: email,
            createdAt: new Date()
        });
        
        return userCredential;
        
    } catch (error) {
        console.error("Vish, deu não - Cadastro:", error);
        throw error;
    }
}


export async function loginAuth(email: string, password: string) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log("Usuário logado:", user.email);
    return user; 
  } catch(error: any) {
    console.error("Deu errado o login:", error.message);
    throw error;  
  }
}


export const handleLogout = async () => {
  try {
    await signOut(auth);
    console.log("Logout realizado com sucesso.");
  } catch (error) {
    console.error("Erro ao fazer logout:", error);
    throw error;
  }
};