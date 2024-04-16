import {apiClient} from "./config"

export const fetch_holidays = async (code, year, month) => {
    try {
        const res = await apiClient.get(`/holiday/${code}/${year}/${month}`)
        console.log(res)
        return res
    }
    catch (err) {
        console.log(err)
        return err
    }
}