"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/server.ts
// Configurations de Middlewares
const express_1 = __importDefault(require("express"));
const compression_1 = __importDefault(require("compression"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const swagger_1 = require("./swagger");
const morgan_1 = __importDefault(require("morgan"));
const constants_1 = require("./core/constants");
const user_routes_1 = __importDefault(require("./routes/user-routes"));
const book_routes_1 = __importDefault(require("./routes/book-routes"));
const loand_routes_1 = __importDefault(require("./routes/loand-routes"));
const notification_routes_1 = __importDefault(require("./routes/notification-routes"));
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
console.log("Debut des operation");
const app = (0, express_1.default)();
console.log("initialisation d'express");
// Configurations de securité
app.use((0, helmet_1.default)()); //Pour configurer les entete http securisés
console.log("configuration des entete");
app.use((0, cors_1.default)({
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
})); // Pour gerer le partage des ressources de maniere securisée
console.log("configuration du partage securisé");
// Configuration globaux de l'application express
app.use(express_1.default.json()); // parser les requets json
app.use(express_1.default.urlencoded({ extended: true })); // parser les requetes url encoder
app.use((0, compression_1.default)()); //compression des requetes http
app.use((0, express_rate_limit_1.default)({
    max: constants_1.ONE_HUNDRED,
    windowMs: constants_1.SIXTY,
    message: 'Trop de Requete à partir de cette adresse IP '
})); //limite le nombre de requete
app.use((0, cookie_parser_1.default)()); //configuration des cookies (JWT)
console.log("operation de configurations de bases");
app.use((0, morgan_1.default)('combined')); // Journalisation des requetes au format combined
// Routes de mon application
//Routes des utilisateurs
app.use('/users', (0, express_rate_limit_1.default)({
    max: 10,
    windowMs: constants_1.SIXTY,
    message: 'Trop de Requete à partir de cette adresse IP ',
}), user_routes_1.default);
//Route des livres
app.use('/books', (0, express_rate_limit_1.default)({
    max: 10,
    windowMs: constants_1.SIXTY,
    message: 'Trop de Requete à partir de cette adresse IP '
}), book_routes_1.default);
// Routes des emprunts
app.use('/loands', (0, express_rate_limit_1.default)({
    max: 10,
    windowMs: constants_1.SIXTY,
    message: 'Trop de Requete à partir de cette adresse IP '
}), loand_routes_1.default);
// Route des notifications
app.use('/notifications', (0, express_rate_limit_1.default)({
    max: 10,
    windowMs: constants_1.SIXTY,
    message: 'Trop de Requete à partir de cette adresse IP '
}), notification_routes_1.default);
// Configuration de la documentation avec Swagger
(0, swagger_1.setupSwagger)(app);
exports.default = app;
//# sourceMappingURL=server.js.map