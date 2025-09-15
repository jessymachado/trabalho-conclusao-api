const express = require('express');
const router = express.Router();
const agendamentoService = require('../service/agendamentoService');
const { estaLogado } = require('../service/userService');

// Marcar agendamento (login obrigatório)
router.post('/agendamento/marcar', (req, res) => {
  if (!estaLogado()) {
    return res.status(401).json({ error: 'Credenciais inválidas. Faça login para agendar.' });
  }
  try {
    const agendamento = agendamentoService.marcarAgendamento(req.body);
    res.status(201).json({ message: 'Agendamento realizado com sucesso!', agendamento });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Desmarcar agendamento (login obrigatório, método PUT)
router.put('/agendamento/desmarcar', (req, res) => {
  if (!estaLogado()) {
    return res.status(401).json({ error: 'Credenciais inválidas. Faça login para desmarcar.' });
  }
  try {
    agendamentoService.desmarcarAgendamento(req.body);
    res.status(200).json({ message: 'Horário agendado foi desmarcado.' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Listar horários disponíveis (GET)
router.get('/agendamento/horariosDisponiveis', (req, res) => {
  const horarios = agendamentoService.listarHorariosDisponiveis();
  res.status(200).json({ horariosDisponiveis: horarios });
});

// Listar horários agendados por data (GET)
router.get('/agendamento/horariosAgendados/:date', (req, res) => {
  const data = req.params.date;
  const agendados = agendamentoService.listarHorariosAgendadosPorData(data);
  res.status(200).json({ horariosAgendados: agendados });
});

module.exports = router;
