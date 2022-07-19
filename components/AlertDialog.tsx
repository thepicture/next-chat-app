import {
  Button,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import { FunctionComponent } from "react";

export interface AlertProps {
  message: string;
  isOpen: boolean;
  onClose: () => void;
}

const AlertDialog: FunctionComponent<AlertProps> = ({
  message,
  isOpen,
  onClose,
}: AlertProps) => {
  const handleClose = () => {
    onClose();
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
          {message}
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
