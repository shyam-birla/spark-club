'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { client } from '../../../../sanity/lib/client';
import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css'; // Import Quill styles

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false }); // Dynamically import ReactQuill

export default function NewResearchProjectPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    status: 'ongoing',
    researchArea: '',
    description: '',
    publicationLink: '',
    githubUrl: '',
    posterImage: null,
    authors: [],
    mentors: [],
    newAuthors: [],
    newMentors: [],
  });
  const [people, setPeople] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    client.fetch(`*[_type == "person"]{_id, name}`).then(setPeople);
  }, []);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      setFormData(prev => ({ ...prev, [name]: files[0] }));
    } else if (type === 'select-multiple') {
      const options = Array.from(e.target.options);
      const selectedValues = options.filter(o => o.selected).map(o => o.value);
      setFormData(prev => ({ ...prev, [name]: selectedValues }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleNewAuthorChange = (e, index) => {
    const { name, value, type, files } = e.target;
    const newAuthors = [...formData.newAuthors];
    if (type === 'file') {
      newAuthors[index][name] = files[0];
    } else {
      newAuthors[index][name] = value;
    }
    setFormData(prev => ({ ...prev, newAuthors }));
  };

  const addNewAuthor = () => {
    setFormData(prev => ({ ...prev, newAuthors: [...prev.newAuthors, { name: '', role: '', image: null, linkedinUrl: '', githubUrl: '' }] }));
  };

  const handleNewMentorChange = (e, index) => {
    const { name, value, type, files } = e.target;
    const newMentors = [...formData.newMentors];
    if (type === 'file') {
      newMentors[index][name] = files[0];
    } else {
      newMentors[index][name] = value;
    }
    setFormData(prev => ({ ...prev, newMentors }));
  };

  const addNewMentor = () => {
    setFormData(prev => ({ ...prev, newMentors: [...prev.newMentors, { name: '', role: '', image: null, linkedinUrl: '', githubUrl: '' }] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch('/api/research/new', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to create research project');
      }

      alert('Research project submitted for approval!');
      router.push('/research');
    } catch (error) {
      console.error(error);
      alert('Something went wrong. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (status === 'unauthenticated') {
    router.push('/login');
    return null;
  }

  return (
    <main className="container mx-auto px-4 py-12 md:py-20">
      <h1 className="text-3xl font-bold mb-6">Submit a New Research Project</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
          <input type="text" name="title" id="title" value={formData.title} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" required />
        </div>
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
          <select name="status" id="status" value={formData.status} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm">
            <option value="ongoing">Ongoing</option>
            <option value="completed">Completed</option>
            <option value="published">Published</option>
          </select>
        </div>
        <div>
          <label htmlFor="researchArea" className="block text-sm font-medium text-gray-700">Research Area</label>
          <input type="text" name="researchArea" id="researchArea" value={formData.researchArea} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description (Abstract)</label>
          <ReactQuill
            theme="snow" // or "bubble"
            value={formData.description}
            onChange={(value) => setFormData(prev => ({ ...prev, description: value }))}
            className="mt-1 block w-full"
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
        </div>
        <div>
          <label htmlFor="publicationLink" className="block text-sm font-medium text-gray-700">Publication Link</label>
          <input type="url" name="publicationLink" id="publicationLink" value={formData.publicationLink} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
        </div>
        <div>
          <label htmlFor="githubUrl" className="block text-sm font-medium text-gray-700">GitHub URL</label>
          <input type="url" name="githubUrl" id="githubUrl" value={formData.githubUrl} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
        </div>
        <div>
          <label htmlFor="posterImage" className="block text-sm font-medium text-gray-700">Poster Image</label>
          <input type="file" name="posterImage" id="posterImage" onChange={handleChange} className="mt-1 block w-full" />
        </div>

        <div>
          <label htmlFor="authors" className="block text-sm font-medium text-gray-700">Authors</label>
          <select multiple name="authors" id="authors" onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm">
            {people.map(person => (
              <option key={person._id} value={person._id}>{person.name}</option>
            ))}
          </select>
        </div>

        <div>
          <h3 className="text-lg font-medium text-gray-900">New Authors</h3>
          {formData.newAuthors.map((author, index) => (
            <div key={index} className="mt-4 p-4 border border-gray-200 rounded-md">
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <label htmlFor={`author-name-${index}`} className="block text-sm font-medium text-gray-700">Name</label>
                  <input type="text" name="name" id={`author-name-${index}`} value={author.name} onChange={(e) => handleNewAuthorChange(e, index)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
                </div>
                <div className="sm:col-span-3">
                  <label htmlFor={`author-role-${index}`} className="block text-sm font-medium text-gray-700">Role</label>
                  <input type="text" name="role" id={`author-role-${index}`} value={author.role} onChange={(e) => handleNewAuthorChange(e, index)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
                </div>
                <div className="sm:col-span-6">
                  <label htmlFor={`author-image-${index}`} className="block text-sm font-medium text-gray-700">Image</label>
                  <input type="file" name="image" id={`author-image-${index}`} onChange={(e) => handleNewAuthorChange(e, index)} className="mt-1 block w-full" />
                </div>
                <div className="sm:col-span-3">
                  <label htmlFor={`author-linkedin-${index}`} className="block text-sm font-medium text-gray-700">LinkedIn URL</label>
                  <input type="url" name="linkedinUrl" id={`author-linkedin-${index}`} value={author.linkedinUrl} onChange={(e) => handleNewAuthorChange(e, index)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
                </div>
                <div className="sm:col-span-3">
                  <label htmlFor={`author-github-${index}`} className="block text-sm font-medium text-gray-700">GitHub URL</label>
                  <input type="url" name="githubUrl" id={`author-github-${index}`} value={author.githubUrl} onChange={(e) => handleNewAuthorChange(e, index)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
                </div>
              </div>
            </div>
          ))}
          <button type="button" onClick={addNewAuthor} className="mt-4 bg-gray-200 text-black px-4 py-2 rounded-md font-semibold text-sm hover:bg-gray-300 transition-colors">Add New Author</button>
        </div>

        <div>
          <label htmlFor="mentors" className="block text-sm font-medium text-gray-700">Mentors</label>
          <select multiple name="mentors" id="mentors" onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm">
            {people.map(person => (
              <option key={person._id} value={person._id}>{person.name}</option>
            ))}
          </select>
        </div>

        <div>
          <h3 className="text-lg font-medium text-gray-900">New Mentors</h3>
          {formData.newMentors.map((mentor, index) => (
            <div key={index} className="mt-4 p-4 border border-gray-200 rounded-md">
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <label htmlFor={`mentor-name-${index}`} className="block text-sm font-medium text-gray-700">Name</label>
                  <input type="text" name="name" id={`mentor-name-${index}`} value={mentor.name} onChange={(e) => handleNewMentorChange(e, index)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
                </div>
                <div className="sm:col-span-3">
                  <label htmlFor={`mentor-role-${index}`} className="block text-sm font-medium text-gray-700">Role</label>
                  <input type="text" name="role" id={`mentor-role-${index}`} value={mentor.role} onChange={(e) => handleNewMentorChange(e, index)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
                </div>
                <div className="sm:col-span-6">
                  <label htmlFor={`mentor-image-${index}`} className="block text-sm font-medium text-gray-700">Image</label>
                  <input type="file" name="image" id={`mentor-image-${index}`} onChange={(e) => handleNewMentorChange(e, index)} className="mt-1 block w-full" />
                </div>
                <div className="sm:col-span-3">
                  <label htmlFor={`mentor-linkedin-${index}`} className="block text-sm font-medium text-gray-700">LinkedIn URL</label>
                  <input type="url" name="linkedinUrl" id={`mentor-linkedin-${index}`} value={mentor.linkedinUrl} onChange={(e) => handleNewMentorChange(e, index)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
                </div>
                <div className="sm:col-span-3">
                  <label htmlFor={`mentor-github-${index}`} className="block text-sm font-medium text-gray-700">GitHub URL</label>
                  <input type="url" name="githubUrl" id={`mentor-github-${index}`} value={mentor.githubUrl} onChange={(e) => handleNewMentorChange(e, index)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
                </div>
              </div>
            </div>
          ))}
          <button type="button" onClick={addNewMentor} className="mt-4 bg-gray-200 text-black px-4 py-2 rounded-md font-semibold text-sm hover:bg-gray-300 transition-colors">Add New Mentor</button>
        </div>

        <div className="text-right">
          <button type="submit" disabled={saving} className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400">
            {saving ? 'Submitting...' : 'Submit for Approval'}
          </button>
        </div>
      </form>
    </main>
  );
}
