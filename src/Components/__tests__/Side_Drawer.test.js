import { render, screen } from "@testing-library/react";
import Side_Drawer from "../Side_Drawer"; // Ensure the correct path
import React from "react";

describe("Side_Drawer Component", () => {
  test("renders Side_Drawer with all items", () => {
    render(<Side_Drawer />);
    screen.debug();

    // Check for button presence
    expect(screen.getByRole("button", { name: /Items/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Cart/i })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Complaint/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /History/i })
    ).toBeInTheDocument();

    // Optionally check if the SVG icons are rendered
    expect(screen.getByTestId("StorefrontOutlinedIcon")).toBeInTheDocument();
    expect(screen.getByTestId("ShoppingCartOutlinedIcon")).toBeInTheDocument();
    // Add additional checks as needed
  });
});
