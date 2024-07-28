import { Router } from "express";
import booksControllers from "../controllers/book-controllers";

const book = Router();

// Consulter la liste des livres disponibles
book.get('/', booksControllers.getAllBooks);

//Ajouter un nouveau livre
book.post('/', booksControllers.addBook);

// Mettre a jour un livre de la bibliothèque
book.put('/:id', booksControllers.updateBook);

// Supprimer un livre
book.delete('/:id', booksControllers.deleteBook);

export default book;