type Sitemap = Array<{
  url: string;
  lastModified?: string | Date;
}>;

export default function sitemap(): Sitemap {
  return [
    {
      url: "https://eonian.finance",
      lastModified: new Date(),
    },
    {
      url: "https://eonian.finance/mission",
      lastModified: new Date(),
    },
    {
      url: "https://eonian.finance/faq",
      lastModified: new Date(),
    },
    {
      url: "https://eonian.finance/community",
      lastModified: new Date(),
    },
    {
      url: "https://eonian.finance/security",
      lastModified: new Date(),
    },
  ];
}
