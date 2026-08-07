import OpenAI from 'openai';

const openai = new OpenAI({
  baseURL: 'https://api.deepseek.com/v1',
  apiKey: 'sk-f170af7a763e4dbe96c8dcacc7eedf51',
});

async function main() {
  try {
    const completion = await openai.chat.completions.create({
      messages: [{ role: "system", content: "Say hello and output valid JSON: {\"message\": \"hello\"}" }],
      model: "deepseek-chat",
      response_format: { type: 'json_object' }
    });
    console.log("SUCCESS:", completion.choices[0].message.content);
  } catch (error) {
    console.error("ERROR:", error.message);
  }
}

main();
