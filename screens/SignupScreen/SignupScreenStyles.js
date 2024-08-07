import styled from "styled-components/native";
import { View, Text, TextInput, Pressable, Platform } from "react-native";
import { SafeAreaView } from "react-native";
import { Colors } from "../../styles/AppStyles";

const {
  seaGreen,
  white,
  infoWhite,
  lightPink,
  darkGrey,
  black,
  skyBlue,
  lightGreen
} = Colors;

const green = "#00ff00";
const red = "#ff0000";

const paddingTop = Platform.OS === "web" ? "10%" : "5%";
const paddingBottom = Platform.OS === "web" ? "10%" : "20%";
const containerHeight = Platform.OS === "web" ? "80%" : "100%";

export const StyledContainer = styled(SafeAreaView)`
  flex: 1;
  padding: 15px;
  background-color: ${darkGrey};
  width: 100%;
  height: ${containerHeight};
  /**
  margin-top: ${paddingTop};
  margin-bottom: ${paddingBottom};
  **/
`;

export const InnerContainer = styled(View)`
  flex: 1;
  width: 100%;
  align-items: center;
  justify-content: center;
`;

export const PageTitle = styled(Text)`
  font-size: 30px;
  text-align: center;
  font-weight: bold;
  color: ${black};
  padding: 10px;
`;

export const SubTitle = styled(Text)`
  font-size: 10px;
  margin-bottom: 20px;
  letter-spacing: 1px;
  font-weight: bold;
  color: ${infoWhite};
`;

export const StyledFormArea = styled(View)`
  width: 90%;
`;

export const StyledTextInput = styled(TextInput)`
  background-color: ${white};
  padding: 15px;
  padding-left: 55px;
  padding-right: 55px;
  border-radius: 5px;
  font-size: 16px;
  height: 60px;
  margin-vertical: 3px;
  margin-bottom: 10px;
  color: ${infoWhite};
`;

export const StyledInputLabel = styled(Text)`
  color: ${infoWhite};
  font-size: 13px;
  text-align: left;
`;

export const LeftIcon = styled(View)`
  left: 15px;
  top: 38px;
  position: absolute;
  z-index: 1;
`;

export const RightIcon = styled(Pressable)`
  right: 15px;
  top: 38px;
  position: absolute;
  z-index: 1;
`;

export const StyledButton = styled(Pressable)`
  padding: 15px;
  background-color: ${black};
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  margin-vertical: 5px;
  height: 60px;

  ${props =>
    props.google == true &&
    `
    background-color: ${white};
    flex-direction: row;
    justify-content: center;
  `}
`;

export const ButtonText = styled(Text)`
  color: ${seaGreen};
  font-size: 16px;

  ${props =>
    props.google == true &&
    `
    padding: 25px;
    color: ${black}
  `}
`;

export const MsgBox = styled(Text)`
  text-align: center;
  font-size: 13px;
  color: ${prop => (prop.type === "SUCCESS" ? green : red)};
`;

export const Line = styled(View)`
  height: 1px;
  width: 100%;
  background-color: ${white};
  margin-vertical: 10px;
`;

export const FooterView = styled(View)`
  justify-content: center;
  flex-direction: row;
  align-items: center;
  padding: 10px;
`;

export const FooterText = styled(Text)`
  justify-content: center;
  align-content: center;
  color: ${infoWhite};
  font-size: 15px;
`;

export const FooterLink = styled(Pressable)`
  justify-content: center;
  align-items: center;
`;

export const FooterLinkContent = styled(Text)`
  color: ${lightPink};
  font-size: 15px;
`;
