import React from "react";
import Link from "next/link";
import * as Collapsible from '@radix-ui/react-collapsible';
import styles from './contacts.module.scss';

import { SocialLink } from "../../socials"
import IconDownOpen from "../../components/icons/icon-down-open";
import IconClose from "../../components/icons/icon-close";

export interface ContactsProps {
    locale: string
    socialLinks: Array<SocialLink>
}

export const Contacts = ({ locale, socialLinks }: ContactsProps) => {
    const [localLinks, otherLocales] = useLocalSocialLinks(locale, socialLinks)

    return (
        <div className={styles.contacts}>
            <ul>
                {localLinks.map(({ name, href, icon }) => (
                    <li key={name}>
                        <Link href={href}><span>{icon}</span>{name}</Link>
                    </li>
                ))}
            </ul>

            <OtherLanguages otherLocales={otherLocales} />
        </div>
    )
}

export default Contacts;

export interface LocalSocialLink {
    name: string;
    href: string;
    icon: React.ReactNode;
}

// TODO: use better format for social links, remove this function
const useLocalSocialLinks = (locale: string, socialLinks: Array<SocialLink>): [Array<LocalSocialLink>, Record<string, Array<LocalSocialLink>>] => {
    const otherLocales: Record<string, Array<LocalSocialLink>> = {};

    const localeSpecific: Array<LocalSocialLink> = socialLinks
        .map(({ name, hrefs, icon }) => {
            Object.keys(hrefs)
                .filter(hrefLocale => hrefLocale !== locale)
                .forEach(hrefLocale => {
                    otherLocales[hrefLocale] = otherLocales[hrefLocale] || [];
                    otherLocales[hrefLocale].push({
                        name,
                        href: hrefs[hrefLocale],
                        icon
                    })
            })

            return ({
                name,
                href: hrefs[locale],
                icon
            })
    })
        .filter(({ href }) => !!href)

    return [localeSpecific, otherLocales];
}

export const OtherLanguages = ({ otherLocales }: { otherLocales: Record<string, Array<LocalSocialLink>>}) => (
    <OtherLanguagesCollapse>
        <ul className={styles.otherLanguagesHighLevelList}>
            {Object.keys(otherLocales).map(locale => (
                <li key={locale}>
                    <h5>{locale}</h5>
                    <ul>
                        {otherLocales[locale].map(({ name, href, icon }) => (
                            <li key={name}>
                                <Link href={href}><span>{icon}</span>{name}</Link>
                            </li>
                        ))}
                    </ul>
                </li>
            ))}
        </ul>
    </OtherLanguagesCollapse>
)

export const OtherLanguagesCollapse = ({ children }: { children: React.ReactNode }) => {
    const [open, setOpen] = React.useState(false);

    return (
        <Collapsible.Root open={open} onOpenChange={setOpen} className={styles.otherLanguagesCollapse}>
            <Collapsible.Trigger asChild>
                <div className={styles.otherLanguagesTrigger}>
                    <span>Other Languages</span>
                    
                    <button className={styles.icon}>{
                        !open ? 
                            <IconDownOpen /> : 
                            <IconClose />
                    }</button>
                </div>
            </Collapsible.Trigger>

            <Collapsible.Content>
                {children}
            </Collapsible.Content>
        </Collapsible.Root>
    )
}