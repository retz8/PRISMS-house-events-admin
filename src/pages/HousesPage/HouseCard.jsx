import React, { useEffect, useState } from "react";
import BoyIcon from "@mui/icons-material/Boy";
import EmojiPeopleIcon from "@mui/icons-material/EmojiPeople";
import styles from "./HouseCard.module.css";
import { useNavigate } from "react-router-dom";
import { getLeaders, updateHousePoint } from "../../api/house";

const defaultLeaders = {
  faculty: { 0: { displayName: "None" } },
  student: { 0: { displayName: "None" } },
};

export default function HouseCard({ house }) {
  const navigate = useNavigate();

  const [leader, setLeader] = useState(defaultLeaders);
  const [curPoint, setCurPoint] = useState(0);
  const [addPoint, setAddPoint] = useState("");

  // useEffect --------------------------------------
  const fetchHouseLeaders = async () => {
    const { error, leaders } = await getLeaders(house.name);
    if (error) {
      return;
    }
    setLeader(leaders);
  };

  useEffect(() => {
    fetchHouseLeaders();
    setCurPoint(house.point);
  }, []);
  // ------------------------------------------------

  const onClickEdit = () => {
    navigate("/update-house", {
      state: {
        houseId: house.id,
        houseName: house.name,
      },
    });
  };

  const handlePointIncrement = async () => {
    const pointObj = {
      point: addPoint,
    };
    const { error, newHouse } = await updateHousePoint(house.id, pointObj);
    if (error) return;
    setCurPoint(newHouse.point);
    setAddPoint("");
  };

  const handlePointDecrement = async () => {
    const pointObj = {
      point: -Math.abs(addPoint),
    };
    const { error, newHouse } = await updateHousePoint(house.id, pointObj);
    if (error) return;
    setCurPoint(newHouse.point);
    setAddPoint("");
  };

  const bgColorString = house.color === "blue" ? "dodgerblue" : house.color;

  return (
    <div className={styles.pageWrapper}>
      <div
        style={{
          position: "absolute",
          opacity: 0.3,
          backgroundColor: bgColorString,
          height: "100%",
          width: "100%",
          top: 0,
          left: 0,
          borderRadius: "10px",
        }}
      ></div>
      <div className={styles.houseCard}>
        <div className={styles.houseCardTop}>
          <div className={styles.houseCardTopTop}>
            <span className={styles.houseName}>{house.name}</span>
            <button className={styles.editButton} onClick={onClickEdit}>
              Edit
            </button>
          </div>
        </div>
        <div className={styles.houseCardBottom}>
          <div className={styles.houseCardLeft}>
            <img src={house.crest} alt="" className={styles.houseCrest} />
            <div className={styles.leaderContainer}>
              <span style={{ fontWeight: "bold", alignSelf: "center" }}>
                House Leaders
              </span>
              <div className={styles.leaderField}>
                <EmojiPeopleIcon className={styles.leaderIcon} />
                {leader.faculty[0] ? (
                  <span>{leader.faculty[0].displayName}</span>
                ) : (
                  <span>None</span>
                )}
              </div>
              <div className={styles.leaderField}>
                <BoyIcon className={styles.leaderIcon} />
                {leader.student[0] ? (
                  <span>{leader.student[0].displayName}</span>
                ) : (
                  <span>None</span>
                )}
              </div>
            </div>
          </div>
          <div className={styles.houseCardRight}>
            <div className={styles.houseInfoArea}>
              <div className={styles.houseText}>
                <div className={styles.housePoint}>
                  <div className={styles.housePointLeft}>
                    <span className={styles.houseTextTitle}>Points: </span>
                    <span>{curPoint}</span>
                  </div>

                  <div className={styles.housePointRight}>
                    <input
                      value={addPoint}
                      type="number"
                      id="addPoint"
                      onChange={(e) => setAddPoint(Number(e.target.value))}
                      placeholder="Quick Point Edit: ex) 20 +"
                      className={styles.pointUpdateInput}
                    />
                    <button
                      className={styles.pointPlusButton}
                      onClick={handlePointIncrement}
                    >
                      +
                    </button>
                    <button
                      className={styles.pointMinusButton}
                      onClick={handlePointDecrement}
                    >
                      -
                    </button>
                  </div>
                </div>
              </div>
              <div className={styles.houseText}>
                <span className={styles.houseTextTitle}>Color: </span>
                <span>{house.color}</span>
              </div>
              <div className={styles.houseText}>
                <span className={styles.houseTextTitle}>Motto: </span>
                <span style={{ fontStyle: "italic" }}>{house.motto}</span>
              </div>
              <div className={styles.houseText}>
                <span className={styles.houseTextTitle}>Motto (English): </span>
                <span style={{ fontStyle: "italic" }}>{house.enMotto}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
