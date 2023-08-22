/**
 * @jest-environment jsdom
 */

import { fireEvent, screen, waitFor } from "@testing-library/dom";
import NewBillUI from "../views/NewBillUI.js";
import NewBill from "../containers/NewBill.js";
import { ROUTES } from "../constants/routes.js";
import { localStorageMock } from "../__mocks__/localStorage.js";
import storeMock from "../__mocks__/store.js";

describe("Given I am connected as an employee", () => {
	describe("When I am on NewBill Page", () => {
		test("Then i should only be able to select image", () => {
			Object.defineProperty(window, "localStorage", { value: localStorageMock });
			window.localStorage.setItem(
				"user",
				JSON.stringify({
					type: "Employee",
				})
			);
			const html = NewBillUI();
			document.body.innerHTML = html;

			// Mock of the onNavigate function
			const onNavigate = pathname => {
				document.body.innerHTML = ROUTES({ pathname });
			};

			const newBillInstance = new NewBill({ document, onNavigate, storeMock, localStorageMock });

			// TODO Test for file extension
			// Find a way to test if different file extension are uploaded
			const fileInput = screen.getByTestId("file");
			fireEvent.change(fileInput, event);
		});
		test("Then i should be redirected to the Bills page when submitting a new Bill", async () => {
			const submitButton = screen.getByText(/^Envoyer$/);

			fireEvent.click(submitButton);

			await waitFor(() => screen.getByTestId("btn-new-bill"));
			const newBillButton = screen.getByTestId("btn-new-bill");
			expect(newBillButton).toBeDefined();
		});
	});
});
