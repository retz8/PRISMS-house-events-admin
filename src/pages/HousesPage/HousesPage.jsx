import React, { useEffect, useState } from "react";
import { getAllHouses } from "../../api/house";
import HouseCard from "./HouseCard";
import styles from "./HousesPage.module.css";

export default function HousesPage() {
  const [houses, setHouses] = useState([]);

  const fetchHouses = async () => {
    const { error, houses } = await getAllHouses();
    if (error || houses.size > 4) {
      console.log(error);
      return;
    }
    console.log(houses);
    setHouses(houses);
  };

  useEffect(() => {
    fetchHouses();
  }, []);

  return (
    <div className={styles.housesPage}>
      {houses ? (
        houses.map((house, index) => {
          return <HouseCard key={index} house={house} />;
        })
      ) : (
        <span>loading...</span>
      )}
    </div>
  );
}
