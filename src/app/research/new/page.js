'use client';

import { useReducer, useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { client, clientWriteClient } from '../../../../sanity/lib/client';
import { toast } from 'react-hot-toast';

// Import custom hooks
import useTeamManagement from '@/hooks/useTeamManagement';
import useImageUpload from '@/hooks/useImageUpload';

// Import child components
import ResearchDetailsSection from '@/components/ResearchDetailsSection';
import PublicationsAndLinksSection from '@/components/PublicationsAndLinksSection';
import TeamSection from '@/components/TeamSection';
import Stepper from '@/components/ui/Stepper';

const steps = [
  { id: 'researchDetails', name: 'Research Details' },
  { id: 'publications', name: 'Publications & Links' },
  { id: 'team', name: 'Team' },
];

const initialFormData = {
  title: '',
  description: '',
  status: 'ongoing',
  researchArea: '',
  publicationLink: '',
  githubUrl: '',
  posterImage: null,
  authors: [],
  mentors: [],
};

function formReducer(state, action) {
  switch (action.type) {
    case 'UPDATE_FIELD':
      return { ...state, [action.field]: action.value };
    case 'ADD_TEAM_MEMBER':
      return { ...state, [action.memberType]: [...state[action.memberType], action.payload] };
    case 'UPDATE_TEAM_MEMBER':
      return {
        ...state,
        [action.memberType]: state[action.memberType].map((member, index) =>
          index === action.index ? { ...member, ...action.payload } : member
        ),
      };
    case 'REMOVE_TEAM_MEMBER':
      return { ...state, [action.memberType]: state[action.memberType].filter((_, index) => index !== action.index) };
    case 'SET_FORM_DATA':
      return { ...state, ...action.payload };
    default:
      return state;
  }
}

export default function NewResearchProjectPage({ slug }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [formData, dispatch] = useReducer(formReducer, initialFormData);
  const [errors, setErrors] = useState({});
  const [activeSection, setActiveSection] = useState('researchDetails');
  const [completedSections, setCompletedSections] = useState({});
  const [saving, setSaving] = useState(false);
  const [uploadingPosterImage, setUploadingPosterImage] = useState(false);

  const { previews, handleImageChange, clearImage } = useImageUpload({ posterImage: { updateAction: 'UPDATE_FIELD', initialValue: formData.posterImage } }, dispatch);

  const { 
    handleLookupProfile, 
    addTeamMember, 
    removeTeamMember, 
    handleTeamMemberChange 
  } = useTeamManagement(dispatch);


  useEffect(() => {
    if (slug) {
      // Fetch existing research project data
      client.fetch(`*[_type == "researchProject" && slug.current == $slug][0]{
        title,
        description,
        status,
        researchArea,
        publicationLink,
        githubUrl,
        posterImage { asset->{url} },
        authors[] { _key, profileRef->{_id, uniqueProfileId, name, linkedinUrl, githubUrl, portfolioUrl, image{asset->{url}}} },
        mentors[] { _key, profileRef->{_id, uniqueProfileId, name, linkedinUrl, githubUrl, portfolioUrl, image{asset->{url}}} },
      }`, { slug }).then(data => {
        if (data) {
          const formattedData = {
            ...data,
            posterImage: data.posterImage?.asset?.url || null,
            authors: data.authors ? data.authors.map(author => ({
              profileId: author.profileRef.uniqueProfileId,
              name: author.profileRef.name,
              linkedinUrl: author.profileRef.linkedinUrl,
              githubUrl: author.profileRef.githubUrl,
              portfolioUrl: author.profileRef.portfolioUrl,
            })) : [],
            mentors: data.mentors ? data.mentors.map(mentor => ({
              profileId: mentor.profileRef.uniqueProfileId,
              name: mentor.profileRef.name,
              linkedinUrl: mentor.profileRef.linkedinUrl,
              githubUrl: mentor.profileRef.githubUrl,
              portfolioUrl: mentor.profileRef.portfolioUrl,
            })) : [],
          };
          dispatch({ type: 'SET_FORM_DATA', payload: formattedData });
        } else {
          toast.error('Research project not found.');
          router.push('/research/new'); // Redirect to new if not found
        }
      }).catch(error => {
        console.error('Error fetching research project for edit:', error);
        toast.error('Failed to load research project for editing.');
      });
    }
  }, [slug, dispatch, router]);

  useEffect(() => {
    const dataToSave = { ...formData, posterImage: null };
    localStorage.setItem('new-research-draft', JSON.stringify(dataToSave));
  }, [formData]);

  const clearDraft = () => {
    localStorage.removeItem('new-research-draft');
    dispatch({ type: 'SET_FORM_DATA', payload: initialFormData });
    toast.success('Draft cleared!');
  };

  const handleNextSection = () => {
    const sections = ['researchDetails', 'publications', 'team'];
    const currentIndex = sections.indexOf(activeSection);
    if (currentIndex < sections.length - 1) {
      setCompletedSections(prev => ({ ...prev, [activeSection]: true }));
      setActiveSection(sections[currentIndex + 1]);
    }
  };

  const handlePrevSection = () => {
    const sections = ['researchDetails', 'publications', 'team'];
    const currentIndex = sections.indexOf(activeSection);
    if (currentIndex > 0) {
      setActiveSection(sections[currentIndex - 1]);
    }
  };

  const validateForm = useCallback(() => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required.';
    if (!formData.description.trim() || formData.description === '<p><br></p>') newErrors.description = 'Description is required.';
    if (formData.publicationLink && !/^(ftp|http|https):\/\/[^ "\\]+$/.test(formData.publicationLink)) newErrors.publicationLink = 'Invalid URL.';
    if (formData.githubUrl && !/^(ftp|http|https):\/\/[^ "\\]+$/.test(formData.githubUrl)) newErrors.githubUrl = 'Invalid URL.';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error('Please correct the errors in the form.');
      return;
    }
    setSaving(true);

    try {
      let posterImageAsset;
      if (formData.posterImage) {
        setUploadingPosterImage(true);
        try {
          const imageFormData = new FormData();
          imageFormData.append('file', formData.posterImage);
          const response = await fetch('/api/upload-image', {
            method: 'POST',
            body: imageFormData,
          });
          if (!response.ok) {
            throw new Error('Failed to upload poster image');
          }
          const data = await response.json();
          posterImageAsset = { _id: data.assetId, url: data.assetUrl };
        } catch (error) {
          toast.error('Failed to upload poster image.');
          console.error(error);
        } finally {
          setUploadingPosterImage(false);
        }
      }

      const submissionData = {
        ...formData,
        posterImage: posterImageAsset ? { _type: 'image', asset: { _type: 'reference', _ref: posterImageAsset._id } } : null,
        authors: formData.authors.map(author => ({
          _key: author.profileId || `new-${author.name}`,
          profileRef: author.profileId ? { _type: 'reference', _ref: author.profileId } : undefined,
          // Handle new authors if necessary
        })),
        mentors: formData.mentors.map(mentor => ({
          _key: mentor.profileId || `new-${mentor.name}`,
          profileRef: mentor.profileId ? { _type: 'reference', _ref: mentor.profileId } : undefined,
          // Handle new mentors if necessary
        })),
      };

      const apiUrl = slug ? `/api/research/${slug}` : '/api/research/new';
      const httpMethod = slug ? 'PUT' : 'POST';

      const response = await fetch(apiUrl, {
        method: httpMethod,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submissionData),
      });

      if (!response.ok) throw new Error(`Failed to ${slug ? 'update' : 'create'} research project`);

      toast.success(`Research project ${slug ? 'updated' : 'submitted for approval'} successfully!`);
      localStorage.removeItem('new-research-draft');
      router.push('/research');
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
      <h1 className="text-3xl font-bold mb-6">Submit a New Research Project</h1>
      <div className="max-w-4xl mx-auto">
        <Stepper steps={steps} activeSection={activeSection} completedSections={completedSections} />
        <div className="mt-8">
          <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl mx-auto">
            {activeSection === 'researchDetails' && (
              <ResearchDetailsSection
                formData={formData}
                dispatch={dispatch}
                errors={errors}
              />
            )}

            {activeSection === 'publications' && (
              <PublicationsAndLinksSection
                formData={formData}
                dispatch={dispatch}
                errors={errors}
                posterImagePreview={previews.posterImage}
                handleImageChange={handleImageChange}
                clearImage={clearImage}
                uploadingPosterImage={uploadingPosterImage}
              />
            )}

            {activeSection === 'team' && (
              <TeamSection
                formData={formData}
                dispatch={dispatch}
                errors={errors}
                handleLookupProfile={handleLookupProfile}
                addTeamMember={(memberType) => addTeamMember(memberType)}
                removeTeamMember={(memberType, index) => removeTeamMember(memberType, index)}
                handleTeamMemberChange={(memberType, index, field, value) => handleTeamMemberChange(memberType, index, field, value)}
              />
            )}

            <div className="flex justify-between mt-8">
              {activeSection !== 'researchDetails' && (
                <button type="button" onClick={handlePrevSection} className="bg-gray-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-gray-700 transition-colors">Previous</button>
              )}
              {activeSection !== 'team' ? (
                <button type="button" onClick={handleNextSection} className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors ml-auto">Next</button>
              ) : (
                <div className="ml-auto">
                  <button type="button" onClick={clearDraft} className="bg-red-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors mr-4">Clear Draft</button>
                  <button type="submit" disabled={saving || uploadingPosterImage} className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400">
                    {saving ? 'Submitting...' : 'Submit for Approval'}
                  </button>
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}