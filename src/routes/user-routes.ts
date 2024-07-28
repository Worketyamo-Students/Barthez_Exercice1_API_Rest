import { Router } from "express";
import usersControllers from "../controllers/user-controllers";

const user = Router();

// A-Inscription d'un utilisateur
user.post('/signup', usersControllers.inscriptionUser);

// B-connexion de l'utilisateur
user.post('/login', usersControllers.connexionUser);

// C-Deconnexion de l'utilisateur
user.post('logout', usersControllers.deconnexionUser);

// D-Consulter le profile de l'utilisateur
user.get('profile',usersControllers.consultProfileUser);

// E-Mettre a jour le profil de l'utilisateur
user.put('profile', usersControllers.updateUser);

// F-supprimer un utilisateur
user.delete('delete', usersControllers.deleteUser);

export default user;