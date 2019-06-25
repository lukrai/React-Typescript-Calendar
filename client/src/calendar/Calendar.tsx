import Octicon, {CircleSlash} from "@primer/octicons-react";
import {DateTime} from "luxon";
import React, {useEffect, useState} from "react";
import Button from "react-bootstrap/es/Button";
import Card from "react-bootstrap/es/Card";
import Modal from "react-bootstrap/es/Modal";
import {disableCourtCase, disableEnableCourtCases, getCalendarData} from "./calendar.actions";
import {CustomDayPickerInput} from "./CustomDayPickerComponent";

const columnCount = 7;

interface ICalendarProps {
    triggerErrorToast(err: string | Error): void;
}

interface ICalendarData {
    courtCases: ICourtCase[];
    createdAt: string;
    date: string;
    id: number;
    updatedAt: string;
}

interface ICourtCase {
    calendarId: number;
    court: string;
    courtNo: string;
    createdAt: string;
    fileNo: string;
    id: number;
    isDisabled: boolean;
    time: string;
    updatedAt: string;
    userId: number;
}

const initialCalendarData: ICalendarData = {
    courtCases: [],
    createdAt: null,
    date: null,
    id: null,
    updatedAt: null,
};

const defaultWeekDay = 3;

export default function Calendar(props: ICalendarProps) {
    const weekDate = getAdjustedWeekDate(DateTime.local(), defaultWeekDay);
    const [calendarData, setCalendarData] = useState<ICalendarData>(initialCalendarData);
    const [dateParam, setDateParam] = useState<string>(weekDate);
    const [date, setDate] = useState<string>(weekDate);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await getCalendarData(date);
                setCalendarData(result);
            } catch (err) {
                props.triggerErrorToast(err.response && err.response.data && err.response.data.message || err);
            }
        };
        fetchData();
    }, [date]);

    const groupedCourtCases = calendarData.courtCases
    && calendarData.courtCases.length > 0
        ? groupByTime(calendarData.courtCases)
        : {};

    return (
        <>
            <div className="input-group">
                <CustomDayPickerInput setDateParam={setDateParam} selectedDay={new Date(dateParam)}>
                    <button
                        className="btn btn-outline-secondary"
                        type="button"
                        onClick={() =>
                            setDate(dateParam)
                        }
                    >
                        Search
                    </button>
                </CustomDayPickerInput>
            </div>
            <div className="container-fluid">
                {calendarData.courtCases
                && calendarData.courtCases.length > 0
                && <GridColumnHeadings disableGridColumn={disableGridColumn} columnCount={columnCount}/>}

                {calendarData.courtCases
                && calendarData.courtCases.length > 0
                && Object.keys(groupedCourtCases).map((key: string, index: number) =>
                    <CalendarRow key={key} time={key} courtCases={groupedCourtCases[key]} rowIndex={index} disableGridItem={disableGridItem}/>,
                )}
            </div>
        </>
    );

    async function disableGridItem(courtCase: ICourtCase) {
        try {
            const result: ICourtCase = await disableCourtCase(courtCase.id, !courtCase.isDisabled);
            setCalendarData(() => {
                const data = calendarData.courtCases.map(o => {
                    if (o.id === result.id) {
                        return {...o, isDisabled: result.isDisabled};
                    }
                    return o;
                });
                return {...calendarData, courtCases: data};
            });
        } catch (err) {
            props.triggerErrorToast(err.response && err.response.data && err.response.data.message || err);
        }

    }

    async function disableGridColumn(columnIndex: number) {
        try {
            const courtCasesToUpdate = calendarData.courtCases.filter((courtCase, i: number) => i % columnCount === columnIndex);
            const result: ICourtCase[] = await disableEnableCourtCases(courtCasesToUpdate);

            setCalendarData(() => {
                const data = calendarData.courtCases.map(courtCase => {
                    const updatedCourtCase = result.find(o => o.id === courtCase.id);
                    if (updatedCourtCase) {
                        return updatedCourtCase;
                    }
                    return courtCase;
                });
                return {...calendarData, courtCases: data};
            });
        } catch (err) {
            props.triggerErrorToast(err.response && err.response.data && err.response.data.message || err);
        }
    }
}

interface ICalendarRowProps {
    time: string;
    courtCases: ICourtCase[];
    rowIndex: number;

    disableGridItem(courtCase: ICourtCase): void;
}

function CalendarRow(props: ICalendarRowProps): JSX.Element { // tslint:disable-line:function-name
    const {courtCases, time, rowIndex} = props;
    const isCasesNotEmpty = courtCases.some(courtCase => courtCase != null);
    return (
        <div className="row" style={{flexWrap: "nowrap"}}>
            <div>{time}</div>
            {isCasesNotEmpty
            && courtCases.map((o, index: number) => {
                if (o != null && o.isDisabled === true) {
                    return <DisabledItem key={o.id} courtCase={o} rowIndex={rowIndex} columnIndex={index} disableGridItem={props.disableGridItem}/>;
                }
                return <CalendarItem key={o.id} courtCase={o} rowIndex={rowIndex} columnIndex={index} disableGridItem={props.disableGridItem}/>;
            })}
        </div>
    );
}

function GridColumnHeadings(props: { columnCount: number, disableGridColumn(columnCount: number): void }): JSX.Element {
    const headings: JSX.Element[] = [];
    for (let i = 0; i < props.columnCount; i += 1) {
        headings.push(
            <div className="col" key={i} style={{paddingLeft: "2px", paddingRight: "2px", paddingBottom: "4px", minWidth: "148px", textAlign: "center"}}>
                <h3>
                    K{i + 1}
                </h3>
                <ConfirmDialog
                    title={"Disable grid elements in this column?"}
                    message={"This will disable all columns in this grid and existing items will be lost. Continue?"}
                    callback={props.disableGridColumn.bind(null, i)}
                />
            </div>,
        );
    }

    return (
        <div className="row" style={{flexWrap: "nowrap", marginTop: "12px", marginBottom: "12px"}}>
            <div style={{minWidth: "38px"}}>
                Time
            </div>
            {headings}
        </div>
    );
}

function ConfirmDialog(props: { title: string; message: string; callback(): void }) {
    const [isOpen, setIsOpen] = useState(false);

    function handleClose() {
        setIsOpen(false);
    }

    function handleOpen() {
        setIsOpen(true);
    }

    function handlePress(e: any) {
        if (typeof props.callback === "function") {
            handleClose();
            props.callback();
        }
    }

    return (
        <>
            <Button variant="primary" onClick={handleOpen}>
                Disable/Enable
            </Button>

            <Modal show={isOpen} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{props.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>{props.message}</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        No
                    </Button>
                    <Button variant="primary" onClick={handlePress}>
                        Yes
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

const groupBy = (key: string) => (array: any[]) =>
    array.reduce((objectsByKeyValue, obj) => {
        const value = obj[key];
        objectsByKeyValue[value] = (objectsByKeyValue[value] || []).concat(obj);
        return objectsByKeyValue;
    }, {});

const groupByTime = groupBy("time");

interface IPropsGridItem {
    rowIndex: number;
    columnIndex: number;
    courtCase: ICourtCase;

    disableGridItem(courtCase: ICourtCase): void;
}

export function CalendarItem(props: IPropsGridItem) {
    const {fileNo, court, courtNo} = props.courtCase;
    const [isVisible, setIsVisible] = useState(false);

    return (
        <div className="col" style={{paddingLeft: "2px", paddingRight: "2px", paddingBottom: "4px"}}>
            <Card style={{minHeight: "150px"}}>
                <Card.Body>
                    <Card.Title>{fileNo}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">{court}</Card.Subtitle>
                    <Card.Text>
                        {court}
                    </Card.Text>
                    <div
                        style={{
                            height: "100%",
                            position: "absolute",
                            top: "0",
                            right: "0",
                            backgroundColor: isVisible ? "#e0e0e0" : "",
                            opacity: isVisible ? 0.75 : 0,
                            borderRadius: "4px",
                        }}
                        onMouseOver={() => setIsVisible(true)}
                        onMouseOut={() => setIsVisible(false)}
                    >
                        <Button color="secondary" onClick={() => props.disableGridItem(props.courtCase)}>
                            <Octicon icon={CircleSlash} verticalAlign="middle"/>
                        </Button>
                    </div>
                </Card.Body>
            </Card>

        </div>
    );
}

export function DisabledItem(props: IPropsGridItem) {
    const [isVisible, setIsVisible] = useState<boolean>(false);

    return (
        <div className="col" style={{paddingLeft: "2px", paddingRight: "2px", paddingBottom: "4px", minWidth: "148px", textAlign: "center"}}>
            <Card bg="danger" text="white" style={{minHeight: "150px"}}>
                <Card.Body>
                    <Octicon icon={CircleSlash} size="large" verticalAlign="middle"/>
                    <div
                        style={{
                            height: "100%",
                            position: "absolute",
                            top: "0",
                            right: "0",
                            backgroundColor: isVisible ? "#e0e0e0" : "",
                            opacity: isVisible ? 0.75 : 0,
                            borderRadius: "4px",
                        }}
                        onMouseOver={() => setIsVisible(true)}
                        onMouseOut={() => setIsVisible(false)}
                    >
                        <Button color="secondary" onClick={() => props.disableGridItem(props.courtCase)}>
                            <Octicon icon={CircleSlash} verticalAlign="middle"/>
                        </Button>
                    </div>
                </Card.Body>
            </Card>
        </div>
    );
}

export function getAdjustedWeekDate(date: DateTime, weekDay: number): string {
    const nextMonthDate = date;
    let weekDayAdjustedDate = nextMonthDate;
    if (nextMonthDate.weekday !== weekDay) {
        weekDayAdjustedDate = nextMonthDate.set({weekday: weekDay});
        if (weekDayAdjustedDate < nextMonthDate) {
            weekDayAdjustedDate = weekDayAdjustedDate.plus({weeks: 1});
        }
    }
    return weekDayAdjustedDate.toISODate();
}
