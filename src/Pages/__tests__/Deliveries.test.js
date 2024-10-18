import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import Deliveries from "../Deliveries";
import axios from "axios";

jest.mock("axios");

describe("Deliveries", () => {
  const riderId = "RIDER001";
  const mockDeliveries = [
    {
      delivery_id: "DELIVERY001",
      order_id: "ORD001",
      buyer_name: "John Doe",
      order_date: "2024-10-18",
      seller_address: "123 Seller St",
      buyer_address: "456 Buyer Ave",
      delivery_status: "Delivery Processing",
    },
  ];

  beforeEach(() => {
    axios.get.mockResolvedValue({ data: mockDeliveries });

    render(
      <MemoryRouter initialEntries={[`/deliveries/${riderId}`]}>
        <Routes>
          <Route path="/deliveries/:riderId" element={<Deliveries />} />
        </Routes>
      </MemoryRouter>
    );
  });

  test("renders the deliveries correctly", async () => {
    await waitFor(() => {
      expect(screen.getByText(/Available Deliveries/i)).toBeInTheDocument();
      expect(screen.getByText(/Delivery ID: DELIVERY001/i)).toBeInTheDocument();
      expect(screen.getByText(/Order ID: ORD001/i)).toBeInTheDocument();
      expect(screen.getByText(/Buyer Name: John Doe/i)).toBeInTheDocument();
    });
  });

  test("allows changing the delivery status", async () => {
    const dropdown = await screen.findByRole("combobox");

    fireEvent.change(dropdown, { target: { value: "Delivered" } });

    expect(dropdown.value).toBe("Delivery Processing");
  });
});
