'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { client } from '../../../../sanity/lib/client';
import dynamic from 'next/dynamic';
import { toast } from 'react-hot-toast';
import 'react-quill-new/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

export default function NewProjectPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    tags: [],
    technologies: [],
    githubUrl: '',
    liveUrl: '',
    mainImage: null,
    cardImage: null,
    projectType: 'team', // 'solo' or 'team'
    soloContributor: { profileId: '', role: '' },
    teamMembers: [],
  });
  const [errors, setErrors] = useState({});
  const [mainImagePreview, setMainImagePreview] = useState(null);
  const [cardImagePreview, setCardImagePreview] = useState(null);
  const [activeSection, setActiveSection] = useState('projectDetails');
  const [allTechnologies, setAllTechnologies] = useState([]);
  const [filteredTechnologies, setFilteredTechnologies] = useState([]);
  const [technologySearchQuery, setTechnologySearchQuery] = useState('');
  const [showAddTechnologyForm, setShowAddTechnologyForm] = useState(false);
  const [newTechnologyName, setNewTechnologyName] = useState('');
  const [newTechnologyLogo, setNewTechnologyLogo] = useState(null);
  const [newTechnologyLogoPreview, setNewTechnologyLogoPreview] = useState(null);
  const [showTechnologyList, setShowTechnologyList] = useState(false);
  const [currentTagInput, setCurrentTagInput] = useState('');
  const [uploadingMainImage, setUploadingMainImage] = useState(false);
  const [uploadingCardImage, setUploadingCardImage] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    client.fetch(`*[_type == "technology"]{_id, name, "logoUrl": logo.asset->url}`).then(techs => {
      setAllTechnologies(techs);
      setFilteredTechnologies(techs);
    });
  }, []);

  useEffect(() => {
    setFilteredTechnologies(
      allTechnologies.filter(tech =>
        tech.name.toLowerCase().includes(technologySearchQuery.toLowerCase())
      )
    );
  }, [technologySearchQuery, allTechnologies]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required.';
    if (!formData.description.trim()) newErrors.description = 'Description is required.';
    if (formData.githubUrl && !/^(ftp|http|https):\/\/[^ "]+$/.test(formData.githubUrl)) {
      newErrors.githubUrl = 'Invalid GitHub URL.';
    }
    if (formData.liveUrl && !/^(ftp|http|https):\/\/[^ "]+$/.test(formData.liveUrl)) {
      newErrors.liveUrl = 'Invalid Live URL.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      const file = files[0];
      setFormData(prev => ({ ...prev, [name]: file }));
      if (name === 'mainImage') setMainImagePreview(URL.createObjectURL(file));
      else if (name === 'cardImage') setCardImagePreview(URL.createObjectURL(file));
      else if (name === 'newTechnologyLogo') {
        setNewTechnologyLogo(file);
        setNewTechnologyLogoPreview(URL.createObjectURL(file));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleLookupProfile = async (uniqueProfileId, memberIndex = null) => {
    if (!uniqueProfileId) {
      toast.error('Please enter a Profile ID to look up.');
      return;
    }
    try {
      const response = await fetch('/api/profile/lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uniqueProfileId }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Profile not found');
      }
      const profile = await response.json();
      if (formData.projectType === 'solo') {
        setFormData(prev => ({ ...prev, soloContributor: { ...prev.soloContributor, ...profile, profileId: profile._id } }));
      } else if (memberIndex !== null) {
        const updatedMembers = [...formData.teamMembers];
        updatedMembers[memberIndex] = { ...updatedMembers[memberIndex], ...profile, profileId: profile._id };
        setFormData(prev => ({ ...prev, teamMembers: updatedMembers }));
      }
      toast.success(`Found profile: ${profile.name}`);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleTeamMemberChange = (index, field, value) => {
    const updatedMembers = [...formData.teamMembers];
    updatedMembers[index][field] = value;
    setFormData(prev => ({ ...prev, teamMembers: updatedMembers }));
  };

  const addTeamMember = () => {
    setFormData(prev => ({ ...prev, teamMembers: [...prev.teamMembers, { uniqueProfileId: '', role: '', isTeamLead: false }] }));
  };

  const removeTeamMember = (index) => {
    const updatedMembers = formData.teamMembers.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, teamMembers: updatedMembers }));
  };



  const handleTagInputChange = (e) => setCurrentTagInput(e.target.value);

  const handleAddTag = (e) => {
    if (e.key === ' ' || e.key === ',' || e.key === 'Enter') {
      e.preventDefault();
      const newTag = currentTagInput.trim().toLowerCase();
      if (newTag && !formData.tags.includes(newTag)) {
        setFormData(prev => ({ ...prev, tags: [...prev.tags, newTag] }));
      }
      setCurrentTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({ ...prev, tags: prev.tags.filter(tag => tag !== tagToRemove) }));
  };

  const handleClearImage = (imageType) => {
    setFormData(prev => ({ ...prev, [imageType]: null }));
    if (imageType === 'mainImage') setMainImagePreview(null);
    if (imageType === 'cardImage') setCardImagePreview(null);
    if (imageType === 'newTechnologyLogo') {
      setNewTechnologyLogo(null);
      setNewTechnologyLogoPreview(null);
    }
    document.getElementById(imageType).value = '';
  };

  const handleTechnologyChange = (techId) => {
    setFormData(prev => ({
      ...prev,
      technologies: prev.technologies.includes(techId)
        ? prev.technologies.filter(id => id !== techId)
        : [...prev.technologies, techId],
    }));
  };

  const handleAddTechnology = async () => {
    if (!newTechnologyName.trim()) {
      toast.error('Technology name is required.');
      return;
    }
    setSaving(true);
    try {
      let logoAsset = null;
      if (newTechnologyLogo) {
        logoAsset = await client.assets.upload('image', newTechnologyLogo);
      }
      const newTech = {
        _type: 'technology',
        name: newTechnologyName.trim(),
        logo: logoAsset ? { _type: 'image', asset: { _type: 'reference', _ref: logoAsset._id } } : undefined,
      };
      const createdTech = await client.create(newTech);
      toast.success(`Technology '${createdTech.name}' added!`);
      setAllTechnologies(prev => [...prev, createdTech]);
      setFormData(prev => ({ ...prev, technologies: [...prev.technologies, createdTech._id] }));
      setNewTechnologyName('');
      setNewTechnologyLogo(null);
      setNewTechnologyLogoPreview(null);
      setShowAddTechnologyForm(false);
    } catch (error) {
      console.error('Failed to add new technology:', error);
      toast.error('Failed to add technology. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setSaving(true);

    try {
      let mainImageAsset, cardImageAsset;
      if (formData.mainImage) {
        setUploadingMainImage(true);
        mainImageAsset = await client.assets.upload('image', formData.mainImage).finally(() => setUploadingMainImage(false));
      }
      if (formData.cardImage) {
        setUploadingCardImage(true);
        cardImageAsset = await client.assets.upload('image', formData.cardImage).finally(() => setUploadingCardImage(false));
      }

      const submissionData = {
        ...formData,
        mainImage: mainImageAsset ? { _type: 'image', asset: { _type: 'reference', _ref: mainImageAsset._id } } : null,
        cardImage: cardImageAsset ? { _type: 'image', asset: { _type: 'reference', _ref: cardImageAsset._id } } : null,
        soloContributor: formData.projectType === 'solo' ? {
          profileRef: { _type: 'reference', _ref: formData.soloContributor.profileId },
          projectRole: formData.soloContributor.role,
        } : undefined,
        teamMembers: formData.projectType === 'team' ? formData.teamMembers.map(member => ({
          _key: member.uniqueProfileId, // Or generate a unique key
          profileRef: { _type: 'reference', _ref: member.profileId },
          projectRole: member.role,
          isTeamLead: member.isTeamLead,
        })) : [],
      };

      const response = await fetch('/api/projects/new', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submissionData),
      });

      if (!response.ok) throw new Error('Failed to create project');

      toast.success('Project submitted for approval!');
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
      <h1 className="text-3xl font-bold mb-6">Submit a New Project</h1>
      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="lg:w-1/4 bg-white p-6 rounded-lg shadow-md sticky top-24 self-start">
          <h2 className="text-xl font-bold mb-4">Form Sections</h2>
          <nav>
            <ul className="space-y-2">
              <li><button type="button" onClick={() => setActiveSection('projectDetails')} className={`w-full text-left px-4 py-2 rounded-md transition-colors ${activeSection === 'projectDetails' ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'}`}>Project Details</button></li>
              <li><button type="button" onClick={() => setActiveSection('media')} className={`w-full text-left px-4 py-2 rounded-md transition-colors ${activeSection === 'media' ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'}`}>Media</button></li>
              <li><button type="button" onClick={() => setActiveSection('teamContributors')} className={`w-full text-left px-4 py-2 rounded-md transition-colors ${activeSection === 'teamContributors' ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'}`}>Team & Contributors</button></li>
              <li><button type="button" onClick={() => setActiveSection('links')} className={`w-full text-left px-4 py-2 rounded-md transition-colors ${activeSection === 'links' ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'}`}>Links</button></li>
            </ul>
          </nav>
        </aside>

        <div className="lg:w-3/4">
          <form onSubmit={handleSubmit} className="space-y-8">
            {activeSection === 'projectDetails' && (
              <section id="projectDetails" className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Project Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-1">
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                    <input
                      type="text"
                      name="title"
                      id="title"
                      value={formData.title}
                      onChange={handleChange}
                      className={`mt-1 block w-full px-3 py-2 border ${errors.title ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                      required
                    />
                    {errors.title && <p className="mt-2 text-sm text-red-600">{errors.title}</p>}
                  </div>
                  <div className="md:col-span-1">
                    <label htmlFor="tags" className="block text-sm font-medium text-gray-700">Tags</label>
                    <div className="mt-1 flex flex-wrap items-center gap-2 p-2 border border-gray-300 rounded-md shadow-sm focus-within:ring-blue-500 focus-within:border-blue-500">
                      {formData.tags.map((tag, index) => (
                        <span key={index} className="flex items-center bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                          {tag}
                          <button
                            type="button"
                            onClick={() => handleRemoveTag(tag)}
                            className="ml-1 text-blue-800 hover:text-blue-900 focus:outline-none"
                          >
                            &times;
                          </button>
                        </span>
                      ))}
                      <input
                        type="text"
                        id="tags"
                        value={currentTagInput}
                        onChange={handleTagInputChange}
                        onKeyDown={handleAddTag}
                        placeholder="Add tags (space, comma, or enter to add)"
                        className="flex-grow border-none focus:ring-0 focus:outline-none p-0"
                      />
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                    <ReactQuill
                      theme="snow"
                      value={formData.description}
                      onChange={(value) => {
                        setFormData(prev => ({ ...prev, description: value }));
                        setErrors(prev => ({ ...prev, description: '' }));
                      }}
                      className={`mt-1 block w-full ${errors.description ? 'border border-red-500 rounded-md' : ''}`}
                      modules={{
                        toolbar: [
                          [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
                          [{ size: [] }],
                          ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                          [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
                          ['link', 'image', 'video'],
                          ['clean']
                        ],
                      }}
                      formats={[
                        'header', 'font', 'size',
                        'bold', 'italic', 'underline', 'strike', 'blockquote',
                        'list', 'indent',
                        'link', 'image', 'video'
                      ]}
                    />
                    {errors.description && <p className="mt-2 text-sm text-red-600">{errors.description}</p>}
                  </div>
                  <div className="md:col-span-2">
                    <label htmlFor="technologies" className="block text-sm font-medium text-gray-700">Technologies</label>
                    <input
                      type="text"
                      placeholder="Search or add technologies..."
                      value={technologySearchQuery}
                      onChange={(e) => setTechnologySearchQuery(e.target.value)}
                      onFocus={() => setShowTechnologyList(true)}
                      onBlur={() => setTimeout(() => setShowTechnologyList(false), 100)}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                    {showTechnologyList && (
                      <div className="mt-2 max-h-48 overflow-y-auto border border-gray-200 rounded-md p-2 bg-white z-10 relative">
                        {filteredTechnologies.length > 0 ? (
                          filteredTechnologies.map(tech => (
                            <div key={tech._id} className="flex items-center mb-1">
                              <input
                                type="checkbox"
                                id={`tech-${tech._id}`}
                                checked={formData.technologies.includes(tech._id)}
                                onChange={() => handleTechnologyChange(tech._id)}
                                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                              />
                              <label htmlFor={`tech-${tech._id}`} className="ml-2 text-sm text-gray-700 flex items-center">
                                {tech.logoUrl && <img src={tech.logoUrl} alt={tech.name} className="w-5 h-5 mr-2" />}
                                {tech.name}
                              </label>
                            </div>
                          ))
                        ) : (
                          <p className="text-sm text-gray-500">No technologies found matching your search.</p>
                        )}
                      </div>
                    )}
                    <button type="button" onClick={() => setShowAddTechnologyForm(true)} className="mt-2 text-blue-600 hover:underline text-sm">Technology not found? Add New</button>

                    {showAddTechnologyForm && (
                      <div className="mt-4 p-4 border border-blue-200 rounded-md bg-blue-50">
                        <h4 className="font-semibold text-blue-800 mb-2">Add New Technology</h4>
                        <div className="space-y-3">
                          <div>
                            <label htmlFor="newTechnologyName" className="block text-sm font-medium text-blue-700">Technology Name</label>
                            <input
                              type="text"
                              id="newTechnologyName"
                              value={newTechnologyName}
                              onChange={(e) => setNewTechnologyName(e.target.value)}
                              className="mt-1 block w-full px-3 py-2 border border-blue-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>
                          <div>
                            <label htmlFor="newTechnologyLogo" className="block text-sm font-medium text-blue-700">Technology Logo</label>
                            <input
                              type="file"
                              name="newTechnologyLogo"
                              id="newTechnologyLogo"
                              onChange={handleChange}
                              className="mt-1 block w-full"
                            />
                            {newTechnologyLogoPreview && (
                              <div className="mt-2 relative w-fit">
                                <img src={newTechnologyLogoPreview} alt="Logo Preview" className="max-w-[80px] h-auto rounded-md shadow" />
                                <button
                                  type="button"
                                  onClick={() => handleClearImage('newTechnologyLogo')}
                                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 text-xs leading-none flex items-center justify-center w-5 h-5 -mt-1 -mr-1 border border-white hover:bg-red-600"
                                  aria-label="Clear logo"
                                >
                                  &times;
                                </button>
                              </div>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={handleAddTechnology}
                            disabled={saving}
                            className="bg-blue-600 text-white px-4 py-2 rounded-md font-semibold text-sm hover:bg-blue-700 transition-colors disabled:bg-gray-400"
                          >
                            {saving ? 'Adding...' : 'Add Technology'}
                          </button>
                          <button
                            type="button"
                            onClick={() => setShowAddTechnologyForm(false)}
                            className="ml-2 bg-gray-300 text-gray-800 px-4 py-2 rounded-md font-semibold text-sm hover:bg-gray-400 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </section>
            )}

            {activeSection === 'media' && (
              <section id="media" className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Media</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="mainImage" className="block text-sm font-medium text-gray-700">Main Image {uploadingMainImage && <span className="text-blue-500 ml-2">Uploading...</span>}</label>
                    <input
                      type="file"
                      name="mainImage"
                      id="mainImage"
                      onChange={handleChange}
                      className="mt-1 block w-full"
                      disabled={uploadingMainImage}
                    />
                    {mainImagePreview && (
                      <div className="mt-4 relative w-fit">
                        <p className="text-sm text-gray-500 mb-2">Main Image Preview:</p>
                        <img src={mainImagePreview} alt="Main Image Preview" className="max-w-xs h-auto rounded-md shadow" />
                        <button
                          type="button"
                          onClick={() => handleClearImage('mainImage')}
                          className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 text-xs leading-none flex items-center justify-center w-6 h-6 -mt-2 -mr-2 border-2 border-white hover:bg-red-600"
                          aria-label="Clear main image"
                        >
                          &times;
                        </button>
                      </div>
                    )}
                  </div>
                  <div>
                    <label htmlFor="cardImage" className="block text-sm font-medium text-gray-700">Card Image {uploadingCardImage && <span className="text-blue-500 ml-2">Uploading...</span>}</label>
                    <input
                      type="file"
                      name="cardImage"
                      id="cardImage"
                      onChange={handleChange}
                      className="mt-1 block w-full"
                      disabled={uploadingCardImage}
                    />
                    {cardImagePreview && (
                      <div className="mt-4 relative w-fit">
                        <p className="text-sm text-gray-500 mb-2">Card Image Preview:</p>
                        <img src={cardImagePreview} alt="Card Image Preview" className="max-w-xs h-auto rounded-md shadow" />
                        <button
                          type="button"
                          onClick={() => handleClearImage('cardImage')}
                          className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 text-xs leading-none flex items-center justify-center w-6 h-6 -mt-2 -mr-2 border-2 border-white hover:bg-red-600"
                          aria-label="Clear card image"
                        >
                          &times;
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </section>
            )}

            {activeSection === 'teamContributors' && (
              <section id="teamContributors" className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Team & Contributors</h2>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Project Type</label>
                  <div className="mt-2 flex gap-4">
                    <label><input type="radio" name="projectType" value="team" checked={formData.projectType === 'team'} onChange={handleChange} className="mr-2" />Team Project</label>
                    <label><input type="radio" name="projectType" value="solo" checked={formData.projectType === 'solo'} onChange={handleChange} className="mr-2" />Solo Project</label>
                  </div>
                </div>

                {formData.projectType === 'solo' ? (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Solo Contributor</h3>
                    <div className="flex items-end gap-2">
                      <input
                        type="text"
                        placeholder="Contributor Profile ID"
                        value={formData.soloContributor.uniqueProfileId || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, soloContributor: { ...prev.soloContributor, uniqueProfileId: e.target.value } }))}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                      />
                      <button type="button" onClick={() => handleLookupProfile(formData.soloContributor.uniqueProfileId)} className="bg-blue-500 text-white px-4 py-2 rounded-md">Lookup</button>
                    </div>
                    {formData.soloContributor.name && (
                      <div className="mt-2 p-2 border rounded-md bg-gray-50">
                        <p><strong>Name:</strong> {formData.soloContributor.name}</p>
                        <input
                          type="text"
                          placeholder="Role in Project"
                          value={formData.soloContributor.role}
                          onChange={(e) => setFormData(prev => ({ ...prev, soloContributor: { ...prev.soloContributor, role: e.target.value } }))}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                        />
                      </div>
                    )}
                  </div>
                ) : (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Team Members</h3>
                    {formData.teamMembers.map((member, index) => (
                      <div key={index} className="mb-4 p-4 border rounded-md">
                        <div className="flex items-end gap-2">
                          <input
                            type="text"
                            placeholder="Member Profile ID"
                            value={member.uniqueProfileId}
                            onChange={(e) => handleTeamMemberChange(index, 'uniqueProfileId', e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                          />
                          <button type="button" onClick={() => handleLookupProfile(member.uniqueProfileId, index)} className="bg-blue-500 text-white px-4 py-2 rounded-md">Lookup</button>
                          <button type="button" onClick={() => removeTeamMember(index)} className="bg-red-500 text-white px-4 py-2 rounded-md">Remove</button>
                        </div>
                        {member.name && (
                          <div className="mt-2">
                            <p><strong>Name:</strong> {member.name}</p>
                            <input
                              type="text"
                              placeholder="Role in Project"
                              value={member.role}
                              onChange={(e) => handleTeamMemberChange(index, 'role', e.target.value)}
                              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                            />
                            <label className="mt-2 flex items-center">
                              <input
                                type="checkbox"
                                checked={member.isTeamLead}
                                onChange={(e) => handleTeamMemberChange(index, 'isTeamLead', e.target.checked)}
                                className="mr-2"
                              />
                              Team Lead
                            </label>
                          </div>
                        )}
                      </div>
                    ))}
                    <button type="button" onClick={addTeamMember} className="bg-green-500 text-white px-4 py-2 rounded-md">Add Team Member</button>
                  </div>
                )}


              </section>
            )}

            {activeSection === 'links' && (
              <section id="links" className="bg-white p-6 rounded-lg shadow-md">
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label htmlFor="githubUrl" className="block text-sm font-medium text-gray-700">GitHub URL</label>
                    <input
                      type="url"
                      name="githubUrl"
                      id="githubUrl"
                      value={formData.githubUrl}
                      onChange={handleChange}
                      className={`mt-1 block w-full px-3 py-2 border ${errors.githubUrl ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                    />
                    {errors.githubUrl && <p className="mt-2 text-sm text-red-600">{errors.githubUrl}</p>}
                  </div>
                  <div>
                    <label htmlFor="liveUrl" className="block text-sm font-medium text-gray-700">Live URL</label>
                    <input
                      type="url"
                      name="liveUrl"
                      id="liveUrl"
                      value={formData.liveUrl}
                      onChange={handleChange}
                      className={`mt-1 block w-full px-3 py-2 border ${errors.liveUrl ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                    />
                    {errors.liveUrl && <p className="mt-2 text-sm text-red-600">{errors.liveUrl}</p>}
                  </div>
                </div>
              </section>
            )}

            <div className="text-right">
              <button type="submit" disabled={saving} className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400">
                {saving ? 'Submitting...' : 'Submit for Approval'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
