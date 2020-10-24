import React, { useState, useRef } from "react";
import {
  Button,
  Checkbox,
  Container,
  FormControlLabel,
  TextField,
  Typography,
  withStyles,
} from "@material-ui/core";
import { withRouter, useHistory } from "react-router-dom";
import ButtonCircularProgress from "./ButtonCircularProgress";
import Axios from "axios";
import { sendSMS } from "../firebase/firebase";
import { phoneFormater } from "../utils";
import { connect } from "react-redux";
import Alert from "@material-ui/lab/Alert";
import { SET_CURRENT_USER, SET_INTENT } from "../actions/types";

const styles = (theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
});
const ForgotPassword = ({ classes, auth, errors, dispatch }) => {
  const [isLoading, setIsLoading] = useState(false);
  const loginPhone = useRef();
  const history = useHistory();
  const onSubmit = () => {
    Axios.post("/api/users/forgot-password", {
      phoneNumber: phoneFormater(loginPhone.current.value),
    })
      .then((res) => {
        sendSMS(phoneFormater(loginPhone.current.value))
          .then(function(confirmationResult) {
            // SMS sent. Prompt user to type the code from the message, then sign the
            // user in with confirmationResult.confirm(code).
            window.confirmationResult = confirmationResult;
            // console.log(confirmationResult);
            console.log("OTP is sent");
            setIsLoading(false);
            dispatch({
                type: SET_CURRENT_USER,
                payload: {...auth, phoneNumber: phoneFormater(loginPhone.current.value)}
            });
            dispatch({
                type: SET_INTENT,
                payload: "/reset-password"
            });
            history.push("/confirm");
          })
          .catch(function(error) {
            console.log(error);
          });
      })
      .catch((err) => console.log(err));
  };
  return (
    <Container component="main" maxWidth="xs">
      <div className={classes.paper}>
        <Typography component="h1" variant="h5">
          Forgot Password
        </Typography>
        <div id="recaptcha-container"></div>
        {errors["usernotfound"] && (
            <Alert severity="error">{errors["usernotfound"]}</Alert>
          )}
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          inputRef={loginPhone}
          id="phone"
          label="Phone Number"
          name="phone"
          autoComplete="off"
          autoFocus
        />
        <Button
          onClick={onSubmit}
          fullWidth
          variant="contained"
          color="secondary"
          disabled={isLoading}
          size="large"
        >
          Send Code
          {isLoading && <ButtonCircularProgress />}
        </Button>
      </div>
    </Container>
  );
};
const mapStateToProps = (state) => ({
  auth: state.auth,
  errors: state.errors,
});
export default connect(mapStateToProps)(
  withRouter(withStyles(styles)(ForgotPassword))
);
