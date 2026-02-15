const EMAIL_API = process.env.REACT_APP_EMAIL_API!;

export interface CommentNotificationDTO {
  to: string;          // Email destinatario
  author: string;      // Usuario que comentó
  eventName: string;   // Nombre del evento
  comment: string;     // Texto del comentario
}

export const EmailService = {
  async sendCommentNotification(data: CommentNotificationDTO) {
    try {
      const response = await fetch(`${EMAIL_API}/api/notificaciones`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Error enviando notificación por email");
      }

      return await response.json();
    } catch (error) {
      console.error("EmailService Error:", error);
      throw error;
    }
  }
};