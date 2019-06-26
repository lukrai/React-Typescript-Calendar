import axios from "axios";
import {DateTime} from "luxon";
import ReactTable from "react-table";
import React, {useEffect, useState} from "react";
import {getCalendarData} from "../calendar/calendar.actions";
import Button from "react-bootstrap/es/Button";
import Modal from "react-bootstrap/es/Modal";
import {login} from "../common/auth.actions";
import {Formik} from "formik";
import * as yup from "yup";
import Form from "react-bootstrap/es/Form";
import InputGroup from "react-bootstrap/es/InputGroup";

export default function Users(props) {
    const [userData, setUserData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            // const result = await axios.get("http://localhost:5000/api/user");
            // console.log("fetching initial");
            // setUserData(result.data);
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
    console.log(props)

    return (
        <div>
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
                            <AddEditModal user={row._original}/>
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
    firstName: yup.string().required(),
    lastName: yup.string().required(),
    email: yup.string().email().required(),
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
                    Edit
                </Button>

                <Modal show={this.state.show} onHide={this.handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Modal heading</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Formik
                            validationSchema={schema}
                            onSubmit={console.log}
                            initialValues={{
                                firstName: this.props.user.firstName,
                                lastName: this.props.user.lastName,
                                email: this.props.user.email,
                                court: this.props.user.court,
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
                              }) => (
                                <Form noValidate onSubmit={handleSubmit}>
                                    <Form.Group controlId="validationFormik01">
                                        <Form.Label>First name</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="firstName"
                                            value={values.firstName}
                                            onChange={handleChange}
                                            isValid={touched.firstName && !errors.firstName}
                                        />
                                        <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                                    </Form.Group>
                                    <Form.Group controlId="validationFormik02">
                                        <Form.Label>Last name</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="lastName"
                                            value={values.lastName}
                                            onChange={handleChange}
                                            isValid={touched.firstName && !errors.lastName}
                                        />

                                        <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
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
                                            isInvalid={!!errors.email}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.email}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                    <Form.Group controlId="validationFormikEmail">
                                        <Form.Label>Court</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Username"
                                            aria-describedby="inputGroupPrepend"
                                            name="email"
                                            value={values.court}
                                            onChange={handleChange}
                                            isInvalid={!!errors.court}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.court}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Form>
                            )}
                        </Formik>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.handleClose}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={this.handleClose}>
                            Save Changes
                        </Button>
                    </Modal.Footer>
                </Modal>
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
