import Groq from "groq-sdk";


const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});


export async function POST(req: Request) {

  try {

    const body = await req.json();


    const completion = await groq.chat.completions.create({

      messages: [
        {
          role: "user",
          content: body.message,
        },
      ],


      model: "openai/gpt-oss-120b",

    });



    return Response.json({

      result:
        completion.choices[0].message.content,

    });



  } catch (error) {


    return Response.json(
      {
        error:"Gagal menghubungi Groq API"
      },
      {
        status:500
      }
    );


  }

}