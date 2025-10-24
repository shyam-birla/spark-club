'use client';

import Link from 'next/link';
import { FaChevronRight, FaHome, FaCalendarAlt, FaTachometerAlt, FaProjectDiagram, FaBook, FaCodeBranch, FaRoad, FaFlask, FaCalendar, FaUser, FaBlog, FaInfoCircle, FaUsers, FaEnvelope, FaCheckCircle, FaExclamationCircle, FaAward, FaTools, FaExclamationTriangle, FaSearch, FaUserCircle, FaDownload, FaShareAlt, FaLinkedin, FaWhatsapp, FaInstagram, FaGithub } from 'react-icons/fa';

const IconMap = {
  FaHome,
  FaCalendarAlt,
  FaTachometerAlt,
  FaProjectDiagram,
  FaBook,
  FaCodeBranch,
  FaRoad,
  FaFlask,
  FaCalendar,
  FaUser,
  FaBlog,
  FaInfoCircle,
  FaUsers,
  FaEnvelope,
  FaCheckCircle,
  FaExclamationCircle,
  FaAward,
  FaTools,
  FaExclamationTriangle,
  FaSearch,
  FaUserCircle,
  FaDownload,
  FaShareAlt,
  FaLinkedin,
  FaWhatsapp,
  FaInstagram,
  FaGithub,
};

const Breadcrumbs = ({ items }) => {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <nav className="flex" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-3">
        {items.map((item, index) => {
          const IconComponent = item.icon ? IconMap[item.icon] : null;
          return (
            <li key={index} className="inline-flex items-center">
              {index > 0 && (
                <FaChevronRight className="w-3 h-3 text-gray-400 mx-1" />
              )}
              {item.href ? (
                              <Link href={item.href} className="text-sm font-medium text-gray-800 hover:text-blue-600 flex items-center gap-1">
                                {IconComponent && <IconComponent className="w-3 h-3" />}
                                {item.label}
                              </Link>
                            ) : (
                              <span className="text-sm font-medium text-gray-700 flex items-center gap-1">
                                {IconComponent && <IconComponent className="w-3 h-3" />}
                                {item.label}
                              </span>              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
