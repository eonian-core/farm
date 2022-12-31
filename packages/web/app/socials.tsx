import IconDiscord from "./components/icons/icon-discord";
import IconGithub from "./components/icons/icon-github";
import IconMedium from "./components/icons/icon-medium";
import IconTelegram from "./components/icons/icon-telegram";
import IconTwitter from "./components/icons/icon-twitter";
import IconYoutube from "./components/icons/icon-youtube";

export interface SocialLink {
  name: string;
  hrefs: Record<string, string>;
  icon: React.ReactNode;
}

const socials: SocialLink[] = [
  {
    name: "Telegram",
    icon: <IconTelegram />,
    hrefs: {
      en: "https://t.me/+9yTj0kBHbMozMDAy",
      ru: "https://t.me/firstblockrus",
    },
  },
  {
    name: "Medium",
    icon: <IconMedium />,
    hrefs: {
      en: "https://medium.com/eonian-finance",
    },
  },
  {
    name: "GitHub",
    icon: <IconGithub />,
    hrefs: {
      en: "https://github.com/eonian-core",
    },
  },
  {
    name: "Twitter",
    icon: <IconTwitter />,
    hrefs: {
      en: "https://twitter.com/EonianFinance",
    },
  },
  {
    name: "Discord",
    icon: <IconDiscord />,
    hrefs: {
      en: "https://discord.gg/nsvDz7EA",
    },
  },
  {
    name: "YouTube",
    icon: <IconYoutube />,
    hrefs: {
      ru: "https://www.youtube.com/@eonian3304"
    },
  }
];

export default socials;
