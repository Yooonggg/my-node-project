const express = require('express');
const app = express();

app.use(express.json());

// In-memory "database"
let books = [
  { id: 1, title: "1984", author: "George Orwell", price: 9.99, stock: 5 },
  { id: 2, title: "To Kill a Mockingbird", author: "Harper Lee", price: 12.99, stock: 3 },
];

// GET: Retrieve all books with price as floating-point (formatted to 2 decimal places)
app.get('/api/books', (req, res) => {
  const updatedBooks = books.map(book => ({
    ...book,
    price: parseFloat(book.price).toFixed(2) // Ensures it's a floating-point number and formats to 2 decimal places
  }));
  res.json(updatedBooks);
});

// POST: Add a new book
app.post('/api/books', (req, res) => {
  const newBook = { id: books.length + 1, ...req.body };
  books.push(newBook);
  res.status(201).json(newBook);
});

// PUT: Update a book by ID
app.put('/api/books/:id', (req, res) => {
  const bookId = parseInt(req.params.id);
  const book = books.find(b => b.id === bookId);
  if (!book) return res.status(404).send('Book not found.');

  Object.assign(book, req.body);
  res.json(book);
});

// DELETE: Remove a book by ID and reindex remaining books
app.delete('/api/books/:id', (req, res) => {
  const bookId = parseInt(req.params.id);
  books = books.filter(b => b.id !== bookId);

  // Reindex the books
  books = books.map((book, index) => ({ ...book, id: index + 1 }));

  res.status(204).send();
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
