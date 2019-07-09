import {Formik} from "formik";
import React from "react";
import Form from "react-bootstrap/es/Form";
import { connect } from "react-redux";
import * as yup from "yup";
import {loginAction} from "../common/auth.actions";

const schema = yup.object({
    email: yup.string().email().required("Required"),
    password: yup.string().required("Required"),
});

const Login = (props: any) => (
    <div>
        <Formik
            initialValues={{email: "", password: ""}}
            validationSchema={schema}
            onSubmit={async (values, {setSubmitting}) => {
                try {
                    await props.login({email: values.email, password: values.password});
                    setSubmitting(false);
                    props.history.push("/");
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
                <Form noValidate onSubmit={handleSubmit} style={{width: "100%", maxWidth: "330px", padding: "15px", margin: "0 auto"}}>
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
                    <button className="btn btn-lg btn-primary btn-block" type="submit" disabled={isSubmitting}>
                        Login
                    </button>
                </Form>
            )}
        </Formik>
    </div>
);

const mapDispatchToProps = dispatch => ({
    login: user => dispatch(loginAction(user)),
});

export default connect(
    null,
    mapDispatchToProps,
)(Login);
