import http from 'k6/http';
import { check, sleep, group } from 'k6';
import { getProximosDiasUteis } from './functions/datas.js';
import { faker } from 'https://cdn.jsdelivr.net/npm/@faker-js/faker/+esm';
import { htmlReport } from 'https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js';

export function handleSummary(data) {
  return {
    'report.html': htmlReport(data),
    'report.json': JSON.stringify(data),
  };
}

const BASE_URL = __ENV.BASE_URL_REST;

export const options = {
    vus: 6,
    iterations: 6,
    thresholds: {
        http_req_failed: ['rate<0.01'],
    },
};


export default function () {
    let token = ''

    const HORARIOS = [
        '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
        '13:30', '14:00', '14:30', '15:00', '15:30', '16:00',
        '16:30', '17:00', '17:30', '18:00'
    ];

    const SERVICOS = ['CORTE', 'COLORAÇÃO', 'ESCOVA'];

    const payloadMarcacao = {
        nomeCliente: faker.person.fullName(),
        telefoneCliente: faker.phone.number('(##) #####-####'),
        dataAgendada: '',
        horarioAgendado: HORARIOS[__VU - 1],
        servico: SERVICOS[__VU - 1]
    };


    group('Fazendo login com sucesso', function () {        
            let responseLoginUsuario = http.post(`${BASE_URL}/usuario/logarUsuario`,
            JSON.stringify({
                usuario: 'recep_salao_k6',
                senha: '123456'
            }),
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

        token = responseLoginUsuario.json('token');

        check(responseLoginUsuario, {
            'status do login deve ser 200': (resp) => resp.status === 200
        });
    });

    group('Marcar agendamento com sucesso', function () {
        const dias = getProximosDiasUteis();
        const indiceAleatorio = Math.floor(Math.random() * dias.length);
        const dataSelecionada = dias[indiceAleatorio];

        payloadMarcacao.dataAgendada = dataSelecionada

        let responseMarcarAgendamento = http.post(`${BASE_URL}/agendamento/marcar`,            
            JSON.stringify({
                nomeCliente: payloadMarcacao.nomeCliente,
                telefoneCliente: payloadMarcacao.telefoneCliente,
                dataAgendada: payloadMarcacao.dataAgendada,
                horarioAgendado: payloadMarcacao.horarioAgendado,
                servico: payloadMarcacao.servico,
            }),
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

        console.log(responseMarcarAgendamento.json())

        check(responseMarcarAgendamento, {
            'status da marcação deve ser 201': (resp) => resp.status === 201,
            'mensagem deve ser de sucesso': (resp) =>
                resp.json('message') === 'Agendamento realizado com sucesso!',
        });
    });


    group('Consultar horários agendados', function () {

        let responseConsultaHorarios = http.get(
            `${BASE_URL}/agendamento/horariosAgendados/${encodeURIComponent(payloadMarcacao.dataAgendada)}`
        );

        const dados = JSON.parse(responseConsultaHorarios.body);
        console.log(dados)

        check(responseConsultaHorarios, {
            "o horário agendado deve estar presente": () =>
                dados.horariosAgendados.some(
                    (item) =>
                        item.dataAgendada === payloadMarcacao.dataAgendada &&
                        item.horarioAgendado === payloadMarcacao.horarioAgendado &&
                        item.telefoneCliente === payloadMarcacao.telefoneCliente
                )
        });
    });

    group('Desmarcar os horários agendados', function () {

        let responseDesmarcarAgendamento = http.put(`${BASE_URL}/agendamento/desmarcar`,
            JSON.stringify({
                nomeCliente: payloadMarcacao.nomeCliente,
                telefoneCliente: payloadMarcacao.telefoneCliente,
                dataAgendada: payloadMarcacao.dataAgendada,
                horarioAgendado: payloadMarcacao.horarioAgendado,
            }),
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
        console.log(responseDesmarcarAgendamento.json())

        check(responseDesmarcarAgendamento, {
            'status da desmarcação deve ser 200': (resp) => resp.status === 200,
            'mensagem deve ser de sucesso': (resp) =>
                resp.json('message') === 'Horário agendado foi desmarcado.',
        });
    });

    group('Simulando o pensamento do usuário', function () {
        sleep(1);
    });
}
