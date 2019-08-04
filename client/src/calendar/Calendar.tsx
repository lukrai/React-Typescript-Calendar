import Octicon, { CircleSlash, Trashcan } from "@primer/octicons-react";
import { DateTime } from "luxon";
import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/es/Button";
import Card from "react-bootstrap/es/Card";
import ConfirmDialog from "../common/ConfirmDialog";
import { ICalendarWithCourtCases, ICourtCase } from "../typings";
import { deleteCourtCase, disableCourtCase, disableEnableCourtCases, getCalendarData } from "./calendar.actions";
import styles from "./calendar.module.css";
import { CustomDayPickerInput } from "./CustomDayPickerComponent";

const columnCount = 7;
const hoverColor = "#e0e0e0";

interface ICalendarProps {
    triggerErrorToast(err: string | Error): void;
}

const initialCalendarData: ICalendarWithCourtCases = {
    courtCases: [],
    createdAt: null,
    date: null,
    id: null,
    updatedAt: null,
};

const defaultWeekDay = 3;

export default function Calendar(props: ICalendarProps) {
    const weekDate = getAdjustedWeekDate(DateTime.local(), defaultWeekDay);
    const [calendarData, setCalendarData] = useState<ICalendarWithCourtCases>(initialCalendarData);
    const [dateParam, setDateParam] = useState<string>(weekDate);
    const [date, setDate] = useState<string>(weekDate);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await getCalendarData(date);
                setCalendarData(result);
            } catch (err) {
                props.triggerErrorToast((err.response && err.response.data && err.response.data.message) || err);
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
                <h5 className="font-weight-bold" style={{ alignSelf: "flex-end", marginRight: "1em", marginLeft: "1em" }}>
                    Posėdžių data: {calendarData.date}
                </h5>
            </div>
            <div className="container-fluid">
                {calendarData.courtCases
                    && calendarData.courtCases.length > 0
                    && <GridColumnHeadings disableGridColumn={disableGridColumn} columnCount={columnCount} />}

                {calendarData.courtCases
                    && calendarData.courtCases.length > 0
                    && Object.keys(groupedCourtCases).map((key: string, index: number) =>
                        <CalendarRow key={key} time={key} courtCases={groupedCourtCases[key]} rowIndex={index} disableGridItem={disableGridItem} deleteGridItem={deleteGridItem} />,
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
                        return { ...o, isDisabled: result.isDisabled };
                    }
                    return o;
                });
                return { ...calendarData, courtCases: data };
            });
        } catch (err) {
            props.triggerErrorToast((err.response && err.response.data && err.response.data.message) || err);
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
                return { ...calendarData, courtCases: data };
            });
        } catch (err) {
            props.triggerErrorToast((err.response && err.response.data && err.response.data.message) || err);
        }
    }

    async function deleteGridItem(courtCase: ICourtCase) {
        try {
            const result: ICourtCase = await deleteCourtCase(courtCase.id);
            setCalendarData(() => {
                const data = calendarData.courtCases.map(o => {
                    if (o.id === result.id) {
                        return { o, ...result };
                    }
                    return o;
                });
                return { ...calendarData, courtCases: data };
            });
        } catch (err) {
            props.triggerErrorToast((err.response && err.response.data && err.response.data.message) || err);
        }
    }
}

interface ICalendarRowProps {
    time: string;
    courtCases: ICourtCase[];
    rowIndex: number;

    disableGridItem(courtCase: ICourtCase): void;
    deleteGridItem?(courtCase: ICourtCase): void;
}

function CalendarRow(props: ICalendarRowProps): JSX.Element { // tslint:disable-line:function-name
    const { courtCases, time, rowIndex } = props;
    const isCasesNotEmpty = courtCases.some(courtCase => courtCase != null);
    return (
        <div className="row" style={{ flexWrap: "nowrap" }}>
            <div>{time}</div>
            {isCasesNotEmpty
                && courtCases.map((o, index: number) => {
                    if (o != null && o.isDisabled === true) {
                        return <DisabledItem key={o.id} courtCase={o} rowIndex={rowIndex} columnIndex={index} disableGridItem={props.disableGridItem} />;
                    }
                    return <CalendarItem
                        key={o.id}
                        courtCase={o}
                        rowIndex={rowIndex}
                        columnIndex={index}
                        disableGridItem={props.disableGridItem}
                        deleteGridItem={props.deleteGridItem}
                    />;
                })}
        </div>
    );
}

function GridColumnHeadings(props: { columnCount: number, disableGridColumn(columnCount: number): void }): JSX.Element {
    const headings: JSX.Element[] = [];
    for (let i = 0; i < props.columnCount; i += 1) {
        headings.push(
            <div className={`col ${styles.calendarHeaderItem}`} key={i}>
                <h3>
                    K{i + 1}
                </h3>
                <ConfirmDialog
                    title={"Disable grid elements in this column?"}
                    message={"This will disable all items in this grid column and no new court cases will be created in this column. Continue?"}
                    buttonText={"Disable/Enable"}
                    buttonVariant={"primary"}
                    callback={props.disableGridColumn.bind(null, i)}
                />
            </div>,
        );
    }

    return (
        <div className={`row ${styles.calendarHeaderContainer}`}>
            <div className={styles.calendarHeaderTimeColumn}>
                Time
            </div>
            {headings}
        </div>
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
    deleteGridItem?(courtCase: ICourtCase): void;
}

export function CalendarItem(props: IPropsGridItem) {
    const { fileNo, court, firstName, lastName, email, phoneNumber } = props.courtCase;
    const [isVisible, setIsVisible] = useState(false);
    const icon = <Octicon icon={Trashcan} verticalAlign="middle" />;

    return (
        <div className={`col ${styles.calendarItemContainer}`}>
            <Card className={styles.calendarItemCard}>
                <Card.Body className={styles.cardBody} id="cardBody">
                    <Card.Title>{fileNo}</Card.Title>
                    <Card.Text>
                        {court}
                    </Card.Text>
                    <Card.Text>
                        {firstName} {lastName}
                    </Card.Text>
                    <Card.Text className={styles.cardEmail} title={email}>
                        {email}
                    </Card.Text>
                    <Card.Text>
                        {phoneNumber}
                    </Card.Text>
                    <div className={styles.gridItemHover}
                        style={{
                            backgroundColor: isVisible ? hoverColor : "",
                            opacity: isVisible ? 0.75 : 0,
                        }}
                        onMouseOver={() => setIsVisible(true)}
                        onMouseOut={() => setIsVisible(false)}
                    >
                        <Button color="secondary" onClick={() => props.disableGridItem(props.courtCase)}>
                            <Octicon icon={CircleSlash} verticalAlign="middle" />
                        </Button>
                        <br />
                        <ConfirmDialog
                            title={"Delete this item?"}
                            message={"This item will be deleted and existing information would be lost. Continue?"}
                            buttonText={icon}
                            buttonVariant={"primary"}
                            callback={props.deleteGridItem.bind(null, props.courtCase)}
                        />
                    </div>
                </Card.Body>
            </Card>

        </div>
    );
}

export function DisabledItem(props: IPropsGridItem) {
    const [isVisible, setIsVisible] = useState<boolean>(false);

    return (
        <div className={`col ${styles.calendarItemContainer}`}>
            <Card bg="danger" text="white" className={styles.calendarItemCardDisabled}>
                <Card.Body>
                    <Octicon icon={CircleSlash} size="large" verticalAlign="middle" />
                    <div
                        className={styles.gridItemHover}
                        style={{
                            backgroundColor: isVisible ? hoverColor : "",
                            opacity: isVisible ? 0.75 : 0,
                        }}
                        onMouseOver={() => setIsVisible(true)}
                        onMouseOut={() => setIsVisible(false)}
                    >
                        <Button color="secondary" onClick={() => props.disableGridItem(props.courtCase)}>
                            <Octicon icon={CircleSlash} verticalAlign="middle" />
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
        weekDayAdjustedDate = nextMonthDate.set({ weekday: weekDay });
        if (weekDayAdjustedDate < nextMonthDate) {
            weekDayAdjustedDate = weekDayAdjustedDate.plus({ weeks: 1 });
        }
    }
    return weekDayAdjustedDate.toISODate();
}
