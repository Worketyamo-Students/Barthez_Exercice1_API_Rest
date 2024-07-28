import { PrismaClient } from "@prisma/client";
import { Request, Response } from 'express';
import { HttpCode } from "../core/constants";
import { msgError } from "../functions/message";

const prisma = new PrismaClient();

const loandControllers = {
    loandBook: async(req:Request, res:Response) => {
        try {
          
            // Message de success
            res.status(HttpCode.CREATED).json({msg: `l'utilisateur a ete ajouter avec success`});            
        } catch (error) {
            return msgError.serveurError(res, error);
        }
    },

    backBook: async(req:Request, res:Response) => {
        try {
            // Recuperation de l'identifiant dans les parametres de la requete
            const {id} = req.params;
            if(!id) msgError.badRequest(res, "identifiant invalide !");

            // Message de success
            res.status(HttpCode.CREATED).json({msg: `l'utilisateur a ete ajouter avec success`});            
        } catch (error) {
            return msgError.serveurError(res, error);
        }
    },

    userLoandHistory: async(req:Request, res:Response) => {
        try {
            // Recuperation de l'identifiant dans les parametres de la requete
            const {id} = req.params;
            if(!id) msgError.badRequest(res, "identifiant invalide !");
          
            // Message de success
            res.status(HttpCode.CREATED).json({msg: `l'utilisateur a ete ajouter avec success`});            
        } catch (error) {
            return msgError.serveurError(res, error);
        }
    }
};

export default loandControllers;