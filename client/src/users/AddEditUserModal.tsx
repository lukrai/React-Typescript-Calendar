import {Formik} from "formik";
import React from "react";
import Button from "react-bootstrap/es/Button";
import Form from "react-bootstrap/es/Form";
import Modal from "react-bootstrap/es/Modal";
import * as yup from "yup";

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

export default class AddEditUserModal extends React.Component<any, any> {
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
                    {this.props.mode === "edit" ? "Edit" : "Add User"}
                </Button>

                <Formik
                    validationSchema={schema}
                    onSubmit={async (values, {setSubmitting}) => {
                        try {
                            console.log(values);
                            const result = await this.props.submitRequest(values);
                            this.props.updateUserData(result);
                            setSubmitting(false);
                            this.handleClose();
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
                                    <Form.Group>
                                        <Form.Label>First name</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="First Name"
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
                                    <Form.Group>
                                        <Form.Label>Last name</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Last Name"
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
                                    <Form.Group>
                                        <Form.Label>Email</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Email"
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
                                    <Form.Group>
                                        <Form.Label>Phone Number</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="+37012345678"
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
                                    <Form.Group>
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
