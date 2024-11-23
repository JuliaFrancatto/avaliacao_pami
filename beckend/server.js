const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql');

const app = express();
const PORT = 3000;


app.use(cors());
app.use(bodyParser.json());

// Configuração do banco de dados
const db = mysql.createConnection({
    host: 'localhost',      
    user: 'root',           
    password: '',           
    database: 'test',     
});

// Conectando ao banco de dados
db.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err);
        return;
    }
    console.log('Conectado ao banco de dados MySQL.');
});

// Rota para cadastro de usuários
app.post('/usuarios', (req, res) => {
    const { cpf, nome, idade, cep, endereco } = req.body;

    if (!cpf || !nome || !idade || !cep) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios!' });
    }

    const sql = 'INSERT INTO cadastro (cpf, nome, idade, cep, endereco) VALUES (?, ?, ?, ?, ?)';
    db.query(sql, [cpf, nome, idade, cep, endereco], (err, result) => {
        if (err) {
            console.error('Erro ao inserir usuário:', err);
            return res.status(500).json({ error: 'Erro ao salvar o usuário!' });
        }
        res.status(201).json({ message: 'Usuário cadastrado com sucesso!' });
    });
});

app.get('/usuarios', (req, res) => {
    const sql = 'SELECT * FROM cadastro';

    db.query(sql, (err, results) => {
        if (err) {
            console.error('Erro ao buscar usuários:', err);
            return res.status(500).json({ error: 'Erro ao buscar usuários!' });
        }

        res.status(200).json(results);
    });
});

// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});


