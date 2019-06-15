import React, {Component} from "react";
import {Flip, toast, ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default class EventErrorHandler extends Component {
    public triggerErrorToast = (error: Error) => {
        toast.error((error && error.message) || String(error), {
            position: "top-center",
            autoClose: 7000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: false,
            transition: Flip,
        });
    }
    private static getDerivedStateFromError(error: Error) { // tslint:disable-line:member-ordering
        console.log(error);
    }

    public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
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

// public handleReactError = (error: Error, errorInfo: React.ErrorInfo) => {
//     process.env.NODE_ENV === "development" && console.log(
//         (errorInfo && errorInfo.componentStack) || errorInfo,
//         (error && error.stack) || error);
//     this.showError((error && error.message) || String(error));
// };
