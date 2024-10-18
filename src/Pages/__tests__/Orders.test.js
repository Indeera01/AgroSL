import React from "react";
import { render, screen } from "@testing-library/react";
import Orders from "../Orders";
import { BrowserRouter } from "react-router-dom";

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () =>
      Promise.resolve([
        {
          order_id: "123",
          item_id: "item_001",
          order_date: new Date(),
          order_quantity: 2,
        },
      ]),
  })
);

test("renders Orders component with mock data without crashing", async () => {
  render(
    <BrowserRouter>
      <Orders />
    </BrowserRouter>
  );

  const orderIdElement = await screen.findByText(/Order ID: 123/i);
  const itemIdElement = await screen.findByText(/Item ID: item_001/i);

  expect(orderIdElement).toBeInTheDocument();
  expect(itemIdElement).toBeInTheDocument();

  expect(true).toBe(true);
});
