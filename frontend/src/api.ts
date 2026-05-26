import axios from 'axios';
import { Book } from './types';

const API = 'http://localhost:3001/api';

export const api = {
  getBooks: () => axios.get<Book[]>(`${API}/books`),
  createBook: (book: Omit<Book, 'addedOn'>) => axios.post(`${API}/books`, book),
  deleteBook: (isbn: string) => axios.delete(`${API}/books/${isbn}`),
};