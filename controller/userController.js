const express = require('express');
const router = express.Router();
const userService = require('../service/userService');

router.post('/user/register', (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Informe usuário e senha.' });
    }
    const user = userService.registerUser(username, password);
    res.status(201).json({ user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.post('/user/login', (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Informe usuário e senha.' });
    }
    const user = userService.loginUser(username, password);
    res.status(200).json({ user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/user/users', (req, res) => {
  try {
    const users = userService.getAllUsers();
    res.status(200).json({ users });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao consultar usuários.' });
  }
});

module.exports = router;
