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
