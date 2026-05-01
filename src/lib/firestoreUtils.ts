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
  orderBy,
  limit,
  serverTimestamp,
  DocumentData
} from "firebase/firestore";
import { db } from "./firebase";

export const getLogs = async (maxLogs: number = 50) => {
  const q = query(collection(db, 'logs'), orderBy('timestamp', 'desc'), limit(maxLogs));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const logAction = async (action: string, collectionName: string, data: any) => {
  try {
    await addDoc(collection(db, 'logs'), {
      action,
      collection: collectionName,
      details: JSON.stringify(data),
      timestamp: serverTimestamp(),
    });
  } catch (error) {
    console.error("Failed to log action:", error);
  }
};

export const addDocument = async (collectionName: string, data: any) => {
  const result = await addDoc(collection(db, collectionName), {
    ...data,
    createdAt: serverTimestamp(),
  });
  await logAction('ADD', collectionName, { id: result.id, ...data });
  return result;
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
  const result = await setDoc(docRef, {
    ...data,
    updatedAt: serverTimestamp(),
  }, { merge: true });
  await logAction('SET', collectionName, { id, ...data });
  return result;
};

export const updateDocument = async (collectionName: string, id: string, data: any) => {
  const docRef = doc(db, collectionName, id);
  const result = await updateDoc(docRef, {
    ...data,
    updatedAt: serverTimestamp(),
  });
  await logAction('UPDATE', collectionName, { id, ...data });
  return result;
};

export const deleteDocument = async (collectionName: string, id: string) => {
  const docRef = doc(db, collectionName, id);
  return await deleteDoc(docRef);
};
