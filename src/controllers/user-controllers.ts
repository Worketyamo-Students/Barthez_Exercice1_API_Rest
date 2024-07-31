import { PrismaClient } from "@prisma/client";
import { Request, Response } from 'express';
import { HttpCode } from "../core/constants";
import { comparePassword, hashText } from "../functions/pasword-crypt";
import { msgError } from "../functions/message";
import sendMail from "../functions/sendmail";
import userToken from "../functions/jwt";

const Prisma = new PrismaClient();

const usersControllers = {
    // Function to add One User
    inscriptionUser: async (req: Request, res: Response) => {
        try {
            // recuperer les informations du corps de la requete
            const {name, email, password} = req.body;

            // Verifions l'uniciter de l'email entrer par l'utilisateur
            const existingEmail = await Prisma.user.findFirst({
                where: {email: email},
                select: {email: true}
            });
            if(existingEmail) return msgError.badRequest(res, "cet Email est dejà utilisé !");

            // Crypter le mot de passe de l'utilisateur;
            const hashPassword = await hashText(password);

            // ajouter l'utilisateur dans la base de données via prisma
            const newUser = await Prisma.user.create({
                data: {
                    name: name.toUpperCase(),
                    email: email,
                    password: hashPassword
                }
            });
            if(!newUser) return msgError.notFound(res, "Erreur d'ajout du nouvel utilisateur !");

            //Mot de bienvenu a l'utilisateur qui vient de s'inscrire
            const message = "<h1>Bienvenue à la bibliotheque commubale</h1> <br> <p>Ici Vous pouvez:</p> <ul><li>Venir lire gratuitement sur des sujets d'actualité, mangas, journaux, bouquins, et levres de tout genre</li> <li>Faire des emprunts des livres</li> <li>Discuter sur ce que vous lisez quotidiennement avec d'autres passionés de la lecture</li></ul>"
            sendMail(newUser.email,{name: newUser.name, content: message})
            
            // Message de success
            res.status(HttpCode.CREATED).json({msg: `l'utilisateur: ${newUser.name} a ete ajouter avec success`});
        } catch (error) {
            return msgError.serveurError(res, error);
        }
    },

    // Function to get One Existing Users
    consultProfileUser: async(req: Request, res: Response) => {
        try {
            // Recuperation de l'identifiant dans les parametres de la requete
            const {id} = req.params;
            if(!id) msgError.badRequest(res, "identifiant invalide !");

            // recherche de l'utilisateur avec cet identifiant
            const User = await Prisma.user.findUnique({
                where: {user_id: id},
                select: {name: true, email: true,}
            });
            if(!User) return msgError.notFound(res, "Erreur lors de la selection de l'utilisateur!");

            // Message de success
            res.status(HttpCode.OK).json({User});
        } catch (error) {
            return msgError.serveurError(res, error);
        }
    },

    // Modification d'un utilisateur
    updateUser: async(req: Request, res: Response) => {
        try {
            // Recuperation de l'identifiant dans les parametres de la requete
            const {id} = req.params;
            if(!id) msgError.badRequest(res, "identifiant invalide !");

            // recuperer les informations du corps de la requete
            const {name, email, password} = req.body;

            // Crypter le mot de passe de l'utilisateur;
            const hashPassword = await hashText(password);

            // Mis a jour de l'utilisateur
            const userUpdate = await Prisma.user.update({
                where: {
                    user_id: id
                },

                data: {
                    name: name.toUpperCase(),
                    email: email,
                    password: hashPassword
                }
            });
            if(!userUpdate) return msgError.notFound(res, "Erreur lors de la modification de l'utilisateur");

            // Message de success
            res.status(HttpCode.OK).json({msg: `utilisateur ${userUpdate.name} mis à jour !`});
        } catch (error) {
            return msgError.serveurError(res, error);
        }
    },

    // Supprimer un utilisateur
    deleteUser: async(req: Request, res: Response) => {
        try {
            // Recuperation de l'identifiant dans les parametres de la requete
            const {id} = req.params;
            if(!id) msgError.badRequest(res, "identifiant invalide !");

            // Suppression de l'utilisateur
            const deleteUser = await Prisma.user.delete({
                where: {
                    user_id: id
                }
            });
            if(!deleteUser) return msgError.notFound(res, "Erreur lors de la suppression de l'utilisateur !");

            // Message de success
            res.status(HttpCode.OK).json({msg: `Suppression de ${deleteUser.name} effectué avec success !`});
        } catch (error) {
            return msgError.serveurError(res, error);
        }
    },

    // Connexion_d_'_un utilisateur
    connexionUser: async(req: Request, res: Response) => {
        try {
            // recuperer les informations du corps de la requete
            const {email, password} = req.body;

            // Verifier que tous les informations ont bien été remplis
            if(!email || !password)  return msgError.badRequest(res, "Veillez remplir tous les champs !");

            // selection de l'utilissateur de la base de données
            const selectUser = await Prisma.user.findUnique({
                where:{
                    email: email
                }
            });
            if(!selectUser) return msgError.notFound(res, "l'utilisateur n'a pas été trouvé !");

            // Recuperation du mot de passe dans la base de données
            const hashPassword = selectUser.password;

            // comparaison des mots de passes
            const comparaison = await comparePassword(password, hashPassword);
            if(!comparaison) return msgError.notFound(res, "Mot depasse incorrect!");
            
            selectUser.password = "";
            // Generer une Access token et generer un refresh tokken pour l'utilisateur
            const accessToken = userToken.accessToken(selectUser);
            const refreshToken = userToken.refreshToken(selectUser);
            
            // Stocker le access token dans le header de la requete
            res.setHeader('Authorization', `Bearer ${accessToken}`);

            // stoker le refresh token dans un cookie securisé
            const cookieOption = {
                secure: true, 
                expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
                httpOnly: true
            };
            res.cookie('_library', refreshToken, cookieOption)

            // Message de success
            res.status(HttpCode.OK).json({msg: `utilisateur Connecté !`});
        } catch (error) {
            return msgError.serveurError(res, error);
        }
    },

    deconnexionUser: async(req: Request, res: Response) => {
        try {
            // Recuperation de l'identifiant dans les parametres de la requete
            const {id} = req.params;
            if(!id) msgError.badRequest(res, "identifiant invalide !");

            const selectUser = await Prisma.user.findUnique({
                where: {
                    user_id: id
                }
            });
            if(!selectUser) return msgError.notFound(res, "L'utilisateur n'existe pas !");

            // Invalider le token de l'utilisateur



            // Message de success
            res.status(HttpCode.OK).json({msg: "Utilisateur deconnecté !"});
        } catch (error) {
            return msgError.serveurError(res, error);
        }
    }
};

export default usersControllers;
