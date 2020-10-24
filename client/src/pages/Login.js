import React, { useState, useCallback, useRef, Fragment } from "react";
import {
  Button,
  Checkbox,
  Container,
  FormControlLabel,
  TextField,
  Typography,
  withStyles,
} from "@material-ui/core";
import classNames from "classnames";
import VisibilityPasswordTextField from "./VisibilityPasswordTextField";
import ButtonCircularProgress from "./ButtonCircularProgress";
import { withRouter, Link, useHistory } from "react-router-dom";
import { sendSMS } from "../firebase/firebase";
import axios from "axios";
import Alert from "@material-ui/lab/Alert";
import { phoneFormater } from "../utils";
import { connect } from "react-redux";
import { loginUser } from "../actions/authActions";
const styles = (theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  link: {
    marginTop: theme.spacing(2),
    color: theme.palette.primary.main,
    cursor: "pointer",
    textDecoration: "none",
    display: "block",
    "&:hover": {
      outline: "none",
    },
    "&:active": {
      outline: "none",
    },
    "&:focus": {
      outline: "none",
    },
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  disabledText: {
    cursor: "auto",
    color: theme.palette.text.disabled,
  },
  formControlLabel: {
    marginRight: 0,
  },
});
const Login = ({ classes, auth, errors, dispatch }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [message, setMessage] = useState(false);
  const loginPhone = useRef();
  const loginPassword = useRef();
  const history = useHistory();
  const onSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    const data = {
      phoneNumber: phoneFormater(loginPhone.current.value),
      password: loginPassword.current.value,
    };
    // sendSMS(loginPhone.current.value)
    //   .then(function(confirmationResult) {
    //     // SMS sent. Prompt user to type the code from the message, then sign the
    //     // user in with confirmationResult.confirm(code).
    //     window.confirmationResult = confirmationResult;
    //     // console.log(confirmationResult);
    //     console.log("OTP is sent");
    //     history.push("/confirm");
    //   })
    //   .catch(function(error) {
    //     console.log(error);
    //   });
    loginUser(data, dispatch, setIsLoading, history);
  };
  return (
    <>
      <Container component="main" maxWidth="xs">
        <div className={classes.paper}>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          {(errors["usernotfound"] || errors["notverified"]) && (
            <Alert severity="error">{errors["usernotfound"] || errors["notverified"]}</Alert>
          )}
          {message && (
            <Alert severity="success">You have successfully logged in.</Alert>
          )}
          <form className={classes.form} onSubmit={onSubmit}>
            <div id="recaptcha-container"></div>
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
            <VisibilityPasswordTextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              inputRef={loginPassword}
              label="Password"
              autoComplete="off"
              FormHelperTextProps={{ error: true }}
              onVisibilityChange={setIsPasswordVisible}
              isVisible={isPasswordVisible}
            />
            <FormControlLabel
              className={classes.formControlLabel}
              control={<Checkbox color="primary" />}
              label={<Typography variant="body1">Remember me</Typography>}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="secondary"
              disabled={isLoading}
              size="large"
            >
              Login
              {isLoading && <ButtonCircularProgress />}
            </Button>
            <Link
              className={classNames(
                classes.link,
                isLoading ? classes.disabledText : null
              )}
              to="/forgot-password"
            >
              Forgot Password?
            </Link>

            <Link
              className={classNames(
                classes.link,
                isLoading ? classes.disabledText : null
              )}
              to="/register"
            >
              Don't have an account? Sign Up
            </Link>
          </form>
        </div>
      </Container>
    </>
  );
};
const mapStateToProps = (state) => ({
  auth: state.auth,
  errors: state.errors,
});
export default connect(mapStateToProps)(withRouter(withStyles(styles)(Login)));
