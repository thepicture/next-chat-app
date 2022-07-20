import {
  Button,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import { FunctionComponent } from "react";

export interface AlertProps {
  messageWithCallback: MessageWithCallback;
  isOpen: boolean;
  onClose: () => void;
}

export interface MessageWithCallback {
  message: string;
  callback?: () => void;
}

const AlertDialog: FunctionComponent<AlertProps> = ({
  messageWithCallback,
  isOpen,
  onClose,
}: AlertProps) => {
  const handleClose = () => {
    onClose();
    if (messageWithCallback.callback) messageWithCallback.callback();
  };

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {messageWithCallback.message}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} autoFocus>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AlertDialog;
