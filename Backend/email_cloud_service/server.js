import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";
import * as sib from "@getbrevo/brevo";

// ======================
// CONFIG INICIAL
// ======================
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8008;

// ======================
// MIDDLEWARES
// ======================
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

// ======================
// BREVO CONFIG 
// ======================
const apiInstance = new sib.TransactionalEmailsApi();
apiInstance.setApiKey(sib.TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY);

// ======================
// CLOUDINARY CONFIG
// ======================
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ======================
// HEALTH CHECK
// ======================
app.get("/ping", (req, res) => {
  res.status(200).send("pong");
});

// ======================
// CLOUDINARY ENDPOINTS
// ======================
app.delete("/multimedia", async (req, res) => {
  const { public_id } = req.body;

  if (!public_id) {
    return res.status(400).json({ error: "Falta el public_id" });
  }

  try {
    const result = await cloudinary.uploader.destroy(public_id);

    if (result.result === "ok") {
      return res.json({ message: "Imagen eliminada correctamente" });
    }

    return res.status(200).json({
      message: "La imagen no se encontró o ya fue eliminada",
      detalle: result,
    });

  } catch (error) {
    console.error("Error Cloudinary:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// ======================
// EMAIL / NOTIFICACIONES (BREVO)
// ======================
app.post("/api/notificaciones", async (req, res) => {
  const { to, author, eventName, comment } = req.body;

  if (!to || !author || !eventName || !comment) {
    return res.status(400).json({ error: "Faltan datos requeridos" });
  }

  try {
    const subject = `Nuevo comentario en tu evento: ${eventName}`;
    const html = `
      <p>El usuario <b>${author}</b> ha comentado en tu evento <b>${eventName}</b>:</p>
      <blockquote style="color:#555;"><i>${comment}</i></blockquote>
    `;

    // 2. Configuración del objeto de envío de Brevo
    const sendSmtpEmail = new sib.SendSmtpEmail();

    sendSmtpEmail.subject = subject;
    sendSmtpEmail.htmlContent = html;
    sendSmtpEmail.sender = { name: "Kalendas", email: process.env.EMAIL_FROM };
    sendSmtpEmail.to = [{ email: to }];

    const data = await apiInstance.sendTransacEmail(sendSmtpEmail);

    console.log("Email enviado con éxito:", data.body);
    res.json({ success: true, message: "Notificación enviada por email" });

  } catch (error) {
    // Brevo suele devolver el error en error.response.body
    console.error("ERROR BREVO:", error.response ? error.response.body : error);
    res.status(500).json({ error: "Error enviando email con Brevo" });
  }
});

// ======================
// START SERVER
// ======================
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Servicio unificado corriendo en http://localhost:${PORT}`);
});
