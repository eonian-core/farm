import rehypeExternalLinks from "rehype-external-links";
import createMDX from "@next/mdx";

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Adds mdx support
  pageExtensions: ["ts", "tsx", "js", "jsx", "md", "mdx"],
};

const withMDX = createMDX({
  extension: /\.mdx?$/,
  options: {
    // If you use remark-gfm, you'll need to use next.config.mjs
    // as the package is ESM only
    // https://github.com/remarkjs/remark-gfm#install
    remarkPlugins: [],

    rehypePlugins: [
      [
        rehypeExternalLinks,
        {
          target: "_blank", // open in new tab
          rel: "noopener noreferrer", // prenect tabnabbing <https://www.freecodecamp.org/news/how-to-use-html-to-open-link-in-new-tab/>
        },
      ],
    ],

    // If you use `MDXProvider`, uncomment the following line.
    providerImportSource: "@mdx-js/react",
  },
});

export default withMDX(nextConfig);
