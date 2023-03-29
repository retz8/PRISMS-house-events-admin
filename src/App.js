import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage/HomePage";
import LoginPage from "./pages/LoginPage/LoginPage";
import UsersPage from "./pages/UsersPage/UsersPage";
import HousesPage from "./pages/HousesPage/HousesPage";
import EventsPage from "./pages/EventsPage/EventsPage";
import TopBar from "./components/TopBar/TopBar";
import SideBar from "./components/SideBar/SideBar";
import styles from "./App.module.css";
import UpdateUser from "./pages/UsersPage/UpdateUser/UpdateUser";
import Protected from "./utils/Protected";
import ProtectedLogin from "./utils/ProtectedLogin";
import UpdateHouse from "./pages/HousesPage/UpdateHouse/UpdateHouse";
import CreateEvent from "./pages/EventsPage/CreateEvent/CreateEvent";
import UpdateEvent from "./pages/EventsPage/UpdateEvent/UpdateEvent";

function App() {
  return (
    <BrowserRouter className="App">
      <TopBar />
      <div className={styles.container}>
        <SideBar />
        <div className={styles.contentsContainer}>
          <Routes>
            <Route path="/" element={<HomePage />}></Route>
            <Route
              path="/login"
              element={
                <ProtectedLogin>
                  <LoginPage />
                </ProtectedLogin>
              }
            ></Route>
            <Route
              path="/users"
              element={
                <Protected>
                  <UsersPage />
                </Protected>
              }
            ></Route>
            <Route
              path="/update-user/:userId"
              element={
                <Protected>
                  <UpdateUser />
                </Protected>
              }
            ></Route>
            <Route
              path="/events"
              element={
                <Protected>
                  <EventsPage />
                </Protected>
              }
            ></Route>
            <Route
              path="/create-event"
              element={
                <Protected>
                  <CreateEvent />
                </Protected>
              }
            ></Route>
            <Route
              path="/update-event/:eventId"
              element={
                <Protected>
                  <UpdateEvent />
                </Protected>
              }
            ></Route>
            <Route
              path="/houses"
              element={
                <Protected>
                  <HousesPage />
                </Protected>
              }
            ></Route>
            <Route
              path="/update-house"
              element={
                <Protected>
                  <UpdateHouse />
                </Protected>
              }
            ></Route>
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
