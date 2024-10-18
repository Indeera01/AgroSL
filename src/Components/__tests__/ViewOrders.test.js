import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import ViewOrders from "../View_Orders";

describe("ViewOrders Component", () => {
  test("renders the View Orders button", () => {
    const sellerId = "S001";

    render(
      <MemoryRouter initialEntries={[`/sellerdashboard/${sellerId}`]}>
        <Routes>
          <Route path="/sellerdashboard/:id" element={<ViewOrders />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText(/View Orders/i)).toBeInTheDocument();
  });

  test("navigates to the correct orders page on button click", () => {
    const sellerId = "S001";

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

    fireEvent.click(screen.getByText(/View Orders/i));

    expect(screen.getByText(/Orders Page/i)).toBeInTheDocument();
  });
});
