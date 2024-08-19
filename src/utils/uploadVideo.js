import { toast } from "react-toastify"
import { fileUploadClient, showErrorToast } from "../axios/config"


/**
 * 
 * @param {File} file file to upload to
 * @param {String} AcademyId tutor id
 * @param {String} type video uploadation type [upload , record]
 */
export const uploadVideoToAzure = async (file, AcademyId, type="upload") => {
    try {
        const formData = new FormData()
        const userId = AcademyId?.replace(/[\s\.\-]/g, '')
        formData.append('file', file)
        formData.append('user_id', userId)
        formData.append('upload_type', type)


        await fileUploadClient.post('/tutor/setup/record', formData)
        toast.success('Video Succesfully Uploaded!')
    }
    catch (err) {
        showErrorToast(err)
    }
}