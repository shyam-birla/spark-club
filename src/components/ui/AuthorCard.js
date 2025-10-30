
import { FaLinkedin, FaGithub, FaGlobe } from 'react-icons/fa';
import Image from 'next/image';

const AuthorCard = ({ authorProfile, editableAuthorLinkedin, editableAuthorGithub, editableAuthorPortfolio, setEditableAuthorLinkedin, setEditableAuthorGithub, setEditableAuthorPortfolio }) => {
  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
      <div className="flex flex-col space-y-1.5 p-6">
        <h3 className="whitespace-nowrap text-2xl font-semibold leading-none tracking-tight">Author Information</h3>
      </div>
      <div className="p-6 pt-0">
        <div className="flex items-center gap-4">
          {authorProfile?.profileRef?.userImage?.asset?.url ? (
            <Image src={authorProfile.profileRef.userImage.asset.url} alt={authorProfile.name} width={64} height={64} className="w-16 h-16 rounded-full object-cover" />
          ) : (
            <div className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center">
              <span className="text-xl font-bold text-gray-600">{authorProfile?.name ? authorProfile.name.charAt(0).toUpperCase() : ''}</span>
            </div>
          )}
          <p className="text-lg font-semibold">{authorProfile?.name || 'N/A'}</p>
        </div>
        <div className="mt-4 space-y-2">
          <div className="flex items-center gap-2">
            <FaLinkedin className="h-5 w-5 text-gray-500" />
            <input
              type="url"
              id="editableAuthorLinkedin"
              value={editableAuthorLinkedin}
              onChange={(e) => setEditableAuthorLinkedin(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="https://linkedin.com/in/..."
            />
          </div>
          <div className="flex items-center gap-2">
            <FaGithub className="h-5 w-5 text-gray-500" />
            <input
              type="url"
              id="editableAuthorGithub"
              value={editableAuthorGithub}
              onChange={(e) => setEditableAuthorGithub(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="https://github.com/..."
            />
          </div>
          <div className="flex items-center gap-2">
            <FaGlobe className="h-5 w-5 text-gray-500" />
            <input
              type="url"
              id="editableAuthorPortfolio"
              value={editableAuthorPortfolio}
              onChange={(e) => setEditableAuthorPortfolio(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="https://my-portfolio.com"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthorCard;
