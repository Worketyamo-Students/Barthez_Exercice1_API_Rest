import { Router } from "express";
import notificationControllers from "../controllers/notification-controllers";

const notification = Router();

// Informer un utilisateur sur la disponibilité d'un livre préalablement reservé
notification.get('/:userID/:bookID', notificationControllers.availableBook);

// Email de rappel pour informer de la date de retour de livre
notification.get('/:userID/:empruntID', notificationControllers.remenberCallBackDate);

export default notification;
