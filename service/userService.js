const { users } = require('../model/userModel');

function registerUser(username, password) {
  if (users.find(u => u.username === username)) {
    throw new Error('Usuário já existe.');
  }
  const user = { username, password };
  users.push(user);
  return user;
}

function loginUser(username, password) {
  const user = users.find(u => u.username === username && u.password === password);
  if (!user) {
    throw new Error('Credenciais inválidas.');
  }
  return user;
}

function getAllUsers() {
  return users.map(u => ({ username: u.username }));
}

module.exports = {
  registerUser,
  loginUser,
  getAllUsers
};