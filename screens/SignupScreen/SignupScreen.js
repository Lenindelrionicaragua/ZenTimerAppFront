import React, { useState, useContext } from "react";
import { StatusBar, ActivityIndicator } from "react-native";
import KeyboardAvoider from "../../component/KeyboardAvoider/KeyboardAvoider";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Formik } from "formik";
import {
  StyledContainer,
  InnerContainer,
  PageTitle,
  SubTitle,
  StyledFormArea,
  StyledButton,
  ButtonText,
  MsgBox,
  Line,
  FooterView,
  FooterText,
  FooterLink,
  FooterLinkContent
} from "./SignupScreenStyles";
import { Colors } from "../../styles/AppStyles";
import { logError, logInfo } from "../../util/logging";
import TextInputSignupScreen from "../../component/TextInputSignupScreen/TextInputSignupScreen";
// API client
import axios from "axios";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { CredentialsContext } from "../../context/credentialsContext";

// api url
import { baseApiUrl } from "../../component/Shared/SharedUrl";

// Colors
const { white, lightGrey } = Colors;

const SignupScreen = ({ navigation }) => {
  const [hidePassword, setHidePassword] = useState(true);
  const [show, setShow] = useState(false);
  const [date, setDate] = useState(new Date(2000, 0, 1));
  const [userBirthDay, setUserBirthDay] = useState();

  const [msg, setMsg] = useState("");
  const [success, setSuccessStatus] = useState("");

  //Context
  const { storedCredentials, setStoredCredentials } =
    useContext(CredentialsContext);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(false);
    setDate(currentDate);
    setUserBirthDay(currentDate);
  };

  const showDatePicker = () => {
    setShow(true);
  };

  // form handling
  const handleSignup = (values, setSubmitting) => {
    setMsg("");
    setSuccessStatus("");

    const credentials = {
      name: values.name,
      email: values.email,
      password: values.password,
      dateOfBirth: values.dateOfBirth
    };

    const url = `${baseApiUrl}/auth/sign-up`;

    axios
      .post(url, { user: credentials })
      .then(response => {
        const { success, msg, user } = response.data;

        if (success) {
          setSuccessStatus(success);
          navigation.navigate(
            "LinkVerificationScreen",
            ({ ...user } = response.data)
          );
          // saveLoginCredentials(
          //   user,
          //   handleMessage({ successStatus: true, msg: msg })
          // );
        } else {
          logInfo(msg);
          handleMessage({ successStatus: true, msg: msg });
        }
      })
      .catch(error => {
        const errorMsg = error.response?.data?.msg || "An error occurred";
        logError(error.response.data.msg);
        handleMessage({
          successStatus: false,
          msg: error.response.data.msg
        });
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  const handleMessage = ({ successStatus, msg }) => {
    setSuccessStatus(successStatus);
    setMsg(msg);
  };

  const saveLoginCredentials = (credentials, msg, successStatus) => {
    AsyncStorage.setItem("zenTimerCredentials", JSON.stringify(credentials))
      .then(() => {
        handleMessage({
          successStatus: true,
          msg: "Login credentials saved successfully"
        });
        setStoredCredentials(credentials);
      })
      .catch(error => {
        logError(error);
        handleMessage({
          successStatus: false,
          msg: "Failed to save login credentials"
        });
      });
  };

  return (
    <KeyboardAvoider>
      <StyledContainer testID="signup-styled-container">
        <StatusBar style="dark" />
        <InnerContainer testID="inner-container">
          <PageTitle testID="signup-page-title">Habit Tracker</PageTitle>
          <SubTitle testID="signup-page-sub-title">Account Sign Up</SubTitle>

          {show && (
            <DateTimePicker
              testID="date-time-picker"
              value={date}
              mode="date"
              is24Hour={true}
              display="default"
              onChange={onChange}
            />
          )}

          <Formik
            initialValues={{
              name: "",
              email: "",
              dateOfBirth: "",
              password: "",
              confirmPassword: ""
            }}
            onSubmit={(values, { setSubmitting }) => {
              values = { ...values, dateOfBirth: userBirthDay };
              const dateOfBirthString = values.dateOfBirth
                ? values.dateOfBirth.toDateString()
                : "";

              if (
                values.name == "" ||
                values.email == "" ||
                values.dateOfBirth == "" ||
                values.password == "" ||
                values.confirmPassword == ""
              ) {
                handleMessage({ msg: "Please fill all the fields" });
                setSubmitting(false);
              } else if (values.password !== values.confirmPassword) {
                handleMessage({ msg: "Passwords do not match" });
                setSubmitting(false);
              } else {
                setSubmitting(true);
                handleSignup(
                  {
                    name: values.name,
                    email: values.email,
                    password: values.password,
                    dateOfBirth: dateOfBirthString
                  },
                  setSubmitting
                );
              }
            }}
            testID="signup-form-formik"
          >
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              isSubmitting
            }) => (
              <StyledFormArea>
                <TextInputSignupScreen
                  label="Name"
                  icon="person"
                  placeholder="Zen User"
                  placeholderTextColor={lightGrey}
                  onChangeText={handleChange("name")}
                  onBlur={handleBlur("name")}
                  value={values.name}
                  testID="name"
                />

                <TextInputSignupScreen
                  label="Email Address"
                  icon="mail"
                  placeholder="serenity@gmail.com"
                  placeholderTextColor={lightGrey}
                  onChangeText={handleChange("email")}
                  onBlur={handleBlur("email")}
                  value={values.email}
                  keyboardType="email-address"
                  testID="signup-screen-email-input"
                />

                <TextInputSignupScreen
                  label="Date of Birth"
                  icon="calendar"
                  placeholder="Tue Feb 01 1984"
                  placeholderTextColor={lightGrey}
                  onChangeText={handleChange("dateOfBirth")}
                  onBlur={handleBlur("dateOfBirth")}
                  value={userBirthDay ? userBirthDay.toDateString() : ""}
                  testID="date-of-birth"
                  isDate={true}
                  editable={false}
                  showDatePicker={showDatePicker}
                />

                <TextInputSignupScreen
                  label="Password"
                  icon="lock"
                  placeholder="* * * * * * *"
                  placeholderTextColor={lightGrey}
                  onChangeText={handleChange("password")}
                  onBlur={handleBlur("password")}
                  value={values.password}
                  secureTextEntry={hidePassword}
                  testID="signup-screen-password-input"
                  isPassword={true}
                  hidePassword={hidePassword}
                  setHidePassword={setHidePassword}
                />

                <TextInputSignupScreen
                  label="Confirm Password"
                  icon="lock"
                  placeholder="* * * * * * *"
                  placeholderTextColor={lightGrey}
                  onChangeText={handleChange("confirmPassword")}
                  onBlur={handleBlur("confirmPassword")}
                  value={values.confirmPassword}
                  secureTextEntry={hidePassword}
                  testID="confirm-password-input"
                  isPassword={true}
                  hidePassword={hidePassword}
                  setHidePassword={setHidePassword}
                />
                <MsgBox type={success ? "SUCCESS" : "ERROR"} testID="msg-box">
                  {msg}
                </MsgBox>

                {!isSubmitting && (
                  <StyledButton
                    testID="signup-styled-button"
                    onPress={handleSubmit}
                  >
                    <ButtonText testID="signup-button-text">Sign Up</ButtonText>
                  </StyledButton>
                )}

                {isSubmitting && (
                  <StyledButton disabled={true} testID="signup-styled-button">
                    <ActivityIndicator size="large" color={white} />
                  </StyledButton>
                )}

                <Line testID="line" />
                <FooterView testID="footer-view">
                  <FooterText testID="signup-footer-text">
                    Already have an account?
                  </FooterText>
                  <FooterLink
                    onPress={() => navigation.navigate("LoginScreen")}
                    testID="footer-login-link"
                  >
                    <FooterLinkContent testID="footer-login-link-content">
                      Login
                    </FooterLinkContent>
                  </FooterLink>
                </FooterView>
              </StyledFormArea>
            )}
          </Formik>
        </InnerContainer>
      </StyledContainer>
    </KeyboardAvoider>
  );
};

export default SignupScreen;
