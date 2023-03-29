import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getEvent, updateEvent } from "../../../api/event";

import ContentEditor from "../components/ContentEditor";
import { uploadImage } from "../../../api";
import { getAllUsers } from "../../../api/user";
import DatePickerComponent from "../components/DatePickerComponent";
import { getAllHouses, updateHousePoint } from "../../../api/house";

import "react-datepicker/dist/react-datepicker.css";
import "react-quill/dist/quill.snow.css";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import styles from "./UpdateEvent.module.css";

export default function UpdateEvent() {
  const navigate = useNavigate();
  const { eventId } = useParams();

  const [eventState, setEventState] = useState(""); // if upcoming, don't render result edit
  const [houses, setHouses] = useState([]);
  const [users, setUsers] = useState([]);

  // Event Fields definition ----------------------------------------
  const [curEvent, setCurEvent] = useState(null); // original event
  const [newEvent, setNewEvent] = useState(null); // updated event
  // title, signuplink, author managed in event Object
  const [checkedHostsList, setCheckedHostsList] = useState([]);
  const [isHostSelecting, setIsHostSelecting] = useState(false);
  const [hostConfirmed, setHostConfirmed] = useState(false);
  const [tierArray, setTierArray] = useState([]);
  const thumbnailInput = useRef();
  const [thumbnailURL, setThumbnailURL] = useState("");
  const [thumbnailObj, setThumbnailObj] = useState(null);
  const [content, setContent] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [isForAll, setIsForAll] = useState(false);
  const [participants, setParticipants] = useState([]);
  const [adminNote, setAdminNote] = useState("");
  const [points, setPoints] = useState([0, 0, 0, 0]); // = result ( 4 houses' points )
  // ----------------------------------------------------------------

  // useEffect ------------------------------------------------------
  const fetchEvent = async () => {
    const { error, event } = await getEvent(eventId);
    if (error) {
      // failed to fetch event
      return;
    }

    const { error: userError, users } = await getAllUsers(); // for hosts & participants selection
    if (userError) {
      // failed to fetch users
      return;
    }

    const { error: houseError, houses } = await getAllHouses(); // for result (points)
    if (houseError) {
      // failed to fetch houses
      return;
    }

    // set inital state
    let curState = "";
    if (event.upcoming === true) {
      curState = "Upcoming";
    } else {
      if (event.resultPosted.waitingResult === true) {
        curState = "Waiting Result";
      } else if (event.resultPosted.active === true) {
        curState = "Result Posted";
      } else {
        curState = "Past";
      }
    }
    setEventState(curState);

    // set initial hosts
    const filteredHosts = users.filter((user) => event.host.includes(user.id));
    var updatedList = filteredHosts.map((h) => {
      return h.id + ", " + h.displayName;
    });
    setCheckedHostsList(updatedList);

    // set initial tier (checkbox array)
    if (event.tier === "I") setTierArray([true, false, false, false, false]);
    if (event.tier === "II") setTierArray([false, true, false, false, false]);
    if (event.tier === "III") setTierArray([false, false, true, false, false]);
    if (event.tier === "IV") setTierArray([false, false, false, true, false]);
    if (event.tier === "Others")
      setTierArray([false, false, false, false, true]);

    // set inital preview thumbnail
    setThumbnailURL(event.thumbnail.url);

    // set initial content
    setContent(event.content);

    // set isForAll & participants
    if (event.isForAll) setIsForAll(true);
    if (event.participants) setParticipants(event.participants);

    // set admin note
    setAdminNote(event.adminNote ? event.adminNote : "");

    setCurEvent(event);
    setNewEvent(event);
    setUsers(users);
    setHouses(houses);
  };

  useEffect(() => {
    fetchEvent();
  }, []);
  // ----------------------------------------------------------------

  const goBack = () => {
    navigate(-1);
  };

  // 1. Host -------------------------------------------------
  const onClickHostSelect = () => {
    setCheckedHostsList([]);
    setIsHostSelecting(true);
  };

  const onClickHideHostSelect = () => {
    setIsHostSelecting(false);
    setHostConfirmed(true);
  };

  const onClickHostRefresh = () => {
    setHostConfirmed(false);
    const filteredHosts = users.filter((user) =>
      curEvent.host.includes(user.id)
    );
    var updatedList = filteredHosts.map((h) => {
      return h.id + ", " + h.displayName;
    });
    setCheckedHostsList(updatedList);
  };

  const handleHostCheck = (event) => {
    var updatedList = [...checkedHostsList];
    if (event.target.checked) {
      updatedList = [...checkedHostsList, event.target.value];
    } else {
      updatedList.splice(checkedHostsList.indexOf(event.target.value), 1);
    }
    setCheckedHostsList(updatedList);
  };

  // 2. Tier -------------------------------------------------
  const handleTierChange = ({ target }) => {
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

  // 3. Thumnbnail -------------------------------------------------
  const onClickThumbnailUpload = () => {
    thumbnailInput.current.click();
  };

  const handleThumbnailChange = ({ target }) => {
    const file = target.files[0];
    if (!file?.type?.includes("image")) {
      return;
      // This is not an image
    }
    const tmpURL = URL.createObjectURL(file);

    setThumbnailURL(tmpURL);
    setThumbnailObj(file);
  };

  // 4. Result (Point) ----------------------------------------------
  const handlePointChange = ({ target }) => {
    const { value, id } = target;
    let tmpArr = [...points];
    if (value === "") tmpArr[id] = 0;
    else tmpArr[id] = value;
    setPoints(tmpArr);
  };

  // 5. Participants ------------------------------------------------
  const handleParticipantsCheck = (event) => {
    var updatedList = [...participants];
    if (event.target.checked) {
      updatedList = [...participants, event.target.value];
    } else {
      updatedList.splice(participants.indexOf(event.target.value), 1);
    }
    setParticipants(updatedList);
  };

  // handleChange & Submit button
  const handleChange = ({ target }) => {
    const { value, name } = target;
    if (name === "title") {
      return setNewEvent({ ...newEvent, title: value });
    }
    if (name === "isAll") {
      return setIsForAll(true);
    }
    if (name === "isSignUp") {
      return setIsForAll(false);
    }
    if (name === "signUpLink") {
      return setNewEvent({ ...newEvent, signUpLink: value });
    }
    if (name === "adminNotes") {
      return setAdminNote(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // tier
    let tier = "I";
    if (tierArray[0]) tier = "I";
    if (tierArray[1]) tier = "II";
    if (tierArray[2]) tier = "III";
    if (tierArray[3]) tier = "IV";
    if (tierArray[4]) tier = "Others";

    // host
    const finalHosts = checkedHostsList.map((checkedHost) => {
      return checkedHost.split(",")[0];
    });

    // thumbnail
    let newThumbnailObj = curEvent.thumbnail;

    if (thumbnailObj) {
      const formData = new FormData();
      formData.set("image", thumbnailObj);

      const { error, image, public_id } = await uploadImage(formData);
      if (!error) newThumbnailObj = { url: image, public_id };
    }

    // points (result)
    let housePointObj = { Albemarle: 0, Lambert: 0, Hobler: 0, Ettl: 0 };
    houses.map((house, index) => {
      housePointObj[house.name] = Number(points[index]);
    });

    // slug
    const slug = newEvent.title
      .toLowerCase()
      .replace(/[^\w]+/g, "-")
      .replace(/^-+|-+$/g, "");

    // resultPosted Obj
    // forceActive is not included in the first version
    let resultPostedObj = {
      active: false,
      waitingResult: true,
      forceActive: false,
    };
    if (eventState === "Waiting Result") {
      if (points.toString() !== [0, 0, 0, 0].toString()) {
        // result point posted
        console.log("checkehckehcked");
        resultPostedObj = {
          ...resultPostedObj,
          active: true,
          waitingResult: false,
          postedDate: new Date(),
        };
      }
    }

    if (eventState === "Result Posted") {
      resultPostedObj = {
        ...resultPostedObj,
        active: true,
        waitingResult: false,
        postedDate: new Date(),
      };
    }

    if (eventState === "Past") {
      // past event
      // just leave it as past event
    }

    // participants
    let finalParticipants = participants.map((p) => {
      return p.split(",")[0];
    });

    // final event object
    const finalEventObj = {
      title: newEvent.title,
      author: newEvent.author,
      host: finalHosts.length === 0 ? curEvent.host : finalHosts,
      tier: tier,
      content: content,
      isForAll: isForAll,
      participants: finalParticipants,
      signUpLink: newEvent.signUpLink,
      startDate,
      endDate,
      adminNote,
      upcoming: newEvent.upcoming,
      result: housePointObj,
      resultPosted: resultPostedObj,
      slug,
    };

    finalEventObj.thumbnail = newThumbnailObj;

    console.log(finalEventObj);

    const { error, event } = await updateEvent(eventId, finalEventObj);

    if (error) {
      // failed to uppdate event
      return;
    }

    // update house points
    houses.map(async (house, index) => {
      const houseId = house.id;
      const pointObj = {
        point: points[index],
      };
      const { error, newHouse } = await updateHousePoint(houseId, pointObj);
      if (error) {
        // failed to update house points
        return;
      }
    });

    window.alert("Event Successfully Updated!");
    return navigate("/events");
  };

  return (
    <div className={styles.updateEvent}>
      <div className={styles.updateEventTop}>
        <div>
          <ArrowBackIcon className={styles.backButton} onClick={goBack} />
          <span className={styles.updateEventPageTitle}>
            Edit Event [{eventState}]
          </span>
        </div>
        <div>
          <button
            className={styles.updateEventSubmitButton}
            onClick={handleSubmit}
          >
            Update Event
          </button>
        </div>
      </div>
      {curEvent && houses ? (
        <div className={styles.updateEventBottom}>
          <div className={styles.formContainer}>
            <form className={styles.updateEventForm}>
              <input
                className={styles.textInput}
                type="text"
                name="title"
                value={newEvent.title}
                placeholder={curEvent.title}
                onChange={handleChange}
              />
              <div className={styles.hostContainer}>
                <span className={styles.hostTitle}>Host</span>
                <div className={styles.hostList}>
                  {checkedHostsList?.length ? (
                    checkedHostsList.map((checkedHost) => {
                      return (
                        <div className={styles.hostText}>
                          <span>{checkedHost.split(",")[1]}</span>
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
                    Change Hosts
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
                  accept="image/jpg, image/png, image/jpeg"
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

              <ContentEditor
                value={content}
                onChange={setContent}
                phText={content}
              />

              <div className={styles.datePickers}>
                <div className={styles.datePickersComponent}>
                  <label htmlFor="startDate" className={styles.dateLabel}>
                    StartDate:
                    <DatePickerComponent
                      name="startDate"
                      setDate={setStartDate}
                      phDate={curEvent.startDate}
                    />
                  </label>
                </div>
                <div className={styles.datePickersComponent}>
                  <label htmlFor="endDate" className={styles.dateLabel}>
                    EndDate:
                    <DatePickerComponent
                      name="endDate"
                      setDate={setEndDate}
                      phDate={curEvent.endDate}
                    />
                  </label>
                </div>
              </div>

              <div className={styles.participantsContainer}>
                <span className={styles.participantsTitle}>Participants: </span>
                <div className={styles.participantsLargeBox}>
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
                    <div className={styles.participantBox}>
                      <input
                        value={newEvent.signUpLink}
                        type="text"
                        name="signUpLink"
                        placeholder="Sign Up Link"
                        onChange={handleChange}
                        className={styles.signUpLink}
                      />
                    </div>
                  ) : (
                    <></>
                  )}
                </div>
              </div>
              {/* <button
                className={styles.updateEventSubmitButton}
                onClick={handleSubmit}
              >
                Update Event
              </button> */}
            </form>
          </div>

          <div className={styles.updateEventRight}>
            <div className={styles.updateEventRightTop}>
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
              <div className={styles.adminNoteContainer}>
                <label htmlFor="my-textarea">Admin Notes</label>
                <textarea
                  id="my-textarea"
                  name="adminNotes"
                  onChange={handleChange}
                  className={styles.adminNotesTextArea}
                  placeholder={adminNote}
                />
              </div>
            </div>
            {eventState === "Upcoming" ? (
              <></>
            ) : (
              <div className={styles.updateEventRightBottom}>
                <div className={styles.houseTop}>
                  <span className={styles.postResultTitle}>
                    Result & Points
                  </span>
                </div>

                <div className={styles.houseBottom}>
                  {houses ? (
                    houses.map((house, index) => {
                      return (
                        <div className={styles.houseContainer}>
                          <span className={styles.houseNameTitle}>
                            {house.name}
                          </span>
                          <img
                            className={styles.crestImg}
                            src={house.crest}
                            alt=""
                          />
                          <div className={styles.pointInputContainer}>
                            <label htmlFor="point">Points</label>
                            {eventState === "Result Posted" ? (
                              <input
                                className={styles.pointInput}
                                type="number"
                                name="point"
                                id={index}
                                value={curEvent.result[house.name]}
                                placeholder={curEvent.result[house.name]}
                              />
                            ) : (
                              <input
                                className={styles.pointInput}
                                type="number"
                                name="point"
                                id={index}
                                // value={points[index]}
                                onChange={handlePointChange}
                                placeholder={
                                  curEvent.result[house.name]
                                    ? curEvent.result[house.name]
                                    : 0
                                }
                              />
                            )}
                          </div>
                          {isForAll ? (
                            <></>
                          ) : (
                            <div className={styles.membersContainer}>
                              {users.map((user) => {
                                return user.house === house.name ? (
                                  <label
                                    key={index + user.displayName}
                                    className={styles.userSelectText}
                                  >
                                    <input
                                      type="checkbox"
                                      value={[user.id, user.displayName]}
                                      onChange={handleParticipantsCheck}
                                    />
                                    {user.displayName}
                                  </label>
                                ) : (
                                  <></>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })
                  ) : (
                    <span>Loading</span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <span>loading...</span>
      )}
    </div>
  );
}
