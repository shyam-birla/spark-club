import Link from 'next/link';
import Image from 'next/image';

const MemberCard = ({ member }) => {
  return (
    <Link href={`/members/${member.slug}`}>
      <div className="bg-gray-800 rounded-lg overflow-hidden text-center transform hover:scale-105 transition-transform duration-300 cursor-pointer">
        <div className="relative w-full h-60">
          <Image
            src={member.imageUrl || '/placeholder.png'}
            alt={member.name}
            layout="fill"
            objectFit="cover"
          />
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