'use client';

import React from 'react';
import Image from 'next/image';

const BlogMediaSection = ({
  coverImagePreview,
  handleCoverImageChange,
  clearCoverImage,
  uploadingCoverImage,
}) => {
  return (
    <section className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Media</h2>
      <div className="grid grid-cols-1 gap-6">
        <div>
          <label htmlFor="coverImage" className="block text-sm font-medium text-gray-700">Cover Image {uploadingCoverImage && <span className="text-blue-500 ml-2">Uploading...</span>}</label>
          <input
            type="file"
            name="coverImage"
            id="coverImage"
            onChange={handleCoverImageChange}
            className="mt-1 block w-full"
            disabled={uploadingCoverImage}
          />
          {coverImagePreview && (
            <div className="mt-4 relative w-fit">
              <p className="text-sm text-gray-500 mb-2">Cover Image Preview:</p>
              <Image src={coverImagePreview} alt="Cover Image Preview" width={300} height={200} className="max-w-xs h-auto rounded-md shadow" />
              <button
                type="button"
              onClick={clearCoverImage}
                className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 text-xs leading-none flex items-center justify-center w-6 h-6 -mt-2 -mr-2 border-2 border-white hover:bg-red-600"
                aria-label="Clear cover image"
              >
                &times;
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default BlogMediaSection;