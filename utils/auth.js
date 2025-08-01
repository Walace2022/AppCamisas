import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { app } from '../services/firebase'; 

export async function login(email, password) {
  const auth = getAuth(app);

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    return {
      success: true,
      user: {
        uid: user.uid,
        email: user.email,
        name: user.displayName || 'Usuário'
      }
    };
  } catch (error) {
    let message = 'Erro ao fazer login';

    if (error.code === 'auth/user-not-found') {
      message = 'Usuário não encontrado';
    } else if (error.code === 'auth/wrong-password') {
      message = 'Senha incorreta';
    } else if (error.code === 'auth/invalid-email') {
      message = 'E-mail inválido';
    }

    throw new Error(message);
  }
}
