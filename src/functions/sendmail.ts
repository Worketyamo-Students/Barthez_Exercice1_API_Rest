import { MAIL_INFO } from '../core/config/env';
import nodemailer from 'nodemailer'
import fs from 'fs';
import ejs from 'ejs';

interface ItemplateData {
    name: string,
    content: string
}

async function sendMail(receiver: string, templateData: ItemplateData){
    // Configuration du transporteur de l'email
    const transporter = nodemailer.createTransport({
        host: "gmail",
        port: 465,
        secure: true,
        auth: {
            user: MAIL_INFO.USER,
            pass: MAIL_INFO.PASSWORD,
        },
    });

    // Lecture du contenu du template ejs
    const template = fs.readFileSync(__dirname + '/mail.ejs', 'utf8')

    // Creer un rendu HTML avec les données lu dans le fichier ejs.
    const content = ejs.render(template, templateData)

    //options du message a envoyer
    const mailOptions = {
        from: "kenwoubarthez@gmail.com",
        to: receiver,
        html: content
    }

    // Envoi du message
    try {
        await transporter.sendMail(mailOptions)
        console.log("Message envoyé avec succes")
    } catch (error) {
        console.error("Une erreur est survenu lors de l'envoi de l'email: "+error);
    }
}

export default sendMail;
