import http from 'k6/http';
import { check, sleep, group } from 'k6';
import { getProximosDiasUteis } from './functions/datas.js';

export const options = {
    vus: 1,
    iterations: 1,
    thresholds: {
        http_req_failed: ['rate<0.01'],
    },
};


export default function () {
    let token = ''

    const payloadMarcacao = {
        nomeCliente: 'Patrícia',
        telefoneCliente: '51982899999',
        dataAgendada: '',
        horarioAgendado: '11:30',
        servico: "COLORAÇÃO"
    };

    group('Fazendo login com sucesso', function () {
        let responseLoginUsuario = http.post('http://localhost:3000/usuario/logarUsuario',
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
        const dataSelecionada = dias[3];

        payloadMarcacao.dataAgendada = dataSelecionada

        let responseMarcarAgendamento = http.post('http://localhost:3000/agendamento/marcar',
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

        check(responseMarcarAgendamento, {
            'status da marcação deve ser 201': (resp) => resp.status === 201,
            'mensagem deve ser de sucesso': (resp) =>
                resp.json('message') === 'Agendamento realizado com sucesso!',
        });

    });


    group('Simulando o pensamento do usuário', function () {
        sleep(1);
    });
}
