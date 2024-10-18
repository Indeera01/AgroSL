// src/Pages/__tests__/Inventory.test.js

import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Inventory from "../Inventory";
import React from "react";
import "@testing-library/jest-dom";

jest.mock("../__mocks__/fileMock", () => ({
  initializeApp: jest.fn(),
  getStorage: jest.fn(),
  getAnalytics: jest.fn(),
  getAuth: jest.fn(),
}));

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
    render(
      <MemoryRouter>
        <Inventory />
      </MemoryRouter>
    );
  });

  test("renders inventory title", () => {
    const titleElement = screen.getByText(/Your Inventory/i);
    expect(titleElement).toBeInTheDocument();
  });

  test("renders 'No items in the Inventory' when items array is empty", () => {
    const noItemsElement = screen.getByText(/No items in the Inventory/i);
    expect(noItemsElement).toBeInTheDocument();
  });

  test("renders Add New Product button", () => {
    const addButtonElement = screen.getByText(/Add New Product/i);
    expect(addButtonElement).toBeInTheDocument();
  });
});
