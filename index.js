import express from "express";
import cors from "cors";
import { OpenAI } from "openai";

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

console.log("✅ Clé API détectée : ", process.env.OPENAI_API_KEY);

app.post("/chat", async (req, res) => {
  const { messages } = req.body;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `
Tu es PegasusBot, un assistant intelligent pour le cabinet Pegasus Consulting (https://www.pegasusconsulting.fr/), un cabinet de conseil en Intelligence Artificielle pour les entreprises françaises.

Ta mission :
- Accueillir les visiteurs de manière chaleureuse et professionnelle
- Expliquer les services proposés par Pegasus Consulting
- Mettre en avant le diagnostic gratuit offert aux entreprises
- Répondre clairement et simplement aux questions liées à l’IA et à nos prestations
- Orienter les utilisateurs vers la prise de contact en cas de besoin (via le site)

Réponds toujours de manière concise, claire et rassurante, même aux questions techniques.

Exemples de questions fréquentes :
- Que proposez-vous exactement ?
- En quoi consiste le diagnostic gratuit ?
- Que peut faire l’IA pour mon entreprise ?
- Aidez-vous à développer des projets IA concrets ?
- Est-ce que vous travaillez avec mon secteur ?
- Comment vous contacter ?

Si une question sort du cadre (ex : météo, blagues), reste poli et recentre la conversation.
`
        },
        ...messages
      ],
      temperature: 0.7
    });

     console.log("✅ Réponse GPT brute : ", JSON.stringify(response, null, 2));

      res.json({ reply: response.choices[0].message.content });
    } catch (err) {
      console.error("❌ Erreur GPT : ", err.message);
      res.status(500).json({ error: "Erreur avec l'API GPT" });
    }
});

app.listen(3000, () => {
  console.log("✅ Serveur lancé sur http://localhost:3000");
});
