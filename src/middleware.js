// src/middleware.js (Updated with protected event detail pages)

export { default } from "next-auth/middleware"

export const config = { 
  matcher: [
    // Profile pages (pehle se protected hain)
    '/profile',
    '/profile/edit',

    // Learning interface (pehle se protected hai)
    '/learn/:path*', 
    '/contact',
    '/join',
    // --- NAYA RULE ADD KIYA GAYA HAI ---
    // Yeh rule '/events' ke andar ke saare pages ko protect karega, 
    // lekin '/events' page ko nahi.
    '/events/:path*',
  ] 
};