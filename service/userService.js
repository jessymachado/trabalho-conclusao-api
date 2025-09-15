const { usuarios } = require('../model/userModel');
let usuarioLogado = null;

function registrarUsuario(usuario, senha) {
  if (usuarios.find(u => u.usuario === usuario)) {
    throw new Error('Usuário já existe.');
  }
  const novoUsuario = { usuario, senha };
  usuarios.push(novoUsuario);
  return novoUsuario;
}

function logarUsuario(usuario, senha) {
  const usuarioEncontrado = usuarios.find(u => u.usuario === usuario && u.senha === senha);
  if (!usuarioEncontrado) {
    throw new Error('Credenciais inválidas.');
  }
  return usuarioEncontrado;
}

function estaLogado() {
  return !!usuarioLogado;
}

function deslogarUsuario() {
  usuarioLogado = null;
}

function consultarUsuarios() {
  return usuarios.map(u => ({ usuario: u.usuario }));
}

module.exports = {
  registrarUsuario,
  logarUsuario,
  consultarUsuarios,
  estaLogado,
  deslogarUsuario
};