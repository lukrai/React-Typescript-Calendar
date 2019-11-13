import axios from "axios";

export async function getCalendarData(date: string) {
  try {
    const response = await axios.get(`/api/calendar/${date}`);
    if (response?.data) {
      return response.data;
    } else {
      return {};
    }
  } catch (err) {
    throw new Error(err.response.data.message || err);
  }
}

export async function disableCourtCase(id: number, disable: boolean) {
  try {
    const response = await axios.put(`/api/court-case/${id}`, { isDisabled: disable });
    if (response?.data) {
      return response.data;
    } else {
      return {};
    }
  } catch (err) {
    throw new Error(err.response.data.message || err);
  }
}

export async function disableEnableCourtCases(courtCases: any) {
  try {
    const response = await axios.put(`/api/court-case`, { courtCases });
    if (response?.data) {
      return response.data;
    } else {
      return {};
    }
  } catch (err) {
    throw new Error(err.response.data.message || err);
  }
}

export async function deleteCourtCase(id: number) {
  try {
    const response = await axios.delete(`/api/court-case/${id}`);
    return response.data;
  } catch (err) {
    throw new Error(err.response.data.message || err);
  }
}
