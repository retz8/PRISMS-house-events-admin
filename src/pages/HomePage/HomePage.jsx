import React, { useContext, useEffect, useState } from "react";
import { loggedInUserContext } from "../../hooks/UserContext";

import OtherHousesIcon from "@mui/icons-material/OtherHouses";
import EventIcon from "@mui/icons-material/Event";
import PersonIcon from "@mui/icons-material/Person";
import styles from "./HomePage.module.css";
import ReactApexChart from "react-apexcharts";
import { getAllHouses } from "../../api/house";

export default function HomePage() {
  const userContext = useContext(loggedInUserContext);
  const [houses, setHouses] = useState([]);
  const [points, setPoints] = useState([]);
  const [names, setNames] = useState([]);
  const [colors, setColors] = useState([]);
  const colss = ["#FFFF00", "#0000FF", "#0000FF", "#0000FF"];

  // chart
  const series = [
    {
      name: "House Points", //will be displayed on the y-axis
      data: points,
    },
  ];
  const options = {
    chart: {
      type: "bar",
      height: 0,
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "55%",
        endingShape: "rounded",
      },
    },
    xaxis: {
      categories: names, //will be displayed on the x-asis
    },
    colors: ["#000000"],
  };

  const fetchHouses = async () => {
    const { error, houses } = await getAllHouses();
    if (error || houses.size > 4) {
      console.log(error);
      return;
    }

    const newPoints = houses.map((house) => Number(house.point));
    const newNames = houses.map((house) => house.name);

    const newColors = houses.map((house) => {
      if (house.color === "blue") return "#0000FF";
      else if (house.color === "yellow") return "#FFFF00";
      else if (house.color === "green") return "#00FF00";
      else if (house.color === "red") return "#FF0000";
      else return "#FFFFFF";
    });
    setPoints(newPoints);
    setNames(newNames);
    setColors(newColors);
    setHouses(houses);
  };

  useEffect(() => {
    fetchHouses();
  }, []);

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
              {houses ? (
                <div>
                  <ReactApexChart
                    options={options}
                    type="bar"
                    series={series}
                    height="400px"
                    // color={colors}
                  />
                </div>
              ) : (
                <></>
              )}
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
