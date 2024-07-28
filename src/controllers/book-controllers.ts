import { PrismaClient } from "@prisma/client";
import { Request, Response } from 'express';
import { HttpCode } from "../core/constants";
import { msgError } from "../functions/message";

const prisma = new PrismaClient();

const booksControllers = {
    // Consulter la liste des livres disponibles
    getAllBooks: async(req: Request, res: Response) =>{
        try {
            const allBooks = prisma.book.findMany({
                select: {
                    title: true,
                    author: true,
                    description: true,
                    publicateYear: true,
                    ISBN: true
                }
            });
            if(!allBooks) return msgError.notFound(res, "Erreur lors de la recuperation des livres !");

            // Message de succes
            res.status(HttpCode.OK).json({allBooks});
        } catch (error) {
            return msgError.serveurError(res, error);
        }
    },

    //Ajouter un nouveau livre
    addBook: async(req: Request, res: Response) =>{
        try {
            
        } catch (error) {
            return msgError.serveurError(res, error);
        }
    },

    // Mettre a jour un livre de la bibliothèque
    updateBook: async(req: Request, res: Response) =>{
        try {
            // Recuperation de l'identifiant dans les parametres de la requete
            const {id} = req.params;
            if(!id) msgError.badRequest(res, "identifiant invalide !");

        } catch (error) {
            return msgError.serveurError(res, error);
        }
    },

    // Supprimer un livre
    deleteBook: async(req: Request, res: Response) =>{
        try {
            // Recuperation de l'identifiant dans les parametres de la requete
            const {id} = req.params;
            if(!id) msgError.badRequest(res, "identifiant invalide !");

            // Suppression du livre dont l'id est donné
            const deleteBook = await prisma.book.delete({
                where: {
                    book_id: id
                }
            });
            if(!deleteBook) return msgError.notFound(res, "Erreur lors de la suppression du livre!");

            // Message de succes
            res.status(HttpCode.OK).json({msg: `le livre ${deleteBook.title} a bien été supprimé !`});
        } catch (error) {
            return msgError.serveurError(res, error);
        }
    },

};

export default booksControllers;