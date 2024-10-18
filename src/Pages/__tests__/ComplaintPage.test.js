import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom"; // Wrap with Router for routing
import ComplaintPage from "../ComplaintPage"; // Adjust the import based on your file structure
import axios from "axios"; // Import axios to mock

jest.mock("axios"); // Mock axios

describe("ComplaintPage", () => {
  const orderId = "ORD12345";
  const sellerId = "SELLER001";

  beforeEach(() => {
    // Mock the axios post method
    axios.post.mockResolvedValue({ status: 200 });

    // Render the component with necessary props
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
    // Mock the input values
    fireEvent.change(
      screen.getByPlaceholderText(/enter the complaint description/i),
      { target: { value: "Test complaint" } }
    );

    // Submit the form
    fireEvent.click(screen.getByRole("button", { name: /submit complaint/i }));

    // Assert that axios.post was called with the correct data
    expect(axios.post).toHaveBeenCalledWith(
      "https://backend-rho-three-58.vercel.app/api/complaints",
      expect.objectContaining({
        description: "Test complaint",
        seller_id: sellerId, // you need to set this from location.state in your test
        order_id: orderId, // you need to set this from location.state in your test
        complaint_seller: false, // default checkbox state
      })
    );
  });
});
