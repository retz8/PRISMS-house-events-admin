import React, { useContext } from "react";
import { loggedInUserContext } from "../../hooks/UserContext";

import OtherHousesIcon from "@mui/icons-material/OtherHouses";
import EventIcon from "@mui/icons-material/Event";
import PersonIcon from "@mui/icons-material/Person";
import styles from "./HomePage.module.css";

export default function HomePage() {
  const userContext = useContext(loggedInUserContext);
  return (
    <div className={styles.homePage}>
      {userContext && userContext.displayName ? (
        userContext.role === "Admin" || userContext.role === "HouseLeader" ? (
          <div>
            <div className={styles.homePageTop}>
              <span className={styles.homePageTitle}>
                Welcome Back, {userContext.displayName}
              </span>
            </div>
            <div className={styles.contentsContainer}>
              <div className={styles.descContainer}>
                <OtherHousesIcon className={styles.descIcon} />
                <span className={styles.descTitle}>Houses:</span>
                <span className={styles.descText}>
                  Manage House Profiles & Points
                </span>
              </div>
              <div className={styles.descContainer}>
                <EventIcon className={styles.descIcon} />
                <span className={styles.descTitle}>Events:</span>
                <span className={styles.descText}>
                  Create / Update / Delete House Events
                </span>
              </div>
              <div className={styles.descContainer}>
                <PersonIcon className={styles.descIcon} />
                <span className={styles.descTitle}>Users:</span>
                <span className={styles.descText}>
                  Manage Users and their profiles
                </span>
              </div>
            </div>
          </div>
        ) : (
          <h1>Sorry, you don't have access to admin panel.</h1>
        )
      ) : (
        // eslint-disable-next-line no-unused-vars
        <div className={styles.welcome}>
          <h1>Welcome to PRISMS House Activity Admin Panel</h1>
        </div>
      )}
    </div>
  );
}
