import { Metadata } from "next";

export const overrideMetadata = (
    title: string,
    description: string
  ): Metadata => {
    return {
      title,
      description,
      openGraph: {
        description,
        title,
      },
    };
  };
  