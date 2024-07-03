const getList = async () => {
    let url = 'http://127.0.0.1:8000/turmas';
    fetch(url, {
        method: 'get',
    })
    .then((response) => response.json())
    .then((data) => {
        data.turmas.forEach(item => getTurmaInfos(item.id_turma, item.professor, item.horario, item.dia_semana, item.nivel))
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

function getTurmaInfos(id_turma, professor, horario, dia_semana, nivel) {
    let table = document.getElementById('table_turmas');
    let row = table.insertRow();
    row.insertCell(0).innerHTML = id_turma;
    row.insertCell(1).innerHTML = professor;
    row.insertCell(2).innerHTML = horario;
    row.insertCell(3).innerHTML = dia_semana;
    row.insertCell(4).innerHTML = nivel;
}

const postMatricula = async (inputNome, inputCpf, inputDataNascimento, inputEmail, inputEndereco, inputTelefone, inputIdTurma) => {
    const formsData = new FormData();
    const pessoa_info = {
        pessoa_info:
                {
                cpf: inputCpf,
                data_nascimento: inputDataNascimento,
                email: inputEmail,
                endereco: inputEndereco,
                nome: inputNome,
                telefone: inputTelefone,
            }
    }
    const json_pessoa_info = JSON.stringify(pessoa_info)

    formsData.append('dados_aluno', json_pessoa_info)
    formsData.append('id_turma',Number(inputIdTurma))


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

function getAlunoInfo(inputCpf) {
    let url = `http://127.0.0.1:8000/alunos/${inputCpf}/turmas`;
    fetch(url, {
        method: 'get',
    })
    .then((response) => response.json())
    .then((data) => {
        console.log(data);
    }
    )
    .catch((error) => {
        console.error('Error:', error);
    }
    );
}

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
        case 'turmas_disponíveis':
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
                            <label for="endereco">Endereço:</label>
                            <input type="text" id="endereco" name="endereco" required>
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
                const inputEndereco = document.getElementById('endereco').value;
                const inputTelefone = document.getElementById('telefone').value;
                const inputIdTurma = document.getElementById('idTurma').value;

                postMatricula(inputNome, inputCpf, inputDataNascimento, inputEmail, inputEndereco, inputTelefone, inputIdTurma);
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
