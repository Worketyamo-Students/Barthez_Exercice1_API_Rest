import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { HttpCode } from "../core/constants";
import sendErrorMessage from "../functions/sendErrorMessage";
import treatmentError from "../functions/treatmentError";
import { hashText } from "../functions/pasword-crypt";

const Prisma = new PrismaClient();

const usersControllers = {
    addNewUser: async (req: Request, res: Response) => {
        try {
            // recuperer les informations du corps de la requete
            const {name, email, password} = req.body;

            // Verifier que tous les informations ont bien été remplis
            if(!name || !email || !password)  return treatmentError(res, "Veillez remplir tous les champs !");

            // Crypter le mot de passe de l'utilisateur;
            const hashPassword = await hashText(password);

            // ajouter l'utilisateur dans la base de données via prisma
            const newUser = await Prisma.user.create({
                data: {
                    name: name,
                    email: email,
                    password: hashPassword
                }
            });
            if(!newUser) return treatmentError(res, "Erreur d'ajout du nouvel utilisateur !");

            // Message de success
            res.status(HttpCode.CREATED).json({msg: `l'utilisateur: ${newUser.name} a ete creer avec success`});
        } catch (error) {
            sendErrorMessage(res, error);
        }
    },
};

export default usersControllers;
