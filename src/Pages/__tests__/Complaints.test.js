import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Complaints from "../Complaints";

global.fetch = jest.fn();

describe("Complaints Component", () => {
  const sellerId = "S001";

  beforeEach(() => {
    fetch.mockClear();
  });

  test("renders Complaints component without crashing", () => {
    render(
      <BrowserRouter>
        <Complaints />
      </BrowserRouter>
    );
    expect(screen.getByText(/complaints/i)).toBeInTheDocument();
  });

  test("fetches and displays complaints", async () => {
    const mockComplaints = [
      {
        complaint_id: "C001",
        complaint_status_seller: "reviewing",
        description: "Product not delivered.",
        rider_name: "John Doe",
        seller_name: "Seller A",
        order_id: "O001",
        complained_seller: true,
      },
      {
        complaint_id: "C002",
        complaint_status_seller: "resolved",
        description: "Product damaged.",
        rider_name: "Jane Doe",
        seller_name: "Seller B",
        order_id: "O002",
        complained_seller: false,
      },
    ];

    fetch.mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce(mockComplaints),
    });

    render(
      <BrowserRouter>
        <Complaints />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Complaint ID: C001/i)).toBeInTheDocument();
      expect(screen.getByText(/Product not delivered./i)).toBeInTheDocument();
      expect(screen.getByText(/Complaint ID: C002/i)).toBeInTheDocument();
      expect(screen.getByText(/Product damaged./i)).toBeInTheDocument();
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });
});
