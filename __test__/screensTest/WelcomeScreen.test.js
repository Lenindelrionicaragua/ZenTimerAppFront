import React from "react";
import renderer from "react-test-renderer";
import { render, cleanup, fireEvent, act } from "@testing-library/react-native";
import MockAdapter from "axios-mock-adapter";
import axios from "axios";

import WelcomeScreen from "../../screens/WelcomeScreen/WelcomeScreen";

import { StatusBar } from "react-native";

jest.mock("@env", () => ({
  EXPO_CLIENT_ID: "mock_expo_client_id",
  IOS_CLIENT_ID: "mock_ios_client_id",
  ANDROID_CLIENT_ID: "mock_android_client_id",
  WEB_CLIENT_ID: "mock_web_client_id"
}));

// Mock Google auth request
jest.mock("expo-auth-session/providers/google", () => {
  return {
    useAuthRequest: () => [
      jest.fn(), // request
      { type: "success" }, // response
      jest.fn() // promptAsync
    ]
  };
});

// Mock navigation
const mockNavigate = jest.fn();
jest.mock("@react-navigation/native", () => {
  return {
    ...jest.requireActual("@react-navigation/native"),
    useNavigation: () => ({
      navigate: mockNavigate
    })
  };
});

// Rendering Functions
const renderWelcomeScreen = routeParams =>
  render(<WelcomeScreen route={{ params: routeParams }} />);
const renderWelcomeScreenWithRenderer = routeParams =>
  renderer.create(<WelcomeScreen route={{ params: routeParams }} />);

let welcomeScreenRender;
let welcomeScreenRenderWithRenderer;

beforeEach(() => {
  welcomeScreenRender = renderWelcomeScreen({
    name: "Zen User",
    email: "serenity@gmail.com"
  });
  welcomeScreenRenderWithRenderer = renderWelcomeScreenWithRenderer({
    name: "Zen User",
    email: "serenity@gmail.com"
  });
});

//SignupScreen
describe("WelcomeScreen", () => {
  afterEach(() => {
    cleanup();
  });

  test("Renders correctly the WelcomeScreen Component", () => {
    const WelcomeScreenSnapshot = welcomeScreenRenderWithRenderer.toJSON();
    expect(WelcomeScreenSnapshot).toMatchSnapshot();
  });

  test("Render StatusBar correctly", () => {
    const WelcomeScreenInstance = welcomeScreenRenderWithRenderer.root;
    const statusBar = WelcomeScreenInstance.findByType(StatusBar);
    expect(statusBar).toBeTruthy();
  });

  test("Render UI components correctly", () => {
    const { getByTestId } = welcomeScreenRender;
    expect(getByTestId("inner-container")).toBeTruthy();
    expect(getByTestId("welcome-container")).toBeTruthy();
    expect(getByTestId("welcome-title")).toBeTruthy();
    expect(getByTestId("user-name")).toBeTruthy();
    expect(getByTestId("user-email")).toBeTruthy();
  });

  test("PageTitle should render a string of letters, numbers, or spaces", () => {
    const { getByTestId } = welcomeScreenRender;
    const pageTitleComponent = getByTestId("welcome-title");
    const textContent = pageTitleComponent.props.children.toString();
    expect(textContent).toMatch("Welcome!");
  });

  test("SubTitle should render a string of letters, numbers or spaces", () => {
    const { getByTestId } = welcomeScreenRender;
    const subTitleComponent = getByTestId("user-name");
    const textContent = subTitleComponent.props.children.toString();
    expect(textContent).toMatch("Zen User");
  });

  test("SubTitle should render a string of letters, numbers or spaces", () => {
    const { getByTestId } = welcomeScreenRender;
    const subTitleComponent = getByTestId("user-email");
    const textContent = subTitleComponent.props.children.toString();
    expect(textContent).toMatch("serenity@gmail.com");
  });
});

// WelcomeImage
describe("WelcomeImage", () => {
  afterEach(() => {
    cleanup();
  });

  test("Render the WelcomePage component correctly and has a valid image source", () => {
    const { getByTestId } = welcomeScreenRender;
    const welcomeImageComponent = getByTestId("welcome-image");
    expect(welcomeImageComponent).toBeTruthy();
  });
});

// Avatar
describe("AvatarImage", () => {
  afterEach(() => {
    cleanup();
  });

  test("Render the AvatarImage component correctly and has a valid image source", () => {
    const { getByTestId } = welcomeScreenRender;
    const avatarImageComponent = getByTestId("avatar-image");
    expect(avatarImageComponent).toBeTruthy();
  });
});

// Logout ButtonText
describe("Logout ButtonText", () => {
  afterEach(() => {
    cleanup();
  });

  test("Renders ButtonText with the correct text", () => {
    const { getByTestId } = welcomeScreenRender;
    const styledButtonElement = getByTestId("logout-button-text");
    const textContent = styledButtonElement.toString();
    expect(styledButtonElement).toBeTruthy();
    expect(textContent).toMatchSnapshot("Logout");
  });
});
