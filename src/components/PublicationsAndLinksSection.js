
'use client';

import { useDropzone } from 'react-dropzone';
import { useCallback } from 'react';
import Image from 'next/image';

export default function PublicationsAndLinksSection({ formData, dispatch, errors, posterImagePreview, handleImageChange, clearImage, uploadingPosterImage }) {

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      // Create a synthetic event object to pass to handleImageChange
      const event = {
        target: {
          files: [file],
        },
      };
      handleImageChange(event, 'posterImage');
    }
  }, [handleImageChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: 'image/*',
    multiple: false,
  });

  return (
    <div className="space-y-6">
      <div>
        <label htmlFor="publicationLink" className="block text-sm font-medium text-gray-700">Publication Link</label>
        <input
          type="url"
          name="publicationLink"
          id="publicationLink"
          value={formData.publicationLink}
          onChange={(e) => dispatch({ type: 'UPDATE_FIELD', field: 'publicationLink', value: e.target.value })}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
        />
        {errors.publicationLink && <p className="text-red-500 text-xs mt-1">{errors.publicationLink}</p>}
      </div>
      <div>
        <label htmlFor="githubUrl" className="block text-sm font-medium text-gray-700">GitHub URL</label>
        <input
          type="url"
          name="githubUrl"
          id="githubUrl"
          value={formData.githubUrl}
          onChange={(e) => dispatch({ type: 'UPDATE_FIELD', field: 'githubUrl', value: e.target.value })}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
        />
        {errors.githubUrl && <p className="text-red-500 text-xs mt-1">{errors.githubUrl}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Poster Image</label>
        <div {...getRootProps()} className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md ${isDragActive ? 'border-blue-500' : ''}`}>
          <input {...getInputProps()} />
          <div className="space-y-1 text-center">
            {posterImagePreview ? (
              <div className="relative">
                <Image src={posterImagePreview} alt="Poster preview" width={192} height={108} className="w-48 h-auto rounded-md" />
                <button type="button" onClick={(e) => { e.stopPropagation(); clearImage('posterImage'); }} className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 text-xs">&times;</button>
              </div>
            ) : (
              <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
            <div className="flex text-sm text-gray-600">
              <p className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                <span>{uploadingPosterImage ? 'Uploading...' : 'Upload a file'}</span>
              </p>
              <p className="pl-1">or drag and drop</p>
            </div>
            <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
          </div>
        </div>
      </div>
    </div>
  );
}