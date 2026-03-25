import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const createTransporter = () => {
  if (process.env.MAIL_SERVICE === "gmail") {
    return nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD,
      },
    });
  }

  if (process.env.MAIL_SERVICE === "ethereal") {
    return null;
  }

  return nodemailer.createTransporter({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT || 587,
    secure: false,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASSWORD,
    },
  });
};

export const getTransporter = async () => {
  if (process.env.MAIL_SERVICE === "ethereal") {
    const testAccount = await nodemailer.createTestAccount();

    return nodemailer.createTransporter({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
  }

  return createTransporter();
};

export const verifyConnection = async () => {
  try {
    const transporter = await getTransporter();
    await transporter.verify();
    console.log("Servidor de correo conectado correctamente");
    return true;
  } catch (error) {
    console.error(
      "Error al conectar con el servidor de correo:",
      error.message,
    );
    return false;
  }
};

export default {
  getTransporter,
  verifyConnection,
};
