import ContactForm from "@/components/ContactForm";
import Link from "next/link";

// Social media links ke liye ek chhota component
const SocialLink = ({ href, children }) => (
  <Link href={href} target="_blank" className="text-gray-400 hover:text-orange-400 transition-colors">
    {children}
  </Link>
);

export default function ContactPage() {
  return (
    <main className="container mx-auto px-4 py-20">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold">Get in Touch</h1>
        <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
          Have a question, a project idea, or just want to say hi? We'd love to hear from you.
        </p>
      </div>

      <ContactForm />

      <div className="text-center mt-16">
        <h2 className="text-2xl font-semibold mb-4">Connect with us on Social Media</h2>
        <div className="flex justify-center items-center gap-6 text-2xl">
          <SocialLink href="https://github.com">GitHub</SocialLink>
          <SocialLink href="https://linkedin.com">LinkedIn</SocialLink>
          <SocialLink href="https://twitter.com">X (Twitter)</SocialLink>
        </div>
      </div>
    </main>
  );
}