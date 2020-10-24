import React, { useState, useCallback, useRef, Fragment } from "react";
import {
  Button,
  Checkbox,
  Container,
  FormControlLabel,
  Grid,
  TextField,
  Typography,
  withStyles,
} from "@material-ui/core";
import classNames from "classnames";
import VisibilityPasswordTextField from "./VisibilityPasswordTextField";
import ButtonCircularProgress from "./ButtonCircularProgress";
import { withRouter, Link, useHistory } from "react-router-dom";
import { registerUser } from "../actions/authActions";
import axios from "axios";
import { phoneFormater, validatePhone } from "../utils";
import { sendSMS } from "../firebase/firebase";
import Alert from "@material-ui/lab/Alert";
import { connect } from "react-redux";
import { GET_ERRORS, SET_INTENT } from "../actions/types";

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
const Register = ({ classes, auth, errors, dispatch }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const history = useHistory();
  const fN = useRef();
  const lN = useRef();
  const phone = useRef();
  const password = useRef();
  const confirm = useRef();
  const onSubmit = (e) => {
    e.preventDefault();
    console.log("Registering...");
    const confirmed = confirm.current.value === password.current.value;
    console.log(confirmed);
    if (!confirmed && validatePhone(phone.current.value)) return;
    setIsLoading(true);
    const user = {
      firstName: fN.current.value,
      lastName: lN.current.value,
      phoneNumber: phoneFormater(phone.current.value),
      password: password.current.value,
    };
    console.log(user);
    axios
      .post("/api/users/register", user)
      .then((res) => {
        sendSMS(phoneFormater(phone.current.value))
          .then(function(confirmationResult) {
            // SMS sent. Prompt user to type the code from the message, then sign the
            // user in with confirmationResult.confirm(code).
            window.confirmationResult = confirmationResult;
            // console.log(confirmationResult);
            console.log("OTP is sent");
            setIsLoading(false);
            dispatch({
              type: SET_INTENT,
              payload: "/login",
            });
            history.push("/confirm");
          })
          .catch(function(error) {
            console.log(error);
          });
        //  history.push("/login")
      })
      .catch((err) => {
        setIsLoading(false);

        dispatch({
          type: GET_ERRORS,
          payload: err.response.data,
        });
      });
  };
  return (
    <>
      <Container component="main" maxWidth="xs">
        <div className={classes.paper}>
          <Typography component="h1" variant="h5">
            Sign Up
          </Typography>
          <div id="recaptcha-container"></div>
          {errors["phoneNumber"] && (
            <Alert severity="error">{errors["phoneNumber"]}</Alert>
          )}
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                autoComplete="fname"
                name="firstName"
                variant="outlined"
                inputRef={fN}
                required
                fullWidth
                id="firstName"
                label="First Name"
                autoFocus
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                required
                fullWidth
                inputRef={lN}
                id="lastName"
                label="Last Name"
                name="lastName"
                autoComplete="lname"
              />
            </Grid>
          </Grid>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            inputRef={phone}
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
            inputRef={password}
            label="Password"
            autoComplete="off"
            FormHelperTextProps={{ error: true }}
            onVisibilityChange={setIsPasswordVisible}
            isVisible={isPasswordVisible}
          />
          <VisibilityPasswordTextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            inputRef={confirm}
            label="Repeat Password"
            autoComplete="off"
            FormHelperTextProps={{ error: true }}
            onVisibilityChange={setIsPasswordVisible}
            isVisible={isPasswordVisible}
          />
          <Button
            onClick={onSubmit}
            fullWidth
            variant="contained"
            color="secondary"
            disabled={isLoading}
            size="large"
          >
            Register
            {isLoading && <ButtonCircularProgress />}
          </Button>
          <Link
            className={classNames(
              classes.link,
              isLoading ? classes.disabledText : null
            )}
            to="/login"
          >
            Already have an account? Sign in
          </Link>
        </div>
      </Container>
    </>
  );
};
const mapStateToProps = (state) => ({
  auth: state.auth,
  errors: state.errors,
});
export default connect(mapStateToProps)(
  withRouter(withStyles(styles)(Register))
);
