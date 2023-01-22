import React from "react";
import IconPerson from "../../../components/icons/icon-person";
import styles from "./founder.module.scss";
import Image from "next/image";

interface Props {
  avatar: string;
  children: React.ReactNode;
}

const Founder: React.FC<Props> = ({ children, avatar }) => {
  return (
    <li className={styles.container}>
      <div className={styles.avatar}>
        {avatar ? (
          <Image src={avatar} alt="avatar" fill />
        ) : (
          <IconPerson width="100%" height="100%" />
        )}
      </div>
      {children}
    </li>
  );
};

export default Founder;
