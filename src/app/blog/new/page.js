
'use client';

import { useReducer, useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { client, clientWriteClient } from '../../../../sanity/lib/client';
import { toast } from 'react-hot-toast';
import dynamic from 'next/dynamic';
import { portableTextToHtml } from '../../../utils/portableTextToHtml';

import Stepper from '@/components/ui/Stepper';
import AuthorCard from '@/components/ui/AuthorCard';
import FileUpload from '@/components/ui/FileUpload';
import BlogDetailsSection from '@/components/BlogDetailsSection';
import { IoMdCheckmark } from 'react-icons/io';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });
import 'react-quill-new/dist/quill.snow.css';

const initialFormData = {
  title: '',
  slug: '',
  category: '',
  coverImage: null,
  body: '',
};

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

const steps = [
  { id: 'postDetails', name: 'Post Details' },
  { id: 'author', name: 'Author' },
  { id: 'media', name: 'Media' },
];

export default function NewBlogPage({ slug }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [formData, dispatch] = useReducer(formReducer, initialFormData);
  const [errors, setErrors] = useState({});
  const [validatedFields, setValidatedFields] = useState({});
  const [completedSections, setCompletedSections] = useState({});
  const [activeSection, setActiveSection] = useState('postDetails');
  const [saving, setSaving] = useState(false);
  const [uploadingCoverImage, setUploadingCoverImage] = useState(false);
  const [coverImagePreview, setCoverImagePreview] = useState(null);
  const [authorProfile, setAuthorProfile] = useState(null);
  const [authorProfileIdInput, setAuthorProfileIdInput] = useState('');
  const [editableAuthorLinkedin, setEditableAuthorLinkedin] = useState('');
  const [editableAuthorGithub, setEditableAuthorGithub] = useState('');
  const [editableAuthorPortfolio, setEditableAuthorPortfolio] = useState('');

  useEffect(() => {
    if (slug) {
      // Fetch existing blog post data
      client.fetch(`*[_type == "blogPost" && slug.current == $slug][0]{
        title,
        "slug": slug.current,
        category,
        body,
        coverImage { asset->{url} },
        author->{_id, name, uniqueProfileId, linkedinUrl, githubUrl, portfolioUrl, profileRef->{userImage{asset->{url}}}},
      }`, { slug }).then(data => {
        if (data) {
          const formattedData = {
            ...data,
            body: portableTextToHtml(data.body), // Convert Portable Text to HTML
          };
          dispatch({ type: 'SET_FORM_DATA', payload: formattedData });
          if (data.coverImage?.asset?.url) {
            setCoverImagePreview(data.coverImage.asset.url);
          }
          if (data.author) {
            setAuthorProfile(data.author);
            setAuthorProfileIdInput(data.author.uniqueProfileId || '');
            setEditableAuthorLinkedin(data.author.linkedinUrl || '');
            setEditableAuthorGithub(data.author.githubUrl || '');
            setEditableAuthorPortfolio(data.author.portfolioUrl || '');
          }
        } else {
          toast.error('Blog post not found.');
          router.push('/blog/new'); // Redirect to new if not found
        }
      }).catch(error => {
        console.error('Error fetching blog post for edit:', error);
        toast.error('Failed to load blog post for editing.');
      });
    }
  }, [slug, dispatch, router]);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    const savedData = localStorage.getItem('blogFormData');
    if (savedData) {
      dispatch({ type: 'SET_FORM_DATA', payload: JSON.parse(savedData) });
    }
  }, []);

  useEffect(() => {
    if (formData.title) {
      const generatedSlug = formData.title.toLowerCase().replace(/\s+/g, '-').slice(0, 96);
      dispatch({ type: 'UPDATE_FIELD', field: 'slug', value: generatedSlug });
    }
  }, [formData.title, dispatch]);

  useEffect(() => {
    localStorage.setItem('blogFormData', JSON.stringify(formData));
  }, [formData]);

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
      setEditableAuthorLinkedin(profile.linkedinUrl || '');
      setEditableAuthorGithub(profile.githubUrl || '');
      setEditableAuthorPortfolio(profile.portfolioUrl || '');
      toast.success(`Found author: ${profile.name}`);
    } catch (error) {
      toast.error(error.message);
      setAuthorProfile(null);
    }
  }, [authorProfileIdInput]);

  const clearAuthor = () => {
    setAuthorProfile(null);
    setAuthorProfileIdInput('');
    setEditableAuthorLinkedin('');
    setEditableAuthorGithub('');
    setEditableAuthorPortfolio('');
  };

  const validateForm = useCallback(() => {
    const newErrors = {};
    const newValidatedFields = {};

    if (formData.title.trim()) {
      newValidatedFields.title = true;
    } else {
      newErrors.title = 'Title is required.';
    }

    if (String(formData.body || '').trim() && String(formData.body || '').trim() !== '<p><br></p>') {
      newValidatedFields.body = true;
    } else {
      newErrors.body = 'Blog content is required.';
    }

    if (authorProfile) {
      newValidatedFields.author = true;
    } else {
      newErrors.author = 'Author is required.';
    }

    setErrors(newErrors);
    setValidatedFields(newValidatedFields);

    return Object.keys(newErrors).length === 0;
  }, [formData, authorProfile]);

  useEffect(() => {
    validateForm();
  }, [formData, authorProfile, validateForm]);

  const handleNextSection = useCallback(() => {
    const currentIndex = steps.findIndex(step => step.id === activeSection);
    if (currentIndex < steps.length - 1) {
      setCompletedSections(prev => ({ ...prev, [activeSection]: true }));
      setActiveSection(steps[currentIndex + 1].id);
    }
  }, [activeSection]);

  const handlePrevSection = useCallback(() => {
    const currentIndex = steps.findIndex(step => step.id === activeSection);
    if (currentIndex > 0) {
      setActiveSection(steps[currentIndex - 1].id);
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
      let coverImageAsset = null;
      console.log('formData.coverImage before upload:', formData.coverImage);
      if (formData.coverImage instanceof File) {
        setUploadingCoverImage(true);
        coverImageAsset = await clientWriteClient.assets.upload('image', formData.coverImage);
        setUploadingCoverImage(false);
      }

      let finalAuthorRef = null;
      const socialLinksEdited = !(
        (editableAuthorLinkedin === (authorProfile?.linkedinUrl || '')) &&
        (editableAuthorGithub === (authorProfile?.githubUrl || '')) &&
        (editableAuthorPortfolio === (authorProfile?.portfolioUrl || ''))
      );

      if (authorProfile && !socialLinksEdited) {
        finalAuthorRef = { _type: 'reference', _ref: authorProfile._id };
      } else {
        const newPerson = {
          _type: 'person',
          name: authorProfile?.name || 'Unknown Author',
          image: authorProfile?.profileImage || null,
          linkedinUrl: editableAuthorLinkedin,
          githubUrl: editableAuthorGithub,
          portfolioUrl: editableAuthorPortfolio,
        };
        finalAuthorRef = newPerson;
      }

      const submissionData = {
        ...formData,
        author: finalAuthorRef,
        coverImage: coverImageAsset ? { _type: 'image', asset: { _type: 'reference', _ref: coverImageAsset._id } } : null,
      };

      const apiUrl = slug ? `/api/blog/${slug}` : '/api/blog/new';
      const httpMethod = slug ? 'PUT' : 'POST';

      const response = await fetch(apiUrl, {
        method: httpMethod,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submissionData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('API Error Status:', response.status);
        console.error('API Error Data:', errorData);
        throw new Error(errorData.message || `Failed to ${slug ? 'update' : 'create'} blog post`);
      }

      toast.success(`Blog ${slug ? 'updated' : 'submitted for approval'} successfully!`);
      router.push('/blog');
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
      <div className="max-w-4xl mx-auto">
        <Stepper steps={steps} activeSection={activeSection} completedSections={completedSections} />
        <div className="mt-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {activeSection === 'postDetails' && (
              <BlogDetailsSection
                formData={formData}
                dispatch={dispatch}
                errors={errors}
                validatedFields={validatedFields}
              />
            )}

            {activeSection === 'author' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
                  Author Details
                  {validatedFields.author && <IoMdCheckmark className="ml-2 text-green-500" />}
                </h2>
                <div className="flex items-end gap-2">
                  <input
                    type="text"
                    id="authorProfileId"
                    value={authorProfileIdInput}
                    onChange={(e) => setAuthorProfileIdInput(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                    placeholder="Enter author's unique profile ID"
                  />
                  <button type="button" onClick={handleLookupAuthor} className="bg-blue-500 text-white px-4 py-2 rounded-md">Lookup</button>
                  {(authorProfile || authorProfileIdInput.trim()) && (
                    <button type="button" onClick={clearAuthor} className="bg-red-500 text-white px-4 py-2 rounded-md">Clear</button>
                  )}
                </div>
                {authorProfile && (
                  <AuthorCard
                    authorProfile={authorProfile}
                    editableAuthorLinkedin={editableAuthorLinkedin}
                    setEditableAuthorLinkedin={setEditableAuthorLinkedin}
                    editableAuthorGithub={editableAuthorGithub}
                    setEditableAuthorGithub={setEditableAuthorGithub}
                    editableAuthorPortfolio={editableAuthorPortfolio}
                    setEditableAuthorPortfolio={setEditableAuthorPortfolio}
                  />
                )}
              </div>
            )}

            {activeSection === 'media' && (
              <FileUpload
                coverImagePreview={coverImagePreview}
                handleCoverImageChange={handleCoverImageChange}
                clearCoverImage={clearCoverImage}
                uploadingCoverImage={uploadingCoverImage}
              />
            )}

            <div className="flex justify-between mt-8">
              {activeSection !== 'postDetails' && (
                <button type="button" onClick={handlePrevSection} className="bg-gray-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-gray-700 transition-colors">Previous</button>
              )}
              {activeSection !== 'media' ? (
                <button type="button" onClick={handleNextSection} className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors ml-auto">Next</button>
              ) : (
                <button type="submit" disabled={saving || uploadingCoverImage} className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400 ml-auto">
                  {saving ? 'Submitting...' : 'Submit for Approval'}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
