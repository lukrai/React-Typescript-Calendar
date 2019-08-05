import axios from "axios";
import { ICourtCaseWithCalendar } from "../typings";

export async function addCourtCase(fileNo): Promise<ICourtCaseWithCalendar> {
    try {
        const response = await axios.post("/api/court-case", { fileNo });
        if (response.data) {
            return response.data;
        }
    } catch (err) {
        throw new Error(err.response.data.message || err);
    }
}
