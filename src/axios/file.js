import { fileUploadClient, showErrorToast } from "./config";
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

export const uploadTutorImage = async (tutorId, file) => {
  try {
    const formData = new FormData()
    const userId = tutorId?.replace(/[\s\.\-]/g, '')
    formData.append('file', file)

    const res = await fileUploadClient.post(`/upload-image-azure/${userId}`, {
      file
    })
    return res
  }
  catch (err) {
    showErrorToast(err);
    throw err;
  }
}

