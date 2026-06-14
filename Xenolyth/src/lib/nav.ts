export interface NavItem {
  label: string;
  href: string;
  status?: 'live' | 'coming-soon';
  children?: NavItem[];
  isButton?: boolean;
}

export const navItems: NavItem[] = [
  {
    label: 'Products',
    href: '#',
    children: [
      {
        label: 'Sentinel',
        href: '/products/sentinel',
        status: 'live'
      }
    ]
  },
  {
    label: 'Research',
    href: '/research'
  },
  {
    label: 'Company',
    href: '#',
    children: [
      {
        label: 'Overview',
        href: '/company'
      }
      // Future items like About, Team, Careers, Press can be appended here cleanly
    ]
  },
  {
    label: 'Contact',
    href: '/contact',
    isButton: true
  }
];
