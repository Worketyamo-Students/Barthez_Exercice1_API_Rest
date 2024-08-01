import {Request, Response, NextFunction } from "express";
import userToken from "../functions/jwt";
import { msgError } from "../functions/message";

const auth = {
    decodeAccessToken: async (req: Request, res:Response, next: NextFunction) => {
        const token = req.headers.authorization;
        console.log(token)
        if(!token) return msgError.badRequest(res, "pas de token trouvé !");

        try {
            const decodeAcess = await userToken.decodeAccessToken(token);
            if(!decodeAcess) return msgError.badRequest(res, "erreur de decodage");

            next();
            return;
        } catch (error) {
            return msgError.serveurError(res, error)
        }
    },

    decodeRefreshToken: async (req: Request, res:Response, next: NextFunction)=> {
        const token = req.cookies._library;
        console.log(token)
        if(!token) return msgError.badRequest(res, "pas de token trouvé !");

        try {
            const decodeRefresh = await userToken.decodeRefreshToken(token);
            if(!decodeRefresh) return msgError.badRequest(res, "erreur de decodage");

            next();
            return;
        } catch (error) {
            return msgError.serveurError(res, error)
        }
    }
}
export default auth;