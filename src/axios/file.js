import { fileUploadClient } from "./config";
import { get_my_edu } from "./tutor";

export const upload_file = async (formData, fileName) => {
  try {
    const { data } = await fileUploadClient.post(`/upload?fileName=${fileName}`, formData)
    return data
  }
  catch (err) {
    console.log(err);
    return err
  }
}

export const getPreviousFilePathFromDB = async (userId) => {
  try {
    const response = await get_my_edu(userId); // Adjust the endpoint
    // Assuming the response.data has a property named filePath
    const previousFilePath = response[0]?.Resume;

    return previousFilePath || null;
  } catch (err) {
    console.error('Error fetching previous file path from DB:', err);
    throw err;
  }
};

export const deleteFileOnServer = async (userId) => {
  try {
    const response = await fileUploadClient.delete(`/delete-file/${userId}`);
    return response.data;
  } catch (err) {
    console.error('Error deleting file on server:', err);
    throw err;
  }
};