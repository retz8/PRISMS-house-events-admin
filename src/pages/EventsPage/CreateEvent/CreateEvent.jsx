import React, { useContext, useEffect, useRef, useState } from "react";
import DatePickerComponent from "../components/DatePickerComponent";
import ContentEditor from "../components/ContentEditor";
import { useNavigate } from "react-router-dom";

import { loggedInUserContext } from "../../../hooks/UserContext";
import { uploadImage } from "../../../api";
import { getAllUsers } from "../../../api/user";
import { createNewEvent } from "../../../api/event";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import "react-datepicker/dist/react-datepicker.css";
import "react-quill/dist/quill.snow.css";
import styles from "./CreateEvent.module.css";

const defaultEvent = {
  title: "",
  author: "", // = logged in user
  host: "", // default: logged in user
  tier: "",
  thumbnail: {
    url: process.env.REACT_APP_DEFAULT_THUMBNAIL_URL,
    public_id: process.env.REACT_APP_DEFAULT_THUMBNAIL_ID,
  },
  content: "",
  summary: "", // not included in the first version
  startDate: new Date(),
  endDate: new Date(),
  isForAll: true,
  signUpLink: "", // only set when isForAll === false
  slug: "",
};

export default function CreateEvent() {
  const userContext = useContext(loggedInUserContext);
  const navigate = useNavigate();

  // Define Event fields -------------------------------------
  const [title, setTitle] = useState(defaultEvent.title);
  const [checkedHostsList, setCheckedHostsList] = useState([]);
  const [isHostSelecting, setIsHostSelecting] = useState(false);
  const [hostConfirmed, setHostConfirmed] = useState(false);
  const [tierArray, setTierArray] = useState([
    true,
    false,
    false,
    false,
    false,
  ]);
  const thumbnailInput = useRef();
  const [thumbnailURL, setThumbnailURL] = useState(defaultEvent.thumbnail?.url); // preview URL
  const [thumbnailObj, setThumbnailObj] = useState(null); // actual file object to upload to the cloud
  const [users, setUsers] = useState([]);
  const [content, setContent] = useState(defaultEvent.content);
  // const [summary, setSummary] = useState(defaultEvent.summary);
  const [startDate, setStartDate] = useState(defaultEvent.startDate);
  const [endDate, setEndDate] = useState(defaultEvent.endDate);
  const [signUpLink, setSignUpLink] = useState("None");
  const [isForAll, setIsForAll] = useState(true);
  // ---------------------------------------------------------

  // useEffect -----------------------------------------------
  const fetchAllUsers = async () => {
    const { error, users } = await getAllUsers();
    if (error) {
      console.error(error);
      // Failed to load users
      return;
    }
    setUsers(users);
  };

  useEffect(() => {
    fetchAllUsers();
  }, []);
  // ---------------------------------------------------------

  const goBack = () => {
    navigate(-1);
  };

  // 1. Host -------------------------------------------------
  const onClickHostSelect = () => {
    setIsHostSelecting(true);
  };

  const onClickHideHostSelect = () => {
    setIsHostSelecting(false);
    setHostConfirmed(true);
  };

  const onClickHostRefresh = () => {
    setHostConfirmed(false);
    setCheckedHostsList([]);
  };

  const handleHostCheck = (event) => {
    // host checkbox
    var updatedList = [...checkedHostsList];
    if (event.target.checked) {
      updatedList = [...checkedHostsList, event.target.value];
    } else {
      updatedList.splice(checkedHostsList.indexOf(event.target.value), 1);
    }
    console.log(updatedList);
    setCheckedHostsList(updatedList);
  };

  // 2. Tier ------------------------------------------------
  const handleTierChange = ({ target }) => {
    // tier checkboxes: (I, II, III, IV, Others)
    const { name } = target;

    if (name === "tier1") {
      return setTierArray([true, false, false, false, false]);
    }
    if (name === "tier2") {
      return setTierArray([false, true, false, false, false]);
    }
    if (name === "tier3") {
      return setTierArray([false, false, true, false, false]);
    }
    if (name === "tier4") {
      return setTierArray([false, false, false, true, false]);
    }
    if (name === "tier5") {
      return setTierArray([false, false, false, false, true]);
    }
  };

  // 3. Thumbnail -------------------------------------------
  const onClickThumbnailUpload = () => {
    thumbnailInput.current.click();
  };

  const handleThumbnailChange = async ({ target }) => {
    const file = target.files[0];
    if (!file?.type?.includes("image")) {
      return;
      // This is not an image
    }
    const tmpURL = URL.createObjectURL(file);
    setThumbnailObj(file); // actual image file to upload to the cloud
    setThumbnailURL(tmpURL); // preview image URL
  };
  // --------------------------------------------------------

  // handleChange & Submit button
  const handleChange = ({ target }) => {
    const { value, name } = target;

    if (name === "title") {
      return setTitle(value);
    }
    if (name === "isAll") {
      return setIsForAll(true);
    }
    if (name === "isSignUp") {
      return setIsForAll(false);
    }
    if (name === "signUpLink") {
      return setSignUpLink(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Host
    const finalHosts = checkedHostsList.map((checkedHost) => {
      return checkedHost.split(",")[0];
    });

    // Thumbnail (uploadImage to the cloud)
    let newThumbnailObj = defaultEvent.thumbnail;

    if (thumbnailObj) {
      const formData = new FormData();
      formData.set("image", thumbnailObj);

      const { error, image, public_id } = await uploadImage(formData);
      if (error) {
        console.log(error);
        // fail to upload Image to the cloud
        return;
      }

      newThumbnailObj = { url: image, public_id };
    }

    // tier
    let tier = "I";
    if (tierArray[1]) tier = "II";
    if (tierArray[2]) tier = "III";
    if (tierArray[3]) tier = "IV";
    if (tierArray[4]) tier = "Others";

    // slug
    const slug = title
      .toLowerCase()
      .replace(/[^\w]+/g, "-")
      .replace(/^-+|-+$/g, "");

    // final event object that will be sent to the server
    const finalEventObj = {
      title,
      author: userContext._id, // logged in user
      host: finalHosts.length === 0 ? userContext._id : finalHosts, // default: logged in user
      tier,
      content,
      // summary,
      startDate: startDate.toLocaleString("en-US", {
        timeZone: "America/New_York",
      }),
      endDate: endDate.toLocaleString("en-US", {
        timeZone: "America/New_York",
      }),
      isForAll,
      signUpLink,
      slug,
    };

    finalEventObj.thumbnail = newThumbnailObj;

    console.log("Final Event: ");
    console.log(finalEventObj);

    const { error, event } = await createNewEvent(finalEventObj);
    if (error) {
      // failed to create new event [server]
      console.error(error);
      return;
    }
    window.alert("Event successfully created");

    return navigate("/events");
  };

  return (
    <div className={styles.createEvent}>
      <div className={styles.createEventTop}>
        <ArrowBackIcon className={styles.backButton} onClick={goBack} />
        <span className={styles.createEventPageTitle}>Create New Event</span>
      </div>
      {users ? (
        <div className={styles.createEventBottom}>
          <div className={styles.contentsContainer}>
            <form className={styles.createEventForm}>
              <input
                className={styles.textInput}
                type="text"
                name="title"
                value={title}
                placeholder={"Title"}
                onChange={handleChange}
              />
              <div className={styles.hostContainer}>
                <span className={styles.hostTitle}>Host</span>
                <div className={styles.hostList}>
                  {checkedHostsList?.length ? (
                    checkedHostsList.map((checkedHost) => {
                      return (
                        <div className={styles.hostText}>
                          <span>{checkedHost.split(",")[1]},</span>
                        </div>
                      );
                    })
                  ) : (
                    <></>
                  )}
                </div>
                {hostConfirmed ? (
                  <button
                    type="button"
                    className={styles.hostSelectButton}
                    onClick={onClickHostRefresh}
                  >
                    Refresh Hosts
                  </button>
                ) : (
                  <button
                    type="button"
                    className={styles.hostSelectButton}
                    onClick={onClickHostSelect}
                  >
                    Select Hosts
                  </button>
                )}
              </div>

              <div className={styles.tierContainer}>
                <span className={styles.tierContainerTitle}>Choose Tier: </span>
                <label htmlFor="tier1" className={styles.tierLabel}>
                  Tier 1{" "}
                </label>
                <input
                  type="checkbox"
                  checked={tierArray[0]}
                  name="tier1"
                  onChange={handleTierChange}
                />
                <label htmlFor="tier2" className={styles.tierLabel}>
                  Tier 2{" "}
                </label>
                <input
                  type="checkbox"
                  checked={tierArray[1]}
                  name="tier2"
                  onChange={handleTierChange}
                />
                <label htmlFor="tier3" className={styles.tierLabel}>
                  Tier 3{" "}
                </label>
                <input
                  type="checkbox"
                  checked={tierArray[2]}
                  name="tier3"
                  onChange={handleTierChange}
                />
                <label htmlFor="tier4" className={styles.tierLabel}>
                  Tier 4{" "}
                </label>
                <input
                  type="checkbox"
                  checked={tierArray[3]}
                  name="tier4"
                  onChange={handleTierChange}
                />
                <label htmlFor="others" className={styles.tierLabel}>
                  Others{" "}
                </label>
                <input
                  type="checkbox"
                  checked={tierArray[4]}
                  name="others"
                  onChange={handleTierChange}
                />
              </div>

              <div className={styles.thumbnailContainer}>
                <input
                  type="file"
                  name="thumbnail"
                  accept="image/*"
                  onChange={handleThumbnailChange}
                  ref={thumbnailInput}
                  hidden
                />
                <button
                  type="button"
                  onClick={onClickThumbnailUpload}
                  className={styles.thumbnailUploadButton}
                >
                  {"Upload Thumbnail Image -> "}
                </button>
                <img
                  className={styles.thumbnailImage}
                  src={thumbnailURL}
                  alt=""
                />
              </div>

              <ContentEditor value={content} onChange={setContent} />

              <div className={styles.datePickers}>
                <div className={styles.datePickersComponent}>
                  <label htmlFor="startDate" className={styles.dateLabel}>
                    StartDate:
                    <DatePickerComponent
                      name="startDate"
                      setDate={setStartDate}
                    />
                  </label>
                </div>
                <div className={styles.datePickersComponent}>
                  <label htmlFor="endDate" className={styles.dateLabel}>
                    EndDate:
                    <DatePickerComponent name="endDate" setDate={setEndDate} />
                  </label>
                </div>
              </div>

              <div className={styles.participantsContainer}>
                <span className={styles.participantsTitle}>Participants: </span>
                <div>
                  <label htmlFor="isAll">All </label>
                  <input
                    type="checkbox"
                    checked={isForAll}
                    name="isAll"
                    onChange={handleChange}
                  />
                  <label htmlFor="isSignUp">Sign Up </label>
                  <input
                    type="checkbox"
                    checked={!isForAll}
                    name="isSignUp"
                    onChange={handleChange}
                  />
                  {!isForAll ? (
                    <input
                      value={signUpLink === "None" ? "" : signUpLink}
                      type="text"
                      name="signUpLink"
                      placeholder="Sign Up Link"
                      onChange={handleChange}
                      className={styles.signUpLink}
                    />
                  ) : (
                    <></>
                  )}
                </div>
              </div>

              <button
                className={styles.createEventSubmitButton}
                onClick={handleSubmit}
              >
                Create Event
              </button>
            </form>
          </div>

          {isHostSelecting ? (
            <div className={styles.userSelectionContainer}>
              <div className={styles.userSelectionTop}>
                <span className={styles.userSelectionTitle}>
                  Select Host(s)
                </span>
                <button
                  type="button"
                  className={styles.hostConfirmButton}
                  onClick={onClickHideHostSelect}
                >
                  Confirm
                </button>
              </div>
              <div className={styles.userSelectionBottom}>
                {users.map((user, index) => {
                  return (
                    <label key={index} className={styles.userSelectText}>
                      <input
                        type="checkbox"
                        value={[user.id, user.displayName]}
                        onChange={handleHostCheck}
                      />
                      {user.displayName}
                    </label>
                  );
                })}
              </div>
            </div>
          ) : (
            <></>
          )}
        </div>
      ) : (
        <span> loading... </span>
      )}
    </div>
  );
}
