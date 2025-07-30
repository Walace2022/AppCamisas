import { db } from './firebase';
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  serverTimestamp
} from 'firebase/firestore';

//PRODUTOS

export const addProduto = async (produto) => {
  const docRef = await addDoc(collection(db, 'produtos'), {
    ...produto,
    createdAt: serverTimestamp()
  });
  return docRef.id;
};


export const getProdutos = async () => {
  const querySnapshot = await getDocs(collection(db, 'produtos'));
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};


export const updateProduto = async (id, dadosAtualizados) => {
  const ref = doc(db, 'produtos', id);
  await updateDoc(ref, dadosAtualizados);
};


export const deleteProduto = async (id) => {
  const ref = doc(db, 'produtos', id);
  await deleteDoc(ref);
};

//MOVIMENTAÇÕES

export const addMovimentacao = async (movimentacao) => {
  await addDoc(collection(db, 'movimentacoes'), {
    ...movimentacao,
    data: serverTimestamp()
  });
};


export const getMovimentacoes = async () => {
  const querySnapshot = await getDocs(collection(db, 'movimentacoes'));
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};


export const getMovimentacoesPorProduto = async (produtoId) => {
  const q = query(collection(db, 'movimentacoes'), where('produtoId', '==', produtoId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};
