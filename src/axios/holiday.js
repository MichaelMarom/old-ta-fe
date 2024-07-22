import { apiClient, showErrorToast } from "./config"

export const fetch_holidays = async (code, year, month) => {
    try {
        const res = await apiClient.get(`/holiday/${code}/${year}/${month}`)
        return res
    }
    catch (err) {
        showErrorToast(err)
    }
}