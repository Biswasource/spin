import { NavLink, Project } from './types';

export const NAV_LINKS: NavLink[] = [
  { label: 'OUR WORK', href: '/' },
  { label: 'ABOUT US', href: '/about' },
  { label: 'BLOGS', href: '/blog' },
  { label: 'REVIEWS', href: '/reviews' },
  { label: 'CLIENTS', href: '#' },
  { label: 'TEAM', href: '#' },
  { label: 'BOOK A CALL', href: '/book-call' },
];

export const PROJECTS: Project[] = [
  {
    id: '1',
    client: 'TLH',
    category: 'LAW FIRM BRANDING',
    color: 'bg-[#181818]',
    textColor: 'text-white',
    logoText: 'TLH',
    linkText: 'Visit Website',
  },
  {
    id: '2',
    client: 'Sevenloop',
    category: 'MANUFACTURING SOLUTION',
    color: 'bg-gradient-to-br from-orange-600 to-orange-400',
    textColor: 'text-white',
    logoText: 'sevenloop',
    linkText: 'View Case Study',
  },
  {
    id: '3',
    client: 'Adnaut',
    category: 'AD TECH',
    color: 'bg-[#1A1A1A]',
    textColor: 'text-white',
    logoText: 'Adnaut.',
    linkText: 'View Case Study',
  },
  {
    id: '4',
    client: 'Lumora Security',
    category: 'CYBER SECURITY',
    color: 'bg-gradient-to-br from-yellow-50 to-yellow-100',
    textColor: 'text-black',
    logoText: 'LUMORA',
    linkText: 'View Project',
  },
];