import client from "./client";

export const getAllUsers = async () => {
  try {
    const { data } = await client.get(`/user/users`);
    return data;
  } catch (error) {
    const { response } = error;
    if (response?.data) {
      return response.data; // exact error status (400, 401, 500등) from backend
    }
    return { error: error.message || error }; // if there is no response data -> frontend has a problem
  }
};

export const getUser = async (userId) => {
  try {
    const { data } = await client.get(`/user/${userId}`);
    return data;
  } catch (error) {
    const { response } = error;
    if (response?.data) {
      return response.data; // exact error status (400, 401, 500등) from backend
    }
    return { error: error.message || error }; // if there is no response data -> frontend has a problem
  }
};

export const deleteUser = async (userId) => {
  try {
    const { data } = await client.delete(`/user/delete/${userId}`);
    return data;
  } catch (error) {
    const { response } = error;
    if (response?.data) {
      return response.data; // exact error status (400, 401, 500등) from backend
    }
    return { error: error.message || error }; // if there is no response data -> frontend has a problem
  }
};

export const updateUser = async (userId, formData) => {
  try {
    const { data } = await client.put(`/user/update/${userId}`, formData);
    return data;
  } catch (error) {
    const { response } = error;
    if (response?.data) {
      return response.data; // exact error status (400, 401, 500등) from backend
    }
    return { error: error.message || error }; // if there is no response data -> frontend has a problem
  }
};

export const searchUser = async (query) => {
  try {
    const { data } = await client.get(`/user/search?displayName=${query}`);
    return data;
  } catch (error) {
    const { response } = error;
    if (response?.data) {
      return response.data;
    }
    return { error: error.message || error };
  }
};

export const graduateSeniors = async (query) => {
  try {
    const { data } = await client.delete(`/user/graduate`);
    return data;
  } catch (error) {
    const { response } = error;
    if (response?.data) {
      return response.data;
    }
    return { error: error.message || error };
  }
};

export const promoteStudents = async (query) => {
  try {
    const { data } = await client.patch(`/user/promote`);
    return data;
  } catch (error) {
    const { response } = error;
    if (response?.data) {
      return response.data;
    }
    return { error: error.message || error };
  }
};
