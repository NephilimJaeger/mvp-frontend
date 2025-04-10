/**
 * Função assíncrona para obter uma lista de turmas do endpoint exposto pela API no backend.
 *
 * @async
 * @function getList
 * @returns {void} Não retorna nada. Os resultados são processados internamente e
 *                 quaisquer erros são registrados no console.
 */

const getList = async () => {
    let url = 'http://127.0.0.1:8000/turmas';

    const table = document.getElementById("table_turmas");
    while (table.rows.length > 1) {
        table.deleteRow(1);
    }

    fetch(url, {
        method: 'get',
    })
    .then((response) => response.json())
    .then((data) => {
        data.turmas.forEach(item => getTurmaInfos(item.id_turma, item.professor, item.horario, item.dia_semana, item.nivel));
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

/**
 * Função responsável por inserir uma nova linha na tabela de turmas 'table_turmas'.
 * Cada célula da nova linha é preenchida com as informações da turma fornecidas como argumentos.
 *
 * @param {string} id_turma - O identificador único da turma.
 * @param {string} professor - O nome do professor responsável pela turma.
 * @param {string} horario - O horário das aulas da turma.
 * @param {string} dia_semana - O dia da semana em que as aulas da turma ocorrem.
 * @param {string} nivel - O nível da turma (ex: iniciante, intermediário, avançado).
 */

function getTurmaInfos(id_turma, professor, horario, dia_semana, nivel) {
    let table = document.getElementById('table_turmas');
    let row = table.insertRow();
    row.insertCell(0).innerHTML = id_turma;
    row.insertCell(1).innerHTML = professor;
    row.insertCell(2).innerHTML = horario;
    row.insertCell(3).innerHTML = dia_semana;
    row.insertCell(4).innerHTML = nivel;

    const cellAcoes = row.insertCell(5);
    const updateButton = document.createElement('button');
    updateButton.textContent = 'Atualizar';
    updateButton.classList.add('update-button');
    updateButton.onclick = function() {
        showEditForm(id_turma, horario, nivel, dia_semana);
    };
    cellAcoes.appendChild(updateButton);
}

/**
 * Função para exibir o formulário de edição de turma.
 *
 * @param {string} id_turma - O ID da turma a ser editada.
 * @param {string} horario - O horário atual da turma.
 * @param {string} nivel - O nível atual da turma.
 * @param {string} dia_semana - O dia da semana atual da turma.
 */
function showEditForm(id_turma, horario, nivel, dia_semana) {

    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'modal-overlay';

    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';
    modalContent.innerHTML = `
        <h3>Editar Turma</h3>
        <form id="editTurmaForm">
        <div class="form-group">
            <label for="horario">Horário:</label>
            <input type="text" id="horario" name="horario" value="${horario}" required>
        </div>
        <div class="form-group">
            <label for="nivel">Nível:</label>
            <input type="text" id="nivel" name="nivel" value="${nivel}" required>
        </div>
            <label for="dia_semana">Dia da Semana:</label>
            <input type="text" id="dia_semana" name="dia_semana" value="${dia_semana}" required>
        </div>
        <div class="form-buttons">
            <button type="submit" class="save-button">Salvar</button>
            <button type="button" class="cancel-button" id="cancelButton">Cancelar</button>
        </div>
        </form>
    `;
    modalOverlay.appendChild(modalContent);
    document.body.appendChild(modalOverlay);

    document.getElementById('cancelButton').onclick = function() {
        document.body.removeChild(modalOverlay);
    }
    document.getElementById('editTurmaForm').addEventListener('submit', function(event) {
        event.preventDefault();
        const novoHorario = document.getElementById('horario').value;
        const novoNivel = document.getElementById('nivel').value;
        const novoDiaSemana = document.getElementById('dia_semana').value;

        updateTurma(id_turma, novoHorario, novoNivel, novoDiaSemana)
            .then(() => {
                document.body.removeChild(modalOverlay);
                getList(); // Atualiza a lista de turmas após a edição
            });
    });
    modalOverlay.onclick = function(event) {
        if (event.target === modalOverlay) {
            document.body.removeChild(modalOverlay);
        }
    }
    document.body.appendChild(modalOverlay);
    modalContent.focus();
    modalContent.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

/**
 * Função para atualizar os dados de uma turma específica.
 * A função faz uma requisição PUT para o endpoint de atualização de turma,
 * passando o ID da turma e os novos dados como parâmetros.
 *
 * @param {string|number} id_turma - O ID da turma a ser atualizada.
 * @param {string} horario - Novo horário da turma.
 * @param {string} nivel - Novo nível da turma.
 * @param {string} dia_semana - Novo dia da semana da turma.
 * @returns {Promise} - Retorna uma Promise que resolve quando a requisição é concluída.
 */

function updateTurma(id_turma, horario, nivel, dia_semana) {
    const url = `http://127.0.0.1:8000/turmas/${id_turma}`;

    const turmaData = new FormData();
    turmaData.append('horario', horario);
    turmaData.append('nivel', nivel);
    turmaData.append('dia_semana', dia_semana);

    return fetch(url, {
        method: 'put',
        body: turmaData
    })
    .then((response) => {
        if (!response.ok) {
            throw new Error(`Erro ao atualizar a turma: ${response.status}`);
        }
        return response.json();
    })
    .then((data) => {
        console.log('Turma atualizada com sucesso:', data);
        alert('Turma atualizada com sucesso!');
        return data;
    })
    .catch((error) => {
        console.error('Error:', error);
        alert('Erro ao atualizar a turma: ' + error.message);
        throw error;
    });
}

/**
 * Função assíncrona que faz um POST para o endpoint de matrícula com os dados do aluno
 * e o identificador da turma em que ele deseja se matricular.
 * Após o envio da solicitação, a função aguarda a resposta do servidor. Se a solicitação
 * for bem-sucedida, exibe uma mensagem de sucesso no console e um alerta informando que
 * a matrícula foi realizada com sucesso. Caso contrário, captura e exibe detalhes do erro.
 *
 * @async
 * @param {string} inputNome - Nome completo.
 * @param {string} inputCpf - CPF.
 * @param {string} inputDataNascimento - Data de nascimento.
 * @param {string} inputEmail - Endereço de email.
 * @param {string} inputCEP - CEP.
 * @param {string} inputNumero - Número do endereço.
 * @param {string} inputTelefone - Número de telefone.
 * @param {string|number} inputIdTurma - Identificador da turma na qual o aluno será matriculado.
 */

async function buscarEnderecoPorCep(inputCEP) {
    const viaCepUrl = `https://viacep.com.br/ws/${inputCEP}/json/`;

    try {
        const response = await fetch(viaCepUrl);
        if (!response.ok) throw new Error(`Erro ao buscar o CEP: ${response.status}`);
        const data = await response.json();

        if (data.erro) {
            throw new Error('CEP não encontrado.');
        }

        document.getElementById('inputLogradouro').value = data.logradouro || '';
        document.getElementById('inputBairro').value = data.bairro || '';
        document.getElementById('inputCidade').value = data.localidade || '';
        document.getElementById('inputEstado').value = data.uf || '';
    } catch (error) {
        console.error('Erro ao buscar o CEP:', error);
        alert('Não foi possível buscar o endereço pelo CEP informado.');
    }
}

const postMatricula = async (inputNome, inputCpf, inputDataNascimento, inputEmail, inputCEP, inputNumero, inputTelefone, inputIdTurma) => {
    const endereco = {
        logradouro: document.getElementById('inputLogradouro').value,
        bairro: document.getElementById('inputBairro').value,
        cidade: document.getElementById('inputCidade').value,
        estado: document.getElementById('inputEstado').value,
    };

    const formsData = new FormData();
    const pessoa_info = {
        pessoa_info: {
            cpf: inputCpf,
            data_nascimento: inputDataNascimento,
            email: inputEmail,
            cep: inputCEP,
            numero: inputNumero,
            nome: inputNome,
            telefone: inputTelefone,
            bairro: endereco.bairro,
            cidade: endereco.cidade,
            uf: endereco.estado,
            logradouro: endereco.logradouro,
        }
    }
    const json_pessoa_info = JSON.stringify(pessoa_info);

    formsData.append('dados_aluno', json_pessoa_info);
    formsData.append('id_turma', Number(inputIdTurma));

    let url = 'http://127.0.0.1:8000/matricula';

    fetch(url, {
        method: 'post',
        body: formsData
    })
    .then((response) => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then((data) => {
        console.log('Success:', data);
        alert('Matrícula realizada com sucesso!');
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

/**
 * Obtém e exibe as informações das turmas em que um aluno, identificado pelo CPF, está matriculado.
 * Se a solicitação for bem-sucedida, a função `displayAlunoInfo`
 * é chamada com os dados obtidos como argumento para exibir as informações das turmas do aluno.
 * Em caso de erro na solicitação, o erro é capturado e registrado no console.
 *
 * @param {string} inputCpf - O CPF do aluno que queremos buscar as informações.
 */

function getAlunoInfo(inputCpf) {
    let url = `http://127.0.0.1:8000/alunos/${inputCpf}/turmas`;
    fetch(url, {
        method: 'get',
    })
    .then((response) => {
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('Aluno não encontrado.');
            }
            throw new Error('Erro na solicitação.');
        }
        return response.json();
    })
    .then((data) => {
        displayAlunoInfo(data);
    })
    .catch((error) => {
        console.error('Error:', error);
        alert(error.message);
    });
}

/**
 * Esta função é responsável por criar e exibir uma tabela contendo informações
 * sobre as turmas em que um aluno específico está matriculado.
 * Antes de adicionar as informações das turmas, a função limpa qualquer conteúdo
 * existente dentro do contêiner 'alunoInfoContainer' para garantir que apenas as
 * informações atuais sejam exibidas. Em seguida, cria uma nova div 'aluno-info',
 * dentro da qual a tabela de turmas é inserida e exibida no contêiner.
 *
 * @param {Object} data - Objeto contendo um array 'turmas' com os dados das turmas em que o aluno está matriculado.
 */

function displayAlunoInfo(data) {
    const alunoInfoContainer = document.getElementById('alunoInfoContainer');
    alunoInfoContainer.innerHTML = ''; // Clear any existing content

    const cpfAluno = document.getElementById('cpf').value;

    const alunoInfoDiv = document.createElement('div');
    alunoInfoDiv.classList.add('aluno-info');
    alunoInfoDiv.innerHTML = `
        <h4>Turmas em que está matriculado</h4>
        <table id="table_turmas">
            <thead>
                <tr>
                    <th>ID Turma</th>
                    <th>Professor</th>
                    <th>Horário</th>
                    <th>Dia da Semana</th>
                    <th>Nível</th>
                    <th>Matrícula</th>
                </tr>
            </thead>
            <tbody></tbody>
        </table>
    `;
    alunoInfoContainer.appendChild(alunoInfoDiv);

    const tableBody = document.getElementById('table_turmas').getElementsByTagName('tbody')[0];
    data.turmas.forEach(turma => {
        let row = tableBody.insertRow();
        row.insertCell(0).innerHTML = turma.id_turma;
        row.insertCell(1).innerHTML = turma.professor;
        row.insertCell(2).innerHTML = turma.horario;
        row.insertCell(3).innerHTML = turma.dia_semana;
        row.insertCell(4).innerHTML = turma.nivel;

        // Adiciona um botão para cancelar a matrícula
        const cellAcoes = row.insertCell(5);
        const cancelButton = document.createElement('button');
        cancelButton.textContent = 'Cancelar';
        cancelButton.classList.add('cancel-button');
        cancelButton.onclick = function() {
            if (confirm(`Deseja realmente cancelar a matrícula na turma ${turma.id_turma}?`)) {
                cancelarMatricula(cpfAluno, turma.id_turma);
            }
        };
        cellAcoes.appendChild(cancelButton);
    });
}

/**
 * Função para cancelar a matrícula do aluo em uma turma específica.
 * A função faz uma requisição DELETE para o endpoint correspondente,
 * passando o CPF do aluno e o ID da turma como parâmetros.
 *
 * @param {string} cpfAluno - O CPF do aluno que deseja cancelar a matrícula.
 * @param {string} idTurma - O ID da turma da qual o aluno deseja cancelar a matrícula.
 * @returns {Promise} - Retorna uma Promise que resolve quando a requisição é concluída.
 */
function cancelarMatricula(cpfAluno, idTurma) {
    let url = `http://127.0.0.1:8000/matricula/${cpfAluno}/${idTurma}`;

    return fetch(url, {
        method: 'delete',
    })
    .then((response) => {
        if (!response.ok) {
            throw new Error(`Erro ao cancelar a matrícula: ${response.status}`);
        }
        return response.json();
    })
    .then((data) => {
        console.log('Matrícula cancelada com sucesso:', data);
        alert('Matrícula cancelada com sucesso!');
        getAlunoInfo(cpfAluno); // Atualiza as informações do aluno após o cancelamento
        return data;
    })
    .catch((error) => {
        console.error('Error:', error);
        alert('Erro ao cancelar a matrícula: ' + error.message);
        throw error;
    });

}

/**
 * Altera o conteúdo da página com base na opção selecionada pelo usuário.
 *
 * Esta função manipula o conteúdo da div com id 'content' substituindo-o com informações
 * relevantes dependendo da página selecionada pelo usuário. As opções de página incluem
 * 'home', 'turmas_disponiveis', 'matricula', 'aluno_info', e um caso padrão que exibe uma
 * mensagem de página não encontrada. Cada caso altera o innerHTML da div 'content' para
 * exibir o conteúdo correspondente à seleção.
 *
 * - 'home': Exibe uma imagem, uma mensagem de boas-vindas e informações de contato.
 * - 'turmas_disponiveis': Mostra uma tabela de turmas disponíveis e chama a função `getList()`
 *   para preencher a tabela.
 * - 'matricula': Apresenta um formulário para que o usuário possa se matricular em uma turma.
 *   Após o envio do formulário, os dados são coletados e enviados para a função `postMatricula`.
 * - 'aluno_info': Oferece um formulário para buscar informações de um aluno pelo CPF. Após o
 *   envio do formulário, os dados são coletados e enviados para a função `getAlunoInfo`.
 * - default: Exibe uma mensagem indicando que a página solicitada não foi encontrada.
 *
 * @param {string} page - A página que o usuário deseja visualizar.
 */

function changeContent(page) {
    var contentDiv = document.getElementById('content');

    switch (page) {
        case 'home':
            contentDiv.innerHTML = `
                <img src="imagens/79.jpg">
                <h2>Venha fazer uma aula experimental conosco!</h2>
                <p>Estamos localizados na Avenida Andaló, 5000. Para mais informações, entre em contato conosco no número (17) 98934-5678.</p>
            `;
            break;
        case 'turmas_disponiveis':
            contentDiv.innerHTML = `
                <h2>Turmas Disponíveis</h2>
                <section class="items">
                    <table id="table_turmas">
                        <tr>
                            <th>Turma</th>
                            <th>Professor</th>
                            <th>Horário</th>
                            <th>Dia da Semana</th>
                            <th>Nível</th>
                            <th>Ação</th>
                        </tr>
                    </table>
                </section>
            `;
            getList();
            break;
        case 'matricula':
            contentDiv.innerHTML = `
                <div class="container">
                    <h2>Matricule-se em uma de nossas turmas</h2>
                    <form id="matriculaForm">
                        <div class="form">
                            <label for="nome">Nome:</label>
                            <input type="text" id="nome" name="nome" required>
                        </div>
                        <div class="form">
                            <label for="cpf">CPF:</label>
                            <input type="text" id="cpf" name="cpf" required>
                        </div>
                        <div class="form">
                            <label for="dataNascimento">Data de Nascimento:</label>
                            <input type="date" id="dataNascimento" name="dataNascimento" required>
                        </div>
                        <div class="form">
                            <label for="email">Email:</label>
                            <input type="email" id="email" name="email" required>
                        </div>
                        <div class="form">
                            <label for="CEP">CEP:</label>
                            <input type="text" id="CEP" name="CEP" required onblur="buscarEnderecoPorCep(this.value)">
                        </div>
                        <div class="form">
                            <label for="inputLogradouro">Logradouro:</label>
                            <input type="text" id="inputLogradouro" name="logradouro" readonly>
                        </div>
                        <div class="form">
                            <label for="numero">Numero:</label>
                            <input type="text" id="numero" name="numero" required>
                        </div>
                        <div class="form">
                            <label for="inputBairro">Bairro:</label>
                            <input type="text" id="inputBairro" name="bairro" readonly>
                        </div>
                        <div class="form">
                            <label for="inputCidade">Cidade:</label>
                            <input type="text" id="inputCidade" name="cidade" readonly>
                        </div>
                        <div class="form">
                            <label for="inputEstado">Estado:</label>
                            <input type="text" id="inputEstado" name="estado" readonly>
                        </div>
                        <div class="form">
                            <label for="telefone">Telefone:</label>
                            <input type="tel" id="telefone" name="telefone" required>
                        </div>
                        <div class="form">
                            <label for="idTurma">ID da Turma:</label>
                            <input type="text" id="idTurma" name="idTurma" required>
                        </div>
                        <div class="form">
                            <button type="submit">Enviar</button>
                        </div>
                    </form>
                </div>
            `;
            document.getElementById('matriculaForm').addEventListener('submit', function(event) {
                event.preventDefault();
                const inputNome = document.getElementById('nome').value;
                const inputCpf = document.getElementById('cpf').value;
                const inputDataNascimento = document.getElementById('dataNascimento').value;
                const inputEmail = document.getElementById('email').value;
                const inputCEP = document.getElementById('CEP').value;
                const inputNumero = document.getElementById('numero').value;
                const inputTelefone = document.getElementById('telefone').value;
                const inputIdTurma = document.getElementById('idTurma').value;

                postMatricula(inputNome, inputCpf, inputDataNascimento, inputEmail, inputCEP, inputNumero, inputTelefone, inputIdTurma);
            });
            break;
        case 'aluno_info':
            contentDiv.innerHTML = `
                <div class="container">
                    <h2>Informações do Aluno</h2>
                    <form id="alunoInfoForm">
                        <div class="form">
                            <label for="cpf">CPF:</label>
                            <input type="text" id="cpf" name="cpf" required>
                        </div>
                        <div class="form">
                            <button type="submit">Buscar</button>
                        </div>
                    </form>
                    <div id="alunoInfoContainer"></div>
                </div>
            `;
            document.getElementById('alunoInfoForm').addEventListener('submit', function(event) {
                event.preventDefault();
                const inputCpf = document.getElementById('cpf').value;
                getAlunoInfo(inputCpf);
            });
            break;
        default:
            contentDiv.innerHTML = '<h2>Page not found!</h2>';
    }
}
