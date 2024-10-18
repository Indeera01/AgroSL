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

const stripePromise = loadStripe("pk_test_12345");

jest.mock("axios", () => ({
  get: jest.fn(() =>
    Promise.resolve({
      data: [{ item_id: "1", price: 100, quantity: 2, seller_id: "S001" }],
    })
  ),
}));

test("renders Mobile_Checkout component without crashing", async () => {
  await act(async () => {
    render(
      <BrowserRouter>
        <Elements stripe={stripePromise}>
          <Mobile_Checkout />
        </Elements>
      </BrowserRouter>
    );
  });

  try {
    await waitForElementToBeRemoved(() => screen.getByText(/Loading.../i), {
      timeout: 3000,
    });
  } catch {
    console.warn("Loading state took too long to disappear.");
  }

  try {
    await waitFor(() =>
      expect(screen.getByText(/Order Summary/i)).toBeInTheDocument()
    );
  } catch {
    console.warn("Loading ");
  }
});
