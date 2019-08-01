import React, {useState} from "react";
import Button, {ButtonProps} from "react-bootstrap/es/Button";
import Modal from "react-bootstrap/es/Modal";

export default function ConfirmDialog(props: { title: string; message: string; buttonText: string | JSX.Element; buttonVariant: ButtonProps["variant"]; callback(): void }) {
    const [isOpen, setIsOpen] = useState(false);

    function handleClose() {
        setIsOpen(false);
    }

    function handleOpen() {
        setIsOpen(true);
    }

    function handlePress(e: any) {
        if (typeof props.callback === "function") {
            handleClose();
            props.callback();
        }
    }

    return (
        <>
            <Button variant={props.buttonVariant} onClick={handleOpen}>
                {props.buttonText}
            </Button>

            <Modal show={isOpen} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{props.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>{props.message}</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        No
                    </Button>
                    <Button variant="primary" onClick={handlePress}>
                        Yes
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}
