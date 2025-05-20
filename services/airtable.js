async function createAirtableRecord(airtableData) {
  const endpoint = "https://api.airtable.com/v0/appcMzkYgI4aK863K/ORDEN%20ID";

  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.AIRTABLE_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(airtableData),
  });

  if (!res.ok) {
    throw new Error(JSON.stringify(await res.json()));
  }

  return res.json();
}

export async function appendAirtableRecords(clientFolderId, data) {
  const fields = {
    "Nombre / Razón Social": data.razonSocial,
    "CUIT / CUIL": parseInt(data.cuitCuil),
    Domicilio: data.domicilio,
    Localidad: data.localidad,
    Provincia: data.provincia,
    "ID DENUNCIADO SANCOR": parseInt(data.numeroOrden),
    "N° Orden ID DENUNCIADO": parseInt(data.numeroOrden),
    " Monto      Adeudado ": data.montoAdeudado,
    ARANCEL: data.arancelVerificatorio,
    "MAIL ACREEDOR": data.mailAcreedorDenunciado,
    CELULAR: data.celularAcreedorDenunciado,
    "APODERADO ABOGADO +": data.datosApoderadoAbogado,
    PATROCINIO: data.esPatrocinante === "true",
    "MAIL ABOGADO O REP": data.mailAbogadoRepresentante,
    "CELULAR ABOGADO O REP 3": data.celularAbogadoRepresentante,
    "CELULAR ABOGADO O REP2": data.celularAbogadoRepresentanteAlternativo,
    ENCABEZADO: data.encabezadoEscrito,
    PETITORIO: data.petitorioEscrito,
    PERSONERIA: data.personeriaEscrito,
    "HECHOS Y FUNDAMENTOS": data.causaFundamento,
    "DETALLE DE LA PRUEBA DOCUMENTAL": data.detallePruebaDocumental,
    "DATOS FIRMANTE ESCRITO": data.datosFirmanteEscrito,
    "DDJJ LECTURA REGLAMENTO": data.declaracionLecturaReglamento === "true",
    "CERTIFICADO DE PRESENTACIÓN": `Se certifica que ${
      data.razonSocial
    } presentó el presente formulario en la fecha ${new Date().toLocaleDateString()}`,
    "LINK A CARPETA DE DRIVE": `https://drive.google.com/drive/folders/${clientFolderId}?usp=sharing`,
  };

  if (data.considerado !== "") {
    fields["CONSIDERADO"] = data.considerado;
  }
  if (data.causa !== "") {
    fields["Causa"] = data.causa;
  }
  if (data.caracter !== "") {
    fields["Carácter"] = data.caracter;
  }

  const airtableData = {
    records: [
      {
        fields,
      },
    ],
  };
  await createAirtableRecord(airtableData);
}
