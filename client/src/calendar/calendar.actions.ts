import axios from "axios";

export async function getCalendarData(date: string) {
    try {
        const response = await axios.get(`http://localhost:5000/api/calendar/${date}`);
        if (response.data) {
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
        const response = await axios.put(`http://localhost:5000/api/court-case/${id}`, {isDisabled: disable});
        if (response.data) {
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
        const response = await axios.put(`http://localhost:5000/api/court-case`, {courtCases});
        if (response.data) {
            return response.data;
        } else {
            return {};
        }
    } catch (err) {
        throw new Error(err.response.data.message || err);
    }
}
