import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom"; // Import Routes for routing
import ViewComplaints from "../View_Complaints"; // Adjust the path according to your structure

describe("ViewComplaints Component", () => {
  test("renders the View Complaints button", () => {
    const sellerId = "S001"; // Example seller ID

    render(
      <MemoryRouter initialEntries={[`/sellerdashboard/${sellerId}`]}>
        <Routes>
          <Route path="/sellerdashboard/:id" element={<ViewComplaints />} />
        </Routes>
      </MemoryRouter>
    );

    // Check if the button is rendered with the correct text
    expect(screen.getByText(/View Complaints/i)).toBeInTheDocument();
  });

  test("navigates to the correct complaints page on button click", () => {
    const sellerId = "S001"; // Example seller ID

    render(
      <MemoryRouter initialEntries={[`/sellerdashboard/${sellerId}`]}>
        <Routes>
          <Route path="/sellerdashboard/:id" element={<ViewComplaints />} />
          <Route
            path="/sellerdashboard/:id/complaints"
            element={<div>Complaints Page</div>}
          />
        </Routes>
      </MemoryRouter>
    );

    // Click the button to navigate
    fireEvent.click(screen.getByText(/View Complaints/i));

    // Check if the navigation occurred to the correct path
    expect(screen.getByText(/Complaints Page/i)).toBeInTheDocument();
  });
});
