import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const loggedInUserContext = createContext({});
export default function UserContext(props) {
  // fetch logged-in user data from the backend
  // store logged-in user data at "value"
  const [userObject, setUserObject] = useState();

  useEffect(() => {
    axios
      .get("https://prisms-house-events-api.onrender.com/auth/user", {
        withCredentials: true,
      })
      .then((res) => {
        console.log(res);
        if (res.data) {
          setUserObject(res.data);
        }
      });
  }, []);
  return (
    <loggedInUserContext.Provider value={userObject}>
      {props.children}
    </loggedInUserContext.Provider>
  );
}
