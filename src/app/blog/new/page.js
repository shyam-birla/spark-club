'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { client } from '../../../../sanity/lib/client';
import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css'; // Import Quill styles

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false }); // Dynamically import ReactQuill

export default function NewBlogPostPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    body: '',
    coverImage: null,
    author: '',
    newAuthor: {
      name: '',
      role: '',
      image: null,
      linkedinUrl: '',
      githubUrl: '',
      instagramUrl: '',
      whatsappNo: '',
    },
  });
  const [authorType, setAuthorType] = useState('existing');
  const [authors, setAuthors] = useState([]);

  useEffect(() => {
    client.fetch(`*[_type == "person"]{_id, name}`).then(setAuthors);
  }, []);
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (name.startsWith('newAuthor')) {
      const field = name.split('.')[1];
      const newAuthor = { ...formData.newAuthor, [field]: type === 'file' ? files[0] : value };
      setFormData(prev => ({ ...prev, newAuthor }));
    } else if (type === 'file') {
      setFormData(prev => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      let coverImageAsset;
      let authorRef;

      if (formData.coverImage) {
        coverImageAsset = await client.assets.upload('image', formData.coverImage);
      }

      if (authorType === 'new') {
        let authorImageAsset;
        if (formData.newAuthor.image) {
          authorImageAsset = await client.assets.upload('image', formData.newAuthor.image);
        }

        const newPerson = {
          _type: 'person',
          name: formData.newAuthor.name,
          role: formData.newAuthor.role,
          linkedinUrl: formData.newAuthor.linkedinUrl,
          githubUrl: formData.newAuthor.githubUrl,
          instagramUrl: formData.newAuthor.instagramUrl,
          whatsappNo: formData.newAuthor.whatsappNo,
          image: authorImageAsset ? { _type: 'image', asset: { _type: 'reference', _ref: authorImageAsset._id } } : null,
        };
        const createdPerson = await client.create(newPerson);
        authorRef = { _type: 'reference', _ref: createdPerson._id };
      } else {
        authorRef = { _type: 'reference', _ref: formData.author };
      }

      const response = await fetch('/api/blog/new', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          coverImage: coverImageAsset ? { _type: 'image', asset: { _type: 'reference', _ref: coverImageAsset._id } } : null,
          author: authorRef,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create blog post');
      }

      alert('Blog post submitted for approval!');
      router.push('/blog');
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
      <h1 className="text-3xl font-bold mb-6">Submit a New Blog Post</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
          <input
            type="text"
            name="title"
            id="title"
            value={formData.title}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <div>
          <label htmlFor="coverImage" className="block text-sm font-medium text-gray-700">Cover Image</label>
          <input
            type="file"
            name="coverImage"
            id="coverImage"
            onChange={handleChange}
            className="mt-1 block w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Author</label>
          <div className="mt-2 flex items-center gap-4">
            <label>
              <input type="radio" name="authorType" value="existing" checked={authorType === 'existing'} onChange={() => setAuthorType('existing')} />
              Existing Author
            </label>
            <label>
              <input type="radio" name="authorType" value="new" checked={authorType === 'new'} onChange={() => setAuthorType('new')} />
              New Author
            </label>
          </div>
        </div>

        {authorType === 'existing' ? (
          <div>
            <label htmlFor="author" className="block text-sm font-medium text-gray-700">Select Author</label>
            <select name="author" id="author" value={formData.author} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm">
              <option value="">Select an author</option>
              {authors.map(author => (
                <option key={author._id} value={author._id}>{author.name}</option>
              ))}
            </select>
          </div>
        ) : (
          <div className="p-4 border border-gray-200 rounded-md">
            <h3 className="text-lg font-medium text-gray-900">New Author Details</h3>
            <div className="mt-4 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <label htmlFor="newAuthor.name" className="block text-sm font-medium text-gray-700">Name</label>
                <input type="text" name="newAuthor.name" id="newAuthor.name" value={formData.newAuthor.name} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
              </div>
              <div className="sm:col-span-3">
                <label htmlFor="newAuthor.role" className="block text-sm font-medium text-gray-700">Role</label>
                <input type="text" name="newAuthor.role" id="newAuthor.role" value={formData.newAuthor.role} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
              </div>
              <div className="sm:col-span-6">
                <label htmlFor="newAuthor.image" className="block text-sm font-medium text-gray-700">Image</label>
                <input type="file" name="newAuthor.image" id="newAuthor.image" onChange={handleChange} className="mt-1 block w-full" />
              </div>
              <div className="sm:col-span-3">
                <label htmlFor="newAuthor.linkedinUrl" className="block text-sm font-medium text-gray-700">LinkedIn URL</label>
                <input type="url" name="newAuthor.linkedinUrl" id="newAuthor.linkedinUrl" value={formData.newAuthor.linkedinUrl} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
              </div>
              <div className="sm:col-span-3">
                <label htmlFor="newAuthor.githubUrl" className="block text-sm font-medium text-gray-700">GitHub URL</label>
                <input type="url" name="newAuthor.githubUrl" id="newAuthor.githubUrl" value={formData.newAuthor.githubUrl} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
              </div>
              <div className="sm:col-span-3">
                <label htmlFor="newAuthor.instagramUrl" className="block text-sm font-medium text-gray-700">Instagram URL</label>
                <input type="url" name="newAuthor.instagramUrl" id="newAuthor.instagramUrl" value={formData.newAuthor.instagramUrl} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
              </div>
              <div className="sm:col-span-3">
                <label htmlFor="newAuthor.whatsappNo" className="block text-sm font-medium text-gray-700">WhatsApp Number</label>
                <input type="text" name="newAuthor.whatsappNo" id="newAuthor.whatsappNo" value={formData.newAuthor.whatsappNo} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
              </div>
            </div>
          </div>
        )}

        <div>
          <label htmlFor="body" className="block text-sm font-medium text-gray-700">Body</label>
          <ReactQuill
            theme="snow" // or "bubble"
            value={formData.body}
            onChange={(value) => setFormData(prev => ({ ...prev, body: value }))}
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
        <div className="text-right">
          <button type="submit" disabled={saving} className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400">
            {saving ? 'Submitting...' : 'Submit for Approval'}
          </button>
        </div>
      </form>
    </main>
  );
}
