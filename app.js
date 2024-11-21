const express = require('express');
const app = express();

app.use(express.json());

// In-memory "database"
let books = [
  { id: 1, title: "1984", author: "George Orwell", price: 9.99, stock: 5 },
  { id: 2, title: "To Kill a Mockingbird", author: "Harper Lee", price: 12.99, stock: 3 },
];

// Function to round price to 2 decimal places
const roundPrice = (price) => Math.round(price * 100) / 100;

// GET: Retrieve all books with price as floating-point (rounded to 2 decimal places)
app.get('/api/books', (req, res) => {
  const updatedBooks = books.map(book => ({
    ...book,
    price: roundPrice(book.price)  // Round the price to 2 decimal places, keeps it a number
  }));
  res.json(updatedBooks);
});

// POST: Add a new book (check for duplicate title before adding)
app.post('/api/books', (req, res) => {
  const { title, author, price, stock } = req.body;

  // Check if the book with the same title already exists
  const existingBook = books.find(book => book.title === title);

  if (existingBook) {
    return res.status(400).send("Cannot add, book with this title already exists");  // Return an error if the title exists
  }

  // Round the price to 2 decimal places before adding it
  const newBook = {
    id: books.length + 1,
    title,
    author,
    price: roundPrice(price),  // Apply price rounding here
    stock
  };
  books.push(newBook);
  res.status(201).json(newBook);
});

// PUT: Update a book by ID
app.put('/api/books/:id', (req, res) => {
  const bookId = parseInt(req.params.id);
  const book = books.find(b => b.id === bookId);
  if (!book) return res.status(404).send('Book not found.');

  // Destructure incoming data and round price if provided
  const { title, author, price, stock } = req.body;
  
  if (price !== undefined) {
    book.price = roundPrice(price);  // Apply price rounding here
  }
  
  if (title !== undefined) book.title = title;
  if (author !== undefined) book.author = author;
  if (stock !== undefined) book.stock = stock;

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
