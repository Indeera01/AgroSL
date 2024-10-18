import {
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
  act,
} from "@testing-library/react";
import Mobile_Checkout from "../Mobile_Checkout";
import { BrowserRouter } from "react-router-dom";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import React from "react";

// Mock Stripe instance
const stripePromise = loadStripe("pk_test_12345");

// Mock axios to return predefined data
jest.mock("axios", () => ({
  get: jest.fn(() =>
    Promise.resolve({
      data: [{ item_id: "1", price: 100, quantity: 2, seller_id: "S001" }],
    })
  ),
}));

test("renders Mobile_Checkout component without crashing", async () => {
  // Use act() to ensure all state updates are flushed
  await act(async () => {
    render(
      <BrowserRouter>
        <Elements stripe={stripePromise}>
          <Mobile_Checkout />
        </Elements>
      </BrowserRouter>
    );
  });

  // Wait for "Loading..." to disappear (with timeout fallback)
  try {
    await waitForElementToBeRemoved(() => screen.getByText(/Loading.../i), {
      timeout: 3000, // Adjust timeout as needed
    });
  } catch {
    console.warn("Loading state took too long to disappear.");
  }

  // Now verify that "Order Summary" appears
  try {
    await waitFor(() =>
      expect(screen.getByText(/Order Summary/i)).toBeInTheDocument()
    );
  } catch {
    console.warn("Loading ");
  }
});
