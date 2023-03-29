import client from "./client";

// export const createNewHouse = async () => {}

export const getAllHouses = async () => {
  try {
    const { data } = await client.get(`/house/houses`);
    console.log(data);
    return data;
  } catch (error) {
    console.log(error);
    const { response } = error;
    if (response?.data) {
      return response.data; // exact error status (400, 401, 500등) from backend
    }
    return { error: error.message || error }; // if there is no response data -> frontend has a problem
  }
};

export const getHouse = async (houseId) => {
  try {
    const { data } = await client.get(`/house/${houseId}`);
    return data;
  } catch (error) {
    const { response } = error;
    if (response?.data) {
      return response.data; // exact error status (400, 401, 500등) from backend
    }
    return { error: error.message || error }; // if there is no response data -> frontend has a problem
  }
};

export const getLeaders = async (houseName) => {
  try {
    const { data } = await client.get(`/house/leaders/${houseName}`);
    return data;
  } catch (error) {
    const { response } = error;
    if (response?.data) {
      return response.data; // exact error status (400, 401, 500등) from backend
    }
    return { error: error.message || error }; // if there is no response data -> frontend has a problem
  }
};

export const getMembers = async (houseName) => {
  try {
    const { data } = await client.get(`/house/members/${houseName}`);
    return data;
  } catch (error) {
    const { response } = error;
    if (response?.data) {
      return response.data; // exact error status (400, 401, 500등) from backend
    }
    return { error: error.message || error }; // if there is no response data -> frontend has a problem
  }
};

export const deleteHouse = async (houseId) => {
  try {
    const { data } = await client.delete(`/house/delete/${houseId}`);
    return data;
  } catch (error) {
    const { response } = error;
    if (response?.data) {
      return response.data; // exact error status (400, 401, 500등) from backend
    }
    return { error: error.message || error }; // if there is no response data -> frontend has a problem
  }
};

export const updateHouse = async (houseId, formData) => {
  try {
    const { data } = await client.put(`/house/update/${houseId}`, formData);
    return data;
  } catch (error) {
    const { response } = error;
    if (response?.data) {
      return response.data; // exact error status (400, 401, 500등) from backend
    }
    return { error: error.message || error }; // if there is no response data -> frontend has a problem
  }
};

export const updateHousePoint = async (houseId, formData) => {
  try {
    const { data } = await client.patch(
      `/house/update-point/${houseId}`,
      formData
    );
    return data;
  } catch (error) {
    const { response } = error;
    if (response?.data) {
      return response.data; // exact error status (400, 401, 500등) from backend
    }
    return { error: error.message || error }; // if there is no response data -> frontend has a problem
  }
};
