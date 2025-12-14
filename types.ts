export interface Project {
  id: string;
  client: string;
  category: string;
  color: string;
  textColor: string;
  logoText: string;
  linkText: string;
  image?: string; // Optional real image, usually we use CSS backgrounds for this demo
}

export interface NavLink {
  label: string;
  href: string;
}