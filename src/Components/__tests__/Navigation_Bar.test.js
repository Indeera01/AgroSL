import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom"; // Import Router for navigation
import Navigation_Bar from "../Navigation_Bar"; // Adjust the import path as needed
import { auth } from "../__mocks__/fileMock"; // Import Firebase auth to mock it
import axios from "axios";

// Mocking Firebase auth
jest.mock("../__mocks__/fileMock", () => ({
  auth: {
    onAuthStateChanged: jest.fn(),
    signOut: jest.fn(),
  },
}));

// Mocking axios
jest.mock("axios");

describe("Navigation_Bar", () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  test("renders the AppBar correctly", () => {
    render(
      <Router>
        <Navigation_Bar />
      </Router>
    );

    const sellerButtons = screen.queryAllByText("Become a Seller");
    expect(sellerButtons.length).toBeGreaterThan(0); // Check at least one exists

    const riderButtons = screen.queryAllByText("Become a Delivery Rider");
    expect(riderButtons.length).toBeGreaterThan(0); // Check at least one exists
  });

  test("displays login button when user is not authenticated", async () => {
    auth.onAuthStateChanged.mockImplementation((callback) => {
      callback(null); // Simulate no user logged in
    });

    render(
      <Router>
        <Navigation_Bar />
      </Router>
    );

    expect(screen.getByText("Login")).toBeInTheDocument();
  });
});
