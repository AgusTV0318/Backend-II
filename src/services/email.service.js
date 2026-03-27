import { getTransporter } from "../config/email.config.js";
import dotenv from "dotenv";

dotenv.config();

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";
const MAIL_USER = process.env.MAIL_USER || "noreply@ecommerce-tvs.com";

class EmailService {
  async sendPasswordResetEmail(email, resetToken, userName) {
    try {
      const transporter = await getTransporter();

      const resetLink = `${FRONTEND_URL}/reset-password?token=${resetToken}`;

      const mailOptions = {
        from: `"E-commerce TVs" <${MAIL_USER}`,
        to: email,
        subject: "Recuperación de Contraseña - E-commerce TVs",
        html: this.getPasswordResetTemplate(userName, resetLink),
      };

      const info = await transporter.sendMail(mailOptions);

      if (process.env.MAIL_SERVICE === "ethereal") {
        console.log(
          "Vista previa del email:",
          nodemailer.getTestMessageUrl(info),
        );
      }

      console.log("Email de recuperación enviado a:", email);
      return true;
    } catch (error) {
      console.error("Error al enviar email:", error);
      throw new Error("No se pudo enviar el email de recuperación");
    }
  }

  getPasswordResetTemplate(userName, resetLink) {
    return `
        <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Recuperación de Contraseña</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                
                <!-- Header -->
                <tr>
                  <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center;">
                    <h1 style="color: #ffffff; margin: 0; font-size: 28px;">🔐 Recuperación de Contraseña</h1>
                  </td>
                </tr>
                
                <!-- Contenido -->
                <tr>
                  <td style="padding: 40px 30px;">
                    <p style="color: #333333; font-size: 16px; line-height: 24px; margin: 0 0 20px 0;">
                      Hola <strong>${userName}</strong>,
                    </p>
                    
                    <p style="color: #666666; font-size: 14px; line-height: 22px; margin: 0 0 30px 0;">
                      Recibimos una solicitud para restablecer la contraseña de tu cuenta en E-commerce TVs. 
                      Si no realizaste esta solicitud, puedes ignorar este correo.
                    </p>
                    
                    <p style="color: #666666; font-size: 14px; line-height: 22px; margin: 0 0 30px 0;">
                      Para restablecer tu contraseña, haz clic en el siguiente botón:
                    </p>
                    
                    <!-- Botón -->
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td align="center" style="padding: 20px 0;">
                          <a href="${resetLink}" 
                             style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                                    color: #ffffff; 
                                    text-decoration: none; 
                                    padding: 16px 40px; 
                                    border-radius: 6px; 
                                    font-size: 16px; 
                                    font-weight: bold; 
                                    display: inline-block;
                                    box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                            Restablecer Contraseña
                          </a>
                        </td>
                      </tr>
                    </table>
                    
                    <p style="color: #999999; font-size: 13px; line-height: 20px; margin: 30px 0 0 0; padding: 20px; background-color: #f9f9f9; border-left: 4px solid #667eea; border-radius: 4px;">
                      ⏰ <strong>Este enlace expirará en 1 hora</strong> por razones de seguridad. 
                      Si el enlace ha expirado, deberás solicitar uno nuevo.
                    </p>
                    
                    <p style="color: #999999; font-size: 12px; line-height: 18px; margin: 20px 0 0 0;">
                      Si el botón no funciona, copia y pega el siguiente enlace en tu navegador:
                    </p>
                    <p style="color: #667eea; font-size: 12px; line-height: 18px; margin: 5px 0 0 0; word-break: break-all;">
                      ${resetLink}
                    </p>
                  </td>
                </tr>
                
                <!-- Footer -->
                <tr>
                  <td style="background-color: #f9f9f9; padding: 30px; text-align: center; border-top: 1px solid #eeeeee;">
                    <p style="color: #999999; font-size: 12px; line-height: 18px; margin: 0 0 10px 0;">
                      Este es un correo automático, por favor no respondas a este mensaje.
                    </p>
                    <p style="color: #999999; font-size: 12px; line-height: 18px; margin: 0;">
                      © ${new Date().getFullYear()} E-commerce TVs. Todos los derechos reservados.
                    </p>
                  </td>
                </tr>
                
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>`;
  }
}

export default new EmailService();
