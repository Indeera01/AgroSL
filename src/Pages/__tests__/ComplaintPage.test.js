import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ComplaintPage from "../ComplaintPage";
import axios from "axios";

jest.mock("axios");

describe("ComplaintPage", () => {
  const orderId = "ORD12345";
  const sellerId = "SELLER001";

  beforeEach(() => {
    axios.post.mockResolvedValue({ status: 200 });

    render(
      <MemoryRouter
        initialEntries={[
          {
            pathname: "/complaint",
            state: { order_id: orderId, seller_id: sellerId },
          },
        ]}
      >
        <ComplaintPage />
      </MemoryRouter>
    );
  });

  test("allows input in the complaint description", () => {
    const descriptionInput = screen.getByPlaceholderText(
      /enter the complaint description/i
    );
    fireEvent.change(descriptionInput, { target: { value: "Test complaint" } });
    expect(descriptionInput.value).toBe("Test complaint");
  });

  test("submits the form with valid data", async () => {
    fireEvent.change(
      screen.getByPlaceholderText(/enter the complaint description/i),
      { target: { value: "Test complaint" } }
    );

    fireEvent.click(screen.getByRole("button", { name: /submit complaint/i }));

    expect(axios.post).toHaveBeenCalledWith(
      "https://backend-rho-three-58.vercel.app/api/complaints",
      expect.objectContaining({
        description: "Test complaint",
        seller_id: sellerId,
        order_id: orderId,
        complaint_seller: false,
      })
    );
  });
});
