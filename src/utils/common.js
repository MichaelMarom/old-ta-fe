import _ from 'lodash'
import { toast } from 'react-toastify';
import   moment from 'moment';

export const formatName = (firstName, lastName) => {
  return `${firstName} ${lastName[0].toUpperCase()}.`;
};

export const isEqualTwoObjectsRoot = (obj1, obj2) => {
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) {
    return false;
  }

  for (const key of keys1) {
    if (obj1[key] !== obj2[key]) {
      return false;
    }
  }

  return true;
};

export const copyToClipboard = (text) => {
  const textArea = document.createElement("textarea");
  textArea.value = text;

  document.body.appendChild(textArea);

  textArea.select();

  document.execCommand("copy");

  document.body.removeChild(textArea);
};

export const convertTutorIdToName = (academyId) => {
  return academyId ?
    academyId.split('.')[0] + " " + academyId.split('.')[1][1] : ''
}

function isArrayStringEqual(array, strArray) {
  try {
    const parsedArray = JSON.parse(strArray);

    return JSON.stringify(array.sort()) === JSON.stringify(parsedArray.sort());
  } catch (error) {
    console.log('Error parsing JSON:', error);
    return false;
  }
}

export const unsavedChangesHelper = (fieldValues, tutor) => {
  return (
    // tutor.AcademyId !== undefined && fieldValues.academyId !== undefined && tutor.AcademyId !== fieldValues.academyId ||
    (tutor.Address1 !== undefined && fieldValues.add1 !== undefined && tutor.Address1 !== fieldValues.add1) ||
    (tutor.Address2 !== undefined && fieldValues.add2 !== undefined && tutor.Address2 !== fieldValues.add2) ||
    (tutor.CellPhone !== undefined && fieldValues.cell !== undefined && tutor.CellPhone !== fieldValues.cell) ||
    (tutor.CityTown !== undefined && fieldValues.city !== undefined && tutor.CityTown !== fieldValues.city) ||
    (tutor.Country !== undefined && fieldValues.country !== undefined && tutor.Country !== fieldValues.country) ||
    (tutor.FirstName !== undefined && fieldValues.fname !== undefined && tutor.FirstName !== fieldValues.fname) ||
    (tutor.GMT !== undefined && fieldValues.timeZone !== undefined && tutor.GMT !== fieldValues.timeZone) ||
    (tutor.Grades !== undefined && fieldValues.tutorGrades !== undefined && !isArrayStringEqual(fieldValues.tutorGrades, tutor.Grades)
    ) ||
    (tutor.HeadLine !== undefined && fieldValues.headline !== undefined && tutor.HeadLine !== fieldValues.headline) ||
    (tutor.Introduction !== undefined && fieldValues.intro !== undefined && tutor.Introduction !== fieldValues.intro) ||
    (tutor.LastName !== undefined && fieldValues.lname !== undefined && tutor.LastName !== fieldValues.lname) ||
    (tutor.MiddleName !== undefined && fieldValues.mname !== undefined && tutor.MiddleName !== fieldValues.mname) ||
    (tutor.Motivate !== undefined && fieldValues.motivation !== undefined && tutor.Motivate !== fieldValues.motivation) ||
    (tutor.ResponseHrs !== undefined && fieldValues.response_zone !== undefined && tutor.ResponseHrs !== fieldValues.response_zone) ||
    (tutor.StateProvince !== undefined && fieldValues.state !== undefined && tutor.StateProvince !== fieldValues.state) ||
    (tutor.ZipCode !== undefined && fieldValues.zipCode !== undefined && tutor.ZipCode !== fieldValues.zipCode) ||
    // (tutor.StartVacation !== undefined && fieldValues.start !== undefined && tutor.StartVacation !== fieldValues.start) ||
    // (tutor.EndVacation !== undefined && fieldValues.end !== undefined && tutor.EndVacation !== fieldValues.end) ||
    (tutor.VacationMode !== undefined && fieldValues.vacation_mode !== undefined && tutor.VacationMode !== fieldValues.vacation_mode)
  );
}


export const capitalizeFirstLetter = (name) => {
  return name.charAt(0).toUpperCase() + name.slice(1);
}


export function getFileExtension(filename) {
  return filename.split('.').pop();
}

/**
 * 
 * @param {{}} dbState Db Values
 * @param {{}} currentState LocalCurrent Values
 * @returns Boolean - if dbValues = localValues
 */
export const compareStates = (dbState, currentState) => {
  // console.log(dbState, currentState)
  if (!(Object.keys(dbState).length)) return false;

  for (const key in currentState) {
    console.log(currentState[key], key, dbState?.[key], currentState[key] !== undefined,
      currentState[key] !== dbState?.[key], !_.isEqual(currentState[key], dbState[key]))

      if(key ==="CertificateExpiration" && moment(currentState["CertificateExpiration"]).isSame(moment(),'day')) continue;
    if (_.isObject(currentState[key]) && currentState[key] !== undefined && !_.isEqual(currentState[key], dbState[key])) return true

    if (!_.isObject(currentState[key]) &&
      currentState[key] !== dbState?.[key] && currentState[key] !== undefined) {
      return true
    }
  }
  return false 
};


export const generateUpcomingSessionMessage = (session, fromNow) => {
  return session?.id ? `The next lessson (${session.subject}) starting in ${fromNow}` : ''
}


export const showRevisitToast = () => {
  toast.info("We are saving the fields you entered. You can return to this page later to complete the application.", {
    className: "setup-private-info",
    autoClose: false
  })
}


export const measureSpeed = async () => {
  const imageUrl = "https://via.placeholder.com/1000"; // URL of a small image file
  const startTime = new Date().getTime();
  const response = await fetch(imageUrl);
  const endTime = new Date().getTime();
  const duration = (endTime - startTime) / 1000; // Time in seconds
  const imageSize = response.headers.get('content-length'); // Image size in bytes
  const speedBps = (imageSize * 8) / duration; // Speed in bits per second
  const speedKbps = speedBps / 1024; // Speed in kilobits per second
  return speedKbps;
};

