import React from "react";
import Link from "next/link";
import styles from './contacts.module.scss';

import { SocialLink } from "../../socials"

export interface ContactsProps {
    locale: string
    socialLinks: Array<SocialLink>
}

export const Contacts = ({ locale, socialLinks }: ContactsProps) => {
    const localLinks = useLocalSocialLinks(locale, socialLinks)

    return (
        <div className={styles.contacts}>
            <ul>
                {localLinks.map(({ name, href, icon }) => (
                    <li key={name}>
                        <Link href={href}><span>{icon}</span>{name}</Link>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default Contacts;

const useLocalSocialLinks = (locale: string, socialLinks: Array<SocialLink>) => 
    socialLinks
        .map(({ name, hrefs, icon }) => ({
            name,
            href: hrefs[locale],
            icon
        }))
        .filter(({ href }) => !!href)
