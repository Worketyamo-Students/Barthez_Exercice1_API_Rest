import { Request, Response, NextFunction } from 'express';
import { HttpCode } from "../core/constants";

// Importer la liste des addresses Ip a bloquer de la base de données
const tabLockIps: string[] = [];

// Definission du middleware pour bloquer les addresses ip lister
const blockIps = (req: Request, res: Response, next: NextFunction) => {
    const clientIp = req.ip || ''; //Recuperer l'addr Ip de l'user

    if(tabLockIps.includes(clientIp)){
        return res.status(HttpCode.FORBIDDEN).json({
            msg: 'Acces Interdit !'
        })
    }
    
    next(); // continue s'il y'a pas de bloquages d'addresses
}

export default blockIps;