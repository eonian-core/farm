import IconDiscord from "./components/icons/icon-discord";
import IconGithub from "./components/icons/icon-github";
import IconMedium from "./components/icons/icon-medium";
import IconTelegram from "./components/icons/icon-telegram";
import IconTwitter from "./components/icons/icon-twitter";
import IconYoutube from "./components/icons/icon-youtube";

export interface SocialLink {
  name: string;
  href: string;
  icon: React.ReactNode;
}

export interface LocalesSocials {
  [locale: string]: Array<SocialLink>
}

export const socials: LocalesSocials = {
  en: [
    {
      name: "Telegram",
      icon: <IconTelegram />,
      href: "https://t.me/+9yTj0kBHbMozMDAy",
    },
    {
      name: "Medium",
      icon: <IconMedium />,
      href: "https://medium.com/eonian-finance",
    },
    {
      name: "GitHub",
      icon: <IconGithub />,
      href: "https://github.com/eonian-core",

    },
    {
      name: "Twitter",
      icon: <IconTwitter />,
      href: "https://twitter.com/EonianFinance",

    },
    {
      name: "Discord",
      icon: <IconDiscord />,
      href: "https://discord.gg/nsvDz7EA",

    },
  ],
  
  ru: [
    {
      name: "Telegram",
      icon: <IconTelegram />,
      href: "https://t.me/firstblockrus",

    },
    {
      name: "YouTube",
      icon: <IconYoutube />,
      href: "https://www.youtube.com/@eonian3304"
    }
  ]
}


export default socials;
