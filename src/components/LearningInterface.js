'use client'; 

import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { FaVideo, FaFileAlt, FaLink, FaGraduationCap, FaFileArchive, FaCheckCircle, FaChevronDown } from 'react-icons/fa';
import PortableTextComponent from '@/components/PortableTextComponent';
import { useSession } from 'next-auth/react';

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
    const [openModuleKey, setOpenModuleKey] = useState(null);
    const searchParams = useSearchParams();

    const allResources = useMemo(() => {
        return roadmap.modules?.flatMap(m => m.subTopics?.flatMap(st => st.resources)).filter(Boolean) || [];
    }, [roadmap]);

    const activeResourceIndex = allResources.findIndex(r => r?._key === activeResource?._key);

    // Effect to set the initial/resumed active resource
    useEffect(() => {
        const resumeKey = searchParams.get('resume_from');
        let initialResource = null;
        if (resumeKey) {
            initialResource = allResources.find(r => r._key === resumeKey);
        }
        if (!initialResource && allResources.length > 0) {
            initialResource = allResources[0];
        }
        setActiveResource(initialResource);
    }, [allResources, searchParams]);
    
    // Effect to auto-expand the module of the active resource
    useEffect(() => {
        // Condition logic is INSIDE the hook
        if (activeResource && roadmap.modules) {
            const parentModule = roadmap.modules.find(module => 
                module.subTopics?.some(subTopic => 
                    subTopic.resources?.some(resource => resource._key === activeResource._key)
                )
            );
            
            if (parentModule) {
                setOpenModuleKey(parentModule._key);
            }
        }
    }, [activeResource, roadmap.modules]);

    const handleModuleToggle = (moduleKey) => {
        setOpenModuleKey(prevKey => (prevKey === moduleKey ? null : moduleKey));
    };
    
    const handleMarkAsComplete = async (resourceKey) => {
        if (!session || !resourceKey || completed.has(resourceKey)) return;
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
                    userEmail: session.user.email,
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
        if (activeResource) handleMarkAsComplete(activeResource._key);
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

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="flex flex-col md:flex-row h-screen bg-gray-100">
            {/* Mobile Sidebar Toggle Button */}
            <button 
                className="md:hidden p-2 bg-white border-b border-gray-200 flex justify-between items-center"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
                <span className="font-semibold text-xs">{roadmap.title}</span>
                <FaChevronDown className={`transition-transform duration-200 ${isSidebarOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Sidebar */}
            <aside 
                className={`fixed inset-y-0 left-0 z-20 w-full bg-white border-r border-gray-200 overflow-y-auto 
                           md:static md:w-80 md:h-full 
                           ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 
                           transition-transform duration-300 ease-in-out`}
            >
                <div className="p-2 md:p-4 border-b">
                    <h2 className="font-bold text-sm md:text-lg truncate">{roadmap.title}</h2>
                </div>
                <nav>
                    {roadmap.modules?.map((module, moduleIndex) => (
                        <div key={module._key} className="border-b">
                            <button 
                                onClick={() => handleModuleToggle(module._key)}
                                className="w-full p-2 md:p-4 font-semibold bg-gray-50 text-left flex justify-between items-center hover:bg-gray-100 text-sm md:text-base"
                            >
                                <span>Module {moduleIndex + 1}: {module.title}</span>
                                <FaChevronDown className={`transition-transform duration-200 ${openModuleKey === module._key ? 'rotate-180' : ''}`} />
                            </button>
                            
                            {openModuleKey === module._key && (
                                <div className="pl-2 md:pl-4 py-1 md:py-2 bg-white">
                                    {module.subTopics?.map((subTopic) => (
                                        <div key={subTopic._key} className="py-1 md:py-2">
                                            <h4 className="font-bold text-xs md:text-sm text-gray-500 uppercase tracking-wider mb-1 md:mb-2">{subTopic.title}</h4>
                                            <ul>
                                                {subTopic.resources?.map((resource) => (
                                                    <li key={resource._key} className="flex items-center gap-1">
                                                        <button 
                                                            onClick={() => { setActiveResource(resource); setIsSidebarOpen(false); }}
                                                            className={`w-full text-left p-1.5 md:p-3 rounded-md flex items-center gap-1 md:gap-3 text-xs transition-colors ${
                                                                activeResource?._key === resource._key ? 'bg-orange-100 text-orange-800' : 'hover:bg-gray-100'
                                                            }`}
                                                        >
                                                            <ResourceIcon type={resource.type} />
                                                            <span className="flex-grow">{resource.title}</span>
                                                            {resource.duration && <span className="text-gray-500 text-xs">{resource.duration} min</span>}
                                                        </button>
                                                        {completed.has(resource._key) && <FaCheckCircle className="text-green-500 flex-shrink-0 mr-1 md:mr-2" />}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-3 md:p-10 overflow-y-auto">
                {activeResource ? (
                    <div className="max-w-4xl mx-auto">
                        <h1 className="text-lg md:text-3xl font-bold mb-3 md:mb-6">{activeResource.title}</h1>
                        <div className="mb-4 md:mb-8">
                            {activeResource.type === 'videoEmbed' && activeResource.videoUrl && ( <div className="aspect-video w-full rounded-lg overflow-hidden border shadow-lg bg-black"><iframe src={getYouTubeEmbedUrl(activeResource.videoUrl)} title={activeResource.title} frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen className="w-full h-full"></iframe></div> )}
                            {activeResource.type === 'article' && activeResource.articleBody && ( <div className="prose lg:prose-xl bg-white p-3 md:p-8 rounded-lg shadow-md max-w-none"><PortableTextComponent value={activeResource.articleBody} /></div> )}
                            {activeResource.type === 'multiFile' && ( <div className="space-y-3 md:space-y-8">{activeResource.files?.map((fileItem) => ( <div key={fileItem._key} className="bg-white p-3 rounded-lg border"><div className="flex justify-between items-center mb-2 md:mb-4"><h3 className="text-sm md:text-xl font-bold">{fileItem.title}</h3><a href={fileItem.fileURL} download target="_blank" rel="noopener noreferrer"><button className="bg-gray-800 text-white px-2 py-0.5 rounded-md font-semibold hover:bg-black text-xs">Download</button></a></div>{fileItem.fileURL?.endsWith('.pdf') ? (<div className="aspect-[4/3] w-full border rounded-lg overflow-hidden"><iframe src={fileItem.fileURL} className="w-full h-full" title={fileItem.title} /></div>) : (<div className="text-center py-3 md:py-10 bg-gray-50 rounded-lg"><p className="text-xs md:text-base">This file type cannot be previewed.</p></div>)}</div>))}</div> )}
                            {activeResource.type === 'file' && activeResource.fileURL && ( <div className="bg-white p-3 rounded-lg border">{activeResource.fileURL.endsWith('.pdf') ? (<div className="mb-3 md:mb-6"><div className="aspect-[4/3] w-full border rounded-lg overflow-hidden"><iframe src={activeResource.fileURL} className="w-full h-full" title={activeResource.title} /></div></div>) : (<p className="mb-2 md:mb-4 text-center text-xs md:text-base">This is a downloadable file.</p>)}<div className="text-center"><a href={activeResource.fileURL} download target="_blank" rel="noopener noreferrer"><button className="bg-black text-white px-3 py-0.5 rounded-md font-semibold hover:opacity-80 text-xs md:px-6 md:py-2 md:text-base">Download File</button></a></div></div> )}
                            {(activeResource.type === 'link' || activeResource.type === 'externalCourse') && activeResource.link && ( <div className="bg-white p-3 rounded-lg border text-center"><p className="mb-2 md:mb-4 text-xs md:text-base">This is an external resource. Click the button below to open it in a new tab.</p><a href={activeResource.link} target="_blank" rel="noopener noreferrer"><button className="bg-black text-white px-3 py-0.5 rounded-md font-semibold hover:opacity-80 text-xs md:px-6 md:py-2 md:text-base">Visit Link</button></a></div> )}
                        </div>
                        <div className="mt-4 md:mt-8 hidden md:flex justify-between items-center">
                            <button onClick={goToPrevious} disabled={activeResourceIndex <= 0} className="bg-gray-200 text-black px-3 py-1 rounded-md font-semibold hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed text-xs md:px-6 md:py-3 md:text-base">Previous Item</button>
                             {session && ( <div>{completed.has(activeResource._key) ? (<div className="inline-flex items-center gap-0.5 md:gap-2 text-sm md:text-lg font-semibold text-green-600 p-1.5 md:p-3 bg-green-50 rounded-lg"><FaCheckCircle /><span>Completed</span></div>) : (<button onClick={() => handleMarkAsComplete(activeResource._key)} className="bg-gray-800 text-white px-4 py-1 rounded-md font-semibold text-sm md:px-8 md:py-3 md:text-lg hover:bg-black">Mark as Complete</button>)}</div> )}
                            <button onClick={goToNext} disabled={activeResourceIndex >= allResources.length - 1} className="bg-black text-white px-4 py-1 rounded-md font-semibold text-sm md:px-8 md:py-3 md:text-lg hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-0.5 md:gap-2">{completed.has(activeResource._key) ? 'Go to next item' : 'Complete & Continue'} →</button>
                        </div>
                    </div>
                ) : ( <div className="text-center text-gray-500 p-3 md:p-10"><p className="text-xs md:text-base">Select a lesson from the left to get started.</p></div> )}
            </main>
            {/* Fixed Navigation for Mobile */}
            <div className="fixed bottom-0 left-0 right-0 z-10 w-full p-3 bg-white border-t border-gray-200 flex flex-col gap-2 md:hidden">
                {activeResource && session && ( 
                    <div className="w-full">{completed.has(activeResource._key) ? (
                        <div className="inline-flex items-center justify-center w-full gap-1 text-sm font-semibold text-green-600 p-2 bg-green-50 rounded-md">
                            <FaCheckCircle /><span>Completed</span>
                        </div>
                    ) : (
                        <button onClick={() => handleMarkAsComplete(activeResource._key)} className="bg-gray-800 text-white px-4 py-2 rounded-md font-semibold text-sm hover:bg-black w-full">Mark as Complete</button>
                    )}</div> 
                )}
                <div className="flex justify-between w-full gap-2">
                    <button onClick={goToPrevious} disabled={activeResourceIndex <= 0} className="bg-gray-200 text-black px-3 py-1 rounded-md font-semibold hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed text-xs w-1/2">Previous Item</button>
                    <button onClick={goToNext} disabled={activeResourceIndex >= allResources.length - 1} className="bg-black text-white px-4 py-1 rounded-md font-semibold text-sm hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-0.5 w-1/2">{activeResource && completed.has(activeResource._key) ? 'Go to next item' : 'Complete & Continue'} →</button>
                </div>
            </div>
        </div>
    );
}