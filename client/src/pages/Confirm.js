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
import { onSubmitOtp } from "../firebase/firebase";
import axios from "axios";
import { connect } from "react-redux";

const styles = (theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
});
const Confirm = ({ classes, auth, errors }) => {
  const [isLoading, setIsLoading] = useState(false);
  const otp = useRef();
  const history = useHistory();
  const onSubmit = () => {
    console.log(otp.current.value);
    setIsLoading(true);
    onSubmitOtp(otp.current.value)
      .then(function(result) {
        // User signed in successfully.
        console.log("Result" + JSON.stringify(result));
        // the user verfied his phone number
        // send verify
        const data = {
          phoneNumber: result.user.phoneNumber,
          accessToken: result.user.providerData[0].accessToken,
        };
        axios.post("/api/users/verify", data).then((res) => {
          console.log(res);
          setIsLoading(false);
          history.push(auth.intent);
        });
      })
      .catch(function(error) {
        console.log(error);
        alert("Incorrect OTP");
      });
  };
  return (
    <Container component="main" maxWidth="xs">
      <div className={classes.paper}>
        <Typography component="h1" variant="h5">
          Confirmation
        </Typography>
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          inputRef={otp}
          id="phone"
          label="Code"
          name="otp"
          autoComplete="off"
          autoFocus
        />
        <Button
          type="button"
          onClick={onSubmit}
          fullWidth
          variant="contained"
          color="secondary"
          disabled={isLoading}
          size="large"
        >
          Verify
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
  withRouter(withStyles(styles)(Confirm))
);
