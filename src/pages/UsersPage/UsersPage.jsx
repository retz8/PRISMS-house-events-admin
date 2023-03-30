import React, { useContext, useEffect, useState } from "react";
import {
  deleteUser,
  getAllUsers,
  graduateSeniors,
  promoteStudents,
  searchUser,
} from "../../api/user";
import { DataGrid } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import { DeleteOutline } from "@mui/icons-material";
import { loggedInUserContext } from "../../hooks/UserContext";

import RefreshIcon from "@mui/icons-material/Refresh";
import SearchIcon from "@mui/icons-material/Search";
import PendingIcon from "@mui/icons-material/Pending";
import styles from "./UsersPage.module.css";

export default function UsersPage() {
  const userContext = useContext(loggedInUserContext);

  const [users, setUsers] = useState([]);
  const [refreshLoading, setRefreshLoading] = useState(false);
  const [graduateLoading, setGraduateLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [searchedRows, setSearchedRows] = useState([]);

  // useEffect -----------------------------------
  const fetchAllUsers = async () => {
    try {
      const { users } = await getAllUsers();
      setUsers(users);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchAllUsers();
  }, []);
  // ---------------------------------------------

  // button handlers -------------------------------
  const handleRefresh = async () => {
    setRefreshLoading(true);
    await fetchAllUsers();
    setRefreshLoading(false);
    setSearching(false);
    setSearchQuery("");
  };

  const handleUserDelete = async (id) => {
    if (id === userContext._id) {
      window.alert("Logged In User: Can't Delete");
      return;
    }
    const confirmed = window.confirm(
      "Are you sure? This will DELETE all of the events written by user"
    );
    if (!confirmed) return;
    try {
      await deleteUser(id);
      const newUsers = users.filter((p) => p.id !== id);
      setUsers(newUsers);
    } catch (error) {
      console.error(error);
      // handle error
    }
  };

  const handleGraduatePromote = async () => {
    const confirmed = window.confirm(
      "Are you sure? This will GRADUATE all Seniors and PROMOTE other students. This will DELETE all of the events written by Senior Student Leaders"
    );
    if (!confirmed) return;

    setGraduateLoading(true);
    const res1 = await graduateSeniors();
    if (res1.error) return;

    const res2 = await promoteStudents();
    if (res2.error) return;
    await fetchAllUsers();
    setGraduateLoading(false);
  };
  // ------------------------------------------------------

  // handle search -----------------------------------------------
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    const { error, users } = await searchUser(searchQuery);
    if (error) return;
    setSearching(true);
    const newRows = users.map((user, index) => {
      return {
        id: user.id,
        name: user.displayName,
        grade: user.grade,
        role: user.role === "HouseLeader" ? "House Leader" : user.role,
        house: user.house,
        email: user.email,
        introduction: user.introduction,
      };
    });
    setSearchedRows(newRows);
  };
  // -------------------------------------------------------

  // Data Grid elements ----------------------------------
  const roleSortComparator = (v1, v2) => {
    const roleOrder = ["Admin", "House Leader", "Faculty", "Student"];
    return roleOrder.indexOf(v1) - roleOrder.indexOf(v2);
  };

  const gradeSortComparator = (v1, v2) => {
    const gradeOrder = ["Admin", "Faculty", "12", "11", "10", "9"];
    return gradeOrder.indexOf(v1) - gradeOrder.indexOf(v2);
  };

  const houseSortComparator = (v1, v2) => {
    const houseOrder = ["Albemarle", "Lambert", "Hobler", "Ettl", "None"];
    return houseOrder.indexOf(v1) - houseOrder.indexOf(v2);
  };

  const columns = [
    { field: "id", headerName: "ID", flex: 0.5, sortable: false },
    { field: "name", headerName: "Name", flex: 2, sortable: true },
    {
      field: "grade",
      headerName: "Grade",
      flex: 1,
      sortable: true,
      sortComparator: gradeSortComparator,
    },
    {
      field: "role",
      headerName: "Role",
      flex: 1,
      sortable: true,
      sortComparator: roleSortComparator,
    },
    {
      field: "house",
      headerName: "House",
      flex: 1,
      sortable: true,
      sortComparator: houseSortComparator,
    },
    { field: "email", headerName: "Email", flex: 3, sortable: false },
    {
      field: "introduction",
      headerName: "Introduction",
      flex: 2,
      sortable: false,
    },
    {
      field: "action",
      headerName: "Action",
      flex: 2,
      renderCell: (params) => {
        return (
          <>
            <Link to={"/update-user/" + params.row.id}>
              <button className={styles.userEdit}>Edit</button>
            </Link>

            <DeleteOutline
              className={styles.userDelete}
              onClick={() => handleUserDelete(params.row.id)}
            />
          </>
        );
      },
    },
  ];

  const rows = users.map((user, index) => {
    return {
      id: user.id,
      name: user.displayName,
      grade: user.grade,
      role: user.role === "HouseLeader" ? "House Leader" : user.role,
      house: user.house,
      email: user.email,
      introduction: user.introduction,
    };
  });
  // ------------------------------------------------------

  return (
    <div className={styles.usersPage}>
      <div className={styles.usersPageTop}>
        <div className={styles.usersPageTopLeft}>
          <span className={styles.usersPageTitle}>All Users</span>
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
          <div className={styles.searchContainer}>
            <SearchIcon className={styles.searchIcon} />
            <form onSubmit={handleSearchSubmit}>
              <input
                name="searchInput"
                type="text"
                value={searchQuery}
                placeholder="Enter Full Name"
                className={styles.searchInput}
                onChange={handleSearchChange}
              />
            </form>
          </div>
        </div>
        <div className={styles.usersPageTopRight}>
          {graduateLoading ? (
            <button className={styles.graduateButton}>Loading...</button>
          ) : (
            <button
              className={styles.graduateButton}
              onClick={handleGraduatePromote}
            >
              Graduate & Promote
            </button>
          )}
        </div>
      </div>

      <div className={styles.gridContainer}>
        {!searching ? (
          <DataGrid
            initialState={{
              sorting: {
                sortModel: [{ field: "name", sort: "asc" }],
              },
            }}
            rows={rows}
            columns={columns}
          />
        ) : (
          <DataGrid rows={searchedRows} columns={columns} />
        )}
      </div>
    </div>
  );
}
