import { z } from 'zod';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('image') as File;
    let fileName = formData.get('fileName') as string;
    const contentType = file.type;

    if (!file || !contentType) {
      return new Response('Invalid file upload', { status: 400 });
    }

    if (!fileName) {
      fileName = uuidv4();
    }

    let result = z
      .object({
        fileName: z.string(),
        contentType: z.string(),
      })
      .safeParse({ fileName, contentType });

    if (result.error) {
      return new Response(result.error.message, { status: 422 });
    }

    const cf = await getCloudflareContext();
    // @ts-ignore
    const bucket = cf.env.AI_IMAGE_BUCKET;

    const upload = await bucket.put(fileName, file.stream());

    if (upload.error) {
      return new Response('Failed to upload file', { status: 500 });
    }

    return new Response(JSON.stringify({ fileName }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error occurred:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
