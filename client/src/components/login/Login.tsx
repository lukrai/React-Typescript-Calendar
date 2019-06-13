import {ErrorMessage, Field, Form, Formik} from "formik";
import React from "react";
import {login} from "./login.actions";

const Login = (props: any) => (
    <div>
        <Formik
            initialValues={{email: "", password: ""}}
            validate={values => {
                const errors: any = {};
                if (!values.email) {
                    errors.email = "Required";
                } else if (
                    !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
                ) {
                    errors.email = "Invalid email address";
                }
                return errors;
            }}
            onSubmit={async (values, {setSubmitting}) => {
                const result = await login({email: values.email, password: values.password});
                props.updateUserState(result);
                setSubmitting(false);
                props.history.push("/");
            }}
        >
            {({errors, isSubmitting}) => (
                <Form style={{width: "100%", maxWidth: "330px", padding: "15px", margin: "0 auto"}}>
                    <div className="form-group">
                        <label htmlFor="exampleInputEmail1">Email address</label>
                        <Field
                            className="form-control"
                            placeholder="Email"
                            type="email"
                            name="email"
                        />
                    </div>
                    <ErrorMessage name="email" component="div"/>
                    {/*{touched.password && errors.password && <div>{errors.password}</div>}*/}

                    <div className="form-group">
                        <label htmlFor="exampleInputPassword1">Password</label>
                        <Field
                            className="form-control"
                            placeholder="Password"
                            type="password"
                            name="password"
                        />
                    </div>
                    <ErrorMessage name="password" component="div"/>
                    <button className="btn btn-lg btn-primary btn-block" type="submit" disabled={isSubmitting}>
                        Submit
                    </button>
                </Form>
            )}
        </Formik>
    </div>
);

export default Login;
