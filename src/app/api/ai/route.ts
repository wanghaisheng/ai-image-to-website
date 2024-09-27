import { z } from 'zod';
import { getCloudflareContext } from '@opennextjs/cloudflare';

import { descriptionPrompt } from '@/lib/ai/prompts/description';
import { codingSystemPrompt } from '@/lib/ai/prompts/coding';

export async function POST(request: Request) {
  try {
    let json = await request.json();
    let result = z
      .object({
        imageUrl: z.string(),
      })
      .safeParse(json);

    if (result.error) {
      return new Response(result.error.message, { status: 422 });
    }
    let { imageUrl } = result.data;

    // Fetch the image from the imageUrl
    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) {
      return new Response('Failed to fetch image', { status: 500 });
    }

    // Convert the image to an array buffer
    const arrayBuffer = await imageResponse.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    const imageArray = [...uint8Array];

    if (!imageArray.length) {
      return new Response('Failed to convert image to array', {
        status: 500,
      });
    }

    const cf = await getCloudflareContext();
    // @ts-ignore
    const ai = cf.env.AI;
    // @ts-ignore
    const gatewayId = cf.env.AI_GATEWAY_ID;

    const generatedCodePromptMessages = [
      {
        role: 'user',
        content: descriptionPrompt,
      },
    ];
    const generatedCodePrompt = await ai.run(
      '@cf/meta/llama-3.2-11b-vision-instruct',
      {
        messages: generatedCodePromptMessages,
        image: imageArray,
        temperature: 0.2,
      },
      {
        gateway: {
          id: gatewayId,
          skipCache: false,
          cacheTtl: 3360,
        },
      }
    );

    console.log(generatedCodePrompt);

    const generatedCodePromptContent = generatedCodePrompt.response;

    if (!generatedCodePromptContent) {
      return new Response('No generatedCodePromptContent generated', {
        status: 500,
      });
    }

    const generatedCodeMessages = [
      {
        role: 'system',
        content: codingSystemPrompt,
      },
      {
        role: 'user',
        content: `
      ${generatedCodePromptContent}
      Please ONLY return code, NO backticks or language names.
      `,
      },
    ];
    const generatedCode = await ai.run(
      '@cf/meta/llama-3.2-3b-instruct',
      {
        messages: generatedCodeMessages,
        temperature: 0.2,
        stream: true,
      },
      {
        gateway: {
          id: gatewayId,
          skipCache: false,
          cacheTtl: 3360,
        },
      }
    );

    return new Response(generatedCode, {
      headers: { 'content-type': 'text/event-stream' },
    });
  } catch (error) {
    console.error('Error occurred:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
