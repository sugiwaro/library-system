import React, { useState, useEffect } from 'react';
import { api } from './api';
import { Book } from './types';

function App() {
  const [books, setBooks] = useState<Book[]>([]);
  const [form, setForm] = useState({ 
    isbn: '', 
    name: '', 
    author: '', 
    pages: 0, 
    year: new Date().getFullYear() 
  });

  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    try {
      const res = await api.getBooks();
      setBooks(res.data);
    } catch (error) {
      console.error('Ошибка загрузки:', error);
      alert('Не удалось загрузить книги');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.isbn || !form.name || !form.author) {
      alert('Заполните все поля!');
      return;
    }
    try {
      await api.createBook(form);
      await loadBooks();
      setForm({ isbn: '', name: '', author: '', pages: 0, year: new Date().getFullYear() });
      alert('Книга добавлена!');
    } catch (error: any) {
      console.error('Ошибка:', error);
      alert(error.response?.data?.error || 'Ошибка при добавлении книги');
    }
  };

  const handleDelete = async (isbn: string) => {
    if (window.confirm(`Удалить книгу ${isbn}?`)) {
      try {
        await api.deleteBook(isbn);
        await loadBooks();
        alert('Книга удалена!');
      } catch (error) {
        alert('Ошибка при удалении');
      }
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>📚 Библиотечная система</h1>
      
      <form onSubmit={handleSubmit} style={{ 
        marginBottom: '20px', 
        border: '1px solid #ccc', 
        padding: '20px', 
        borderRadius: '8px',
        backgroundColor: '#f9f9f9'
      }}>
        <h3>Добавить новую книгу</h3>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <input 
            placeholder="ISBN" 
            value={form.isbn} 
            onChange={e => setForm({...form, isbn: e.target.value})} 
            required 
            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
          <input 
            placeholder="Название" 
            value={form.name} 
            onChange={e => setForm({...form, name: e.target.value})} 
            required 
            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
          <input 
            placeholder="Автор" 
            value={form.author} 
            onChange={e => setForm({...form, author: e.target.value})} 
            required 
            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
          <input 
            type="number" 
            placeholder="Страниц" 
            value={form.pages} 
            onChange={e => setForm({...form, pages: parseInt(e.target.value) || 0})} 
            required 
            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
          <input 
            type="number" 
            placeholder="Год" 
            value={form.year} 
            onChange={e => setForm({...form, year: parseInt(e.target.value) || new Date().getFullYear()})} 
            required 
            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
          <button 
            type="submit" 
            style={{ 
              padding: '8px 16px', 
              backgroundColor: '#007bff', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            ➕ Добавить
          </button>
        </div>
      </form>

      <h3>Список книг ({books.length})</h3>
      {books.length === 0 ? (
        <p>Пока нет книг. Добавьте первую!</p>
      ) : (
        <table style={{ 
          width: '100%', 
          borderCollapse: 'collapse',
          backgroundColor: 'white'
        }}>
          <thead style={{ backgroundColor: '#f2f2f2' }}>
            <tr>
              <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'left' }}>ISBN</th>
              <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'left' }}>Название</th>
              <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'left' }}>Автор</th>
              <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'center' }}>Страниц</th>
              <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'center' }}>Год</th>
              <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'center' }}>Действия</th>
            </tr>
          </thead>
          <tbody>
            {books.map(book => (
              <tr key={book.isbn}>
                <td style={{ border: '1px solid #ddd', padding: '12px' }}>{book.isbn}</td>
                <td style={{ border: '1px solid #ddd', padding: '12px' }}>{book.name}</td>
                <td style={{ border: '1px solid #ddd', padding: '12px' }}>{book.author}</td>
                <td style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'center' }}>{book.pages}</td>
                <td style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'center' }}>{book.year}</td>
                <td style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'center' }}>
                  <button 
                    onClick={() => handleDelete(book.isbn)}
                    style={{
                      padding: '5px 10px',
                      backgroundColor: '#dc3545',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    🗑️ Удалить
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default App;