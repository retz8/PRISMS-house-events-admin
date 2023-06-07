import client from "./client";

export const uploadImage = async (formData) => {
  try {
    console.log(formData);
    const { data } = await client.post(`/upload-image`, formData);
    return data;
  } catch (error) {
    const { response } = error;
    if (response?.data) {
      return response.data; // exact error status (400, 401, 500등) from backend
    }
    return { error: error.message || error }; // if there is no response data -> frontend has a problem
  }
};
