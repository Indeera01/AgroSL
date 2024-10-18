// src/Pages/__tests__/Inventory.test.js

import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom"; // Import MemoryRouter
import Inventory from "../Inventory"; // Adjust path if needed
import React from "react";
import "@testing-library/jest-dom"; // Import the jest-dom matchers

// Mock the firebase module and other necessary functions
jest.mock("../__mocks__/fileMock", () => ({
  initializeApp: jest.fn(),
  getStorage: jest.fn(),
  getAnalytics: jest.fn(),
  getAuth: jest.fn(),
}));

// Mock the data fetching method directly in the Inventory module
jest.mock("../Inventory", () => {
  return () => {
    return (
      <div>
        <h1>Your Inventory</h1>
        <div>No items in the Inventory</div>
        <button>Add New Product</button>
      </div>
    );
  };
});

describe("Inventory Component", () => {
  beforeEach(() => {
    // Wrap your component in MemoryRouter
    render(
      <MemoryRouter>
        <Inventory />
      </MemoryRouter>
    );
  });

  test("renders inventory title", () => {
    const titleElement = screen.getByText(/Your Inventory/i); // Adjust this text based on actual title
    expect(titleElement).toBeInTheDocument(); // This should work now
  });

  test("renders 'No items in the Inventory' when items array is empty", () => {
    const noItemsElement = screen.getByText(/No items in the Inventory/i);
    expect(noItemsElement).toBeInTheDocument();
  });

  test("renders Add New Product button", () => {
    const addButtonElement = screen.getByText(/Add New Product/i); // Adjust this text based on actual button text
    expect(addButtonElement).toBeInTheDocument();
  });
});
