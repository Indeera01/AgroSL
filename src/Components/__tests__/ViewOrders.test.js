import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom"; // Import necessary components from react-router
import ViewOrders from "../View_Orders"; // Adjust the import path as necessary

describe("ViewOrders Component", () => {
  test("renders the View Orders button", () => {
    const sellerId = "S001"; // Example seller ID

    render(
      <MemoryRouter initialEntries={[`/sellerdashboard/${sellerId}`]}>
        <Routes>
          <Route path="/sellerdashboard/:id" element={<ViewOrders />} />
        </Routes>
      </MemoryRouter>
    );

    // Check if the button is rendered with the correct text
    expect(screen.getByText(/View Orders/i)).toBeInTheDocument();
  });

  test("navigates to the correct orders page on button click", () => {
    const sellerId = "S001"; // Example seller ID

    render(
      <MemoryRouter initialEntries={[`/sellerdashboard/${sellerId}`]}>
        <Routes>
          <Route path="/sellerdashboard/:id" element={<ViewOrders />} />
          <Route
            path="/sellerdashboard/:id/orders"
            element={<div>Orders Page</div>}
          />
        </Routes>
      </MemoryRouter>
    );

    // Click the button to navigate
    fireEvent.click(screen.getByText(/View Orders/i));

    // Check if the navigation occurred to the correct path
    expect(screen.getByText(/Orders Page/i)).toBeInTheDocument();
  });
});
