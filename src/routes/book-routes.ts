import { Router } from "express";
import booksControllers from "../controllers/book-controllers";
import validator from "../functions/validator";
import validate from "../middleware/validate";

const book = Router();

// Consulter la liste des livres disponibles
book.get('/', booksControllers.getAllBooks);

//Ajouter un nouveau livre
book.post('/', validator.validateBook, validate, booksControllers.addBook);

// Mettre a jour un livre de la bibliothèque
book.put('/:id',validator.validateBook, validate, booksControllers.updateBook);

// Supprimer un livre
book.delete('/:id', booksControllers.deleteBook);

export default book;