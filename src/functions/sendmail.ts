import nodemailer from 'nodemailer'
import fs from 'fs';
import ejs from 'ejs';
import path from 'path'
import dotenv from 'dotenv'
dotenv.config();

interface ItemplateData {
    name: string,
    content: string
}
const emailConfig = {
    email: process.env.EMAIL,
    password: process.env.PASSWORD
}
const validateEmailConfig = () => {
    if(!emailConfig.email || !emailConfig.password)
    console.error("Addresse email ou mot de passe non configuré !");
    process.exit(1);
};
validateEmailConfig();

// Configuration du transporteur de l'email
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: 465,
    secure: true,
    auth: {
        user: emailConfig.email,
        pass: emailConfig.password,
    },
});
console.log(process.env.EMAIL, process.env.PASSWORD)

async function sendMail(receiver: string, templateData: ItemplateData) {
    // Lecture du contenu du template ejs
    const templatePath = path.join(__dirname + '/mail.ejs')
    const template = fs.readFileSync(templatePath, 'utf8')

    // Creer un rendu HTML avec les données lu dans le fichier ejs.
    const content = ejs.render(template, templateData)

    // L'objet de l'email est statique
    const subject = "Bibliotheque Communal";

    //options du message a envoyer
    const mailOptions = {
        from: emailConfig.email,
        to: receiver,
        subject: subject,
        html: content
    }

    // Envoi du message
    try {
        await transporter.sendMail(mailOptions)
        console.log("Message envoyé avec succes")
    } catch (error) {
        console.error(`Une erreur est survenue lors de l'envoi de l'addresse email: ${error}`)
    }
}

export default sendMail;
