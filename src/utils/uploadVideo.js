import { fileUploadClient, showErrorToast } from "../axios/config";

/**
 *
 * @param {File} file file to upload to
 * @param {String} AcademyId tutor id
 * @param {String} type video uploadation type [upload , record]
 */
export const uploadVideoToAzure = async (
  file,
  AcademyId,
  containerName,
  type = "upload",
  onUploadProgress
) => {
  try {
    const formData = new FormData();
    const userId = AcademyId?.replace(/[\s\.\-]/g, "");
    console.log(userId)
    formData.append("file", file);
    formData.append("user_id", userId);
    formData.append("upload_type", type);
    formData.append("containerName", containerName);

    return await fileUploadClient.post("/tutor/setup/record", formData, {
      onUploadProgress,
    });
  } catch (err) {
    showErrorToast(err);
  }
};
