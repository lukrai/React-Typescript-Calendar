import axios from "axios";
import {Formik} from "formik";
import {DateTime} from "luxon";
import React, {useEffect, useState} from "react";
import Card from "react-bootstrap/es/Card";
import Form from "react-bootstrap/es/Form";
import * as yup from "yup";
import {addCourtCase} from "./dashboard.actions";
import styles from "./dashboard.module.css";

const schema = yup.object({
    fileNo: yup.string().required("Required").max(19, "Can'tmbe longer that 19 characters."),
});

export default function Dashboard(props: any) {
    const [userData, setUserData]: [any, any] = useState({courtCases: []});
    const {user} = props;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await axios.get(`http://localhost:5000/api/user/${user.id}`);
                setUserData(result.data);
            } catch (err) {
                props.triggerErrorToast(err.response && err.response.data && err.response.data.message || err);
            }
        };

        fetchData();
    }, []);

    return (
        <div>
            <div className={styles.headerContainer}>
                <Card className={styles.info}>
                    <Card.Header>My Info</Card.Header>
                    <Card.Body>
                        <Card.Text>
                            {user.court}<br/>
                            {user.firstName} {user.lastName}<br/>
                            {user.email}<br/>
                            {user.phoneNumber}
                        </Card.Text>
                    </Card.Body>
                </Card>

                <Formik
                    initialValues={{fileNo: ""}}
                    validationSchema={schema}
                    onSubmit={async (values, {setSubmitting, resetForm}) => {
                        try {
                            const result = await addCourtCase(values.fileNo);
                            setUserData({...userData, courtCases: [result, ...userData.courtCases]});
                            setSubmitting(false);
                            resetForm({
                                fileNo: "",
                            });
                        } catch (err) {
                            setSubmitting(false);
                            props.triggerErrorToast(err);
                        }
                    }}
                >
                    {({
                          handleSubmit,
                          handleChange,
                          handleBlur,
                          values,
                          touched,
                          isValid,
                          errors,
                          isSubmitting,
                      }) => (
                        <Form noValidate onSubmit={handleSubmit} className={styles.form} >
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
                                Submit
                            </button>
                        </Form>
                    )}
                </Formik>
            </div>

            <h2 className={styles.contentContainer}>Mano užregistruotos bylos</h2>
            <Table courtCases={userData.courtCases}/>
        </div>
    );
}

const Table = (props: { courtCases: any[] }) => {
    const {courtCases} = props;
    return (
        <div className={`table-responsive ${styles.contentContainer}`}>
            <table className="table table-sm">
                <thead>
                <tr>
                    <th scope="col">#</th>
                    <th scope="col">Registered At</th>
                    <th scope="col">File No.</th>
                    <th scope="col">Created At</th>
                </tr>
                </thead>
                <tbody>
                {courtCases.length > 0 && courtCases.map((o, index) => (
                    <tr key={o.id}>
                        <th>{index + 1}</th>
                        {o.calendar && <th>{o.calendar.date} {o.time}</th>}
                        <td>{o.fileNo}</td>
                        <td>{DateTime.fromISO(o.createdAt).toLocaleString()}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};
