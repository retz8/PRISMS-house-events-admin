import React, { useContext } from "react";
import { loggedInUserContext } from "../../hooks/UserContext";
import styles from "./TopBar.module.css";
import { Link } from "react-router-dom";

export default function TopBar() {
  const userContext = useContext(loggedInUserContext);

  return (
    <div className={styles.topBar}>
      <div className={styles.topBarContainer}>
        <div className={styles.topLeft}>
          <Link to="/" className={styles.logo}>
            PRISMS House Events Admin Panel
          </Link>
        </div>
        <div className={styles.nameContainer}>
          <img
            src={
              userContext
                ? userContext.profilePic.url
                : process.env.REACT_APP_DEFAULT_PROFILE_PIC_URL
            }
            alt="profilePic"
            className={styles.topAvatar}
          />

          {userContext ? (
            <span className={styles.name}>{userContext.displayName}</span>
          ) : (
            <span className={styles.name}>Guest</span>
          )}
        </div>
      </div>
    </div>
  );
}
