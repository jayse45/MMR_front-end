import React from "react";
import { unmountComponentAtNode } from "react-dom";
import { render, screen } from "@testing-library/react"
import Button from "../../components/Button";

let container = null;
beforeEach(() => {
	// setup a DOM element as a render target
	container = document.createElement("div");
	document.body.appendChild(container);
});

afterEach(() => {
	// cleanup on exiting
	unmountComponentAtNode(container);
	container.remove();
	container = null;
});
describe('Text UI components', () => {
	it("Test Buttom Render", () => {
		const expectedText = "test button"
		render(<Button title={"test button"}>{expectedText}</Button>, container);
		const component = screen.getByText(expectedText);
		expect(component.textContent).toBe(expectedText)
	})

});