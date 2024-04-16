import moment from 'moment';
import { monthFormat, wholeDateFormat } from '../constants/constants';

export const convertGMTOffsetToLocalString = (offset) => {
    const dateLocal = (moment().utc()).clone().add(offset, 'hours');
    const timeDateLocal = dateLocal.format(wholeDateFormat);
    return timeDateLocal;
}


export const showDate = (date, format = monthFormat) => {
    return moment(date).format(format);
}
// todo
export const convertTimeObjectToUserTimeZoneTime = (timeObject, GMT) => {

}
