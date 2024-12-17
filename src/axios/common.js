import { apiClient, showErrorToast } from "./config";

export const getNameUsingIdColumn = async (id, tableName, fieldName) => {
  try {
    const response = await apiClient.get(`/${tableName}/getField/${id}`, {
      params: { fieldName },
    });
    return response.data;
  } catch (err) {
    showErrorToast(err);
  }
};

/**
 *
 * @param {Object} id  {idColumnName, value}
 * @param {String} tableName
 * @param {Object} field {fieldName, fieldValue,....}
 */
export const updateFieldUsingIdColumn = async (id, tableName, fields) => {
  try {
    const response = await apiClient.put(`/${tableName}/update/${id.id}`, {
      fields,
      id,
    });
    return response.data;
  } catch (err) {
    showErrorToast(err);
  }
};


export const subscribeToPushNotifications = async (subscription) => {
  try {
    const response = await apiClient.post('/subscribe', subscription);
    return response.data;
  } catch (err) {
    showErrorToast(err);
  }
}

export const showNotification = async (notificationObj) => {
  try {
    const response = await apiClient.post('/send-notification', notificationObj);
    return response.data;
  } catch (err) {
    showErrorToast(err);
  }
}

export const post_notification = async (notification) => {
  try {
    const response = await apiClient.post('/notification', notification);
    return response.data;
  } catch (err) {
    showErrorToast(err);
  }
}

export const update_notification = async (id, body) => {
  try {
    const response = await apiClient.put(`/notification/${id}`, body);
    return response.data;
  } catch (err) {
    showErrorToast(err);
  }
}

