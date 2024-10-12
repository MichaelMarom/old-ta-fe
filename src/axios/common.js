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


