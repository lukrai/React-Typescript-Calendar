import Octicon, {CircleSlash} from "@primer/octicons-react";
import axios from "axios";
import React, {useEffect, useState} from "react";
import Button from "react-bootstrap/es/Button";
import Card from "react-bootstrap/es/Card";
import Modal from "react-bootstrap/es/Modal";
import {CustomDayPickerInput} from "./CustomDayPickerComponent";
import {disableCourtCase, getCalendarData} from "./calendar.actions";

const columnCount = 7;

export default function Calendar(props: any) {
    const [calendarData, setCalendarData]: [any, any] = useState({});
    const [dateParam, setDateParam] = useState("2019-07-10");
    const [date, setDate] = useState(
        "2019-07-10",
    );

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
            <div className="container-fluid">
                {calendarData.courtCases
                && calendarData.courtCases.length > 0
                && <GridColumnHeadings disableGridColumn={disableGridColumn} columnCount={columnCount}></GridColumnHeadings>}

                {calendarData.courtCases
                && calendarData.courtCases.length > 0
                && Object.keys(groupedCourtCases).map((key: string, index: number) =>
                    <CalendarRow time={key} courtCases={groupedCourtCases[key]} rowIndex={index} disableGridItem={disableGridItem}></CalendarRow>
                )}
            </div>
        </>
    );

    async function disableGridItem(courtCase: any) {
        try {
            const result: any = await disableCourtCase(courtCase.id, !courtCase.isDisabled);
            setCalendarData(() => {
                const data = calendarData.courtCases.map((o: any, i: number) => {
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

    function disableGridColumn(columnIndex: number) {
        setCalendarData(() => {
            const data = calendarData.courtCases.map((courtCase: any, i: number) => {
                if (i % columnCount === columnIndex) {
                    return {...courtCase, isDisabled: !courtCase.isDisabled};
                }
                return courtCase;
            });
            return {...calendarData, courtCases: data};
        });
    }
}

function CalendarRow(props: any): JSX.Element { // tslint:disable-line:function-name
    const {courtCases, time, rowIndex} = props;
    const isCasesNotEmpty = courtCases.some((courtCase: any) => courtCase != null);
    return (
        <div className="row" style={{flexWrap: "nowrap"}}>
            <div>{time}</div>
            {isCasesNotEmpty
            && courtCases.map((o: any, index: number) => {
                if (o != null && o.isDisabled !== true) {
                    return <CalendarItem courtCase={o} rowIndex={rowIndex} columnIndex={index} disableGridItem={props.disableGridItem}/>;
                } else if (o != null && o.isDisabled === true) {
                    return <DisabledItem courtCase={o} rowIndex={rowIndex} columnIndex={index} disableGridItem={props.disableGridItem}/>;
                }
                return <DisabledItem courtCase={o} rowIndex={rowIndex} columnIndex={index} disableGridItem={props.disableGridItem}/>;
                // return <EmptyItem rowIndex={rowIndex} columnIndex={index} disableGridItem={props.disableGridItem}/>;
            })}
        </div>
    );
}

function GridColumnHeadings(props: { columnCount: number, disableGridColumn(columnCount: number): void }): JSX.Element {
    const headings: JSX.Element[] = [];
    for (let i = 0; i < props.columnCount; i += 1) {
        headings.push(
            <div className="col" key={i}>
                <h3>
                    K{i + 1}
                    <ConfirmDialog
                        title={"Disable grid elements in this column?"}
                        message={"This will disable all columns in this grid and existing items will be lost. Continue?"}
                        callback={props.disableGridColumn.bind(null, i)}
                    >
                    </ConfirmDialog>
                </h3>
            </div>,
        );
    }

    return (
        <div className="row">
            {headings}
        </div>
    );
}

function ConfirmDialog(props: any) {
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
                Disable
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
    courtCase: any;

    disableGridItem(courtCase: any): void;
}

interface IPropsGridCalandarItem extends IPropsGridItem {
    courtCase: any; // ICourtCase;
}

export function CalendarItem(props: IPropsGridCalandarItem) {
    const {fileNo, court, courtNo, firstName, lastName, phoneNumber} = props.courtCase;
    const [isVisible, setIsVisible] = useState(false);

    return (
        <div className="col" style={{paddingLeft: "2px", paddingRight: "2px", paddingBottom: "4px"}}>
            <Card>
                <Card.Body>
                    <Card.Title>{fileNo}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">{fileNo}</Card.Subtitle>
                    <Card.Text>
                        <p>{court}</p>
                        <p>{courtNo}</p>
                        <p>{firstName} {lastName} {phoneNumber}</p>
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
                        </Button>
                    </div>
                </Card.Body>
            </Card>

        </div>
    );
}

export function DisabledItem(props: IPropsGridItem) {
    const [isVisible, setIsVisible] = useState(false);

    return (
        <div className="col" style={{paddingLeft: "2px", paddingRight: "2px", paddingBottom: "4px", minWidth: "148px", textAlign: "center"}}>
            <Card bg="danger" text="white">
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
                        </Button>
                    </div>
                </Card.Body>
            </Card>
        </div>
    );
}

// export function EmptyItem(props: IPropsGridItem) {
//     const [isVisible, setIsVisible] = useState(false);
//     const itemStyle = {height: "100%", top: "0", right: "0", backgroundColor: isVisible ? "#e0e0e0" : "", opacity: isVisible ? 1 : 0, borderRadius: "4px"};
//
//     return (
//         <div className="col">
//             {/*<Grid item xs></Grid>*/}
//             {/*<div*/}
//             {/*    style={itemStyle}*/}
//             {/*    onMouseOver={() => setIsVisible(true)}*/}
//             {/*    onMouseOut={() => setIsVisible(false)}*/}
//             {/*>*/}
//             {/*    <IconButton color="secondary" onClick={() => props.disableGridItem(props.rowIndex, props.columnIndex)}>*/}
//             {/*        <Block style={{ fontSize: "0.5em" }}></Block>*/}
//             {/*    </IconButton>*/}
//             {/*</div>*/}
//         </div>
//     );
// }
