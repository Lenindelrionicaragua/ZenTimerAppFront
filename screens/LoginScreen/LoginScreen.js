import React, { useState, useContext, useEffect } from "react";
import { StatusBar, ActivityIndicator } from "react-native";
import KeyboardAvoider from "../../component/KeyboardAvoider/KeyboardAvoider";
import { Formik } from "formik";
import { Fontisto } from "@expo/vector-icons";
import {
  StyledContainer,
  InnerContainer,
  PageLogo,
  PageTitle,
  SubTitle,
  StyledFormArea,
  StyledButton,
  ButtonText,
  MsgBox,
  Line,
  FooterView,
  FooterText,
  SignupLink,
  SignupLinkContent
} from "./LoginScreenStyles";
import { Colors } from "../../styles/AppStyles";
import { logError, logInfo } from "../../util/logging";
import TextInputLoginScreen from "../../component/TextInputLoginScreen/TextInputLoginScreen";

import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import axios from "axios";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { CredentialsContext } from "../../context/credentialsContext";

WebBrowser.maybeCompleteAuthSession();

const { white, grey, lightGrey } = Colors;

const LoginScreen = () => {
  const [hidePassword, setHidePassword] = useState(true);
  const [msg, setMsg] = useState("");
  const [success, setSuccessStatus] = useState("");
  const [googleSubmitting, setGoogleSubmitting] = useState(false);

  const { storedCredentials, setStoredCredentials } =
    useContext(CredentialsContext);

  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: "YOUR_EXPO_CLIENT_ID",
    iosClientId: "YOUR_IOS_CLIENT_ID",
    androidClientId: "YOUR_ANDROID_CLIENT_ID",
    webClientId: "YOUR_WEB_CLIENT_ID"
  });

  useEffect(() => {
    if (response?.type === "success") {
      const { authentication } = response;
      handleGoogleResponse(authentication);
    } else if (response?.type === "error") {
      handleMessage({ msg: "Google signin was cancelled or failed" });
    }
  }, [response]);

  const handleGoogleResponse = authentication => {
    axios
      .get(
        `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${authentication.accessToken}`
      )
      .then(res => {
        const { email, name, photoUrl } = res.user;
        saveLoginCredentials(
          {
            email,
            name,
            photoUrl
          },
          handleMessage({
            successStatus: true,
            msg: "Google signin was successful"
          })
        );
      })
      .catch(error => {
        console.log(error);
        handleMessage({
          msg: "An error occurred. Check your network and try again"
        });
        setGoogleSubmitting(false);
      });
  };

  const handleLogin = (values, setSubmitting) => {
    setMsg("");
    setSuccessStatus("");

    const credentials = {
      email: values.email,
      password: values.password
    };

    const url =
      "https://zen-timer-app-server-7f9db58def4c.herokuapp.com/api/auth/log-in";

    axios
      .post(url, { user: credentials })
      .then(response => {
        const { success, msg, user } = response.data;

        if (success) {
          setSuccessStatus(success);
          saveLoginCredentials(
            user,
            handleMessage({ successStatus: true, msg: msg })
          );
        } else {
          logInfo(msg);
          handleMessage({ successStatus: true, msg: msg });
        }
      })
      .catch(error => {
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
      <StyledContainer testID="styled-container">
        <StatusBar style="light" />
        <InnerContainer testID="inner-container">
          <PageLogo
            resizeMode="cover"
            source={require("./../../assets/logoZenTimer.png")}
            testID="page-logo"
          />
          <PageTitle testID="page-title">ZenTimer</PageTitle>
          <SubTitle testID="sub-title">Account Login</SubTitle>

          <Formik
            initialValues={{ email: "", password: "" }}
            onSubmit={(values, { setSubmitting }) => {
              if (values.email == "" || values.password == "") {
                handleMessage({ msg: "Please fill all the fields" });
                setSubmitting(false);
              } else {
                setSubmitting(true);
                handleLogin(
                  { email: values.email, password: values.password },
                  setSubmitting
                );
              }
            }}
            testID="login-form-formik"
          >
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              isSubmitting
            }) => (
              <StyledFormArea>
                <TextInputLoginScreen
                  label="Email Address"
                  icon="mail"
                  placeholder="serenity@gmail.com"
                  placeholderTextColor={lightGrey}
                  onChangeText={handleChange("email")}
                  onBlur={handleBlur("email")}
                  value={values.email}
                  keyboardType="email-address"
                  testID="email-input"
                />
                <TextInputLoginScreen
                  label="Password"
                  icon="lock"
                  placeholder="* * * * * * *"
                  placeholderTextColor={lightGrey}
                  onChangeText={handleChange("password")}
                  onBlur={handleBlur("password")}
                  value={values.password}
                  secureTextEntry={hidePassword}
                  testID="password-input"
                  isPassword={true}
                  hidePassword={hidePassword}
                  setHidePassword={setHidePassword}
                />
                <MsgBox type={success ? "SUCCESS" : "ERROR"} testID="msg-box">
                  {msg}
                </MsgBox>
                {!isSubmitting && (
                  <StyledButton
                    testID="login-styled-button"
                    onPress={handleSubmit}
                  >
                    <ButtonText testID="login-button-text">Login</ButtonText>
                  </StyledButton>
                )}

                {isSubmitting && (
                  <StyledButton disabled={true} testID="login-styled-button">
                    <ActivityIndicator size="large" color={white} />
                  </StyledButton>
                )}

                <Line testID="line" />

                {!googleSubmitting && (
                  <StyledButton
                    google={true}
                    disabled={!request}
                    onPress={() => {
                      setGoogleSubmitting(true);
                      promptAsync();
                    }}
                    testID="google-styled-button"
                  >
                    <Fontisto
                      name="google"
                      color={grey}
                      size={20}
                      testID="google-icon"
                    />
                    <ButtonText google={true} testID="google-button-text">
                      Sign in with Google
                    </ButtonText>
                  </StyledButton>
                )}

                {googleSubmitting && (
                  <StyledButton
                    google={true}
                    disabled={true}
                    testID="google-styled-button"
                  >
                    <ActivityIndicator size="large" color={white} />
                  </StyledButton>
                )}
                <FooterView testID="footer-view">
                  <FooterText testID="footer-text">
                    Don't you have an account already?
                  </FooterText>
                  <SignupLink
                    onPress={() => navigation.navigate("SignupScreen")}
                    testID="signup-link"
                  >
                    <SignupLinkContent testID="signup-link-content">
                      Signup
                    </SignupLinkContent>
                  </SignupLink>
                </FooterView>
              </StyledFormArea>
            )}
          </Formik>
        </InnerContainer>
      </StyledContainer>
    </KeyboardAvoider>
  );
};

export default LoginScreen;
