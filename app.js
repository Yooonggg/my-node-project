const express = require('express');
const app = express();

app.use(express.json());

// In-memory "database"
let books = [
  { 
    id:      1, 
    title:  "Flipped", 
    author: "Rio Nava", 
    price:   95.99, 
    stock:   50 
  },
  { 
    id:      2, 
    title:   "The Alchemist", 
    author:  "Rio Nava", 
    price:   120.99, 
    stock:   132 
  },
  { 
    id:      3, 
    title:   "The Love Hypothesis", 
    author:  "Rio Nava", 
    price:   145.99, 
    stock:   80 
  },
  { 
    id:      4, 
    title:   "The Siren", 
    author:  "Rio Nava", 
    price:   80.49, 
    stock:   120 
  },
  { 
    id:      5, 
    title:   "Turtles All the Way Down", 
    author:  "Rio Nava", 
    price:   110.99, 
    stock:   40 
  },
  { 
    id:      6, 
    title:   "Harry Potter and the Sorcerer's Stone", 
    author:  "Kathleen Felisilda", 
    price:   550.55, 
    stock:   210
  },
  { 
    id:      7, 
    title:   "The Midnight Library", 
    author:  "Kathleen Felisilda",
    price:   550.50, 
    stock:   220 
  },
  { 
    id: 8, 
    title: "Once Upon A Broken Heart", 
    author: "Kathleen Felisilda", 
    price: 750.80, 
    stock: 150 
  },
  { 
    id: 9, 
    title: "Pride and Prejudice", 
    author: "Kathleen Felisilda", 
    price: 275.42, 
    stock: 189
  },
  { 
    id: 10, 
    title: "The Great Gatsby", 
    author: "Kathleen Felisilda", 
    price: 650.67, 
    stock: 200 
  },
  { 
    id: 11, 
    title: "The Brothers Karamazov", 
    author: "James Allen Victoria", 
    price: 14.49, 
    stock: 4 
  },
  { 
    id: 12, 
    title: "Les Misérables", 
    author: "James Allen Victoria", 
    price: 18.99, 
    stock: 3 
  },
  { 
    id: 13, 
    title: "Jane Eyre", 
    author: "James Allen Victoria", 
    price: 9.99, 
    stock: 7 
  },
  { 
    id: 14, 
    title: "Wuthering Heights", 
    author: "James Allen Victoria", 
    price: 11.49, 
    stock: 5 
  },
  { 
    id: 15, 
    title: "Animal Farm", 
    author: "James Allen Victoria", 
    price: 7.99, 
    stock: 10 
  },
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

// POST: Add a new book (check for duplicate title and author)
app.post('/api/books', (req, res) => {
  const { title, author, price, stock } = req.body;

  // Check if the book with the same title and author already exists
  const existingBook = books.find(book => book.title === title && book.author === author);

  if (existingBook) {
    return res.status(400).send("Cannot add, book with this title and author already exists");
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

// PUT: Update a book by ID (check for duplicate title and author)
app.put('/api/books/:id', (req, res) => {
  const bookId = parseInt(req.params.id);
  const book = books.find(b => b.id === bookId);
  if (!book) return res.status(404).send('Book not found.');

  // Destructure incoming data and round price if provided
  const { title, author, price, stock } = req.body;
  
  // Check if the updated book title and author already exist (and it's not the same book)
  const duplicateBook = books.find(b => b.title === title && b.author === author && b.id !== bookId);
  
  if (duplicateBook) {
    return res.status(400).send("Cannot update, book with this title and author already exists");
  }

  // Update the book fields
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
