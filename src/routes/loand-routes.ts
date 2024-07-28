import { Router } from "express";
import loandControllers from "../controllers/loand-controllers";

const loand = Router();

//Emprunter un livre
loand.post('/', loandControllers.loandBook);

// Retourné un livre emprunter
loand.put('/:id/return', loandControllers.backBook);

//Histrique des emprunts d'un utilisateur
loand.get('/user/:userID', loandControllers.userLoandHistory);

export default loand;