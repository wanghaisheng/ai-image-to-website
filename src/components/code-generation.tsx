'use client';

import { useState } from 'react';

import { DragAndDropUploader } from '@/components/drag-and-drop-uploader';
import { Button } from '@/components/ui/button';

export async function* readStream(response: ReadableStream) {
  let reader = response.pipeThrough(new TextDecoderStream()).getReader();
  let done = false;

  while (!done) {
    let { value, done: streamDone } = await reader.read();
    console.log(value, streamDone);
    done = streamDone;

    if (value) yield value;
  }

  reader.releaseLock();
}

export function CodeGeneration() {
  const [imageName, setImageName] = useState<string | null>(null);
  const [generationPending, setGenerationPending] = useState<boolean>(false);
  const [generatedCode, setGeneratedCode] = useState<string | null>('');

  const handleUploadSuccess = (data: any) => {
    setImageName(data.fileName);
  };

  const handleGenerateCode = () => {
    if (!imageName) return;
    setGeneratedCode('');
    setGenerationPending(true);

    fetch('/api/ai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        imageUrl: `https://pub-697226dc46ac49548e8fae407a281f43.r2.dev/${imageName}`,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.body;
      })
      .then(async (data) => {
        for await (let chunk of readStream(data as ReadableStream)) {
          try {
            console.log('Received chunk:', chunk);

            const parts = chunk.split('\n');

            parts.forEach((part) => {
              const cleanedPart = part.replace(/^data: /, '').trim();

              if (cleanedPart && cleanedPart !== '[DONE]') {
                if (cleanedPart.startsWith('{') && cleanedPart.endsWith('}')) {
                  const parsedPart = JSON.parse(cleanedPart);
                  setGeneratedCode((prev) => prev + parsedPart.response);
                } else {
                  console.error('Invalid JSON part:', cleanedPart);
                }
              }
            });

            setGenerationPending(false);
          } catch (error) {
            console.error('Error parsing chunk:', error);
            setGenerationPending(false);
          }
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        setGenerationPending(false);
      });
  };

  return (
    <div className="flex flex-col">
      <div className="w-full max-w-3xl py-4 px-4 sm:px-6 lg:px-8 m-auto items-center text-center">
        <div
          className={`transition-all duration-500 ease-in-out mt-[5vh] lg:mt-[15vh]`}
        >
          {!generatedCode && !generationPending && (
            <>
              <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
                Upload a file to generate your website
              </h1>
              <DragAndDropUploader onUploadSuccess={handleUploadSuccess} />
              {imageName && (
                <Button className="mt-4" onClick={handleGenerateCode}>
                  Generate Code
                </Button>
              )}
            </>
          )}
          {generationPending && (
            <div className="mt-4">
              <p className="text-lg text-gray-900 dark:text-white">
                Generating code...
              </p>
            </div>
          )}
          {generatedCode && (
            <div className="mt-4">
              <pre className="text-sm text-left whitespace-pre-wrap">
                {generatedCode}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
