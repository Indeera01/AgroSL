import React from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Success from "../Success";

describe("Success Component", () => {
  const renderWithRouter = (component) => {
    return render(<BrowserRouter>{component}</BrowserRouter>);
  };

  test("renders success message correctly", () => {
    renderWithRouter(<Success />);

    const successText = screen.queryByText(/Account Created Successfully!/i);
    expect(successText).toBeTruthy();
  });

  test("renders login button", () => {
    renderWithRouter(<Success />);
    const button = screen.queryByRole("button", { name: /Go to Log In Page/i });
    expect(button).toBeTruthy();
  });
});
