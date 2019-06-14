import axios from "axios";
import React, {useEffect, useState} from "react";
import {login} from "../common/auth.actions";
import {ErrorMessage, Field, Form, Formik} from "formik";
import {DateTime} from "luxon";

export default function Dashboard(props: any) {
    const [userData, setUserData]: [any, any] = useState({courtCases: []});

    useEffect(() => {
        const fetchData = async () => {
            const result = await axios.get("http://localhost:5000/api/user/1");
            console.log("fetching initial");
            setUserData(result.data);
        };
        fetchData();
    }, []);

    // useEffect(() => {
    //     console.log("SecondUseEffect");
    //     console.log(userData.courtCases.length);
    // }, [userData]);

    // const handleSubmit = async () => {
    //
    // }

    console.log(userData);
    return (
        <div>
            <Formik
                initialValues={{fileNo: "", courtNo: "", court: ""}}
                validate={values => {
                    const errors: any = {};
                    if (!values.fileNo) {
                        errors.email = "Required";
                    }
                    return errors;
                }}
                onSubmit={async (values, {setSubmitting}) => {
                    // const result = await login({email: values.email, password: values.password});
                    const result = await axios.post("http://localhost:5000/api/court-case", {court: values.court, courtNo: values.courtNo, fileNo: values.fileNo});
                    console.log({...userData, courtCases: [...userData.courtCases, result.data]});
                    setUserData({...userData, courtCases: [result.data, ...userData.courtCases]});
                    // props.updateUserState(result);
                    setSubmitting(false);

                }}
            >
                {({errors, isSubmitting}) => (
                    <Form style={{width: "100%", maxWidth: "330px", padding: "15px", margin: "0 auto"}}>
                        <div className="form-group">
                            <label>Bylos nr.</label>
                            <Field
                                className="form-control"
                                placeholder="Bylos nr."
                                type="text"
                                name="fileNo"
                            />
                        </div>
                        <ErrorMessage name="fileNo" component="div"/>
                        {/*{touched.password && errors.password && <div>{errors.password}</div>}*/}

                        <div className="form-group">
                            <label>Teismo nr.</label>
                            <Field
                                className="form-control"
                                placeholder="Teismo nr."
                                type="text"
                                name="courtNo"
                            />
                        </div>
                        <ErrorMessage name="courtNo" component="div"/>

                        <div className="form-group">
                            <label>Teismas</label>
                            <Field
                                className="form-control"
                                placeholder="Teismas"
                                type="text"
                                name="court"
                            />
                        </div>
                        <ErrorMessage name="court" component="div"/>


                        <button className="btn btn-lg btn-primary btn-block" type="submit" disabled={isSubmitting}>
                            Submit
                        </button>
                    </Form>
                )}
            </Formik>

            <Table courtCases={userData.courtCases}/>
        </div>
    );
}

const Table = (props: {courtCases: any[]}) => {
    const {courtCases} = props;
    console.log(courtCases.length);
    return (
        <div className="table-responsive" style={{width: "100%", maxWidth: "1200px", margin: "0 auto"}}>
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
