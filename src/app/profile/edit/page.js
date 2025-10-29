'use client';

import { toast } from 'react-hot-toast';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { client } from '../../../../sanity/lib/client';
import { FaPlus, FaTrash, FaCamera, FaUser, FaTag, FaInfoCircle, FaGithub, FaLinkedin, FaLink, FaBuilding, FaGraduationCap, FaBriefcase, FaProjectDiagram } from 'react-icons/fa';
import Image from 'next/image';

export default function EditProfilePage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    
    const [allTechnologies, setAllTechnologies] = useState([]);
    
    const [formData, setFormData] = useState({
        userName: '',
        tagline: '',
        bio: '',
        linkedinUrl: '',
        githubUrl: '',
        portfolioUrl: '',
        education: [],
        workExperience: [],
        externalProjects: [],
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [imageAsset, setImageAsset] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const [isUploading, setIsUploading] = useState(false);

    useEffect(() => {
        if (status === 'authenticated') {
            const userEmail = session.user.email;
            
            client.fetch(`*[_type == "technology"]{_id, name} | order(name asc)`).then(techs => {
                setAllTechnologies(techs);
            });

            const query = `*[_type == "profile" && userEmail == $email] | order(_updatedAt desc)[0]{
                ...,
                "userImage": userImage.asset->{_id, url},
                "externalProjects": externalProjects[]{..., "technologies": technologies[]->._id}
            }`;
            
            client.fetch(query, { email: userEmail }).then(data => {
                if (data) {
                    setFormData({
                        userName: data.userName || session?.user?.name || '',
                        tagline: data.tagline || '',
                        bio: data.bio || '',
                        linkedinUrl: data.linkedinUrl || '',
                        githubUrl: data.githubUrl || '',
                        portfolioUrl: data.portfolioUrl || '',
                        education: data.education || [],
                        workExperience: data.workExperience || [],
                        externalProjects: data.externalProjects?.map(p => ({...p, technologies: p.technologies || []})) || [],
                    });
                    if (data.userImage?.url) {
                        setPreviewImage(data.userImage.url);
                    }
                } else {
                    setFormData(prev => ({ ...prev, userName: session?.user?.name || '' }));
                    if (session.user.image) {
                        setPreviewImage(session.user.image);
                    }
                }
                setLoading(false);
            });
        }
        if (status === 'unauthenticated') {
            router.push('/login');
        }
    }, [status, session, router]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    
    const handleImageUpload = async (e) => {
        const selectedFile = e.target.files[0];
        if (!selectedFile) return;

        setPreviewImage(URL.createObjectURL(selectedFile));
        setIsUploading(true);

        const formData = new FormData();
        formData.append('file', selectedFile);

        try {
            const response = await fetch('/api/upload-image', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Upload failed');
            }

            const document = await response.json();
            setImageAsset(document);
        } catch (error) {
            console.error('Image upload error:', error);
            toast.error('Image upload failed. Please try again.');
        } finally {
            setIsUploading(false);
        }
    };

    const handleArrayChange = (index, event, field) => {
        const { name, value } = event.target;
        const newArray = [...formData[field]];
        newArray[index][name] = value;
        setFormData(prev => ({ ...prev, [field]: newArray }));
    };

    const addArrayItem = (field) => {
        let newItem;
        if (field === 'education') newItem = { _key: `edu_${Date.now()}`, school: '', degree: '', startDate: '', endDate: '' };
        if (field === 'workExperience') newItem = { _key: `work_${Date.now()}`, company: '', title: '', startDate: '', endDate: '', description: '' };
        if (field === 'externalProjects') newItem = { _key: `proj_${Date.now()}`, title: '', description: '', projectUrl: '', technologies: [] };
        
        setFormData(prev => ({ ...prev, [field]: [...prev[field], newItem] }));
    };

    const removeArrayItem = (index, field) => {
        const newArray = formData[field].filter((_, i) => i !== index);
        setFormData(prev => ({ ...prev, [field]: newArray }));
    };

    const handleTechChange = (projectIndex, event) => {
        const selectedTechIds = Array.from(event.target.selectedOptions, option => option.value);
        const newProjects = [...formData.externalProjects];
        newProjects[projectIndex].technologies = selectedTechIds;
        setFormData(prev => ({ ...prev, externalProjects: newProjects }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            // Create a mutable copy of the form data
            const submissionData = {
                ...formData,
                externalProjects: formData.externalProjects.map(proj => ({
                    ...proj,
                    technologies: proj.technologies.map(techId => ({ _type: 'reference', _ref: techId }))
                }))
            };

            // === THE FIX IS HERE ===
            // Conditionally add the userImage to the submissionData object
            if (imageAsset?._id) {
                submissionData.userImage = {
                    _type: 'image',
                    asset: {
                        _type: 'reference',
                        _ref: imageAsset._id
                    }
                };
            }

            const response = await fetch('/api/profile', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(submissionData), // Send the corrected object
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("API Error Response:", errorData);
                throw new Error(errorData.message || 'Failed to update profile');
            }

            toast.success('Profile updated successfully!');
            router.push('/profile');
            router.refresh();
        } catch (error) {
            console.error(error);
            toast.error('Something went wrong. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading profile...</div>;
    }

    return (
        <main className="container mx-auto px-4 py-12 md:py-20 bg-white">
            <title>Edit Profile | Spark Community</title>
            <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl border border-gray-200 shadow-lg">
                <h1 className="text-3xl font-bold mb-6">Edit Your Profile</h1>
                
                <form onSubmit={handleSubmit} className="space-y-8">
                    
                    <div className="space-y-6">
                        <h2 className="text-xl font-semibold border-b pb-2">Basic Information</h2>

                        <div className="flex items-center gap-6">
                            <div className="relative">
                                <Image
                                    src={previewImage || '/default-avatar.png'}
                                    alt="Profile Preview"
                                    width={100}
                                    height={100}
                                    className="rounded-full object-cover border-4 border-white shadow-md"
                                />
                            </div>
                            <div>
                                <label htmlFor="profileImage" className="cursor-pointer bg-gradient-to-r from-blue-500 to-purple-600 text-white px-5 py-2.5 rounded-lg font-semibold text-sm shadow-md hover:from-blue-600 hover:to-purple-700 transition-all duration-300 ease-in-out flex items-center">
                                    <FaCamera className="inline-block mr-2" />
                                    {isUploading ? 'Uploading...' : 'Change Picture'}
                                </label>
                                <input
                                    type="file"
                                    id="profileImage"
                                    name="profileImage"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="hidden"
                                    disabled={isUploading}
                                />
                                <p className="text-xs text-gray-500 mt-2">PNG, JPG, GIF up to 5MB.</p>
                            </div>
                        </div>

                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FaUser className="text-gray-400" />
                            </div>
                            <input type="text" name="userName" id="userName" value={formData.userName} onChange={handleChange} className="mt-1 block w-full pl-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm" required />
                        </div>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FaTag className="text-gray-400" />
                            </div>
                            <input type="text" name="tagline" id="tagline" value={formData.tagline} onChange={handleChange} className="mt-1 block w-full pl-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm" placeholder="e.g., Aspiring Full-Stack Developer" />
                        </div>
                        <div className="relative">
                            <div className="absolute top-3 left-3 pointer-events-none">
                                <FaInfoCircle className="text-gray-400" />
                            </div>
                            <textarea name="bio" id="bio" rows="4" value={formData.bio} onChange={handleChange} className="mt-1 block w-full pl-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm"></textarea>
                        </div>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FaGithub className="text-gray-400" />
                            </div>
                            <input type="url" name="githubUrl" id="githubUrl" value={formData.githubUrl} onChange={handleChange} className="mt-1 block w-full pl-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm" placeholder="https://github.com/username" />
                        </div>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FaLinkedin className="text-gray-400" />
                            </div>
                            <input type="url" name="linkedinUrl" id="linkedinUrl" value={formData.linkedinUrl} onChange={handleChange} className="mt-1 block w-full pl-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm" placeholder="https://linkedin.com/in/username" />
                        </div>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FaLink className="text-gray-400" />
                            </div>
                            <input type="url" name="portfolioUrl" id="portfolioUrl" value={formData.portfolioUrl} onChange={handleChange} className="mt-1 block w-full pl-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm" placeholder="https://my-website.com" />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold border-b pb-3 flex items-center gap-3"><FaGraduationCap /> Education</h2>
                        {formData.education.map((edu, index) => (
                            <div key={edu._key || index} className="p-4 border rounded-lg space-y-4 relative bg-gray-50">
                                <button type="button" onClick={() => removeArrayItem(index, 'education')} className="absolute top-3 right-3 text-white bg-gradient-to-r from-red-500 to-orange-500 rounded-full p-2 hover:scale-110 transition-transform"><FaTrash /></button>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><FaBuilding className="text-gray-400" /></div>
                                    <input name="school" placeholder="School/University" value={edu.school} onChange={(e) => handleArrayChange(index, e, 'education')} className="w-full mt-1 block pl-10 px-3 py-2 border border-gray-300 rounded-md" />
                                </div>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><FaGraduationCap className="text-gray-400" /></div>
                                    <input name="degree" placeholder="Degree" value={edu.degree} onChange={(e) => handleArrayChange(index, e, 'education')} className="w-full mt-1 block pl-10 px-3 py-2 border border-gray-300 rounded-md" />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <input type="month" name="startDate" value={edu.startDate} onChange={(e) => handleArrayChange(index, e, 'education')} className="w-full mt-1 block px-3 py-2 border border-gray-300 rounded-md" />
                                    <input type="month" name="endDate" value={edu.endDate} onChange={(e) => handleArrayChange(index, e, 'education')} className="w-full mt-1 block px-3 py-2 border border-gray-300 rounded-md" />
                                </div>
                            </div>
                        ))}
                        <button type="button" onClick={() => addArrayItem('education')} className="flex items-center gap-2 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg px-4 py-2 hover:from-blue-600 hover:to-purple-700 transition-all duration-300 ease-in-out"><FaPlus /> Add Education</button>
                    </div>

                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold border-b pb-3 flex items-center gap-3"><FaBriefcase /> Work Experience</h2>
                        {formData.workExperience.map((work, index) => (
                             <div key={work._key || index} className="p-4 border rounded-lg space-y-4 relative bg-gray-50">
                                <button type="button" onClick={() => removeArrayItem(index, 'workExperience')} className="absolute top-3 right-3 text-white bg-gradient-to-r from-red-500 to-orange-500 rounded-full p-2 hover:scale-110 transition-transform"><FaTrash /></button>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><FaBuilding className="text-gray-400" /></div>
                                    <input name="company" placeholder="Company" value={work.company} onChange={(e) => handleArrayChange(index, e, 'workExperience')} className="w-full mt-1 block pl-10 px-3 py-2 border border-gray-300 rounded-md" />
                                </div>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><FaBriefcase className="text-gray-400" /></div>
                                    <input name="title" placeholder="Job Title" value={work.title} onChange={(e) => handleArrayChange(index, e, 'workExperience')} className="w-full mt-1 block pl-10 px-3 py-2 border border-gray-300 rounded-md" />
                                </div>
                                <textarea name="description" placeholder="Description of your role" value={work.description} onChange={(e) => handleArrayChange(index, e, 'workExperience')} className="w-full mt-1 block px-3 py-2 border border-gray-300 rounded-md" />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <input type="month" name="startDate" value={work.startDate} onChange={(e) => handleArrayChange(index, e, 'workExperience')} className="w-full mt-1 block px-3 py-2 border border-gray-300 rounded-md" />
                                    <input type="month" name="endDate" value={work.endDate} onChange={(e) => handleArrayChange(index, e, 'workExperience')} className="w-full mt-1 block px-3 py-2 border border-gray-300 rounded-md" />
                                </div>
                            </div>
                        ))}
                        <button type="button" onClick={() => addArrayItem('workExperience')} className="flex items-center gap-2 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg px-4 py-2 hover:from-blue-600 hover:to-purple-700 transition-all duration-300 ease-in-out"><FaPlus /> Add Work Experience</button>
                    </div>

                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold border-b pb-3 flex items-center gap-3"><FaProjectDiagram /> Personal Projects</h2>
                        {formData.externalProjects.map((proj, index) => (
                            <div key={proj._key || index} className="p-4 border rounded-lg space-y-4 relative bg-gray-50">
                                <button type="button" onClick={() => removeArrayItem(index, 'externalProjects')} className="absolute top-3 right-3 text-white bg-gradient-to-r from-red-500 to-orange-500 rounded-full p-2 hover:scale-110 transition-transform"><FaTrash /></button>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><FaProjectDiagram className="text-gray-400" /></div>
                                    <input name="title" placeholder="Project Title" value={proj.title} onChange={(e) => handleArrayChange(index, e, 'externalProjects')} className="w-full mt-1 block pl-10 px-3 py-2 border border-gray-300 rounded-md" />
                                </div>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><FaLink className="text-gray-400" /></div>
                                    <input name="projectUrl" placeholder="Project URL (GitHub/Live)" value={proj.projectUrl} onChange={(e) => handleArrayChange(index, e, 'externalProjects')} className="w-full mt-1 block pl-10 px-3 py-2 border border-gray-300 rounded-md" />
                                </div>
                                <textarea name="description" placeholder="Short description" value={proj.description} onChange={(e) => handleArrayChange(index, e, 'externalProjects')} className="w-full mt-1 block px-3 py-2 border border-gray-300 rounded-md" />
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Technologies Used</label>
                                    <select
                                        multiple
                                        value={proj.technologies}
                                        onChange={(e) => handleTechChange(index, e)}
                                        className="mt-1 block w-full h-32 px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                                    >
                                        {allTechnologies.map(tech => (
                                            <option key={tech._id} value={tech._id}>
                                                {tech.name}
                                            </option>
                                        ))}
                                    </select>
                                    <p className="text-xs text-gray-500 mt-1">Hold Ctrl (or Cmd on Mac) to select multiple.</p>
                                </div>
                            </div>
                        ))}
                        <button type="button" onClick={() => addArrayItem('externalProjects')} className="flex items-center gap-2 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg px-4 py-2 hover:from-blue-600 hover:to-purple-700 transition-all duration-300 ease-in-out"><FaPlus /> Add Personal Project</button>
                    </div>

                    <div className="text-right">
                        <button type="submit" disabled={saving || isUploading} className="bg-gradient-to-r from-green-500 to-teal-500 text-white px-8 py-3 rounded-lg font-semibold hover:from-green-600 hover:to-teal-600 transition-all duration-300 ease-in-out disabled:bg-gray-400 disabled:from-gray-400 disabled:to-gray-400">
                            {saving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </main>
    );
}
