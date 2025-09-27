// src/app/login/page.js
'use client';

import { signIn } from 'next-auth/react';
import Image from 'next/image';
import { FaGoogle, FaGithub } from 'react-icons/fa';

export default function LoginPage() {
  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-8 bg-white shadow-lg rounded-xl border border-gray-200">
        
        <div className="text-center">
          <Image 
            src="/logo-black.png" // Make sure your logo is in the public folder
            alt="SPARK Club Logo"
            width={150}
            height={50}
            className="mx-auto object-contain"
          />
          <h2 className="mt-6 text-2xl font-bold text-gray-900">
            Join the Innovation Hub
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to continue your learning journey
          </p>
        </div>
        
        <div className="space-y-4">
          <button
            onClick={() => signIn('google', { callbackUrl: '/' })}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            <FaGoogle className="w-5 h-5" />
            <span>Sign in with Google</span>
          </button>
          
          <button
            onClick={() => signIn('github', { callbackUrl: '/' })}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-800 hover:bg-gray-900 transition-colors"
          >
            <FaGithub className="w-5 h-5" />
            <span>Sign in with GitHub</span>
          </button>
        </div>

      </div>
    </main>
  );
}