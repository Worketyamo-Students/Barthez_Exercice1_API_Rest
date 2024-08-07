import { PrismaClient } from "@prisma/client";
import { Request, Response } from 'express';
import { HttpCode } from "../core/constants";
import { msgError } from "../functions/message";

const prisma = new PrismaClient();

const booksControllers = {
    // Consulter la liste des livres disponibles
    getAllBooks: async(req: Request, res: Response) =>{
        try {
            const allBooks = await prisma.book.findMany({
                select: {
                    title: true,
                    author: true,
                    description: true,
                    publicateYear: true,
                    ISBN: true
                }
            });
            if(!allBooks) return msgError.notFound(res, "Erreur lors de la recuperation des livres !");

            if(allBooks.length === 0) return res.status(HttpCode.OK).json({msg: "Pas encore de livre pour le moment !"})

            // Message de succes
            res.status(HttpCode.OK).json({msg: allBooks});
        } catch (error) {
            return msgError.serveurError(res, error);
        }
    },

    //Ajouter un nouveau livre
    addBook: async(req: Request, res: Response) =>{
        try {
            // Recuperation des information du corps de la requete
            const {title, author, description, publicateYear, ISBN} = req.body;
            
            // verification que le livre n'esiste pas dejà
            const everExist = await prisma.book.findFirst({where: {title}})
            if(everExist) return res.status(HttpCode.FORBIDDEN).json({msg: "Un livre avec ce titre existe dejà !"})
            
            // Ajout d'un nouveau livre avec les infos entrés
            const newBook = await prisma.book.create({
                data: {
                    title: title,
                    author: author,
                    description: description,
                    publicateYear: publicateYear,
                    ISBN: ISBN
                }
            });
            if(!newBook) return msgError.notFound(res, "Erreur lors de l'ajout du nouveau livre !");

            // Message de succes
            res.status(HttpCode.CREATED).json({msg: `Le livre ${newBook.title} a bien été ajouté.`});
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

            // Recuperation des information du corps de la requete
            const {title, author, description, publicateYear, ISBN} = req.body;

            // Modificatiion du livre dnt l'id correspond a celui entré
            const updateBook = await prisma.book.update({
                where: {
                    book_id: id
                },

                data: {
                    title: title,
                    author: author,
                    description: description,
                    publicateYear: publicateYear,
                    ISBN: ISBN
                }
            });
            if(!updateBook) return msgError.notFound(res, "Erreur lors de l'ajout du nouveau livre !");

            // Message de succes
            res.status(HttpCode.OK).json({msg: `Le livre ${updateBook.title} a bien été modifié.`});
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
            
            // Preciser qu'on ne peut supprimer un livre emprunter
            const selectLoanBook = await prisma.book.findFirst({
                where: {
                    book_id: id,
                    status: "emprunte"
                }
            })
            if(selectLoanBook) return res.status(HttpCode.FORBIDDEN).json({msg: "vous ne pouvez pas supprimer ce livre, il est emprunter"});

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