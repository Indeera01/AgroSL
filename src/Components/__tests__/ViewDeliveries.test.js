import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import View_Deliveries from "../View_Deliveries";

describe("View_Deliveries Component", () => {
  test("renders the View Deliveries button", () => {
    const riderId = "R001";

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

    expect(screen.getByText(/View Deliveries/i)).toBeInTheDocument();
  });

  test("navigates to the correct deliveries page on button click", () => {
    const riderId = "R001";

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

    fireEvent.click(screen.getByText(/View Deliveries/i));

    expect(screen.getByText(/Deliveries Page/i)).toBeInTheDocument();
  });
});
