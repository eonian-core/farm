import React from "react";
import Link from "next/link";
import Image from 'next/image'
import styles from './contacts.module.scss';
import GrowingTree from './growing_tree.png'

import { SocialLink } from "../../socials"

export interface ContactsProps {
    locale: string
    socialLinks: Array<SocialLink>
}

export const Contacts = ({ locale, socialLinks }: ContactsProps) => {
    const localLinks = useLocalSocialLinks(locale, socialLinks)

    return (
        <div className={styles.contacts}>
            <Image src={GrowingTree} alt="Growing Neon Tree" placeholder="blur" />
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
