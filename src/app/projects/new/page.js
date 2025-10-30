'use client';

import { useReducer, useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { client, clientWriteClient } from '../../../../sanity/lib/client';
import { toast } from 'react-hot-toast';
import { FaProjectDiagram, FaArrowLeft, FaArrowRight, FaTrash, FaCheckCircle, FaSpinner } from 'react-icons/fa';
import { portableTextToHtml } from '../../../utils/portableTextToHtml';

// Import custom hooks
import useTechnologies from '@/hooks/useTechnologies';
import useTeamManagement from '@/hooks/useTeamManagement';
import useImageUpload from '@/hooks/useImageUpload';

// Import child components
import ProjectDetailsSection from '@/components/ProjectDetailsSection';
import MediaSection from '@/components/MediaSection';
import TeamContributorsSection from '@/components/TeamContributorsSection';
import ProjectLinksSection from '@/components/ProjectLinksSection';
import Stepper from '@/components/ui/Stepper';

const steps = [
  { id: 'projectDetails', name: 'Project Details' },
  { id: 'media', name: 'Media' },
  { id: 'teamContributors', name: 'Team & Contributors' },
  { id: 'links', name: 'Links' },
];

// Initial state for the form reducer
const initialFormData = {
  title: '',
  description: '',
  tags: [],
  technologies: [],
  githubUrl: '',
  liveUrl: '',
  mainImage: null,
  cardImage: null,
  projectType: 'team', // 'solo' or 'team'
  status: 'in-progress', // Added default status
  soloContributor: { profileId: '', role: '' },
  teamMembers: [],
  galleryImages: [], // Added for project gallery
};

// Reducer function for form state management
function formReducer(state, action) {
  switch (action.type) {
    case 'UPDATE_FIELD':
      return { ...state, [action.field]: action.value };
    case 'UPDATE_SOLO_CONTRIBUTOR':
      return { ...state, soloContributor: { ...state.soloContributor, ...action.payload } };
    case 'ADD_TEAM_MEMBER':
      return { ...state, teamMembers: [...state.teamMembers, action.payload] };
    case 'UPDATE_TEAM_MEMBER':
      return {
        ...state,
        teamMembers: state.teamMembers.map((member, index) =>
          index === action.index ? { ...member, ...action.payload } : member
        ),
      };
    case 'REMOVE_TEAM_MEMBER':
      return { ...state, teamMembers: state.teamMembers.filter((_, index) => index !== action.index) };
    case 'ADD_TAG':
      return { ...state, tags: [...state.tags, action.tag] };
    case 'REMOVE_TAG':
      return { ...state, tags: state.tags.filter(tag => tag !== action.tag) };
    case 'TOGGLE_TECHNOLOGY':
      return {
        ...state,
        technologies: state.technologies.includes(action.techId)
          ? state.technologies.filter(id => id !== action.techId)
          : [...state.technologies, action.techId],
      };
    case 'ADD_GALLERY_IMAGES':
      return { ...state, galleryImages: [...state.galleryImages, ...action.payload] };
    case 'REMOVE_GALLERY_IMAGE':
      return { ...state, galleryImages: state.galleryImages.filter((_, index) => index !== action.index) };
    case 'SET_FORM_DATA': // For resetting or pre-filling form
      return { ...state, ...action.payload };
    default:
      return state;
  }
}
export default function NewProjectPage({ slug }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [formData, dispatch] = useReducer(formReducer, initialFormData);
  const [errors, setErrors] = useState({});
  const [validatedFields, setValidatedFields] = useState({});
  const [completedSections, setCompletedSections] = useState({});
  const [activeSection, setActiveSection] = useState('projectDetails');
  const [saving, setSaving] = useState(false);
  const [uploadingMainImage, setUploadingMainImage] = useState(false);
  const [uploadingCardImage, setUploadingCardImage] = useState(false);


  // Custom hooks
  const {
    allTechnologies,
    filteredTechnologies,
    technologySearchQuery,
    showAddTechnologyForm,
    newTechnologyName,
    newTechnologyLogoPreview,
    savingNewTechnology,
    showTechnologyList,
    setShowTechnologyList,
    setShowAddTechnologyForm,
    handleTechnologySearch,
    handleNewTechnologyNameChange,
    handleNewTechnologyLogoChange,
    clearNewTechnologyLogo,
    handleAddTechnology,
  } = useTechnologies(formData.technologies);

  const {
    handleLookupProfile,
    addTeamMember,
    removeTeamMember,
    handleSoloContributorChange,
    handleTeamMemberChange,
  } = useTeamManagement(dispatch);

    

      

    

        const { previews, handleImageChange, clearImage } = useImageUpload({

    

          mainImage: { updateAction: 'UPDATE_FIELD', initialValue: formData.mainImage },

    

          cardImage: { updateAction: 'UPDATE_FIELD', initialValue: formData.cardImage },

    

          galleryImages: { updateAction: 'ADD_GALLERY_IMAGES', initialValue: formData.galleryImages, multiple: true },

    

        }, dispatch);

    

      

    

      useEffect(() => {
        if (slug) {
          // Fetch existing project data
          client.fetch(`*[_type in ["project", "projectSubmission"] && slug.current == $slug][0]{
            title,
            description,
            tags,
            technologies[]->{_id},
            githubUrl,
            liveUrl,
            mainImage { asset->{url} },
            cardImage { asset->{url} },
            projectType,
            status,
            soloContributor { profileRef->{_id, uniqueProfileId, name, linkedinUrl, githubUrl, portfolioUrl, userImage{asset->{url}}}, projectRole },
            teamMembers[] { _key, profileRef->{_id, uniqueProfileId, name, linkedinUrl, githubUrl, portfolioUrl, userImage{asset->{url}}}, projectRole, isTeamLead },
            galleryImages[] { asset->{url} },
          }`, { slug }).then(data => {
            if (data) {
              const formattedData = {
                ...data,
                description: portableTextToHtml(data.description),
                technologies: data.technologies ? data.technologies.map(tech => tech._id) : [],
                mainImage: data.mainImage?.asset?.url || null,
                cardImage: data.cardImage?.asset?.url || null,
                galleryImages: data.galleryImages ? data.galleryImages.map(img => img.asset.url) : [],
                soloContributor: data.soloContributor ? {
                  profileId: data.soloContributor.profileRef?.uniqueProfileId || '',
                  name: data.soloContributor.profileRef?.name || '',
                  email: data.soloContributor.profileRef?.email || '',
                  linkedinUrl: data.soloContributor.profileRef?.linkedinUrl || '',
                  githubUrl: data.soloContributor.profileRef?.githubUrl || '',
                  portfolioUrl: data.soloContributor.profileRef?.portfolioUrl || '',
                  userImage: data.soloContributor.profileRef?.userImage || null,
                  role: data.soloContributor.projectRole,
                } : { profileId: '', role: '' },
                teamMembers: data.teamMembers ? data.teamMembers.map(member => ({
                  profileId: member.profileRef?.uniqueProfileId || '',
                  name: member.profileRef?.name || '',
                  email: member.profileRef?.email || '',
                  linkedinUrl: member.profileRef?.linkedinUrl || '',
                  githubUrl: member.profileRef?.githubUrl || '',
                  portfolioUrl: member.profileRef?.portfolioUrl || '',
                  userImage: member.profileRef?.userImage || null,
                  role: member.projectRole,
                  isTeamLead: member.isTeamLead,
                })) : [],
              };
              dispatch({ type: 'SET_FORM_DATA', payload: formattedData });
            } else {
              toast.error('Project not found.');
              router.push('/projects/new'); // Redirect to new if not found
            }
          }).catch(error => {
            console.error('Error fetching project for edit:', error);
            toast.error('Failed to load project for editing.');
          });
        }
      }, [slug, dispatch, router]);

      useEffect(() => {

        const draft = JSON.parse(localStorage.getItem('new-project-draft'));

        if (draft) {

          dispatch({ type: 'SET_FORM_DATA', payload: draft });

        }

      }, []);

    

      useEffect(() => {
        const serializableFormData = {};
        for (const key in formData) {
          if (formData.hasOwnProperty(key)) {
            const value = formData[key];
            if (key === 'mainImage' || key === 'cardImage') {
              serializableFormData[key] = value && !(value instanceof File) ? value : null;
            } else if (key === 'galleryImages') {
              serializableFormData[key] = Array.isArray(value)
                ? value.filter(item => !(item instanceof File))
                : [];
            } else if (key === 'soloContributor') {
              // Only store serializable parts of soloContributor
              serializableFormData[key] = {
                profileId: value.profileId || '',
                role: value.role || '',
              };
            } else if (key === 'teamMembers') {
              // Only store serializable parts of teamMembers
              serializableFormData[key] = Array.isArray(value)
                ? value.map(member => ({
                    profileId: member.profileId || '',
                    role: member.role || '',
                    isTeamLead: member.isTeamLead || false,
                  }))
                : [];
            } else if (typeof value !== 'function' && typeof value !== 'object' || value === null) {
              // Copy primitive types and nulls directly
              serializableFormData[key] = value;
            } else if (Array.isArray(value)) {
              // Copy arrays of primitive types
              serializableFormData[key] = value.filter(item => typeof item !== 'object' || item === null);
            } else if (typeof value === 'object' && value !== null) {
              // For other objects, attempt a shallow copy if they don't contain File objects
              // This is a fallback and might still need refinement for deeply nested non-serializable objects
              try {
                serializableFormData[key] = JSON.parse(JSON.stringify(value));
              } catch (e) {
                serializableFormData[key] = null; // Fallback for non-serializable objects
              }
            }
          }
        }
        localStorage.setItem('new-project-draft', JSON.stringify(serializableFormData));
      }, [formData]);

    

      const clearDraft = () => {

        localStorage.removeItem('new-project-draft');

        dispatch({ type: 'SET_FORM_DATA', payload: initialFormData });

        toast.success('Draft cleared!');

      };

    

      const handleNextSection = () => {

        const sections = ['projectDetails', 'media', 'teamContributors', 'links'];

        const currentIndex = sections.indexOf(activeSection);

        if (currentIndex < sections.length - 1) {

          setCompletedSections(prev => ({ ...prev, [activeSection]: true }));

          setActiveSection(sections[currentIndex + 1]);

        }

      };

    

      const handlePrevSection = () => {

        const sections = ['projectDetails', 'media', 'teamContributors', 'links'];

        const currentIndex = sections.indexOf(activeSection);

        if (currentIndex > 0) {

          setActiveSection(sections[currentIndex - 1]);

        }

      };

    

      const validateForm = useCallback(() => {

        const newErrors = {};

        const newValidatedFields = {};

    

        if (formData.title.trim()) {

          newValidatedFields.title = true;

        } else {

          newErrors.title = 'Title is required.';

        }

    

        if (formData.description && formData.description.trim() !== '<p><br></p>') {

          newValidatedFields.description = true;

        } else {

          newErrors.description = 'Description is required.';

        }

    

        if (formData.githubUrl && !/^(ftp|http|https):\/\/[^ "\\]+$/.test(formData.githubUrl)) {

          newErrors.githubUrl = 'Invalid GitHub URL.';

        } else if (formData.githubUrl) {

          newValidatedFields.githubUrl = true;

        }

    

        if (formData.liveUrl && !/^(ftp|http|https):\/\/[^ "\\]+$/.test(formData.liveUrl)) {

          newErrors.liveUrl = 'Invalid Live URL.';

        } else if (formData.liveUrl) {

          newValidatedFields.liveUrl = true;

        }

    

        const allProfileIds = [];

        if (formData.projectType === 'team') {

          formData.teamMembers.forEach(member => {

            if (member.uniqueProfileId) {

              allProfileIds.push(member.uniqueProfileId);

            }

          });

        } else { // solo

          if (formData.soloContributor.profileId) {

            allProfileIds.push(formData.soloContributor.profileId);

          }

        }

    

        const uniqueProfileIds = new Set(allProfileIds);

        if (allProfileIds.length !== uniqueProfileIds.size) {

          newErrors.team = 'Each profile can only be added to the project once.';

        } else if (allProfileIds.length > 0) {

          newValidatedFields.teamContributors = true;

        }

    

        setErrors(newErrors);

        setValidatedFields(newValidatedFields);

    

        return Object.keys(newErrors).length === 0;

      }, [formData]);

    

      useEffect(() => {

        validateForm();

      }, [formData, validateForm]);

    

      const handleSubmit = async (e) => {

        e.preventDefault();

        if (!validateForm()) {

          toast.error('Please correct the errors in the form.');

          return;

        }

        setSaving(true);

    

        try {

          let mainImageAsset, cardImageAsset;

          if (formData.mainImage) {
            setUploadingMainImage(true);
            try {
              const imageFormData = new FormData();
              imageFormData.append('file', formData.mainImage);
              const response = await fetch('/api/upload-image', {
                method: 'POST',
                body: imageFormData,
              });
              if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to upload main image');
              }
              const data = await response.json();
              mainImageAsset = { _id: data.assetId, url: data.assetUrl };
            } catch (error) {
              toast.error('Failed to upload main image.');
              console.error(error);
            } finally {
              setUploadingMainImage(false);
            }
          }

          if (formData.cardImage) {
            setUploadingCardImage(true);
            try {
              const imageFormData = new FormData();
              imageFormData.append('file', formData.cardImage);
              const response = await fetch('/api/upload-image', {
                method: 'POST',
                body: imageFormData,
              });
              if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to upload card image');
              }
              const data = await response.json();
              cardImageAsset = { _id: data.assetId, url: data.assetUrl };
            } catch (error) {
              toast.error('Failed to upload card image.');
              console.error(error);
            } finally {
              setUploadingCardImage(false);
            }
          }

          const galleryImageAssets = [];
          if (formData.galleryImages && formData.galleryImages.length > 0) {
            for (const [index, imageFile] of formData.galleryImages.entries()) {
              try {
                const imageFormData = new FormData();
                imageFormData.append('file', imageFile);
                const response = await fetch('/api/upload-image', {
                  method: 'POST',
                  body: imageFormData,
                });
                if (!response.ok) {
                  const errorData = await response.json();
                  throw new Error(errorData.error || `Failed to upload gallery image ${index + 1}`);
                }
                const data = await response.json();
                galleryImageAssets.push({ _type: 'image', _key: `gallery-${data.assetId}-${index}`, asset: { _type: 'reference', _ref: data.assetId } });
              } catch (error) {
                toast.error(`Failed to upload gallery image ${index + 1}.`);
                console.error(error);
              }
            }
          }

    

          const submissionData = {

            ...formData,

            mainImage: mainImageAsset ? { _type: 'image', asset: { _type: 'reference', _ref: mainImageAsset._id } } : null,

            cardImage: cardImageAsset ? { _type: 'image', asset: { _type: 'reference', _ref: cardImageAsset._id } } : null,

            galleryImages: galleryImageAssets,

            soloContributor: formData.projectType === 'solo' ? {

              profileRef: { _type: 'reference', _ref: formData.soloContributor.profileId },

              projectRole: formData.soloContributor.role,

            } : undefined,

            teamMembers: formData.projectType === 'team' ? formData.teamMembers.map(member => ({

              _key: member.profileId, // Use profileId as key, assuming it's unique

              profileRef: { _type: 'reference', _ref: member.profileId },

              projectRole: member.role,

              isTeamLead: member.isTeamLead,

            })) : [],

          };

    

          console.log('Submission Data:', submissionData);

    

          const apiUrl = slug ? `/api/projects/${slug}` : '/api/projects/new';
          const httpMethod = slug ? 'PUT' : 'POST';

          const response = await fetch(apiUrl, {

            method: httpMethod,

            headers: { 'Content-Type': 'application/json' },

            body: JSON.stringify(submissionData),

          });

    

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `Failed to ${slug ? 'update' : 'create'} project`);
          }

    

          toast.success(`Project ${slug ? 'updated' : 'submitted for approval'} successfully!`);

          localStorage.removeItem('new-project-draft');

          router.push('/projects');

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

          <h1 className="text-3xl font-bold mb-6 flex items-center gap-2"><FaProjectDiagram /> Submit a New Project</h1>

          <div className="max-w-4xl mx-auto">

            <Stepper steps={steps} activeSection={activeSection} completedSections={completedSections} />

            <div className="mt-8">

              <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl mx-auto">

                {activeSection === 'projectDetails' && (

                  <ProjectDetailsSection

                    formData={formData}

                    dispatch={dispatch}

                    errors={errors}

                    validatedFields={validatedFields}

                    allTechnologies={allTechnologies}

                    filteredTechnologies={filteredTechnologies}

                    technologySearchQuery={technologySearchQuery}

                    showAddTechnologyForm={showAddTechnologyForm}

                    newTechnologyName={newTechnologyName}

                    newTechnologyLogoPreview={newTechnologyLogoPreview}

                    savingNewTechnology={savingNewTechnology}

                    showTechnologyList={showTechnologyList}

                    setShowTechnologyList={setShowTechnologyList}

                    setShowAddTechnologyForm={setShowAddTechnologyForm}

                    handleTechnologySearch={handleTechnologySearch}

                    handleNewTechnologyNameChange={handleNewTechnologyNameChange}

                    handleNewTechnologyLogoChange={handleNewTechnologyLogoChange}

                    clearNewTechnologyLogo={clearNewTechnologyLogo}

                    handleAddTechnology={handleAddTechnology}

                  />

                )}

    

                {activeSection === 'media' && (

                  <MediaSection

                    formData={formData}

                    dispatch={dispatch}

                    errors={errors}

                    validatedFields={validatedFields}

                    mainImagePreview={previews.mainImage}

                    cardImagePreview={previews.cardImage}

                    galleryImagesPreview={previews.galleryImages}

                    handleImageChange={handleImageChange}

                    clearImage={clearImage}

                    uploadingMainImage={uploadingMainImage}

                    uploadingCardImage={uploadingCardImage}

                  />

                )}

    

                {activeSection === 'teamContributors' && (

                  <TeamContributorsSection

                    formData={formData}

                    dispatch={dispatch}

                    errors={errors}

                    validatedFields={validatedFields}

                    handleLookupProfile={handleLookupProfile}

                    addTeamMember={addTeamMember}

                    removeTeamMember={removeTeamMember}

                    handleSoloContributorChange={handleSoloContributorChange}

                    handleTeamMemberChange={handleTeamMemberChange}

                  />

                )}

    

                {activeSection === 'links' && (

                  <ProjectLinksSection

                    formData={formData}

                    dispatch={dispatch}

                    errors={errors}

                    validatedFields={validatedFields}

                  />

                )}

    

                <div className="flex justify-between mt-8">

                  {activeSection !== 'projectDetails' && (

                    <button type="button" onClick={handlePrevSection} className="flex items-center gap-2 bg-gray-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-gray-700 transition-colors"><FaArrowLeft /> Previous</button>

                  )}

                  {activeSection !== 'links' ? (

                    <button type="button" onClick={handleNextSection} className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors ml-auto">Next <FaArrowRight /></button>

                  ) : (

                    <div className="text-right">

                      <button type="button" onClick={clearDraft} className="flex items-center gap-2 bg-red-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors mr-4"><FaTrash /> Clear Draft</button>

                      <button type="submit" disabled={saving || uploadingMainImage || uploadingCardImage} className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400">

                        {saving ? <><FaSpinner className="animate-spin" /> Submitting...</> : <><FaCheckCircle /> Submit for Approval</>}

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

    