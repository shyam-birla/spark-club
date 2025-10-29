'use client';

import { useReducer, useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { client, clientWriteClient } from '../../../../sanity/lib/client';
import BlogDetailsSection from '@/components/BlogDetailsSection';
import BlogMediaSection from '@/components/BlogMediaSection';
import { toast } from 'react-hot-toast';
import dynamic from 'next/dynamic';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });
import 'react-quill-new/dist/quill.snow.css';

// Initial state for the form reducer
const initialFormData = {
  title: '',
  slug: '',
  category: '', // Added for blog category
  coverImage: null,
  body: '',
};

// Reducer function for form state management
function formReducer(state, action) {
  switch (action.type) {
    case 'UPDATE_FIELD':
      return { ...state, [action.field]: action.value };
    case 'SET_FORM_DATA':
      return { ...state, ...action.payload };
    default:
      return state;
  }
}

export default function NewBlogPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [formData, dispatch] = useReducer(formReducer, initialFormData);
  const [errors, setErrors] = useState({});
  const [activeSection, setActiveSection] = useState('postDetails'); // Added
  const [saving, setSaving] = useState(false);
  const [uploadingCoverImage, setUploadingCoverImage] = useState(false);
  const [coverImagePreview, setCoverImagePreview] = useState(null);
  const [authorProfile, setAuthorProfile] = useState(null); // Added
  const [authorProfileIdInput, setAuthorProfileIdInput] = useState(''); // Added

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (formData.title) {
      const generatedSlug = formData.title.toLowerCase().replace(/\s+/g, '-').slice(0, 96);
      dispatch({ type: 'UPDATE_FIELD', field: 'slug', value: generatedSlug });
    }
  }, [formData.title, dispatch]);

  const handleCoverImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      dispatch({ type: 'UPDATE_FIELD', field: 'coverImage', value: file });
      setCoverImagePreview(URL.createObjectURL(file));
    }
  };

  const clearCoverImage = () => {
    dispatch({ type: 'UPDATE_FIELD', field: 'coverImage', value: null });
    setCoverImagePreview(null);
    const inputElement = document.getElementById('coverImage');
    if (inputElement) {
      inputElement.value = '';
    }
  };

  const handleLookupAuthor = useCallback(async () => {
    if (!authorProfileIdInput.trim()) {
      toast.error('Please enter an Author Profile ID to look up.');
      return;
    }
    try {
      const response = await fetch('/api/profile/lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uniqueProfileId: authorProfileIdInput }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Author profile not found');
      }
      const profile = await response.json();
      setAuthorProfile(profile);
      toast.success(`Found author: ${profile.name}`);
    } catch (error) {
      toast.error(error.message);
      setAuthorProfile(null);
    }
  }, [authorProfileIdInput]);

  const validateForm = useCallback(() => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required.';
    if (!formData.body.trim() || formData.body.trim() === '<p><br></p>') newErrors.body = 'Blog content is required.';
    if (!authorProfile) newErrors.author = 'Author is required. Please lookup an author profile.'; // Added
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleNextSection = useCallback(() => { // Added
    const sections = ['postDetails', 'media']; // Define sections for blog
    const currentIndex = sections.indexOf(activeSection);
    if (currentIndex < sections.length - 1) {
      setActiveSection(sections[currentIndex + 1]);
    }
  }, [activeSection]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error('Please correct the errors in the form.');
      return;
    }
    setSaving(true);

    try {
      let coverImageAsset;
      if (formData.coverImage) {
        setUploadingCoverImage(true);
        coverImageAsset = await clientWriteClient.assets.upload('image', formData.coverImage).finally(() => setUploadingCoverImage(false));
      }

      const submissionData = {
        ...formData,
        coverImage: coverImageAsset ? { _type: 'image', asset: { _type: 'reference', _ref: coverImageAsset._id } } : null,
        author: authorProfile ? { _type: 'reference', _ref: authorProfile._id } : null, // Added
      };

      const response = await fetch('/api/blogs/new', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submissionData),
      });

      if (!response.ok) throw new Error('Failed to create blog submission');

      toast.success('Blog submitted for approval!');
      router.push('/blogs');
    } catch (error) {
      console.error(error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (status === 'loading') return <div>Loading...</div>;
  if (status === 'unauthenticated') {
    router.push('/login');
    return null;
  }

  return (
    <main className="container mx-auto px-4 py-12 md:py-20">
      <h1 className="text-3xl font-bold mb-6">Submit a New Blog Post</h1>
      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="lg:w-1/4 bg-white p-6 rounded-lg shadow-md sticky top-24 self-start">
          <h2 className="text-xl font-bold mb-4">Form Sections</h2>
          <nav>
            <ul className="space-y-2">
              <li><button type="button" onClick={() => setActiveSection('postDetails')} className={`w-full text-left px-4 py-2 rounded-md transition-colors ${activeSection === 'postDetails' ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'}`}>Post Details</button></li>
              <li><button type="button" onClick={() => setActiveSection('media')} className={`w-full text-left px-4 py-2 rounded-md transition-colors ${activeSection === 'media' ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'}`}>Media</button></li>
            </ul>
          </nav>
        </aside>

        <div className="lg:w-3/4">
          <form onSubmit={handleSubmit} className="space-y-8">
            {activeSection === 'postDetails' && (
              <div>
                <BlogDetailsSection
                  formData={formData}
                  dispatch={dispatch}
                  errors={errors}
                  authorProfile={authorProfile}
                  authorProfileIdInput={authorProfileIdInput}
                  setAuthorProfileIdInput={setAuthorProfileIdInput}
                  handleLookupAuthor={handleLookupAuthor}
                />
                <div className="text-right mt-8">
                  <button type="button" onClick={handleNextSection} className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors">Next</button>
                </div>
              </div>
            )}

            {activeSection === 'media' && (
              <div>
                <BlogMediaSection
                  coverImagePreview={coverImagePreview}
                  handleCoverImageChange={handleCoverImageChange}
                  clearCoverImage={clearCoverImage}
                  uploadingCoverImage={uploadingCoverImage}
                />
                <div className="text-right mt-8">
                  <button type="submit" disabled={saving || uploadingCoverImage} className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400">
                    {saving ? 'Submitting...' : 'Submit for Approval'}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </main>
  );
}
