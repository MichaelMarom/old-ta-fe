import { toast } from "react-toastify"
import { fileUploadClient, showErrorToast } from "../axios/config"

export const uploadVideoToAzure = async (file, AcademyId) => {
    try {
        const formData = new FormData()
        const userId = AcademyId?.replace(/[\s\.\-]/g, '')
        formData.append('file', file)
        formData.append('user_id', userId)

        await fileUploadClient.post('/tutor/setup/record', formData)
        toast.success('Video Succesfully Uploaded!')
    }
    catch (err) {
        showErrorToast(err)
    }
}