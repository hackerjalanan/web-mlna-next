import { apiHandler } from "@/lib/api/handler";
import { success } from "@/lib/api/response";
import { http } from "@/lib/api/http";
import { json } from "@/lib/api/request";
import { sendContactEmail } from "@/lib/mail/contact";
import type { ContactRequest } from "@/types/contact";


export const POST = apiHandler(async (request) => {

  const body = await json<ContactRequest>(request);


  const {
    name, email,subject, message,
  } = body;

  if (!name || !email || !subject || !message) {

    throw http.badRequest(
      "Semua field wajib diisi",
      "VALIDATION_ERROR"
    );
  }

  await sendContactEmail({ 
    name,  email,  subject,  message,
});

  return success(
    null,
    "Pesan berhasil dikirim"
  );

});