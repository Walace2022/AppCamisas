export async function login(username, password) {
  
  const user = {
    username: 'admin',
    password: '123456',
  };

  
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (username === user.username && password === user.password) {
        resolve({ success: true, user: { name: 'Admin' } });
      } else {
        reject(new Error('Usuário ou senha inválidos'));
      }
    }, 1000);
  });
}