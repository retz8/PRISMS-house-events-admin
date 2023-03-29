import React, { useContext } from "react";
import styles from "./SideBar.module.css";
import HomeIcon from "@mui/icons-material/Home";
import OtherHousesIcon from "@mui/icons-material/OtherHouses";
import EventIcon from "@mui/icons-material/Event";
import PersonIcon from "@mui/icons-material/Person";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import { Link } from "react-router-dom";
import { loggedInUserContext } from "../../hooks/UserContext";

export default function SideBar() {
  const userContext = useContext(loggedInUserContext);

  const handleLogout = () => {
    window.open(
      "https://prisms-house-events-api.onrender.com/auth/logout",
      "_self"
    );
  };

  return (
    <div className={styles.sideBar}>
      <ul className={styles.sideBarList}>
        <li className={styles.sideBarListItem}>
          <HomeIcon className={styles.sideBarIcon} />
          <Link to="/">Home</Link>
        </li>
        {userContext ? (
          userContext.role === "Admin" || userContext.role === "HouseLeader" ? (
            <div>
              <li className={styles.sideBarListItem}>
                <OtherHousesIcon className={styles.sideBarIcon} />
                <Link to="/houses">Houses</Link>
              </li>
              <li className={styles.sideBarListItem}>
                <EventIcon className={styles.sideBarIcon} />
                <Link to="/events">Events</Link>
              </li>
              <li className={styles.sideBarListItem}>
                <PersonIcon className={styles.sideBarIcon} />
                <Link to="/users">Users</Link>
              </li>
              <li className={styles.sideBarListItem} onClick={handleLogout}>
                <LogoutIcon className={styles.sideBarIcon} />
                Logout
              </li>
            </div>
          ) : (
            <li className={styles.sideBarListItem} onClick={handleLogout}>
              <LogoutIcon className={styles.sideBarIcon} />
              Logout
            </li>
          )
        ) : (
          <li className={styles.sideBarListItem}>
            <LoginIcon className={styles.sideBarIcon} />
            <Link to="/login">Login</Link>
          </li>
        )}
      </ul>
    </div>
  );
}
