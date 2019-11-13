import { Formik } from "formik";
import React from "react";
import Form from "react-bootstrap/Form";
import { connect } from "react-redux";
import { RouteComponentProps } from "react-router";
import * as yup from "yup";
import { loginAction } from "../common/auth/auth.actions";
import { IUser, IUserLogin } from "../typings";

interface IProps extends RouteComponentProps {
  auth: IUser;
  login(user: IUserLogin): void;
  triggerErrorToast?(error: Error): void;
}

const schema = yup.object({
  email: yup
    .string()
    .email()
    .required("Privalomas laukas"),
  password: yup.string().required("Privalomas laukas"),
});

const Login = (props: IProps) => (
  <div>
    <Formik
      initialValues={{ email: "", password: "" }}
      validationSchema={schema}
      onSubmit={async (values, { setSubmitting }) => {
        try {
          await props.login({ email: values.email, password: values.password });
          setSubmitting(false);
          props.history.push("/dashboard");
        } catch (err) {
          setSubmitting(false);
          props.triggerErrorToast(err);
        }
      }}
    >
      {({ handleSubmit, handleChange, handleBlur, values, touched, isValid, errors, isSubmitting }) => (
        <Form
          noValidate
          onSubmit={handleSubmit}
          style={{ width: "100%", maxWidth: "330px", padding: "15px", margin: "0 auto" }}
        >
          <Form.Group>
            <Form.Label>El. paštas</Form.Label>
            <Form.Control
              type="text"
              placeholder="Jūsų el. paštas"
              aria-describedby="inputGroupPrepend"
              name="email"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              isInvalid={!!errors.email && !!touched.email}
            />
            <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
          </Form.Group>
          <Form.Group>
            <Form.Label>Slaptažodis</Form.Label>
            <Form.Control
              type="password"
              placeholder="***********"
              name="password"
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
              isInvalid={!!errors.password && !!touched.password}
            />
            <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
          </Form.Group>
          <button className="btn btn-lg btn-primary btn-block" type="submit" disabled={isSubmitting}>
            Prisijungti
          </button>
        </Form>
      )}
    </Formik>
  </div>
);

const mapDispatchToProps = dispatch => ({
  login: user => dispatch(loginAction(user)),
});

export default connect(null, mapDispatchToProps)(Login);
