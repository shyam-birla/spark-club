
'use client';

import { FiUploadCloud, FiX } from 'react-icons/fi';
import Image from 'next/image';

const FileUpload = ({ coverImagePreview, handleCoverImageChange, clearCoverImage, uploadingCoverImage }) => {
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length) {
      const event = {
        target: {
          files: files,
        },
      };
      handleCoverImageChange(event);
    }
  };

  return (
    <div className="rounded-lg border border-dashed border-gray-200 bg-card text-card-foreground shadow-sm">
      <div className="flex flex-col space-y-1.5 p-6">
        <h3 className="whitespace-nowrap text-2xl font-semibold leading-none tracking-tight">Cover Image</h3>
      </div>
      <div className="p-6 pt-0" onDragOver={handleDragOver} onDrop={handleDrop}>
        <div className="flex flex-col items-center justify-center space-y-4 rounded-md border-2 border-dashed border-gray-300 p-12 text-center">
          {coverImagePreview ? (
            <div className="relative">
              <Image src={coverImagePreview} alt="Cover image preview" width={192} height={192} className="h-48 w-auto rounded-md" />
              <button
                type="button"
                onClick={clearCoverImage}
                className="absolute top-2 right-2 rounded-full bg-red-500 p-1 text-white shadow-md transition-transform hover:scale-105"
              >
                <FiX className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <FiUploadCloud className="mx-auto h-12 w-12 text-gray-400" />
              <p className="text-lg font-semibold">Drag & drop your image here</p>
              <p className="text-sm text-gray-500">or</p>
              <label htmlFor="coverImage" className="cursor-pointer font-medium text-blue-600 hover:text-blue-500">
                Browse files
                <input type="file" id="coverImage" className="sr-only" onChange={handleCoverImageChange} accept="image/*" />
              </label>
            </div>
          )}
          {uploadingCoverImage && <p className="mt-2 text-sm text-gray-500">Uploading...</p>}
        </div>
      </div>
    </div>
  );
};

export default FileUpload;
