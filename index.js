const express = require('express');
const { v4: uuidv4 } = require('uuid');

const app = express();
const port = 3000;

// Используем встроенный middleware для парсинга JSON
app.use(express.json());

const links = new Map();

// Эндпойнт для создания одноразовой ссылки
app.post('/create', (req, res) => {
    const { value } = req.body;
    if (!value) {
        return res.status(400).json({ error: 'Value is required' });
    }

    const id = uuidv4();
    links.set(id, value);

    res.json({ link: `http://localhost:${port}/get/${id}` });
});

// Эндпойнт для получения значения по одноразовой ссылке
app.get('/get/:id', (req, res) => {
    const { id } = req.params;

    if (!links.has(id)) {
        return res.status(404).json({ error: 'Link not found or already used' });
    }

    const value = links.get(id);
    links.delete(id);

    res.json({ value });
});

app.listen(port, () => {
    console.log(`Service is running on http://localhost:${port}`);
});