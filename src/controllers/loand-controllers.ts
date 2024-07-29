import { PrismaClient } from "@prisma/client";
import { Request, Response } from 'express';
import { HttpCode } from "../core/constants";
import { msgError } from "../functions/message";

const prisma = new PrismaClient();

const loandControllers = {
    loandBook: async (req: Request, res: Response) => {
        try {
            // Recuperation des id du livres et de l'utilisateur dans le corps de la requete
            const { bookID, userID } = req.body;

            // Verification de la presence de ces elements
            if (!bookID || !userID) return msgError.badRequest(res, "Veillez saisir toutes les informations");

            //rechercher l'utilisateur en question
            const livreExist = await prisma.book.findUnique({
                where: { book_id: bookID }
            });
            if (!livreExist) return msgError.notFound(res, "le livre mentionné n'existe pas !");

            // verification du status du livre
            if (livreExist.status === "emprunte") return msgError.notFound(res, "le livre demandé est dejà emprunté !");

            //rechercher l'utilisateur en question
            const userExist = await prisma.user.findFirst({
                where: { user_id: userID }
            });
            if (!userExist) return msgError.notFound(res, "l'utilisateur mentionné n'existe pas");

            //Mettre a jour le statut du livre
            const updateBookStatus = await prisma.book.update({
                where: {book_id: bookID},
                data: {status: "emprunte"}
            });
            if (!updateBookStatus) return msgError.notFound(res, "erreur lors de la modification du status du livre!");

            // Ajouter un emprunt
            const newLoand = await prisma.loand.create({
                data: {bookID,userID}
            });
            if (!newLoand) return msgError.notFound(res, "Erreur lors de l'ajout de l'emprunt");

            // Message de success
            res.status(HttpCode.CREATED).json({ msg: `emprunt ajouter avec success` });
        } catch (error) {
            return msgError.serveurError(res, error);
        }
    },

    backBook: async (req: Request, res: Response) => {
        try {
            // Recuperation de l'identifiant dans les parametres de la requete
            const { id } = req.params;
            if (!id) msgError.badRequest(res, "identifiant invalide !");

            // verifier l'existance de l'emprunt specifier
            const existLoand = await prisma.loand.findFirst({
                where: {loand_id: id}
            });
            if (!existLoand) return msgError.notFound(res, "l'emprunt' specifier est introuvabe")

            // mis à jour de la date de retour de l'emprunt
            const updateLoand = await prisma.loand.update({
                where: {
                    loand_id: id
                },
                data: {
                    backDate: new Date()
                }
            });
            if (!updateLoand) return msgError.notFound(res, "erreur lors de la mise a jour de la date de rendu de l'emprunt !")

            // Mis a jour du status du livre qui est remis
            const updateBook = await prisma.book.update({
                where: {book_id: existLoand.bookID},
                data: {status: "disponible"}
            });
            if (!updateBook) return msgError.notFound(res, "erreur lors de mis à jour d'un livre");

            // Message de success
            res.status(HttpCode.CREATED).json({ msg: `l'utilisateur a ete ajouter avec success` });
        } catch (error) {
            return msgError.serveurError(res, error);
        }
    },

    userLoandHistory: async (req: Request, res: Response) => {
        try {
            // Recuperation de l'identifiant dans les parametres de la requete
            const { userID } = req.params;
            if (!userID) msgError.badRequest(res, "identifiant invalide !");

            const userLoand = await prisma.loand.findMany({
                where: {userID}
            });
            if (!userLoand) return msgError.notFound(res, "erreur lors de la recuperation de l'historique !");

            // Message de success
            res.status(HttpCode.CREATED).json({ msg: userLoand });
        } catch (error) {
            return msgError.serveurError(res, error);
        }
    }
};

export default loandControllers;