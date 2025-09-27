// src/components/LearningInterface.js (COMPLETE - with useMemo fix)
'use client'; 

import { useState, useEffect, useMemo } from 'react'; // useMemo ko import kiya
import { FaVideo, FaFileAlt, FaLink, FaGraduationCap, FaFileArchive, FaCheckCircle } from 'react-icons/fa';
import { PortableText } from '@portabletext/react';
import { useSession } from 'next-auth/react';

// Helper function to convert YouTube URL to embeddable format
const getYouTubeEmbedUrl = (url) => {
    if (!url) return '';
    try {
        const urlObj = new URL(url);
        let videoId = null;
        if (urlObj.hostname === 'www.youtube.com' || urlObj.hostname === 'youtube.com') {
            videoId = urlObj.searchParams.get('v');
        } else if (urlObj.hostname === 'youtu.be') {
            videoId = urlObj.pathname.slice(1);
        }
        if (videoId) return `https://www.youtube.com/embed/${videoId}`;
    } catch (error) {
        console.error("Invalid URL for YouTube embed:", error);
        return '';
    }
    return url;
};

const ResourceIcon = ({ type }) => {
    switch (type) {
        case 'videoEmbed': return <FaVideo className="text-gray-500" />;
        case 'article': return <FaFileAlt className="text-gray-500" />;
        case 'multiFile': return <FaFileArchive className="text-gray-500" />;
        case 'file': return <FaFileAlt className="text-gray-500" />;
        case 'externalCourse': return <FaGraduationCap className="text-gray-500" />;
        default: return <FaLink className="text-gray-500" />;
    }
};

export default function LearningInterface({ roadmap, initialProgress }) {
    const { data: session } = useSession();
    const [activeResource, setActiveResource] = useState(null);
    const [completed, setCompleted] = useState(() => new Set(initialProgress || []));

    // useMemo ka use karke 'allResources' ko cache kiya
    const allResources = useMemo(() => {
        return roadmap.modules?.flatMap(m => m.subTopics?.flatMap(st => st.resources)) || [];
    }, [roadmap]);

    const activeResourceIndex = allResources.findIndex(r => r._key === activeResource?._key);

    useEffect(() => {
        if (allResources.length > 0 && !activeResource) {
            setActiveResource(allResources[0]);
        }
    }, [allResources, activeResource]);
    
    const handleMarkAsComplete = async (resourceKey) => {
        if (!session || !resourceKey || completed.has(resourceKey)) {
            return;
        }
        
        const newCompleted = new Set(completed);
        newCompleted.add(resourceKey);
        setCompleted(newCompleted);

        try {
            const response = await fetch('/api/progress', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    roadmapId: roadmap._id,
                    resourceKey: resourceKey,
                }),
            });
            if (!response.ok) throw new Error('Failed to save progress');
        } catch (error) {
            const oldCompleted = new Set(completed);
            oldCompleted.delete(resourceKey);
            setCompleted(oldCompleted);
            alert("An error occurred. Please check your connection and try again.");
        }
    };
    
    const goToNext = () => {
        if (activeResource) {
            handleMarkAsComplete(activeResource._key);
        }
        const nextIndex = activeResourceIndex + 1;
        if (nextIndex < allResources.length) {
            setActiveResource(allResources[nextIndex]);
        }
    };
    
    const goToPrevious = () => {
        const prevIndex = activeResourceIndex - 1;
        if (prevIndex >= 0) {
            setActiveResource(allResources[prevIndex]);
        }
    };

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Left Sidebar */}
            <aside className="w-80 h-full bg-white border-r border-gray-200 overflow-y-auto">
                <div className="p-4 border-b">
                    <h2 className="font-bold text-lg truncate">{roadmap.title}</h2>
                </div>
                <nav>
                    {roadmap.modules?.map((module, moduleIndex) => (
                        <div key={module._key} className="border-b">
                            <h3 className="p-4 font-semibold bg-gray-50">Module {moduleIndex + 1}: {module.title}</h3>
                            {module.subTopics?.map((subTopic) => (
                                <div key={subTopic._key} className="pl-4 py-2">
                                    <h4 className="font-bold text-sm text-gray-500 uppercase tracking-wider mb-2">{subTopic.title}</h4>
                                    <ul>
                                        {subTopic.resources?.map((resource) => (
                                            <li key={resource._key} className="flex items-center gap-1">
                                                <button 
                                                    onClick={() => setActiveResource(resource)}
                                                    className={`w-full text-left p-3 rounded-md flex items-center gap-3 text-sm transition-colors ${
                                                        activeResource?._key === resource._key ? 'bg-orange-100 text-orange-800' : 'hover:bg-gray-100'
                                                    }`}
                                                >
                                                    <ResourceIcon type={resource.type} />
                                                    <span className="flex-grow">{resource.title}</span>
                                                    {resource.duration && <span className="text-gray-500">{resource.duration} min</span>}
                                                </button>
                                                {completed.has(resource._key) && <FaCheckCircle className="text-green-500 flex-shrink-0 mr-2" />}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    ))}
                </nav>
            </aside>

            {/* Right Content Area */}
            <main className="flex-1 p-6 md:p-10 overflow-y-auto">
                {activeResource ? (
                    <div className="max-w-4xl mx-auto">
                        <h1 className="text-3xl font-bold mb-6">{activeResource.title}</h1>
                        
                        <div className="mb-8">
                            {/* Video Player */}
                            {activeResource.type === 'videoEmbed' && activeResource.videoUrl && (
                                <div className="aspect-video w-full rounded-lg overflow-hidden border shadow-lg bg-black">
                                    <iframe
                                        src={getYouTubeEmbedUrl(activeResource.videoUrl)}
                                        title={activeResource.title}
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                        allowFullScreen
                                        className="w-full h-full"
                                    ></iframe>
                                </div>
                            )}
                            
                            {/* Article Renderer */}
                            {activeResource.type === 'article' && activeResource.articleBody && (
                                <div className="prose lg:prose-xl bg-white p-6 md:p-8 rounded-lg shadow-md max-w-none">
                                    <PortableText value={activeResource.articleBody} />
                                </div>
                            )}
                            
                            {/* Multi-File Viewer */}
                            {activeResource.type === 'multiFile' && (
                                <div className="space-y-8">
                                    {activeResource.files?.map((fileItem) => (
                                        <div key={fileItem._key} className="bg-white p-6 rounded-lg border">
                                            <div className="flex justify-between items-center mb-4">
                                                <h3 className="text-xl font-bold">{fileItem.title}</h3>
                                                <a href={fileItem.fileURL} download target="_blank" rel="noopener noreferrer">
                                                    <button className="bg-gray-800 text-white px-4 py-2 rounded-md font-semibold hover:bg-black text-sm">Download</button>
                                                </a>
                                            </div>
                                            {fileItem.fileURL?.endsWith('.pdf') ? (
                                                <div className="aspect-[4/3] w-full border rounded-lg overflow-hidden">
                                                    <iframe src={fileItem.fileURL} className="w-full h-full" title={fileItem.title} />
                                                </div>
                                            ) : (
                                                <div className="text-center py-10 bg-gray-50 rounded-lg"><p>This file type cannot be previewed.</p></div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Single File Viewer */}
                            {activeResource.type === 'file' && activeResource.fileURL && (
                                <div className="bg-white p-6 rounded-lg border">
                                    {activeResource.fileURL.endsWith('.pdf') ? (
                                        <div className="mb-6"><div className="aspect-[4/3] w-full border rounded-lg overflow-hidden"><iframe src={activeResource.fileURL} className="w-full h-full" title={activeResource.title} /></div></div>
                                    ) : (
                                        <p className="mb-4 text-center">This is a downloadable file.</p>
                                    )}
                                    <div className="text-center"><a href={activeResource.fileURL} download target="_blank" rel="noopener noreferrer"><button className="bg-black text-white px-6 py-2 rounded-md font-semibold hover:opacity-80">Download File</button></a></div>
                                </div>
                            )}

                            {/* External Link */}
                            {(activeResource.type === 'link' || activeResource.type === 'externalCourse') && activeResource.link && (
                                 <div className="bg-white p-6 rounded-lg border text-center">
                                     <p className="mb-4">This is an external resource. Click the button below to open it in a new tab.</p>
                                     <a href={activeResource.link} target="_blank" rel="noopener noreferrer"><button className="bg-black text-white px-6 py-2 rounded-md font-semibold hover:opacity-80">Visit Link</button></a>
                                 </div>
                            )}
                        </div>
                        
                        {/* Navigation Buttons */}
                        <div className="mt-8 flex justify-between items-center">
                            <button onClick={goToPrevious} disabled={activeResourceIndex <= 0} className="bg-gray-200 text-black px-6 py-3 rounded-md font-semibold hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed">
                                Previous Item
                            </button>
                             {session && (
                                <div>
                                    {completed.has(activeResource._key) ? (
                                        <div className="inline-flex items-center gap-2 text-lg font-semibold text-green-600 p-3 bg-green-50 rounded-lg">
                                            <FaCheckCircle />
                                            <span>Completed</span>
                                        </div>
                                    ) : (
                                        <button onClick={() => handleMarkAsComplete(activeResource._key)} className="bg-gray-800 text-white px-8 py-3 rounded-md font-semibold text-lg hover:bg-black">
                                            Mark as Complete
                                        </button>
                                    )}
                                </div>
                            )}
                            <button onClick={goToNext} disabled={activeResourceIndex >= allResources.length - 1} className="bg-black text-white px-8 py-3 rounded-md font-semibold text-lg hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
                                {completed.has(activeResource._key) ? 'Go to next item' : 'Complete & Continue'} →
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="text-center text-gray-500">
                        <p>Select a lesson from the left to get started.</p>
                    </div>
                )}
            </main>
        </div>
    );
}