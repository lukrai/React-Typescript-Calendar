import axios from "axios";
import { Formik } from "formik";
import { DateTime } from "luxon";
import React, { useEffect, useState } from "react";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import ReactTable from "react-table";
import * as yup from "yup";
import { ICourtCaseWithCalendar, IUser } from "../typings";
import { addCourtCase } from "./dashboard.actions";
import styles from "./dashboard.module.css";

const TAB_KEYS = {
    default: "defaultCourtCases",
    court: "courtCourtCases",
};

interface IProps {
    user: IUser;
    triggerErrorToast?(error: Error): void;
}

const schema = yup.object({
    fileNo: yup
        .string()
        .required("Privalomas laukas")
        .max(19, "Bylos nr. negali būti ilgesnė už 19 simbolių."),
});

export default function Dashboard(props: IProps) {
    const [userData, setUserData] = useState<{ courtCases: ICourtCaseWithCalendar[] }>({ courtCases: [] });
    const [courtCaseData, setCourtCaseData] = useState<ICourtCaseWithCalendar[]>([]);
    const [loading, setLoading] = useState(true);
    const [key, setKey] = useState("defaultCourtCases");
    const { user } = props;

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const result = await axios.get(`/api/user/${user.id}`);
                setCourtCaseData(result.data.courtCases);
                setLoading(false);
            } catch (err) {
                setLoading(false);
                props.triggerErrorToast((err.response && err.response.data && err.response.data.message) || err);
            }
        };

        fetchData();
    }, [props, user.id]);

    const getUserCourtData = async (tabKey: string) => {
        try {
            setLoading(true);
            setKey(tabKey);
            const result =
                tabKey === TAB_KEYS.court
                    ? await axios.get(`/api/court-case`)
                    : await axios.get(`/api/user/${user.id}`);
            setCourtCaseData(tabKey === TAB_KEYS.court ? result.data : result.data.courtCases);
            setLoading(false);
        } catch (err) {
            props.triggerErrorToast((err.response && err.response.data && err.response.data.message) || err);
        }
    };

    return (
        <div>
            <div className={styles.headerContainer}>
                <Card className={styles.info}>
                    <Card.Header>Mano duomenys</Card.Header>
                    <Card.Body>
                        <Card.Text>
                            {user.court}
                            <br />
                            {user.firstName} {user.lastName}
                            <br />
                            {user.email}
                            <br />
                            {user.phoneNumber}
                        </Card.Text>
                    </Card.Body>
                </Card>

                <Formik
                    initialValues={{ fileNo: "" }}
                    validationSchema={schema}
                    onSubmit={async (values, { setSubmitting, resetForm }) => {
                        try {
                            const result = await addCourtCase(values.fileNo);
                            setCourtCaseData([result, ...courtCaseData]);
                            setSubmitting(false);
                            resetForm({values: {
                                fileNo: "",
                            }});
                        } catch (err) {
                            setSubmitting(false);
                            props.triggerErrorToast(err);
                        }
                    }}
                >
                    {({ handleSubmit, handleChange, handleBlur, values, touched, errors, isSubmitting }) => (
                        <Form noValidate onSubmit={handleSubmit} className={styles.form}>
                            <Form.Group>
                                <Form.Label>Bylos nr.</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Bylos Nr."
                                    name="fileNo"
                                    value={values.fileNo}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    isInvalid={!!errors.fileNo && !!touched.fileNo}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {touched.fileNo && errors.fileNo}
                                </Form.Control.Feedback>
                            </Form.Group>
                            <button className="btn btn-lg btn-primary btn-block" type="submit" disabled={isSubmitting}>
                                Registruoti
                            </button>
                        </Form>
                    )}
                </Formik>
            </div>

            {/* <h2 className={styles.contentContainer}>Mano užregistruotos bylos</h2> */}
            {/* <Table courtCases={userData.courtCases}/> */}
            <div className={`table-responsive ${styles.contentContainer}`}>
                <Tabs activeKey={key} id="caseTables" onSelect={k => getUserCourtData(k)}>
                    <Tab eventKey={TAB_KEYS.default} title="Mano užregistruotos bylos">
                        <CourtCasesTable courtCases={courtCaseData} loading={loading} />
                    </Tab>
                    <Tab eventKey={TAB_KEYS.court} title="Mano teismo bylos">
                        <CourtCasesTable courtCases={courtCaseData} loading={loading} />
                    </Tab>
                </Tabs>
            </div>
        </div>
    );
}

const CourtCasesTable = (props: { courtCases: ICourtCaseWithCalendar[]; loading: boolean }) => {
    const { loading, courtCases = [] } = props;
    return (
        <ReactTable
            style={{ maxWidth: "1200px", margin: "0 auto" }}
            columns={[
                {
                    Header: "Priskirtas laikas",
                    id: "registeredCalendarDate",
                    accessor: o => o.calendar && `${o.calendar.date} ${o.time}`,
                },
                {
                    Header: "Bylos nr.",
                    accessor: "fileNo",
                    width: 165,
                },
                {
                    Header: "Vardas",
                    accessor: "firstName",
                },
                {
                    Header: "Pavardė",
                    accessor: "lastName",
                },
                {
                    Header: "El. paštas",
                    accessor: "email",
                },
                {
                    Header: "Tel. nr.",
                    accessor: "phoneNumber",
                },
                {
                    Header: "Registracijos data",
                    id: "registeredAt",
                    accessor: o => DateTime.fromISO(o.registeredAt).toISODate(),
                },
            ]}
            data={courtCases}
            loading={loading}
            filterable
            defaultPageSize={20}
            className="-striped -highlight"
        />
    );
};
