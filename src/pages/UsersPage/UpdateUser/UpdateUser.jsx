import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { getUser, updateUser } from "../../../api/user";
import { loggedInUserContext } from "../../../hooks/UserContext";
import { uploadImage } from "../../../api/index";

import { MailOutline } from "@mui/icons-material";
import HouseIcon from "@mui/icons-material/House";
import NotesIcon from "@mui/icons-material/Notes";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import styles from "./UpdateUser.module.css";

const defaultUser = {
  displayName: "",
  email: "",
  grade: "",
  role: "",
  house: "",
  introduction: "",
  profilePic: {
    url: process.env.REACT_APP_DEFAULT_PROFILE_PIC_URL,
    public_id: process.env.REACT_APP_DEFAULT_PROFILE_PIC_PUBLIC_ID,
  },
};

export default function UpdateUser() {
  const userContext = useContext(loggedInUserContext);
  const navigate = useNavigate();
  const { userId } = useParams();

  const [curUser, setCurUser] = useState({ ...defaultUser }); // original user
  const [newUserObject, setNewUserObject] = useState({ ...defaultUser }); // updated user info
  const [newProfileURL, setNewProfileURL] = useState(""); // preview profile image url
  const [newProfileObj, setNewProfileObj] = useState({}); // new uploaded iamge file

  // useEffect -------------------------------------------------
  const fetchUser = async () => {
    const { error, user } = await getUser(userId);
    if (error) {
      // unable to fetch user
      return;
    }
    setCurUser(user);
    setNewUserObject(user);
    setNewProfileURL(user.profilePic.url);
  };

  useEffect(() => {
    fetchUser();
  }, []);
  // ------------------------------------------------------------

  const goBack = () => {
    navigate(-1);
  };

  // thumbnail
  const handleImageLocalUpload = async ({ target }) => {
    const file = target.files[0];

    if (!file?.type?.includes("image")) {
      return;
      // This is not an image
    }
    const tmpURL = URL.createObjectURL(file);

    setNewProfileURL(tmpURL);
    setNewProfileObj(file);
  };

  // handleChange & Submit ----------------------------------------------
  const handleChange = ({ target }) => {
    const { value, name } = target;
    if (name === "name") {
      return setNewUserObject({ ...newUserObject, displayName: value });
    }
    if (name === "email") {
      return setNewUserObject({ ...newUserObject, email: value });
    }
    if (name === "house") {
      return setNewUserObject({ ...newUserObject, house: value });
    }
    if (name === "role") {
      return setNewUserObject({ ...newUserObject, role: value });
    }
    if (name === "introduction") {
      return setNewUserObject({ ...newUserObject, introduction: value });
    }
    if (name === "grade") {
      return setNewUserObject({ ...newUserObject, grade: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { displayName, email, profilePic, grade, role, house, introduction } =
      newUserObject;

    let newProfilePic = profilePic;

    if (newProfileObj) {
      const formData = new FormData();
      formData.set("image", newProfileObj);

      const { error, image, public_id } = await uploadImage(formData);
      if (!error) newProfilePic = { url: image, public_id };
    }

    const finalUser = {
      displayName,
      email,
      profilePic: newProfilePic,
      grade,
      role: role === "House Leader" ? "HouseLeader" : role,
      house,
      introduction,
    };
    console.log("Submit");
    console.log(finalUser);

    const { error, user } = await updateUser(userId, finalUser);
    if (error) {
      // unable to update user
      return;
    }

    setCurUser(user);
    setNewUserObject(user);
    setNewProfileObj({});
    setNewProfileURL(user.profilePic.url);
  };
  // --------------------------------------------------------------

  const { displayName, role, grade, email, house, introduction } =
    newUserObject;

  return (
    <div className={styles.updateUser}>
      {curUser ? (
        <div>
          <div className={styles.updateUserTop}>
            <ArrowBackIcon className={styles.backButton} onClick={goBack} />

            {userContext._id === curUser.id ? (
              <span className={styles.updateUserTitle}>
                Edit User (You): {curUser.displayName}
              </span>
            ) : (
              <span className={styles.updateUserTitle}>
                Edit User: {curUser.displayName}
              </span>
            )}
          </div>

          <div className={styles.contentsContainer}>
            <div className={styles.userShow}>
              <div className={styles.userShowTop}>
                <img
                  src={curUser.profilePic.url}
                  alt=""
                  className={styles.userShowImg}
                />
                <div className={styles.userShowTopTitle}>
                  <span className={styles.userShowName}>
                    {curUser.displayName}
                  </span>
                  <span className={styles.userShowRole}>
                    {curUser.role === "HouseLeader"
                      ? "House Leader"
                      : curUser.role}
                    ,{" "}
                    {curUser.grade === "Faculty" || curUser.grade === "Admin"
                      ? curUser.grade
                      : `Grade ${curUser.grade}`}
                  </span>
                </div>
              </div>
              <div className={styles.userShowBottom}>
                <span className={styles.userShowTitle}>Account Details</span>
                <div className={styles.userShowInfo}>
                  <MailOutline className={styles.userShowIcon} />
                  <span className={styles.userShowInfoTitle}>
                    {curUser.email}
                  </span>
                </div>
                <div className={styles.userShowInfo}>
                  <HouseIcon className={styles.userShowIcon} />
                  <span className={styles.userShowInfoTitle}>
                    {curUser.house}
                  </span>
                </div>
                <div className={styles.userShowInfo}>
                  <NotesIcon className={styles.userShowIcon} />
                  <span className={styles.userShowInfoTitle}>
                    {curUser.introduction}
                  </span>
                </div>
              </div>
            </div>
            <div className={styles.userUpdate}>
              <span className={styles.userUpdateTitle}>Edit</span>
              <form className={styles.userUpdateForm}>
                <div className={styles.userUpdateLeft}>
                  <div className={styles.userUpdateItem}>
                    <label>Name</label>
                    <input
                      value={displayName}
                      type="text"
                      name="name"
                      onChange={handleChange}
                      placeholder={curUser.displayName}
                      className={styles.userUpdateInput}
                    />
                  </div>
                  <div className={styles.userUpdateItem}>
                    <label>Grade</label>
                    <input
                      value={grade}
                      type="text"
                      name="grade"
                      onChange={handleChange}
                      placeholder={curUser.grade}
                      className={styles.userUpdateInput}
                    />
                  </div>
                  <div className={styles.userUpdateItem}>
                    <label>Role</label>
                    <input
                      value={role === "HouseLeader" ? "House Leader" : role}
                      type="text"
                      name="role"
                      onChange={handleChange}
                      placeholder={
                        curUser.role === "HouseLeader"
                          ? "House Leader"
                          : curUser.role
                      }
                      className={styles.userUpdateInput}
                    />
                  </div>
                  <div className={styles.userUpdateItem}>
                    <label>Email</label>
                    <input
                      value={email}
                      type="text"
                      idname="email"
                      onChange={handleChange}
                      placeholder={curUser.email}
                      className={styles.userUpdateInput}
                    />
                  </div>
                  <div className={styles.userUpdateItem}>
                    <label>House</label>
                    <input
                      value={house}
                      type="text"
                      onChange={handleChange}
                      name="house"
                      placeholder={curUser.house}
                      className={styles.userUpdateInput}
                    />
                  </div>
                  <div className={styles.userUpdateItem}>
                    <label>Introduction</label>
                    <input
                      value={introduction}
                      type="text"
                      name="introduction"
                      onChange={handleChange}
                      placeholder={curUser.introduction}
                      className={styles.userUpdateInput}
                    />
                  </div>
                </div>
                <div className={styles.userUpdateRight}>
                  <div className={styles.userUpdateUpload}>
                    <img
                      src={newProfileURL}
                      alt=""
                      className={styles.userUpdateImg}
                    />
                    <input
                      type="file"
                      name="profilePic"
                      id="profilePic"
                      accept="image/*"
                      className={styles.imageInput}
                      onChange={handleImageLocalUpload}
                      hidden
                    />
                    <label
                      htmlFor="profilePic"
                      className={styles.profilePicUpdateContainer}
                    >
                      <CloudUploadIcon className={styles.userUpdateIcon} />
                      <span>Upload Image</span>
                    </label>
                  </div>
                  <button
                    className={styles.userUpdateButton}
                    onClick={handleSubmit}
                  >
                    Update
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      ) : (
        <span className={styles.updateUserTitle}>Loading...</span>
      )}
    </div>
  );
}
