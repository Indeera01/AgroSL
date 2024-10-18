import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom"; // Import Routes for routing
import View_Deliveries from "../View_Deliveries"; // Adjust the path according to your structure

describe("View_Deliveries Component", () => {
  test("renders the View Deliveries button", () => {
    const riderId = "R001"; // Example rider ID

    render(
      <MemoryRouter initialEntries={[`/delivery_rider_dashboard/${riderId}`]}>
        <Routes>
          <Route
            path="/delivery_rider_dashboard/:riderId"
            element={<View_Deliveries />}
          />
        </Routes>
      </MemoryRouter>
    );

    // Check if the button is rendered with the correct text
    expect(screen.getByText(/View Deliveries/i)).toBeInTheDocument();
  });

  test("navigates to the correct deliveries page on button click", () => {
    const riderId = "R001"; // Example rider ID

    render(
      <MemoryRouter initialEntries={[`/delivery_rider_dashboard/${riderId}`]}>
        <Routes>
          <Route
            path="/delivery_rider_dashboard/:riderId"
            element={<View_Deliveries />}
          />
          <Route
            path="/delivery_rider_dashboard/:riderId/deliveries"
            element={<div>Deliveries Page</div>}
          />
        </Routes>
      </MemoryRouter>
    );

    // Click the button to navigate
    fireEvent.click(screen.getByText(/View Deliveries/i));

    // Check if the navigation occurred to the correct path
    expect(screen.getByText(/Deliveries Page/i)).toBeInTheDocument();
  });
});
