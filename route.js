import multer from "multer";
import { appendAirtableRecords } from "./services/airtable.js";
import { createFolderWithFiles } from "./services/google.js";
import { sendGeneratedEmail } from "./services/sendEmail.js";

// Configure multer for handling file uploads
const upload = multer();

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  try {
    // Handle multipart form data
    upload.any()(req, res, async (err) => {
      if (err) {
        console.error("Error processing form data:", err);
        return res.status(400).json({ error: "Error processing form data" });
      }

      const formData = req.body;
      console.log("FormData:", formData);

      const files = req.files;
      console.log("Files:", files);

      // Combine form data and files
      let data = { ...formData };

      // Group files by fieldname
      files.forEach((file) => {
        if (data[file.fieldname]) {
          // If we already have a file for this field, convert to array if not already
          if (!Array.isArray(data[file.fieldname])) {
            data[file.fieldname] = [data[file.fieldname]];
          }
          data[file.fieldname].push(file);
        } else {
          // First file for this field
          data[file.fieldname] = file;
        }
      });

      console.log("Converted FormData to Object:", data);

      try {
        const clientFolderId = await createFolderWithFiles({
          razonSocial: data.razonSocial,
          dniFrenteDorso: data.dniFrenteDorso,
          copiaPoderRepresentacion: data.copiaPoderRepresentacion,
          agregadoPruebaDocumental: data.agregadoPruebaDocumental,
          demandaVerificacionCreditos: data.demandaVerificacionCreditos,
          comprobanteArancel: data.comprobanteArancel,
        });

        await appendAirtableRecords(clientFolderId, data);
        await sendGeneratedEmail(data);

        return res.status(200).json({
          message: "Form data received",
        });
      } catch (error) {
        console.error("Error processing request:", error);
        return res.status(500).json({
          message: "Error",
          error: error.message,
        });
      }
    });
  } catch (error) {
    console.error("Error in /api/enviar:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
}
