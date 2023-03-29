import client from "./client";

export const createNewEvent = async (formData) => {
  try {
    const { data } = await client.post(`/event/create`, formData);
    return data;
  } catch (error) {
    const { response } = error;
    if (response?.data) {
      return response.data; // exact error status (400, 401, 500등) from backend
    }
    return { error: error.message || error }; // if there is no response data -> frontend has a problem
  }
};

export const getAllEvents = async () => {
  try {
    const { data } = await client.get(`/event/events`);
    return data;
  } catch (error) {
    const { response } = error;
    if (response?.data) {
      return response.data; // exact error status (400, 401, 500등) from backend
    }
    return { error: error.message || error }; // if there is no response data -> frontend has a problem
  }
};

export const getEvent = async (eventId) => {
  try {
    const { data } = await client.get(`/event/${eventId}`);
    return data;
  } catch (error) {
    const { response } = error;
    if (response?.data) {
      return response.data; // exact error status (400, 401, 500등) from backend
    }
    return { error: error.message || error }; // if there is no response data -> frontend has a problem
  }
};

export const updateEvent = async (eventId, formData) => {
  try {
    const { data } = await client.put(`/event/update/${eventId}`, formData);
    return data;
  } catch (error) {
    const { response } = error;
    if (response?.data) {
      return response.data; // exact error status (400, 401, 500등) from backend
    }
    return { error: error.message || error }; // if there is no response data -> frontend has a problem
  }
};

export const deleteEvent = async (eventId) => {
  try {
    const { data } = await client.delete(`/event/delete/${eventId}`);
    return data;
  } catch (error) {
    const { response } = error;
    if (response?.data) {
      return response.data; // exact error status (400, 401, 500등) from backend
    }
    return { error: error.message || error }; // if there is no response data -> frontend has a problem
  }
};

export const getUpcomingEvents = async () => {
  try {
    const { data } = await client.get(`/event/upcoming`);
    return data;
  } catch (error) {
    const { response } = error;
    if (response?.data) {
      return response.data; // exact error status (400, 401, 500등) from backend
    }
    return { error: error.message || error }; // if there is no response data -> frontend has a problem
  }
};

export const getWaitingResultEvents = async () => {
  try {
    const { data } = await client.get(`/event/waiting-result`);
    return data;
  } catch (error) {
    const { response } = error;
    if (response?.data) {
      return response.data; // exact error status (400, 401, 500등) from backend
    }
    return { error: error.message || error }; // if there is no response data -> frontend has a problem
  }
};

export const getResultPostedEvents = async () => {
  try {
    const { data } = await client.get(`/event/result-posted`);
    return data;
  } catch (error) {
    const { response } = error;
    if (response?.data) {
      return response.data; // exact error status (400, 401, 500등) from backend
    }
    return { error: error.message || error }; // if there is no response data -> frontend has a problem
  }
};

export const getPastEvents = async () => {
  try {
    const { data } = await client.get(`/event/past`);
    return data;
  } catch (error) {
    const { response } = error;
    if (response?.data) {
      return response.data; // exact error status (400, 401, 500등) from backend
    }
    return { error: error.message || error }; // if there is no response data -> frontend has a problem
  }
};
