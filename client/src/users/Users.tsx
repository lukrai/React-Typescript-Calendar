import axios from "axios";
import {DateTime} from "luxon";
import ReactTable from "react-table";
import React, {useEffect, useState} from "react";
import {disableEnableCourtCases, getCalendarData} from "../calendar/calendar.actions";
import Button from "react-bootstrap/es/Button";
import Modal from "react-bootstrap/es/Modal";
import {login} from "../common/auth.actions";
import {Formik} from "formik";
import * as yup from "yup";
import Form from "react-bootstrap/es/Form";

export async function addUser(user) {
    try {
        const response = await axios.post(`http://localhost:5000/api/user`, user);
        if (response.data) {
            return response.data;
        } else {
            return {};
        }
    } catch (err) {
        throw new Error(err.response.data.message || err);
    }
}

export async function updateUser(user) {
    try {
        const response = await axios.put(`http://localhost:5000/api/user/${user.id}`, user);
        if (response.data) {
            return response.data;
        } else {
            return {};
        }
    } catch (err) {
        throw new Error(err.response.data.message || err);
    }
}


export default function Users(props) {
    const [userData, setUserData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const result = await axios.get("http://localhost:5000/api/user");
                setUserData(result.data);
                setLoading(false);
            } catch (err) {
                props.triggerErrorToast(err.response && err.response.data && err.response.data.message || err);
            }
        };
        fetchData();
    }, []);

    console.log(userData);
    console.log(props);

    const updateUserData = user => {
        try {
            setUserData(() => {
                const data = userData.map(o => {
                    if (user.id === o.id) {
                        return user;
                    }
                    return o;
                });
                return data;
            });
        } catch (err) {
            props.triggerErrorToast(err.response && err.response.data && err.response.data.message || err);
        }
    }

    const updateNewUserData = user => {
        try {
            setUserData([...userData, user]);
        } catch (err) {
            props.triggerErrorToast(err.response && err.response.data && err.response.data.message || err);
        }
    }

    return (
        <div>
            <AddEditModal user={{firstName: "", lastName: ""}} mode={"add"} triggerErrorToast={props.triggerErrorToast} submitRequest={addUser} updateUserData={updateNewUserData}/>
            <ReactTable
                style={{maxWidth: "1200px", margin: "0 auto"}}
                columns={[
                    {
                        Header: "Id",
                        accessor: "id",
                    },
                    {
                        Header: "First Name",
                        accessor: "firstName",
                    },
                    {
                        Header: "Last Name",
                        accessor: "lastName",
                    },
                    {
                        Header: "Email",
                        accessor: "email",
                    },
                    {
                        Header: "Court",
                        accessor: "court",
                    },
                    {
                        Header: "Actions",
                        Cell: ({row}) => (<div>
                            <AddEditModal user={row._original} mode={"edit"} triggerErrorToast={props.triggerErrorToast} submitRequest={updateUser}
                                          updateUserData={updateUserData}/>
                            {props.user.id !== row.id && <button onClick={() => console.log(row._original)}>Delete</button>}
                        </div>),
                    },
                ]}
                data={userData}
                loading={loading}
                filterable
                defaultPageSize={20}
                className="-striped -highlight"
            />
            <br/>
        </div>
    );
}

const schema = yup.object({
    firstName: yup.string().required("Required"),
    lastName: yup.string().required("Required"),
    email: yup.string().email().required("Required"),
    phoneNumber: yup.string().required("Required"),
    court: yup.string().required("Required"),
    password: yup.string()
        .min(8, "Password is too short - should be 8 chars minimum."),
    passwordConfirmation: yup.string()
        .oneOf([yup.ref("password"), null], "Passwords must match"),
});

class AddEditModal extends React.Component<any, any> {
    constructor(props, context) {
        super(props, context);

        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);

        this.state = {
            show: false,
        };
    }

    public render() {
        return (
            <>
                <Button variant="primary" onClick={this.handleShow}>
                    {this.props.mode === "edit" ? "Edit" : "Add"}
                </Button>

                <Formik
                    validationSchema={schema}
                    onSubmit={async (values, {setSubmitting}) => {
                        try {
                            console.log(values);
                            const result = await this.props.submitRequest(values);
                            this.props.updateUserData(result);
                            setSubmitting(false);
                        } catch (err) {
                            setSubmitting(false);
                            this.props.triggerErrorToast(err);
                        }
                    }}
                    initialValues={{
                        id: this.props.user.id,
                        firstName: this.props.user.firstName,
                        lastName: this.props.user.lastName,
                        email: this.props.user.email,
                        phoneNumber: this.props.user.phoneNumber,
                        court: this.props.user.court,
                        password: "",
                        passwordConfirmation: "",
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
                        <Modal show={this.state.show} onHide={this.handleClose}>
                            <Form noValidate onSubmit={handleSubmit}>
                                <Modal.Header closeButton>
                                    <Modal.Title>{this.props.mode === "edit" ? "Edit" : "Add"} User</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    <Form.Group controlId="validationFormik01">
                                        <Form.Label>First name</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="firstName"
                                            value={values.firstName}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            isInvalid={!!errors.firstName && !!touched.firstName}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {touched.firstName && errors.firstName}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                    <Form.Group controlId="validationFormik02">
                                        <Form.Label>Last name</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="lastName"
                                            value={values.lastName}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            isInvalid={!!errors.lastName && !!touched.lastName}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.lastName}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                    <Form.Group controlId="validationFormikEmail">
                                        <Form.Label>Email</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Username"
                                            aria-describedby="inputGroupPrepend"
                                            name="email"
                                            value={values.email}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            isInvalid={!!errors.email && !!touched.email}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.email}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                    <Form.Group controlId="validationFormik02">
                                        <Form.Label>Phone Number</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="phoneNumber"
                                            value={values.phoneNumber}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            isInvalid={!!errors.phoneNumber && !!touched.phoneNumber}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.phoneNumber}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                    <Form.Group controlId="exampleForm.ControlSelect1">
                                        <Form.Label>Court</Form.Label>
                                        <Form.Control
                                            as="select"
                                            type="select"
                                            name="court"
                                            value={values.court}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            isInvalid={!!errors.court && !!touched.court}
                                        >
                                            <option value="" label="Select a court"/>
                                            {courtOptions.map(o => <option key={o} value={o} label={o}/>)}
                                        </Form.Control>
                                        <Form.Control.Feedback type="invalid">
                                            {errors.court}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label>Password</Form.Label>
                                        <Form.Control
                                            type="password"
                                            placeholder="Password"
                                            name="password"
                                            value={values.password}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            isInvalid={!!errors.password && !!touched.password}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.password}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label>Password Confirmation</Form.Label>
                                        <Form.Control
                                            type="password"
                                            placeholder="Password"
                                            name="passwordConfirmation"
                                            value={values.passwordConfirmation}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            isInvalid={!!errors.passwordConfirmation && !!touched.passwordConfirmation}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.passwordConfirmation}
                                        </Form.Control.Feedback>
                                    </Form.Group>

                                </Modal.Body>
                                <Modal.Footer>
                                    <Button variant="secondary" onClick={this.handleClose} disabled={isSubmitting}>
                                        Cancel
                                    </Button>
                                    <Button variant="primary" type="submit" disabled={isSubmitting}>
                                        Save
                                    </Button>
                                </Modal.Footer>
                            </Form>
                        </Modal>
                    )}
                </Formik>
            </>
        );
    }

    private handleClose() {
        this.setState({show: false});
    }

    private handleShow() {
        this.setState({show: true});
    }
}

const courtOptions = [
    "Kauno apygardos teismas",
    "Kauno apylinkės teismas Kauno rūmai",
    "Kauno apylinkės teismas Kaišiadorių rūmai",
    "Kauno apylinkės teismas Kėdainių rūmai",
    "Kauno apylinkės teismas Jonavos rūmai",
];
