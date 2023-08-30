import { ResourcesLinks } from "./features";

type Sitemap = Array<{
  url: string;
  lastModified?: string | Date;
}>;

const domain = "https://eonian.finance";
const currentDate = new Date();

export default function sitemap(): Sitemap {
  return Object.values(ResourcesLinks)
    .filter(({ external }) => !external)
    .filter(({ isEnabled }) => isEnabled)
    .map(link => ({
      url: `${domain}${link.href}`,
      lastModified: currentDate,
    }));
}
