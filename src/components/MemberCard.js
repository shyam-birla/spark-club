// Image component ko hata diya gaya hai
import Link from 'next/link';

const MemberCard = ({ member }) => {
  return (
    <Link href={`/members/${member.slug}`}>
      <div className="bg-gray-800 rounded-lg overflow-hidden text-center transform hover:scale-105 transition-transform duration-300 cursor-pointer">
        <div className="relative w-full h-60">
          {member.imageUrl ? (
            // YAHAN BHI BADLAV KIYA GAYA HAI:
            // Normal <img> tag use kiya gaya hai
            <img
              src={member.imageUrl}
              alt={member.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-700 flex items-center justify-center">
              <span className="text-gray-400">No Image</span>
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="text-xl font-bold text-white">{member.name}</h3>
          <p className="text-orange-400">{member.role}</p>
        </div>
      </div>
    </Link>
  );
};

export default MemberCard;