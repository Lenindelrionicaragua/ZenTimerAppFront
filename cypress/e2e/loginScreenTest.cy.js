describe("LoginScreen", () => {
  it("render the elements of the LoginScreen", () => {
    cy.visit("http://192.168.178.182:8081");
    cy.get('[data-testId="page-logo"]').should("exist");
    cy.get('[data-testId="page-title"]')
      .should("exist")
      .should("have.text", "ZenTimer");
    cy.get('[data-testId="sub-title"]')
      .should("exist")
      .should("have.text", "Account Login");
    cy.get('[data-testId="email-input"]').should("exist");
    cy.get('[data-testId="password-input"]').should("exist");
    cy.get('[data-testId="msg-box"]').should("exist");
    cy.get('[data-testId="line"]').should("exist");
    cy.get('[data-testId="login-styled-button"]')
      .should("exist")
      .should("have.text", "Login");
    cy.get('[data-testId="google-styled-button"]')
      .should("exist")
      .should("have.text", "Sign in with Google");
    cy.get('[data-testId="google-icon"]').should("exist");
    cy.get('[data-testId="footer-text"]')
      .should("exist")
      .should("have.text", "Don't you have an account already?");
    cy.get('[data-testId="signup-link-content"]')
      .should("exist")
      .should("have.text", "Signup");
  });

  it("inputs register user information correctly", () => {
    cy.visit("http://192.168.178.182:8081");
    const testEmail = "testuser@example.com";
    const testPassword = "password123";
    cy.get('[data-testId="email-input"]')
      .type(testEmail)
      .should("have.value", testEmail);
    cy.get('[data-testId="password-input"]')
      .type(testPassword)
      .should("have.value", testPassword);
  });

  it("should fail when the user doesn't exist", () => {
    cy.visit("http://192.168.178.182:8081");
    const testEmail = "invaliduser@gmail.com";
    const testPassword = "invalidpassword";
    cy.get('[data-testId="email-input"]').type(testEmail);
    cy.get('[data-testId="password-input"]').type(testPassword);
    cy.get('[data-testId="login-styled-button"]').click();
    cy.get('[data-testId="msg-box"]')
      .should("exist")
      .should(
        "have.text",
        "No user was found associated with the provided email address. Please verify your email and try again or register if you are a new user."
      );
  });

  it("should fail when the password is not correct", () => {
    cy.visit("http://192.168.178.182:8081");
    const testEmail = "usertest@gmail.com";
    const testPassword = "invalidPassword";
    cy.get('[data-testId="email-input"]').type(testEmail);
    cy.get('[data-testId="password-input"]').type(testPassword);
    cy.get('[data-testId="login-styled-button"]').click();
    cy.get('[data-testId="msg-box"]')
      .should("exist")
      .should(
        "have.text",
        "The password provided is incorrect. Please verify your password and try again."
      );
  });

  it("render all the WelcomeScreen elements correctly, when the email and password are valids", () => {
    cy.visit("http://192.168.178.182:8081");
    const testEmail = "usertest@gmail.com";
    const testPassword = "Password1234!";
    cy.get('[data-testId="email-input"]').type(testEmail);
    cy.get('[data-testId="password-input"]').type(testPassword);
    cy.get('[data-testId="login-styled-button"]').click();
    cy.get('[data-testId="welcome-image"]').should("exist");
    cy.get('[data-testId="welcome-title"]')
      .should("exist")
      .and("have.text", "Welcome!");
    cy.get('[data-testId="user-name"]')
      .should("exist")
      .and("have.text", "Len Del Rio");
    cy.get('[data-testId="user-email"]')
      .should("exist")
      .and("have.text", "usertest@gmail.com");
    cy.get('[data-testId="avatar-image"]').should("exist");
    cy.get('[data-testId="line"]').should("exist");
    cy.get('[data-testId="logout-button-text"]')
      .should("exist")
      .and("have.text", "Logout");
  });
});
