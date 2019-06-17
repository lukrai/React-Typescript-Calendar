import axios from "axios";
import React, {useEffect, useState} from "react";
import {CustomDayPickerInput} from "./CustomDayPickerComponent";

export default function Calendar(props: any) {
    const [calendarData, setCalendarData]: [any, any] = useState({});
    const [dateParam, setDateParam] = useState("2019-07-10");
    const [date, setDate] = useState(
        "2019-07-10",
    );

    async function getCalendarData(date: string) {
        try {
            const response = await axios.get(`http://localhost:5000/api/calendar/${date}`);
            if (response.data) {
                return response.data;
            } else {
                return {};
            }
        } catch (err) {
            props.triggerErrorToast(err.response && err.response.data && err.response.data.message || err);
            return {};
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            const result = await getCalendarData(date);
            setCalendarData(result);
        };

        fetchData();
    }, [date]);

    return (
        <>
            <CustomDayPickerInput setDateParam={setDateParam}>
                <button
                    type="button"
                    onClick={() =>
                        setDate(dateParam)
                    }
                >
                    Search
                </button>
            </CustomDayPickerInput>
            <ul>
                {calendarData.courtCases && calendarData.courtCases.length > 0 && calendarData.courtCases.map((o: any) => (
                    <li key={o.id}>
                        <p>{o.time}</p>
                        <p>{o.fileNo}</p>
                    </li>
                ))}
            </ul>
        </>
    );
}
