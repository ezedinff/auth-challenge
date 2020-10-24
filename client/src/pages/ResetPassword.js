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
import VisibilityPasswordTextField from "./VisibilityPasswordTextField";
import Axios from "axios";
import Alert from "@material-ui/lab/Alert";

import { connect } from "react-redux";

const styles = (theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
});
const ResetPassword = ({ classes, auth, errors, dispath }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const password = useRef();
  const confirm = useRef();
  const history = useHistory();
  const onSubmit = () => {
    const confirmed = confirm.current.value === password.current.value;
    Axios.post("/api/users/reset-password", {
      phoneNumber: auth.user.phoneNumber,
      password: password.current.value,
    })
      .then((res) => {
        history.push("/login");
      })
      .catch((err) => console.log(err));
  };
  return (
    <Container component="main" maxWidth="xs">
      <div className={classes.paper}>
        <Typography component="h1" variant="h5">
          Reset Your Password
        </Typography>
        {errors["usernotfound"] && (
          <Alert severity="error">{errors["usernotfound"]}</Alert>
        )}
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
          Reset Password
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
  withRouter(withStyles(styles)(ResetPassword))
);
