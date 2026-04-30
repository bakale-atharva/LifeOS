import { 
  collection, 
  addDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDoc,
  setDoc,
  query, 
  where,
  serverTimestamp,
  DocumentData
} from "firebase/firestore";
import { db } from "./firebase";

export const addDocument = async (collectionName: string, data: any) => {
  return await addDoc(collection(db, collectionName), {
    ...data,
    createdAt: serverTimestamp(),
  });
};

export const getDocuments = async (collectionName: string) => {
  const querySnapshot = await getDocs(collection(db, collectionName));
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getDocument = async (collectionName: string, id: string) => {
  const docRef = doc(db, collectionName, id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() };
  }
  return null;
};

export const setDocument = async (collectionName: string, id: string, data: any) => {
  const docRef = doc(db, collectionName, id);
  return await setDoc(docRef, {
    ...data,
    updatedAt: serverTimestamp(),
  }, { merge: true });
};

export const updateDocument = async (collectionName: string, id: string, data: any) => {
  const docRef = doc(db, collectionName, id);
  return await updateDoc(docRef, {
    ...data,
    updatedAt: serverTimestamp(),
  });
};

export const deleteDocument = async (collectionName: string, id: string) => {
  const docRef = doc(db, collectionName, id);
  return await deleteDoc(docRef);
};
