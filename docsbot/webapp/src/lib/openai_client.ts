import { SECRET_OPENAI_API_KEY } from '$env/static/private';
import { Configuration, OpenAIApi, type ChatCompletionRequestMessage } from 'openai';

const configuration = new Configuration({
	apiKey: SECRET_OPENAI_API_KEY
});
const openai = new OpenAIApi(configuration);

export async function createChatCompletion(
	document: string[],
	question: string
): Promise<string | null> {
	let messages = [];
	let systemContent = `Eres un asistente de IA, eres un experto en Soporte técnico en equipos y paquetes informáticos.
  Tus conocimientos los obtienes basado en la información que te voy a entregar delimitada entre tres ticks.`;

	systemContent += '\n\n```';
	for (let i = 0; i < document.length; i++) {
		systemContent += '\n' + document[i];
	}
	systemContent +=
		'\n```\n\nEl usuario te hará preguntas sobre Soporte técnico de equipos y paquetes informáticos y deberás responder de forma concisa e incluir fragmentos de solución siempre que puedas.';

	messages.push({
		role: 'system',
		content: systemContent
	} satisfies ChatCompletionRequestMessage);

	let prompt = question;

	messages.push({
		role: 'user',
		content: prompt
	} satisfies ChatCompletionRequestMessage);

	console.log(messages);
	try {
		let response = await openai.createChatCompletion({
			model: 'gpt-3.5-turbo',
			messages: messages,
			temperature: 1,
			max_tokens: 1000
		});

		if (response.data.choices.length > 0) {
			return response.data.choices[0].message!.content;
		} else {
			return null;
		}
	} catch (error: any) {
		if (error.response) {
			console.log(error.response.status);
			console.log(error.response.data);
		} else {
			console.log(error.message);
		}
		return null;
	}
}
