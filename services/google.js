import fs from "fs";
import { google } from "googleapis";
import { Readable } from "stream";

const SCOPES = [
  "https://www.googleapis.com/auth/drive.file",
  "https://www.googleapis.com/auth/drive.metadata.readonly",
];

export const MAIN_FOLDER_ID = "1Zcf42HwD4rg2IkSUsrrOTZFfkcInoaTq";

const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  },
  scopes: SCOPES,
});
const drive = google.drive({ version: "v3", auth });

export async function createFolder(parentId, name) {
  const requestBody = {
    name,
    mimeType: "application/vnd.google-apps.folder",
    fields: "id",
    parents: [parentId],
  };
  const res = await drive.files.create({
    requestBody,
  });
  return res.data.id;
}

export async function createFiles(parentId, name, files) {
  try {
    if (!parentId) {
      throw new Error("Failed to create folder");
    }

    if (Array.isArray(files)) {
      for (const file of files) {
        console.log("file", file.originalname);
        const requestBody = {
          name: file.originalname,
          fields: "id",
        };

        // Create a readable stream from the file buffer
        const readableStream = Readable.from(file.buffer);

        const media = {
          mimeType: file.mimetype,
          body: readableStream,
        };

        const res = await drive.files.create({
          requestBody: {
            ...requestBody,
            parents: [parentId],
          },
          media,
          fields: "id, name, parents",
        });
      }
    } else {
      const requestBody = {
        name: files.originalname,
        fields: "id",
      };

      console.log("Entramos a crear el archivo ÚNICO");

      // Create a readable stream from the file buffer
      const readableStream = Readable.from(files.buffer);

      const media = {
        mimeType: files.mimetype,
        body: readableStream,
      };

      const res = await drive.files.create({
        requestBody: {
          ...requestBody,
          parents: [parentId],
        },
        media,
        fields: "id, name, parents",
      });
    }
    return { success: true };
  } catch (error) {
    console.error("Error por:", error);
    throw new Error("Failed to create files");
  }
}

export async function createFolderWithFiles({
  razonSocial,
  dniFrenteDorso,
  copiaPoderRepresentacion,
  agregadoPruebaDocumental,
  demandaVerificacionCreditos,
  comprobanteArancel,
}) {
  console.log({
    razonSocial,
    dniFrenteDorso,
    copiaPoderRepresentacion,
    agregadoPruebaDocumental,
    demandaVerificacionCreditos,
    comprobanteArancel,
  });

  const clientFolderId = await createFolder(MAIN_FOLDER_ID, razonSocial ?? "");
  if (!clientFolderId) {
    throw new Error("Failed to create folder");
  }

  const dniFolderId = await createFolder(clientFolderId, "DNI Frente y Dorso");
  const comprobanteArancelFolderId = await createFolder(
    clientFolderId,
    "Comprobante de Arancel"
  );
  const demandaVerificFolderId = await createFolder(
    clientFolderId,
    "Demanda de Verificación de Créditos"
  );
  const poderFolderId = await createFolder(clientFolderId, "Poder");
  const pruebaDocumentalFolderId = await createFolder(
    clientFolderId,
    "Prueba Documental"
  );

  if (
    !dniFolderId ||
    !comprobanteArancelFolderId ||
    !demandaVerificFolderId ||
    !poderFolderId ||
    !pruebaDocumentalFolderId
  ) {
    throw new Error("Failed to create folder");
  }

  if (dniFrenteDorso) {
    await createFiles(dniFolderId, "dni", dniFrenteDorso);
  }

  if (copiaPoderRepresentacion) {
    await createFiles(
      poderFolderId,
      "copiaPoderRepresentacion",
      copiaPoderRepresentacion
    );
  }

  if (agregadoPruebaDocumental) {
    await createFiles(
      pruebaDocumentalFolderId,
      "agregadoPruebaDocumental",
      agregadoPruebaDocumental
    );
  }

  if (demandaVerificacionCreditos) {
    await createFiles(
      demandaVerificFolderId,
      "demandaVerificacionCreditos",
      demandaVerificacionCreditos
    );
  }

  if (comprobanteArancel) {
    await createFiles(
      comprobanteArancelFolderId,
      "comprobanteArancel",
      comprobanteArancel
    );
  }

  return clientFolderId;
}
