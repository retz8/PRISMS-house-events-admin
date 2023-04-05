import React from "react";
import { FcGoogle } from "react-icons/fc";
import styles from "./LoginPage.module.css";

export default function LoginPage() {
  const googleLogin = () => {
    window.open(process.env.REACT_APP_API_URL + "/auth/google", "_self");
  };

  return (
    <div className={styles.loginPage}>
      <div className={styles.loginForm}>
        <h1 className={styles.loginTitle}>Login</h1>
        <div className={styles.googleContainer} onClick={googleLogin}>
          <FcGoogle className={styles.googleIcon} />
          <p className={styles.loginText}>Login with Google</p>
        </div>
      </div>
    </div>
  );
}
