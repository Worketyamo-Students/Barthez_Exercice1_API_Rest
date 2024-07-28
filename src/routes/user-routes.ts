import { Router } from "express";
import usersControllers from "../controllers/user-controllers";

const user = Router();

// A-Inscription d'un utilisateur
user.post('/signup', usersControllers.inscriptionUser);

// B-connexion de l'utilisateur
user.post('/login', usersControllers.connexionUser);

// C-Deconnexion de l'utilisateur
user.post('/logout/:id', usersControllers.deconnexionUser);

// D-Consulter le profile de l'utilisateur
user.get('/profile/:id',usersControllers.consultProfileUser);

// E-Mettre a jour le profil de l'utilisateur
user.put('/profile/:id', usersControllers.updateUser);

// F-supprimer un utilisateur
user.delete('/profile/:id', usersControllers.deleteUser);

export default user;