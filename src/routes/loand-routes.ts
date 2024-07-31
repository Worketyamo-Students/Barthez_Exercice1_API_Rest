import { Router } from "express";
import loandControllers from "../controllers/loand-controllers";
import validator from "../functions/validator";
import validate from "../middleware/validate";

const loand = Router();

//Emprunter un livre
loand.post('/', validator.validateLoand, validate, loandControllers.loandBook);

// Retourné un livre emprunter
loand.put('/:id/return', loandControllers.backBook);

//Histrique des emprunts d'un utilisateur
loand.get('/user/:userID', loandControllers.userLoandHistory);

export default loand;