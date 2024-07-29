import { Router } from "express";
import usersControllers from "../controllers/user-controllers";
import validator from "../functions/validator";
import validate from "../middleware/validate";

const user = Router();

// A-Inscription d'un utilisateur
user.post('/signup', validator.validateUser, validate, usersControllers.inscriptionUser);

// B-connexion de l'utilisateur
user.post('/login', validator.validateBook, validate, usersControllers.connexionUser);

// C-Deconnexion de l'utilisateur
user.post('/logout/:id',usersControllers.deconnexionUser);

// D-Consulter le profile de l'utilisateur
user.get('/profile/:id',usersControllers.consultProfileUser);

// E-Mettre a jour le profil de l'utilisateur
user.put('/profile/:id', usersControllers.updateUser);

// F-supprimer un utilisateur
user.delete('/profile/:id', usersControllers.deleteUser);

export default user;