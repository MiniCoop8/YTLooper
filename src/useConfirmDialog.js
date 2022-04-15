import React, { useState, useMemo, forwardRef } from "react";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";

const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const useConfimDialog = () => {
    const [openDialog, setOpenDialog] = useState(false)
    const [title, setTitle] = useState('Are you sure?')
    const [labels, setLabels] = useState(['Yes', 'No'])
    const [message, setMessage] = useState('Are you sure?')
    const [openProps, setOpenProps] = useState()

    const open = (props) => {
        setOpenProps(props)
        if (props.Title) {
            setTitle(props.Title)
        }
        if (props.Labels) {
            setLabels(props.Labels)
        }
        if (props.Message) {
            setMessage(props.Message)
        }

        setOpenDialog(true)
    }

    const close = () => {
        setOpenDialog(false)
    }

    const handleCancel = () => {
        setOpenDialog(false)
        if (openProps.OnCancel) {
            openProps.OnCancel()
        }
    };
    const handleConfirm = () => {
        if (openProps.OnConfirm) {
            openProps.OnConfirm()
        }
        else {
            setOpenDialog(false)
        }
    };
    const handleClose = () => {
        setOpenDialog(false)
    }

    var ConfirmDialog = useMemo(() => {
        return ({children}) => (
                <Dialog
                    open={openDialog}
                    // TransitionComponent={Transition}
                    keepMounted
                    onClose={handleCancel}
                    aria-describedby="alert-dialog-slide-description"
                >
                    <DialogTitle>{title}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-slide-description">
                            {message}
                            {children}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>{labels[1]}</Button>
                        <Button onClick={handleConfirm}>{labels[0]}</Button>
                    </DialogActions>
                </Dialog>
            )
    }, [openDialog, title, message, labels])

    return {
        ShowConfirm: open,
        CloseConfirm: close,
        ConfirmDialog: ConfirmDialog
    }
};
export default useConfimDialog;
