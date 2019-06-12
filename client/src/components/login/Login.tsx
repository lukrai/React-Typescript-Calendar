import {Formik} from "formik";
import React from "react";
import {login} from "./login.actions";

const Login = () => (
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
            onSubmit={(values, {setSubmitting}) => {
                login({email: values.email, password: values.password})
                    .then(() => {
                    setSubmitting(false);
                });
            }}
        >
            {({
                  values,
                  errors,
                  touched,
                  handleChange,
                  handleBlur,
                  handleSubmit,
                  isSubmitting,
                  /* and other goodies */
              }) => (
                <form onSubmit={handleSubmit} style={{width: "100%", maxWidth: "330px", padding: "15px", margin: "0 auto"}}>
                    <div className="form-group">
                        <label htmlFor="exampleInputEmail1">Email address</label>
                        <input
                            className="form-control"
                            placeholder="Email"
                            type="email"
                            name="email"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.email}
                        />
                    </div>
                    {errors.email && touched.email && errors.email}

                    <div className="form-group">
                        <label htmlFor="exampleInputPassword1">Password</label>
                        <input
                            className="form-control"
                            placeholder="Password"
                            type="password"
                            name="password"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.password}
                        />
                    </div>
                    <small className="form-text text-muted">{errors.password && touched.password && errors.password}.</small>
                    <button className="btn btn-lg btn-primary btn-block" type="submit" disabled={isSubmitting}>
                        Submit
                    </button>
                </form>
            )}
        </Formik>
    </div>
);

export default Login;
