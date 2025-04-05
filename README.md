# PUC-Rio MVP FrontEnd
![Badge em Desenvolvimento](http://img.shields.io/static/v1?label=STATUS&message=EM%20DESENVOLVIMENTO&color=GREEN&style=for-the-badge)

Interface gráfica que permite aos alunos da escola de beach tennis "Pé na Areia" consultarem as turmas disponíveis, realizar matrículas e consultarem em que turmas estão matriculados atualmente.

### Execução da Aplicação

#### Usando Docker
Para executar a aplicação utilizando Docker:

```bash
# Construir a imagem
docker build -t pe-na-areia-frontend .

# Executar o contêiner
docker run -d -p 8080:80 pe-na-areia-frontend
```

Após a execução, acesse a aplicação em: http://localhost:8080

### Páginas disponíveis

#### 1. Home

    - Informações de localização e contato da escola

#### 2. Turmas disponíveis

    - Mostra informações sobre as turmas como horários, nível e nome do professor

#### 3. Matricule-se

    - Formulário a ser preenchido caso a pessoa queira se matricular em uma das turmas disponíveis

#### 4. Informações do Aluno

    - Consulta por CPF do aluno, em qual(is) turma(s) ele está matriculado atualmente.

