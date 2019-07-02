import axios from "axios";

export async function addCourtCase(fileNo) {
    try {
        const response = await axios.post("http://localhost:5000/api/court-case", {fileNo});
        if (response.data) {
            return response.data;
        } else {
            return {};
        }
    } catch (err) {
        throw new Error(err.response.data.message || err);
    }
}
