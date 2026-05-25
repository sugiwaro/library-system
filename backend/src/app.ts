import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

// Хранилище данных (в памяти)
let books: any[] = [];

// GET все книги
app.get('/api/books', (req, res) => {
    res.json(books);
});

// GET одну книгу
app.get('/api/books/:isbn', (req, res) => {
    const book = books.find(b => b.isbn === req.params.isbn);
    if (!book) {
        return res.status(404).json({ error: 'Книга не найдена' });
    }
    res.json(book);
});

// POST создать книгу
app.post('/api/books', (req, res) => {
    const book = {
        ...req.body,
        addedOn: new Date().toISOString()
    };
    books.push(book);
    res.status(201).json(book);
});

// PATCH обновить книгу
app.patch('/api/books/:isbn', (req, res) => {
    const index = books.findIndex(b => b.isbn === req.params.isbn);
    if (index === -1) {
        return res.status(404).json({ error: 'Книга не найдена' });
    }
    books[index] = { ...books[index], ...req.body };
    res.json(books[index]);
});

// DELETE удалить книгу
app.delete('/api/books/:isbn', (req, res) => {
    const index = books.findIndex(b => b.isbn === req.params.isbn);
    if (index === -1) {
        return res.status(404).json({ error: 'Книга не найдена' });
    }
    books.splice(index, 1);
    res.json({ message: 'Книга удалена' });
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`✅ Сервер запущен на http://localhost:${PORT}`);
    console.log(`📚 Доступные эндпоинты:`);
    console.log(`   GET    /api/books - получить все книги`);
    console.log(`   POST   /api/books - создать книгу`);
    console.log(`   PATCH  /api/books/:isbn - обновить книгу`);
    console.log(`   DELETE /api/books/:isbn - удалить книгу`);
});