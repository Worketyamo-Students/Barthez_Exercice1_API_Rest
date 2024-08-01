import { Router } from "express";
import notificationControllers from "../controllers/notification-controllers";
import validator from "../functions/validator";
import validate from "../middleware/validate";

const notification = Router();

// Informer un utilisateur sur la disponibilité d'un livre préalablement emprunté
notification.post('/:userID/:bookID', notificationControllers.availableBook);

// Email de rappel pour informer de la date de retour de livre
notification.post('/info/:userID/:empruntID', validator.validateNotification, validate, notificationControllers.remenberCallBackDate);

export default notification;
