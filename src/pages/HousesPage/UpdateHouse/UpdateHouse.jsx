import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

import { getHouse, getLeaders, getMembers } from "../../../api/house";
import { updateHouse } from "../../../api/house";
import { uploadImage } from "../../../api";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ColorLensIcon from "@mui/icons-material/ColorLens";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import PsychologyAltIcon from "@mui/icons-material/PsychologyAlt";
import styles from "./UpdateHouse.module.css";

const defaultHouse = {
  name: "",
  point: 0,
  motto: "",
  enMotto: "",
  crest: {
    url: "",
    public_id: "",
  },
  color: "",
};
const defaultLeaders = {
  faculty: {
    0: {
      displayName: "None",
    },
  },
  student: {
    0: {
      displayName: "None",
    },
  },
};

export default function UpdateHouse() {
  const location = useLocation();
  const houseId = location.state.houseId;
  const houseName = location.state.houseName;

  const [house, setHouse] = useState({});
  const [newHouse, setNewHouse] = useState(defaultHouse);
  const [members, setMembers] = useState([]);
  const [leaders, setLeaders] = useState(defaultLeaders);
  const [newCrestObj, setNewCrestObj] = useState(null);
  const [newCrestURL, setNewCrestURL] = useState();

  // useEffect ---------------------------------------
  const fetchHouseInfo = async () => {
    // error혹은 post json파일이 getPosts(backend)에서 return된다
    const { error, house } = await getHouse(houseId);
    if (error) {
      // failed to get house
      return;
    }

    const { error: memberError, users } = await getMembers(houseName);
    if (memberError) return;
    setMembers(users);

    const { error: leaderError, leaders } = await getLeaders(houseName);
    if (leaderError) return;
    setLeaders(leaders);

    setHouse(house);
    setNewHouse(house);
    setNewCrestURL(house.crest?.url);
  };

  useEffect(() => {
    fetchHouseInfo();
  }, []);
  // -------------------------------------------------

  const handleImageLocalUpload = ({ target }) => {
    const file = target.files[0];

    if (!file?.type?.includes("image")) {
      return;
      // This is not an image
    }
    const tmpURL = URL.createObjectURL(file);
    console.log(tmpURL);
    setNewCrestURL(tmpURL);
    setNewCrestObj(file);
  };

  // handle change & submit
  const handleChange = ({ target }) => {
    const { value, id } = target;
    if (id === "name") {
      return setNewHouse({ ...newHouse, name: value });
    }
    if (id === "point") {
      return setNewHouse({ ...newHouse, point: value });
    }
    if (id === "color") {
      return setNewHouse({ ...newHouse, color: value });
    }
    if (id === "motto") {
      return setNewHouse({ ...newHouse, motto: value });
    }
    if (id === "enMotto") {
      return setNewHouse({ ...newHouse, enMotto: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, point, crest, motto, enMotto, color } = newHouse;

    let newCrest = crest;
    console.log("newCrestOBj");
    console.log(newCrestObj);

    if (newCrestObj) {
      const formData = new FormData();
      formData.set("image", newCrestObj);

      const { error, image, public_id } = await uploadImage(formData);
      if (error) {
        // failed to upload image
        return;
      }
      newCrest = { url: image, public_id };
    }

    const newPoint = Number(point);

    const finalHouse = {
      name,
      point: newPoint,
      motto,
      enMotto,
      color,
    };

    finalHouse.crest = newCrest;

    console.log("Submit");
    console.log(finalHouse);
    const { error, house } = await updateHouse(houseId, finalHouse);

    if (error) {
      // failed to update house
      return;
    }

    setHouse(house);
    setNewHouse(house);
    setNewCrestObj({});
    setNewCrestURL(house.crest?.url);
  };

  // const { name, point, motto, enMotto, color } = newHouse;

  return (
    <div className={styles.updateHouse}>
      {house && leaders ? (
        <div>
          <div className={styles.updateHouseTop}>
            <Link to="/houses">
              <ArrowBackIcon className={styles.backButton} />
            </Link>
            <span className={styles.updateHouseTitle}>
              Edit House: {house.name}
            </span>
          </div>
          <div className={styles.contentsContainer}>
            <div className={styles.houseShow}>
              <div className={styles.houseShowTop}>
                <img
                  src={house.crest?.url}
                  alt=""
                  className={styles.houseShowImg}
                />
                <div className={styles.houseShowTopTitle}>
                  <span
                    className={styles.houseShowName}
                    style={{ fontSize: "20px" }}
                  >
                    {house.name}
                  </span>
                  <span
                    className={styles.houseShowPoint}
                    style={{ marginBottom: "10px" }}
                  >
                    Point: {house.point}
                  </span>
                  <span style={{ fontWeight: "bold" }}>FHL</span>
                  {leaders.faculty[0] ? (
                    <span className={styles.houseShowPoint}>
                      {leaders.faculty[0].displayName}
                    </span>
                  ) : (
                    <span>None</span>
                  )}
                  <span style={{ fontWeight: "bold" }}>SHL</span>
                  {leaders.student[0] ? (
                    <span className={styles.houseShowPoint}>
                      {leaders.student[0].displayName}
                    </span>
                  ) : (
                    <span>None</span>
                  )}
                </div>
              </div>
              <div className={styles.houseShowBottom}>
                <div className={styles.houseBaseProfile}>
                  <span className={styles.houseShowTitle}>House Details</span>
                  <div className={styles.houseShowInfo}>
                    <ColorLensIcon className={styles.houseShowIcon} />
                    <span className={styles.houseShowInfoTitle}>
                      {house.color}
                    </span>
                  </div>
                  <div className={styles.houseShowInfo}>
                    <PsychologyAltIcon className={styles.houseShowIcon} />
                    <span className={styles.houseShowInfoTitle}>
                      {house.motto}
                    </span>
                  </div>
                  <div className={styles.houseShowInfo}>
                    <PsychologyAltIcon className={styles.houseShowIcon} />
                    <span className={styles.houseShowInfoTitle}>
                      {house.enMotto}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.houseUpdate}>
              <span className={styles.houseUpdateTitle}>Edit</span>
              <form className={styles.houseUpdateForm}>
                <div className={styles.houseUpdateLeft}>
                  <div className={styles.houseUpdateItem}>
                    <label>Name</label>
                    <input
                      value={newHouse.name}
                      type="text"
                      id="name"
                      onChange={handleChange}
                      placeholder={house.name}
                      className={styles.houseUpdateInput}
                    />
                  </div>
                  <div className={styles.houseUpdateItem}>
                    <label>Point</label>
                    <div>
                      <input
                        value={newHouse.point}
                        type="number"
                        id="point"
                        onChange={handleChange}
                        placeholder={house.point}
                        className={styles.houseUpdateInput}
                      />
                    </div>
                  </div>
                  <div className={styles.houseUpdateItem}>
                    <label>Color</label>
                    <input
                      value={newHouse.color}
                      type="text"
                      id="color"
                      onChange={handleChange}
                      placeholder={house.color}
                      className={styles.houseUpdateInput}
                    />
                  </div>
                  <div className={styles.houseUpdateItem}>
                    <label>Motto</label>
                    <input
                      value={newHouse.motto}
                      type="text"
                      id="motto"
                      onChange={handleChange}
                      placeholder={house.motto}
                      className={styles.houseUpdateInput}
                    />
                  </div>
                  <div className={styles.houseUpdateItem}>
                    <label>Motto (English)</label>
                    <input
                      value={newHouse.enMotto}
                      type="text"
                      id="enMotto"
                      onChange={handleChange}
                      placeholder={house.enMotto}
                      className={styles.houseUpdateInput}
                    />
                  </div>
                </div>
                <div className={styles.houseUpdateRight}>
                  <div className={styles.houseUpdateUpload}>
                    <img
                      src={newCrestURL}
                      alt=""
                      className={styles.houseUpdateImg}
                    />
                    <input
                      type="file"
                      name="crest"
                      id="crest"
                      accept="image/*"
                      className={styles.imageInput}
                      onChange={handleImageLocalUpload}
                      hidden
                    />
                    <label
                      htmlFor="crest"
                      className={styles.crestUpdateContainer}
                    >
                      <CloudUploadIcon className={styles.houseUpdateIcon} />
                      <span>Upload Image</span>
                    </label>
                  </div>
                  <button
                    className={styles.houseUpdateButton}
                    onClick={handleSubmit}
                  >
                    Update
                  </button>
                </div>
              </form>
            </div>
            {members ? (
              <div className={styles.houseUpdate}>
                <span className={styles.houseUpdateTitle}>Edit Members</span>
                <div className={styles.leadersUpdateContainer}>
                  <span style={{ fontWeight: "bold" }}>Leaders</span>
                  <div>
                    <span className={styles.houseShowTitle}>Faculty</span>
                    {leaders.faculty[0] ? (
                      <div className={styles.memberContainer}>
                        <div className={styles.memberProfile}>
                          {leaders.faculty[0].profilePic?.url ? (
                            <img
                              className={styles.houseMemberPic}
                              src={leaders.faculty[0].profilePic.url}
                              alt=""
                            />
                          ) : (
                            <></>
                          )}
                          <span className={styles.houseMemberText}>
                            {leaders.faculty[0].displayName}
                          </span>
                        </div>
                        <Link to={"/update-user/" + leaders.faculty[0]._id}>
                          <button className={styles.houseMemberButton}>
                            Edit
                          </button>
                        </Link>
                      </div>
                    ) : (
                      <div className={styles.memberContainer}>
                        <span>None</span>
                      </div>
                    )}
                  </div>
                  <div>
                    <span className={styles.houseShowTitle}>Student</span>
                    {leaders.student[0] ? (
                      <div className={styles.memberContainer}>
                        <div className={styles.memberProfile}>
                          {leaders.student[0].profilePic?.url ? (
                            <img
                              className={styles.houseMemberPic}
                              src={leaders.student[0].profilePic.url}
                              alt=""
                            />
                          ) : (
                            <></>
                          )}
                          <span className={styles.houseMemberText}>
                            {leaders.student[0].displayName}
                          </span>
                        </div>
                        <Link to={"/update-user/" + leaders.student[0]._id}>
                          <button className={styles.houseMemberButton}>
                            Edit
                          </button>
                        </Link>
                      </div>
                    ) : (
                      <div className={styles.memberContainer}>
                        <span>None</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className={styles.membersUpdateContainer}>
                  <div className={styles.membersContainer}>
                    <span style={{ fontWeight: "bold" }}>Members</span>
                    <div className={styles.houseMemberList}>
                      {members.map((member, index) => {
                        return (
                          <div key={index} className={styles.memberContainer}>
                            <div className={styles.memberProfile}>
                              <img
                                className={styles.houseMemberPic}
                                src={member.profilePic?.url}
                                alt=""
                              />
                              {member.role === "HouseLeader" ? (
                                <span
                                  className={styles.houseMemberText}
                                  style={{ fontWeight: "bold" }}
                                >
                                  {member.displayName}
                                </span>
                              ) : (
                                <span className={styles.houseMemberText}>
                                  {member.displayName}
                                </span>
                              )}
                            </div>
                            <Link to={"/update-user/" + member.id}>
                              <button className={styles.houseMemberButton}>
                                Edit
                              </button>
                            </Link>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <span>Loading...</span>
            )}
          </div>
        </div>
      ) : (
        <span className={styles.updateHouseTitle}>Loading...</span>
      )}
    </div>
  );
}
