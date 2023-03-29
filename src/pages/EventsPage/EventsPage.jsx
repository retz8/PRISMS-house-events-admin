import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { deleteEvent, getAllEvents } from "../../api/event";
import { DataGrid } from "@mui/x-data-grid";
import styles from "./EventsPage.module.css";
import { DeleteOutline } from "@mui/icons-material";
import RefreshIcon from "@mui/icons-material/Refresh";
import PendingIcon from "@mui/icons-material/Pending";
import { getAllHouses, updateHousePoint } from "../../api/house";

export default function EventsPage() {
  const [events, setEvents] = useState([]); // events lists fetched from the server
  const [eventStates, setEventStates] = useState([]); // events states (eventStates[params.row.id] = "Upcoming")
  const [refreshLoading, setRefreshLoading] = useState(false); // handle refresh status

  const [housesName, setHousesName] = useState([]); // housesName to handle point deduction due to event deletion (housesName[index] = "Albemarle")
  const [housesId, setHousesId] = useState([]); // housesId to request point deduction to the server ()

  // useEffect & fetchEvents -----------------------------------------------------------------
  const fetchEvents = async () => {
    const { error, events } = await getAllEvents();

    if (error) {
      // error: events fetching failed
      return;
    }

    // fetch houses for point deduction (event deletion)
    const { error: houseError, houses } = await getAllHouses();
    if (houseError) return;

    const housesNameObj = houses.map((house) => {
      return house.name;
    });

    let housesIdObj = [];
    houses.map((house) => {
      housesIdObj.push(house.id);
    });

    // set states (upcoming, waiting result, result posted, past)
    const newStates = events.map((event, index) => {
      if (event.upcoming === true) {
        return "Upcoming";
      } else {
        if (event.resultPosted.waitingResult === true) {
          return "Waiting Result";
        } else if (event.resultPosted.active === true) {
          return "Result Posted";
        } else {
          return "Past";
        }
      }
    });

    setEvents(events);
    setHousesName(housesNameObj);
    setHousesId(housesIdObj);
    setEventStates(newStates);
  };

  useEffect(() => {
    fetchEvents();
  }, []);
  // ----------------------------------------------------------------------------------------

  // button handlers ------------------------------------------------------------------------
  const handleRefresh = async () => {
    setRefreshLoading(true);
    await fetchEvents();
    setRefreshLoading(false);
  };

  const handleEventDelete = async (id) => {
    const confirmed = window.confirm("Are you sure?");
    if (!confirmed) return;
    try {
      // id: eventId
      const { error, message } = await deleteEvent(id);
      if (error) {
        // failed to delete event
        return;
      }

      // reset points
      const ev = events.filter((event) => event.id.includes(id));
      if (ev && ev[0].result) {
        housesName.map(async (n, index) => {
          const pointObj = {
            point: -ev[0].result[n],
          };
          const { error, newHouse } = await updateHousePoint(
            housesId[index],
            pointObj
          );
          if (error) {
            // failed to deduct points
            return;
          }
        });
      }

      const newEvents = events.filter((p) => p.id !== id);
      setEvents(newEvents);

      window.alert("Successfully removed event");
    } catch (error) {
      console.error(error.message);
    }
  };
  // ----------------------------------------------------------------------------------------

  // MUI DataGrid components ---------------------------------------------------------
  const tierSortComparator = (v1, v2) => {
    const tierOrder = ["I", "II", "III", "IV", "Others"];
    return tierOrder.indexOf(v1) - tierOrder.indexOf(v2);
  };

  const stateSortComparator = (v1, v2) => {
    const stateOrder = ["Upcoming", "Waiting Result", "Result Posted", "Past"];
    return stateOrder.indexOf(v1) - stateOrder.indexOf(v2);
  };

  const columns = [
    { field: "id", headerName: "ID", flex: 0.5, sortable: false },
    { field: "title", headerName: "Title", flex: 2, sortable: true },
    // { field: "author", headerName: "Author", flex: 1, sortable: true },
    // { field: "host", headerName: "Host", flex: 1, sortable: true },
    {
      field: "tier",
      headerName: "Tier",
      flex: 0.5,
      sortable: true,
      sortComparator: tierSortComparator,
    },
    {
      field: "startDate",
      headerName: "Start Date",
      flex: 1,
      valueGetter: ({ value }) =>
        value &&
        new Date(value).toLocaleDateString("en-us", {
          timeZone: "America/New_York",
          year: "numeric",
          month: "short",
          day: "numeric",
        }),
    },
    {
      field: "endDate",
      headerName: "End Date",
      flex: 1,
      valueGetter: ({ value }) =>
        value &&
        new Date(value).toLocaleDateString("en-us", {
          timeZone: "America/New_York",
          year: "numeric",
          month: "short",
          day: "numeric",
        }),
    },
    {
      field: "state",
      headerName: "State",
      flex: 1,
      sortable: true,
      sortComparator: stateSortComparator,
    },
    {
      field: "action",
      headerName: "Action",
      flex: 1,
      renderCell: (params) => {
        return (
          <>
            <Link to={"/update-event/" + params.row.id}>
              <button className={styles.eventEdit}>Edit</button>
            </Link>

            <DeleteOutline
              className={styles.eventDelete}
              onClick={() => handleEventDelete(params.row.id)}
            />
          </>
        );
      },
    },
  ];

  const rows = events.map((event, index) => {
    return {
      id: event.id,
      title: event.title,
      // author: event.author,
      // host: event.host,
      tier: event.tier,
      startDate: event.startDate,
      endDate: event.endDate,
      state: eventStates[index],
    };
  });
  // --------------------------------------------------------------------------------

  return (
    <div className={styles.eventsPage}>
      <div className={styles.eventsPageTop}>
        <div className={styles.eventsPageTopLeft}>
          <span className={styles.eventsPageTitle}>All Events</span>
          {refreshLoading ? (
            <PendingIcon
              className={styles.refreshIcon}
              onClick={handleRefresh}
            />
          ) : (
            <RefreshIcon
              className={styles.refreshIcon}
              onClick={handleRefresh}
            />
          )}
        </div>

        <div className={styles.eventsPageTopRight}>
          <Link to="/create-event">
            <button className={styles.createEventButton}>
              Create New Event
            </button>
          </Link>
        </div>
      </div>
      <div className={styles.gridContainer}>
        <DataGrid
          initialState={{
            sorting: {
              sortModel: [{ field: "state", sort: "asc" }],
            },
          }}
          rows={rows}
          columns={columns}
        />
      </div>
    </div>
  );
}
