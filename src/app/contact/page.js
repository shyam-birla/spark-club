import ContactForm from "@/components/ContactForm";
import Link from "next/link";
import { client } from "../../../sanity/lib/client";

const SocialLink = ({ href, children }) => (
  <Link href={href} target="_blank" className="text-gray-500 hover:text-black transition-colors">
    {children}
  </Link>
);

const socialLinksQuery = `*[_type == "socialLink"]{
  _id,
  name,
  url
}`;

export default async function ContactPage() {
  const socialLinks = await client.fetch(socialLinksQuery);

  return (
    // === YAHAN BADLAV KIYA GAYA HAI ===
    <main className="bg-gray-50/50 backdrop-blur-sm py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-black">Get in Touch</h1>
          <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
            Have a question, a project idea, or just want to say hi? We&apos;d love to hear from you.
          </p>
        </div>

        <ContactForm />

        <div className="text-center mt-16">
          <h2 className="text-2xl font-semibold text-black mb-4">Connect with us on Social Media</h2>
          <div className="flex justify-center items-center gap-6 text-2xl">
            {socialLinks.map((link) => (
              <SocialLink key={link._id} href={link.url}>
                {link.name}
              </SocialLink>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}