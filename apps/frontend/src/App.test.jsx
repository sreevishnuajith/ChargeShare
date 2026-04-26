import { render, screen } from "@testing-library/react";
import App from "./App";

describe("App", () => {
  it("shows project heading", () => {
    render(<App />);
    expect(screen.getByText("ChargeShare")).toBeInTheDocument();
  });
});
