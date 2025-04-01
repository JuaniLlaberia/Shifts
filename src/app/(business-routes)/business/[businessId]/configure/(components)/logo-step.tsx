'use client';

import { ReactNode, useState } from 'react';
import Dropzone, { FileRejection } from 'react-dropzone';
import { toast } from 'sonner';
import { CloudUpload, Loader2, MousePointerSquareDashed } from 'lucide-react';

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useUploadThing } from '@/lib/uploadthing';
import { Progress } from '@/components/ui/progress';

type LogoStepProps = {
  children: ReactNode;
  handleChangeStep?: (step: number, skip?: boolean) => void;
  businessId: string;
};

const LogoStep = ({
  businessId,
  children,
  handleChangeStep,
}: LogoStepProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  const { startUpload, isUploading } = useUploadThing('imageUploader', {
    onClientUploadComplete: () => {
      handleChangeStep?.(2);
      setIsOpen(false);
      toast.success('New logo uploaded successfully');
    },
    onUploadProgress(p) {
      setUploadProgress(p);
    },
  });

  const onDropRejected = (rejectedFiles: FileRejection[]) => {
    const [file] = rejectedFiles;

    setIsDragOver(false);
    toast.error(`${file.file.type} type is not supported.`, {
      description: 'Please choose a PNG, JPG, JPEG image instead.',
    });
  };

  const onDropAccepted = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      startUpload(acceptedFiles, { businessId, isOnboarding: true });
      setIsDragOver(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Upload your Logo</AlertDialogTitle>
          <AlertDialogDescription>
            This logo will only be visible for your employees.{' '}
            <span className='font-medium'>It is optional to have one.</span>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <Dropzone
          onDropRejected={onDropRejected}
          onDropAccepted={onDropAccepted}
          accept={{
            'image/png': ['.png'],
            'image/jpeg': ['.jpeg', '.jpg'],
          }}
          onDragEnter={() => setIsDragOver(true)}
          onDragLeave={() => setIsDragOver(false)}
        >
          {({ getRootProps, getInputProps }) => (
            <div
              {...getRootProps()}
              className={cn(
                'bg-gray-100 my-2 rounded-lg w-full h-40 flex flex-col items-center justify-center gap-1 border-2 border-border',
                isDragOver && 'border-border border-dashed'
              )}
            >
              <input {...getInputProps()} />
              {isDragOver ? (
                <MousePointerSquareDashed className='size-5 mb-1' />
              ) : isUploading ? (
                <Loader2 className='animate-spin size-5 mb-1' />
              ) : (
                <CloudUpload className='size-5 mb-1' />
              )}
              <div className='flex flex-col justify-center mb-2 text-sm text-zinc-700'>
                {isUploading ? (
                  <div className='flex flex-col items-center'>
                    <p>Uploading...</p>
                    <Progress
                      value={uploadProgress}
                      className='mt-2 w-40 h-2 bg-gray-300'
                    />
                  </div>
                ) : isDragOver ? (
                  <p>
                    <span className='font-semibold'>Drop file</span>
                    to upload
                  </p>
                ) : (
                  <p>
                    <span className='font-semibold underline'>
                      Click to upload
                    </span>{' '}
                    or drag and drop
                  </p>
                )}
              </div>

              <p className='text-xs text-muted-foreground'>
                PNG, JPG, JPEG (max 4MB)
              </p>
            </div>
          )}
        </Dropzone>

        <AlertDialogFooter>
          <Button
            variant='ghost'
            size='sm'
            onClick={() => {
              handleChangeStep?.(2, true);
              setIsOpen(false);
            }}
          >
            Skip
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default LogoStep;
