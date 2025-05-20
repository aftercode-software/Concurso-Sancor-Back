import * as Brevo from "@getbrevo/brevo";

export async function sendEmail(receiver, subject, cc, body) {
  let apiInstance = new Brevo.TransactionalEmailsApi();
  apiInstance.setApiKey(
    Brevo.TransactionalEmailsApiApiKeys.apiKey,
    process.env.BREVO_API_KEY
  );

  let sendSmtpEmail = new Brevo.SendSmtpEmail();

  sendSmtpEmail.subject = subject;
  sendSmtpEmail.sender = { email: "informacion@concursosancor.com" };
  sendSmtpEmail.to = receiver.map((email) => ({ email }));
  if (cc) {
    sendSmtpEmail.cc = cc.map((email) => ({ email }));
  }
  sendSmtpEmail.textContent = body;

  try {
    const res = await apiInstance.sendTransacEmail(sendSmtpEmail);
    // transporter.sendMail(mailOptions);
    return { success: true, res };
  } catch (error) {
    return { success: false, error: error };
  }
}

export async function sendGeneratedEmail(data) {
  let subject = "Confirmación de Presentación de Formulario - Concurso Sancor ";

  const emailBody = `Estimado/a ${data.razonSocial || "Interesado/a"},

Le confirmamos que su formulario ha sido presentado exitosamente ante Concurso Sancor.

A continuación, encontrará un resumen de los datos registrados:

- Nombre / Razón Social: ${data.razonSocial || "No presentado"}
- CUIT / CUIL: ${data.cuitCuil || "No presentado"}
- Domicilio: ${data.domicilio || "No presentado"}
- Localidad: ${data.localidad || "No presentado"}
- Provincia: ${data.provincia || "No presentado"}
- Causa: ${data.causa || "No presentado"}
- N° Orden: ${data.numeroOrden || "No presentado"}
- Monto Adeudado: ${data.montoAdeudado || "No presentado"}
- Arancel Verificatorio: ${data.arancelVerificatorio || "No presentado"}
- Comprobante Arancel: ${
    data.comprobanteArancel !== "" ? "Presentado" : "No presentado"
  }
- Carácter: ${data.caracter || "No presentado"}
- Considerado: ${data.considerado || "No presentado"}
- Mail del Acreedor: ${data.mailAcreedorDenunciado || "No presentado"}
- Celular del Acreedor: ${data.celularAcreedorDenunciado || "No presentado"}
- DNI Frente y Dorso: ${
    data.dniFrenteDorso !== "" ? "Presentado" : "No presentado"
  }
- Datos del Apoderado/Abogado: ${data.datosApoderadoAbogado || "No presentado"}
- Copia Poder Representación: ${
    data.copiaPoderRepresentacion !== "" ? "Presentado" : "No presentado"
  }
- Patrocinio Letrado: ${data.esPatrocinante === "true" ? "Sí" : "No"}
- Mail del Abogado/Representante: ${
    data.mailAbogadoRepresentante || "No presentado"
  }
- Celular del Abogado/Representante: ${
    data.celularAbogadoRepresentante || "No presentado"
  }
- Celular Alternativo del Abogado/Representante: ${
    data.celularAbogadoRepresentanteAlternativo || "No presentado"
  }
- Encabezado del Escrito: ${data.encabezadoEscrito || "No presentado"}
- Petitorio del Escrito: ${data.petitorioEscrito || "No presentado"}
- Personería: ${data.personeriaEscrito || "No presentado"}
- Hechos y Fundamentos: ${data.causaFundamento || "No presentado"}
- Detalle de Prueba Documental: ${
    data.detallePruebaDocumental || "No presentado"
  }
- Agregado Prueba Documental: ${
    data.agregadoPruebaDocumental !== "" ? "Presentado" : "No presentado"
  }
- Datos del Firmante del Escrito: ${
    data.datosFirmanteEscrito || "No presentado"
  }
- Demanda Verificación de Créditos: ${
    data.demandaVerificacionCreditos !== "" ? "Presentado" : "No presentado"
  }

Presentación sujeta a verificación y control final de lo acompañado por parte de la Sindicatura

Por favor, conserve este correo como comprobante de su presentación. Si tiene alguna consulta, no dude en contactarnos.

Atentamente,
El equipo de Concursos Sancor Seguros.
`;

  // await sendEmail(
  //   ["concursosancorcom@gmail.com"],
  //   `Presentación de Formulario - ${data.razonSocial}`,
  //   emailBody
  // );

  let receivers = [];
  if (data.mailAcreedorDenunciado) {
    receivers.push(data.mailAcreedorDenunciado);
  }
  if (data.mailAbogadoRepresentante) {
    receivers.push(data.mailAbogadoRepresentante);
  }

  let concursoSancor = ["concursosancorcom@gmail.com"];

  if (receivers.length > 0) {
    const res = await sendEmail(receivers, subject, concursoSancor, emailBody);
    console.log(res);
  } else {
    const res = await sendEmail(concursoSancor, subject, null, emailBody);
    console.log(res);
  }
}
