import React, {Component} from "react";
import {Flip, toast, ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default class EventErrorHandler extends Component {
    public triggerErrorToast = (error: Error) => {
        toast.error((error && error.message) || String(error), {
            position: "top-center",
            autoClose: 7000,
            hideProgressBar: false,
            pauseOnHover: true,
            draggable: false,
            transition: Flip,
        });
    }

    public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        process.env.NODE_ENV === "development" && console.log(
        (errorInfo && errorInfo.componentStack) || errorInfo,
        (error && error.stack) || error);
        this.triggerErrorToast(error);
    }

    public render() {
        return (
            <div>
                <ToastContainer/>
                {this.props.children}
            </div>
        );
    }
}
