import { PrismaClient } from "@prisma/client";
import { Request, Response } from 'express';
import { HttpCode } from "../core/constants";
import { comparePassword, hashText } from "../functions/pasword-crypt";
import { msgError } from "../functions/message";

const Prisma = new PrismaClient();

const usersControllers = {
    // Function to add One User
    inscriptionUser: async (req: Request, res: Response) => {
        try {
            // recuperer les informations du corps de la requete
            const {name, email, password} = req.body;

            // Verifier que tous les informations ont bien été remplis
            if(!name || !email || !password)  return msgError.badRequest(res, "Veillez remplir tous les champs !");

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
            if(!newUser) return msgError.notFound(res, "Erreur d'ajout du nouvel utilisateur !");

            // Generer une Access token et generer un refresh tokken pour l'utilisateur



            // Message de success
            res.status(HttpCode.CREATED).json({msg: `l'utilisateur: ${newUser.name} a ete creer avec success`});
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
                where: {
                    user_id: id
                },

                select: {
                    name: true,
                    email: true,
                    password: true
                }
            });
            if(!User) return msgError.notFound(res, "Erreur lors de la selection de l'utilisateur!");

            // Message de success
            res.status(HttpCode.OK).json({msg: `Utilisateur trouvé: `, User});
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

            // Verifier que tous les informations ont bien été remplis
            if(!name || !email || !password)  return msgError.badRequest(res, "Veillez remplir tous les champs !");

            // Crypter le mot de passe de l'utilisateur;
            const hashPassword = await hashText(password);

            // Mis a jour de l'utilisateur
            const userUpdate = await Prisma.user.update({
                where: {
                    user_id: id
                },

                data: {
                    name: name,
                    email: email,
                    password: hashPassword
                }
            });
            if(!userUpdate) return msgError.notFound(res, "Erreur lors de la modification de l'utilisateur");

            // Message de success
            res.status(HttpCode.OK).json({msg: `l'utilisateur ${userUpdate.name} mis à jour !`});
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

    // Connexion d'un utilisateur
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
            if(!selectUser) return msgError.notFound(res, "l'Utilisateur n'a pas ete trouvé !");

            // Recuperation du mot de passe dans la base de données
            const hashPassword = selectUser.password;

            // comparaison des mots de passes
            const comparaison = comparePassword(password, hashPassword);
            if(!comparaison) return msgError.notFound(res, "Echec de la connexion !");

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

            const selectUser = Prisma.user.findUnique({
                where: {
                    user_id: id
                }
            });
            if(!selectUser) return msgError.notFound(res, "L'utilisateur n'existe pas !")

            // Invalider le token de l'utilisateur


            
            // Message de success
            res.status(HttpCode.OK).json({msg: "Utilisateur deconnecté !"});
        } catch (error) {
            return msgError.serveurError(res, error);
        }
    }
};

export default usersControllers;
