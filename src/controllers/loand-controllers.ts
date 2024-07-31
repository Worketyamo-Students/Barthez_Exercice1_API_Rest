import { PrismaClient } from "@prisma/client";
import { Request, Response } from 'express';
import { HttpCode } from "../core/constants";
import { msgError } from "../functions/message";

const prisma = new PrismaClient();

const loandControllers = {
    // Fonction pour ajouter un emprunt
    loandBook: async (req: Request, res: Response) => {
        try {
            // Recuperation des id du livres et de l'utilisateur dans le corps de la requete
            const { bookID, userID } = req.body;

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

    // fonction pour rembourser un livre emprunter
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
            res.status(HttpCode.CREATED).json({ msg: `le livre a bien été retourné !`});
        } catch (error) {
            return msgError.serveurError(res, error);
        }
    },

    userLoandHistory: async (req: Request, res: Response) => {
        try {
            // Recuperation de l'identifiant dans les parametres de la requete
            const { userID } = req.params;
            if (!userID) msgError.badRequest(res, "identifiant invalide !");

            // Recuperation de tous les emprunts que l'utilisateur a fait
            const loans = await prisma.loand.findMany({
                where: {userID}
            });
            if (loans.length === 0) return msgError.notFound(res, "erreur lors de la recuperation de l'historique !");
    
            interface IloanInfo {
                infoUser: {
                    userName: string,
                    userEmail: string
                },
                bookName: string,
                loanDate: Date
            }
            const loanInfo: IloanInfo[] = [];

            // recherche du nom du livre, et de la date de l'emprunt sur chaque emprund pour afficher
            for(const loan of loans) {
                // recuperation de l'id du livre emprunté
                const book_id = loan.bookID;

                //recuperation de l'utilisateur qui a emprunté
                const user_id = loan.userID

                // recherche du nom du livre
                const book = await prisma.book.findUnique({where: {book_id}});
                const bookName = book? book.title : "livre inconnue";

                // recuperation de la date de l'emprunt
                const loanDate = loan.loandDate
            
                // recuperation du nom de l'emprunteur
                const user = await prisma.user.findUnique({where: {user_id}})
                const userName = user? user.name : "nom inconnu";
                const userEmail = user? user.email: "email inconnu";
                const infoUser = {userName,userEmail};
                
                // ajout des infos dans le tableau
                loanInfo.push({infoUser, bookName, loanDate})
            }

            // Message de success
            res.status(HttpCode.OK).json({ msg: loanInfo});
        } catch (error) {
            return msgError.serveurError(res, error);
        }
    }
};

export default loandControllers;