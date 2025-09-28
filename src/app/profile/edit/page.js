'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { client } from '../../../../sanity/lib/client';
import { FaPlus, FaTrash } from 'react-icons/fa';

export default function EditProfilePage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    
    // State to hold all available technologies for the dropdown
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

    // Fetch profile data and all technologies
    useEffect(() => {
        if (status === 'authenticated') {
            const userEmail = session.user.email;
            
            // Fetch all technologies using the correct field name 'name'
            client.fetch(`*[_type == "technology"]{_id, name} | order(name asc)`).then(techs => {
                setAllTechnologies(techs);
            });

            // Fetch user profile data, expanding technology IDs for the form
            const query = `*[_type == "profile" && userEmail == $email] | order(_updatedAt desc)[0]{
                ...,
                "externalProjects": externalProjects[]{..., "technologies": technologies[]->._id}
            }`;
            
            client.fetch(query, { email: userEmail }).then(data => {
                if (data) {
                    setFormData({
                        userName: data.userName || session.user.name,
                        tagline: data.tagline || '',
                        bio: data.bio || '',
                        linkedinUrl: data.linkedinUrl || '',
                        githubUrl: data.githubUrl || '',
                        portfolioUrl: data.portfolioUrl || '',
                        education: data.education || [],
                        workExperience: data.workExperience || [],
                        // Ensure technologies is an array of IDs for the form state
                        externalProjects: data.externalProjects?.map(p => ({...p, technologies: p.technologies || []})) || [],
                    });
                } else {
                    setFormData(prev => ({ ...prev, userName: session.user.name }));
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

    // Special handler for multi-select technologies
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
            // Format data for Sanity, especially references
            const finalData = {
                ...formData,
                externalProjects: formData.externalProjects.map(proj => ({
                    ...proj,
                    technologies: proj.technologies.map(techId => ({ _type: 'reference', _ref: techId }))
                }))
            };

            const response = await fetch('/api/profile', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(finalData), 
            });

            if (!response.ok) {
                throw new Error('Failed to update profile');
            }

            alert('Profile updated successfully!');
            router.push('/profile');
            router.refresh();
        } catch (error) {
            console.error(error);
            alert('Something went wrong. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading profile...</div>;
    }

    return (
        <main className="container mx-auto px-4 py-12 md:py-20">
            <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl border border-gray-200 shadow-md">
                <h1 className="text-3xl font-bold mb-6">Edit Your Profile</h1>
                
                <form onSubmit={handleSubmit} className="space-y-8">
                    
                    {/* Basic Info Section */}
                    <div className="space-y-6">
                        <h2 className="text-xl font-semibold border-b pb-2">Basic Information</h2>
                        <div>
                            <label htmlFor="userName" className="block text-sm font-medium text-gray-700">Full Name</label>
                            <input type="text" name="userName" id="userName" value={formData.userName} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" required />
                        </div>
                        <div>
                            <label htmlFor="tagline" className="block text-sm font-medium text-gray-700">Tagline</label>
                            <input type="text" name="tagline" id="tagline" value={formData.tagline} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" placeholder="e.g., Aspiring Full-Stack Developer" />
                        </div>
                        <div>
                            <label htmlFor="bio" className="block text-sm font-medium text-gray-700">About Me / Bio</label>
                            <textarea name="bio" id="bio" rows="4" value={formData.bio} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"></textarea>
                        </div>
                        <div>
                            <label htmlFor="githubUrl" className="block text-sm font-medium text-gray-700">GitHub Profile URL</label>
                            <input type="url" name="githubUrl" id="githubUrl" value={formData.githubUrl} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" placeholder="https://github.com/username" />
                        </div>
                        <div>
                            <label htmlFor="linkedinUrl" className="block text-sm font-medium text-gray-700">LinkedIn Profile URL</label>
                            <input type="url" name="linkedinUrl" id="linkedinUrl" value={formData.linkedinUrl} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" placeholder="https://linkedin.com/in/username" />
                        </div>
                        <div>
                            <label htmlFor="portfolioUrl" className="block text-sm font-medium text-gray-700">Personal Portfolio URL</label>
                            <input type="url" name="portfolioUrl" id="portfolioUrl" value={formData.portfolioUrl} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" placeholder="https://my-website.com" />
                        </div>
                    </div>

                    {/* Education Section */}
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold border-b pb-2">Education</h2>
                        {formData.education.map((edu, index) => (
                            <div key={edu._key || index} className="p-4 border rounded-md space-y-3 relative">
                                <button type="button" onClick={() => removeArrayItem(index, 'education')} className="absolute top-2 right-2 text-red-500 hover:text-red-700"><FaTrash /></button>
                                <input name="school" placeholder="School/University" value={edu.school} onChange={(e) => handleArrayChange(index, e, 'education')} className="w-full mt-1 block px-3 py-2 border border-gray-300 rounded-md" />
                                <input name="degree" placeholder="Degree" value={edu.degree} onChange={(e) => handleArrayChange(index, e, 'education')} className="w-full mt-1 block px-3 py-2 border border-gray-300 rounded-md" />
                                <div className="flex gap-4">
                                    <input type="month" name="startDate" value={edu.startDate} onChange={(e) => handleArrayChange(index, e, 'education')} className="w-full mt-1 block px-3 py-2 border border-gray-300 rounded-md" />
                                    <input type="month" name="endDate" value={edu.endDate} onChange={(e) => handleArrayChange(index, e, 'education')} className="w-full mt-1 block px-3 py-2 border border-gray-300 rounded-md" />
                                </div>
                            </div>
                        ))}
                        <button type="button" onClick={() => addArrayItem('education')} className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-800"><FaPlus /> Add Education</button>
                    </div>

                    {/* Work Experience Section */}
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold border-b pb-2">Work Experience</h2>
                        {formData.workExperience.map((work, index) => (
                             <div key={work._key || index} className="p-4 border rounded-md space-y-3 relative">
                                <button type="button" onClick={() => removeArrayItem(index, 'workExperience')} className="absolute top-2 right-2 text-red-500 hover:text-red-700"><FaTrash /></button>
                                <input name="company" placeholder="Company" value={work.company} onChange={(e) => handleArrayChange(index, e, 'workExperience')} className="w-full mt-1 block px-3 py-2 border border-gray-300 rounded-md" />
                                <input name="title" placeholder="Job Title" value={work.title} onChange={(e) => handleArrayChange(index, e, 'workExperience')} className="w-full mt-1 block px-3 py-2 border border-gray-300 rounded-md" />
                                <textarea name="description" placeholder="Description of your role" value={work.description} onChange={(e) => handleArrayChange(index, e, 'workExperience')} className="w-full mt-1 block px-3 py-2 border border-gray-300 rounded-md" />
                                <div className="flex gap-4">
                                    <input type="month" name="startDate" value={work.startDate} onChange={(e) => handleArrayChange(index, e, 'workExperience')} className="w-full mt-1 block px-3 py-2 border border-gray-300 rounded-md" />
                                    <input type="month" name="endDate" value={work.endDate} onChange={(e) => handleArrayChange(index, e, 'workExperience')} className="w-full mt-1 block px-3 py-2 border border-gray-300 rounded-md" />
                                </div>
                            </div>
                        ))}
                        <button type="button" onClick={() => addArrayItem('workExperience')} className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-800"><FaPlus /> Add Work Experience</button>
                    </div>

                    {/* External Projects Section with Technologies */}
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold border-b pb-2">Personal Projects</h2>
                        {formData.externalProjects.map((proj, index) => (
                            <div key={proj._key || index} className="p-4 border rounded-md space-y-3 relative">
                                <button type="button" onClick={() => removeArrayItem(index, 'externalProjects')} className="absolute top-2 right-2 text-red-500 hover:text-red-700"><FaTrash /></button>
                                <input name="title" placeholder="Project Title" value={proj.title} onChange={(e) => handleArrayChange(index, e, 'externalProjects')} className="w-full mt-1 block px-3 py-2 border border-gray-300 rounded-md" />
                                <input name="projectUrl" placeholder="Project URL (GitHub/Live)" value={proj.projectUrl} onChange={(e) => handleArrayChange(index, e, 'externalProjects')} className="w-full mt-1 block px-3 py-2 border border-gray-300 rounded-md" />
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
                        <button type="button" onClick={() => addArrayItem('externalProjects')} className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-800"><FaPlus /> Add Personal Project</button>
                    </div>

                    <div className="text-right">
                        <button type="submit" disabled={saving} className="bg-black text-white px-6 py-2 rounded-md font-semibold hover:opacity-80 disabled:bg-gray-400">
                            {saving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </main>
    );
}



