'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface FileWithPreview extends File {
  preview: string;
}

interface DragAndDropUploaderProps {
  onUploadSuccess: (data: any) => void;
}

export function DragAndDropUploader({
  onUploadSuccess,
}: DragAndDropUploaderProps) {
  const [imageUploadPending, setImageUploadPending] = useState<boolean>(false);
  const [files, setFiles] = useState<FileWithPreview[]>([]);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setImageUploadPending(true);

      const newFiles = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      );

      setFiles((prevFiles) => [...prevFiles, ...newFiles]);

      newFiles.forEach((file) => {
        const formData = new FormData();
        formData.append('image', file);

        fetch('/api/image', {
          method: 'POST',
          body: formData,
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            return response.json();
          })
          .then((data) => {
            console.log('Success:', data);
            setImageUploadPending(false);
            onUploadSuccess(data); // Pass the response data to the parent component
          })
          .catch((error) => {
            console.error('Error:', error);
          });
      });
    },
    [onUploadSuccess]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': [],
    },
  });

  const removeFile = (file: FileWithPreview) => {
    setFiles((prevFiles) => prevFiles.filter((f) => f !== file));
    URL.revokeObjectURL(file.preview);
  };

  return (
    <Card className="w-full max-w-md p-6">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragActive ? 'border-primary bg-primary/10' : 'border-gray-300'
        }`}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the images here ...</p>
        ) : (
          <p>
            Drag &apos;n&apos; drop some images here, or click to select files
          </p>
        )}
      </div>
      {files.length > 0 && (
        <div className="mt-6 grid grid-cols-2 gap-4">
          {files.map((file) => (
            <div key={file.name} className="relative group">
              <img
                src={file.preview}
                alt={file.name}
                className="w-full h-32 object-cover rounded-md"
              />
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => removeFile(file)}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Remove {file.name}</span>
              </Button>
            </div>
          ))}
        </div>
      )}
      {imageUploadPending && (
        <div className="mt-4">
          <p className="text-lg text-gray-900 dark:text-white">
            Uploading image...
          </p>
        </div>
      )}
    </Card>
  );
}