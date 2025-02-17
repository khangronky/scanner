import { expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import Page from "../app/page";

test("renders the page", () => {
  render(<Page />);
  expect(screen.getByText("Hello")).toBeDefined();
});
