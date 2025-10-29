// src/components/MediaSection.js
"use client";

import React from 'react';
import Image from 'next/image';
import { IoMdCheckmark } from 'react-icons/io';
import { FaPlus } from 'react-icons/fa';

const MediaSection = ({
  formData,
  dispatch,
  errors,
  validatedFields,
  mainImagePreview,
  cardImagePreview,
  galleryImagesPreview = [], // Added fallback
  handleImageChange,
  clearImage,
  uploadingMainImage,
  uploadingCardImage,
}) => {
  return (
    <section id="media" className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Media</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="mainImage" className="block text-sm font-medium text-gray-700 flex items-center">
                        Main Image {validatedFields.mainImage && <IoMdCheckmark className="ml-2 text-green-500" />}
                      </label>
                      <p className="text-xs text-gray-500 mb-2">This is the primary image displayed at the top of your project's detail page.</p>
                      <div
                        className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md"
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => handleImageChange(e, 'mainImage')}
                      >
                        <div className="space-y-1 text-center">
                          {mainImagePreview ? (
                            <div className="relative mx-auto w-48 h-32 rounded-md overflow-hidden">
                              <img src={mainImagePreview} alt="Main Image Preview" className="w-full h-full object-cover" />
                              <button
                                type="button"
                                onClick={() => clearImage('mainImage')}
                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 text-xs leading-none flex items-center justify-center w-6 h-6 border-2 border-white hover:bg-red-600"
                                aria-label="Clear main image"
                              >
                                &times;
                              </button>
                            </div>
                          ) : (
                            <svg
                              className="mx-auto h-12 w-12 text-gray-400"
                              stroke="currentColor"
                              fill="none"
                              viewBox="0 0 48 48"
                              aria-hidden="true"
                            >
                              <path
                                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                strokeWidth={2}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          )}
                          <div className="flex text-sm text-gray-600">
                            <label
                              htmlFor="mainImageInput"
                              className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                            >
                              <span>Upload a file</span>
                              <input
                                id="mainImageInput"
                                name="mainImageInput"
                                type="file"
                                className="sr-only"
                                onChange={(e) => handleImageChange(e, 'mainImage')}
                                disabled={uploadingMainImage}
                              />
                            </label>
                            <p className="pl-1">or drag and drop</p>
                          </div>
                          <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                          {uploadingMainImage && <p className="text-blue-500 text-sm">Uploading...</p>}
                        </div>
                      </div>
                    </div>
                    <div>
                      <label htmlFor="cardImage" className="block text-sm font-medium text-gray-700 flex items-center">
                        Card Image {validatedFields.cardImage && <IoMdCheckmark className="ml-2 text-green-500" />}
                      </label>
                      <p className="text-xs text-gray-500 mb-2">This image will be used for the project card in listings. Recommended aspect ratio: 16:9.</p>
                      <div
                        className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md"
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => handleImageChange(e, 'cardImage')}
                      >
                        <div className="space-y-1 text-center">
                          {cardImagePreview ? (
                            <div className="relative mx-auto w-48 h-32 rounded-md overflow-hidden">
                              <img src={cardImagePreview} alt="Card Image Preview" className="w-full h-full object-cover" />
                              <button
                                type="button"
                                onClick={() => clearImage('cardImage')}
                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 text-xs leading-none flex items-center justify-center w-6 h-6 border-2 border-white hover:bg-red-600"
                                aria-label="Clear card image"
                              >
                                &times;
                              </button>
                            </div>
                          ) : (
                            <svg
                              className="mx-auto h-12 w-12 text-gray-400"
                              stroke="currentColor"
                              fill="none"
                              viewBox="0 0 48 48"
                              aria-hidden="true"
                            >
                              <path
                                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                strokeWidth={2}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          )}
                          <div className="flex text-sm text-gray-600">
                            <label
                              htmlFor="cardImageInput"
                              className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                            >
                              <span>Upload a file</span>
                              <input
                                id="cardImageInput"
                                name="cardImageInput"
                                type="file"
                                className="sr-only"
                                onChange={(e) => handleImageChange(e, 'cardImage')}
                                disabled={uploadingCardImage}
                              />
                            </label>
                            <p className="pl-1">or drag and drop</p>
                          </div>
                          <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                          {uploadingCardImage && <p className="text-blue-500 text-sm">Uploading...</p>}
                        </div>
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <label htmlFor="galleryImages" className="block text-sm font-medium text-gray-700 flex items-center">
                        Project Gallery Images
                        {validatedFields.galleryImages && <IoMdCheckmark className="ml-2 text-green-500" />}
                      </label>
                      <p className="text-xs text-gray-500 mb-2">Add additional images to showcase your project's features and design.</p>
                      <div
                        className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md"
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => handleImageChange(e, 'galleryImages')}
                      >
                        <div className="space-y-1 text-center">
                          {galleryImagesPreview.length > 0 ? (
                            <div className="grid grid-cols-3 gap-4">
                              {galleryImagesPreview.map((image, index) => (
                                <div key={index} className="relative w-full h-32 rounded-md overflow-hidden">
                                  <img src={image} alt={`Gallery Image ${index + 1}`} className="w-full h-full object-cover" />
                                  <button
                                    type="button"
                                    onClick={() => clearImage('galleryImages', index)}
                                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 text-xs leading-none flex items-center justify-center w-6 h-6 border-2 border-white hover:bg-red-600"
                                    aria-label="Clear gallery image"
                                  >
                                    &times;
                                  </button>
                                </div>
                              ))}
                              {/* Add a button to add more images when some are already present */}
                              <div className="relative w-full h-32 rounded-md border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer">
                                <label
                                  htmlFor="galleryImagesInput"
                                  className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500 p-4"
                                >
                                  <FaPlus className="mx-auto h-8 w-8 text-gray-400" />
                                  <span className="mt-2 block text-sm">Add More</span>
                                  <input
                                    id="galleryImagesInput"
                                    name="galleryImagesInput"
                                    type="file"
                                    className="sr-only"
                                    onChange={(e) => handleImageChange(e, 'galleryImages')}
                                    multiple
                                  />
                                </label>
                              </div>
                            </div>
                          ) : (
                            <>
                              <svg
                                className="mx-auto h-12 w-12 text-gray-400"
                                stroke="currentColor"
                                fill="none"
                                viewBox="0 0 48 48"
                                aria-hidden="true"
                              >
                                <path
                                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                strokeWidth={2}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                              <div className="flex text-sm text-gray-600">
                                <label
                                  htmlFor="galleryImagesInput"
                                  className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                                >
                                  <span>Upload files</span>
                                  <input
                                    id="galleryImagesInput"
                                    name="galleryImagesInput"
                                    type="file"
                                    className="sr-only"
                                    onChange={(e) => handleImageChange(e, 'galleryImages')}
                                    multiple
                                  />
                                </label>
                                <p className="pl-1">or drag and drop</p>
                              </div>
                            </>
                          )}
                          <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB each</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>  );
};

export default MediaSection;
