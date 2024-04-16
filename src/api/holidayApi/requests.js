import holidayApi from "./config";

export const get_holidays_by_countryCode = async (code, year) => {
    try {
        const holidays = await holidayApi.holidays({ country: code, year })
        console.log(holidays);
        return holidays
    }
    catch (err) {
        console.error(err)
        return err
    }
}
