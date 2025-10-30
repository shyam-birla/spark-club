
'use client';

import { clientWriteClient } from '../../sanity/lib/client';
import { toast } from 'react-hot-toast';
import React, { useCallback, useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

import { IoMdCheckmark } from 'react-icons/io';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });
import 'react-quill-new/dist/quill.snow.css';

const BlogDetailsSection = ({ formData, dispatch, errors, validatedFields }) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);
  const imageHandler = useCallback(function () {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      if (file) {
        try {
          toast.loading('Uploading image...');
          const asset = await clientWriteClient.assets.upload('image', file);
          toast.dismiss();
          toast.success('Image uploaded!');

          const imageUrl = asset.url;
          const quill = this.quill;
          const range = quill.getSelection();
          quill.insertEmbed(range.index, 'image', imageUrl);
        } catch (error) {
          toast.dismiss();
          toast.error('Image upload failed.');
          console.error('Image upload error:', error);
        }
      }
    };
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 flex items-center">
          Title
          {validatedFields.title && <IoMdCheckmark className="ml-2 text-green-500" />}
        </label>
        <input
          type="text"
          name="title"
          id="title"
          value={formData.title}
          onChange={(e) => dispatch({ type: 'UPDATE_FIELD', field: 'title', value: e.target.value })}
          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${errors.title ? 'border-red-500' : ''}`}
          required
        />
        {errors.title && <p className="mt-2 text-sm text-red-600">{errors.title}</p>}
      </div>

      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700">
          Category
        </label>
        <select
          name="category"
          id="category"
          value={formData.category || ''}
          onChange={(e) => dispatch({ type: 'UPDATE_FIELD', field: 'category', value: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          required
        >
          <option value="">Select a category</option>
          <option value="technical">Technical</option>
          <option value="community-update">Community Update</option>
          <option value="tutorial">Tutorial</option>
          <option value="news">News</option>
          <option value="event">Event</option>
        </select>
      </div>

      <div>
        
                <label htmlFor="body" className="block text-sm font-medium text-gray-700 flex items-center">
                  Content
                  {validatedFields.body && <IoMdCheckmark className="ml-2 text-green-500" />}
                </label>
                <div className={`mt-1 ${errors.body ? 'border border-red-500 rounded-md' : ''}`}>
                  {isClient && (
                    <ReactQuill
                      theme="snow"
                      value={formData.body}
                      onChange={(value) => dispatch({ type: 'UPDATE_FIELD', field: 'body', value })}
                      modules={{
                        toolbar: {
                          container: [
                            [{ header: '1' }, { header: '2' }, { font: [] }],
                            [{ size: [] }],
                            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                            [
                              { list: 'ordered' },
                              { list: 'bullet' },
                              { indent: '-1' },
                              { indent: '+1' },
                            ],
                            ['link', 'image', 'video'],
                            ['clean'],
                          ],
                          handlers: {
                            image: imageHandler,
                          },
                        },
                        clipboard: {
                          matchVisual: false,
                        },
                      }}
                    />
                  )}
                </div>
        
        {errors.body && <p className="mt-2 text-sm text-red-600">{errors.body}</p>}
      </div>
    </div>
  );
};

export default BlogDetailsSection;
