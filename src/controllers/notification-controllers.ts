import { PrismaClient } from "@prisma/client";
import { Request, Response } from 'express';
import { HttpCode } from "../core/constants";
import { msgError } from "../functions/message";
import sendMail from "../functions/sendmail";

const prisma = new PrismaClient();

const notificationControllers = {
    availableBook: async(req:Request, res:Response) => {
        try {
            // Recuperation de l'identifiant dans les parametres de la requete
            const {userID, bookID} = req.params;
            if(!userID || !bookID) msgError.badRequest(res, "identifiant invalide !");
            
            // on se rassure que le livre est vraiment disponible
            const available = await prisma.book.findFirst({where: {
                book_id: bookID,
                status: "disponible"
            }})
            if(!available) return msgError.notFound(res, "Le livre specier est introuvale ou non disponible pour le moment!")

            // verifier l'utilisateur specifier
            const user = await prisma.user.findFirst({
                where: {
                    user_id: userID
                }
            });
            if(!user) return msgError.notFound(res, "l'utilisateur' specifier est introuvabe")

            // verifier le livre specifier
            const book = await prisma.book.findFirst({
                where: {
                    book_id: bookID
                }
            });
            if(!book) return msgError.notFound(res, "le livre specifier est introuvabe")

            //Fonction pour envoyer un message a l'utilisateur
            const content = `le livre ${book.title} est disponible`
            sendMail(user.email, {name: user.name, content});

            // Message de success
            res.status(HttpCode.OK).json({msg: "Utilisateur informé"})
        } catch (error) {
            return msgError.serveurError(res, error);
        }
    },

    remenberCallBackDate: async(req:Request, res:Response) => {
        try {
            // Recuperation de l'identifiant dans les parametres de la requete
            const {userID, empruntID} = req.params;
            if(!userID || !empruntID) msgError.badRequest(res, "identifiant invalide !");
            
            const {message} = req.body

            // verifier l'utilisateur specifier
            const user = await prisma.user.findFirst({
                where: {
                    user_id: userID
                }
            });
            if(!user) return msgError.notFound(res, "l'utilisateur' specifier est introuvabe")

            // verifier l'etat de l'emprunt specifier
            const loand = await prisma.loand.findFirst({
                where: {
                    loand_id: empruntID,
                    //backDate: null
                }
            });
            if(!loand) return msgError.notFound(res, "l'emprunt specifier est introuvabe ou a dejà ete rembourser !")

            //Fonction pour envoyer un message a l'utilisateur
            sendMail(user.email, {name: user.name, content: message})
            
            // Message de success
            res.status(HttpCode.OK).json({msg: "Utilisateur rappeler"})
        } catch (error) {
            return msgError.serveurError(res, error);
        }
    },
};

export default notificationControllers;