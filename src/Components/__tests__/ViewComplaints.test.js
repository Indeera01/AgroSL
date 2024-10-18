import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import ViewComplaints from "../View_Complaints";

describe("ViewComplaints Component", () => {
  test("renders the View Complaints button", () => {
    const sellerId = "S001";

    render(
      <MemoryRouter initialEntries={[`/sellerdashboard/${sellerId}`]}>
        <Routes>
          <Route path="/sellerdashboard/:id" element={<ViewComplaints />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText(/View Complaints/i)).toBeInTheDocument();
  });

  test("navigates to the correct complaints page on button click", () => {
    const sellerId = "S001";

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

    fireEvent.click(screen.getByText(/View Complaints/i));

    expect(screen.getByText(/Complaints Page/i)).toBeInTheDocument();
  });
});
