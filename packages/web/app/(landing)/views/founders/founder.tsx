import React from "react";
import IconPerson from "../../../components/icons/icon-person";
import styles from "./founder.module.scss";
import Image, { StaticImageData } from "next/image";

import AvatarYuriy from './assets/yuriy.png';
import AvatarVladisalv from "./assets/vladislav.png";
import AvatarArtem from "./assets/artem.png";
import AvatarSergey from "./assets/sergey.png";

interface Props {
  name: string;
  children: React.ReactNode;
}

const avatars: Record<string, StaticImageData> = {
  yuriy: AvatarYuriy,
  vladislav: AvatarVladisalv,
  sergey: AvatarSergey,
  artem: AvatarArtem,
};

const Founder: React.FC<Props> = ({ children, name }) => {
  return (
    <li className={styles.container}>
      <div className={styles.avatar}>
        <Image src={avatars[name]} alt="avatar" placeholder="blur" />
      </div>
      {children}
    </li>
  );
};

export default Founder;
