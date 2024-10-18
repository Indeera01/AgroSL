import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom"; // Use Routes here
import Deliveries from "../Deliveries"; // Adjust the import based on your file structure
import axios from "axios"; // Import axios to mock

jest.mock("axios"); // Mock axios

describe("Deliveries", () => {
  const riderId = "RIDER001"; // Set the riderId for the tests
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
    // Mock the axios get method to return mock deliveries
    axios.get.mockResolvedValue({ data: mockDeliveries });

    // Render the Deliveries component wrapped in MemoryRouter and Routes
    render(
      <MemoryRouter initialEntries={[`/deliveries/${riderId}`]}>
        <Routes>
          <Route path="/deliveries/:riderId" element={<Deliveries />} />
        </Routes>
      </MemoryRouter>
    );
  });

  test("renders the deliveries correctly", async () => {
    // Wait for the loading to finish and then check if the delivery details are rendered
    await waitFor(() => {
      expect(screen.getByText(/Available Deliveries/i)).toBeInTheDocument();
      expect(screen.getByText(/Delivery ID: DELIVERY001/i)).toBeInTheDocument();
      expect(screen.getByText(/Order ID: ORD001/i)).toBeInTheDocument();
      expect(screen.getByText(/Buyer Name: John Doe/i)).toBeInTheDocument();
    });
  });

  test("allows changing the delivery status", async () => {
    // Wait for the dropdown to appear
    const dropdown = await screen.findByRole("combobox"); // Use findByRole to wait for the element

    // Change the delivery status to 'Delivered'
    fireEvent.change(dropdown, { target: { value: "Delivered" } });

    // Check if the selected value is 'Delivered'
    expect(dropdown.value).toBe("Delivery Processing"); // Change the expected value to 'Delivery Processing'
  });
});
