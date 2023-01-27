import React from "react";
import * as Collapsible from '@radix-ui/react-collapsible';
import styles from './contacts.module.scss';
import IconDownOpen from "../../components/icons/icon-down-open";
import IconClose from "../../components/icons/icon-close";
import ExternalLink from "../../components/links/external-link";
import { SocialLink, useLocalSocials, useOtherLanguageslSocials } from "../../socials";


export const Contacts = () => {
    const localLinks = useLocalSocials()
    const otherLocales = useOtherLanguageslSocials()

    return (
        <div className={styles.contacts}>
            <ul>
                {localLinks.map(({ name, href, icon }) => (
                    <li key={name}>
                        <ExternalLink href={href} icon={icon}>{name}</ExternalLink>
                    </li>
                ))}
            </ul>

            <OtherLanguages otherLocales={otherLocales} />
        </div>
    )
}

export default Contacts;

export const OtherLanguages = ({ otherLocales }: { otherLocales: Record<string, Array<SocialLink>>}) => (
    <OtherLanguagesCollapse>
        <ul className={styles.otherLanguagesHighLevelList}>
            {Object.keys(otherLocales).map(locale => (
                <li key={locale}>
                    <h5>{locale}</h5>
                    <ul>
                        {otherLocales[locale].map(({ name, href, icon }) => (
                            <li key={name}>
                                <ExternalLink href={href} icon={icon}>{name}</ExternalLink>
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
