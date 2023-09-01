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
		// Setup the localStorage so that the user is connected as an employee
		Object.defineProperty(window, "localStorage", { value: localStorageMock });
		window.localStorage.setItem("user", JSON.stringify({ type: "Employee" }));

		// Mock of the onNavigate function (used by the router)
		const onNavigate = pathname => {
			document.body.innerHTML = ROUTES({ pathname });
		};

		beforeEach(() => {
			// Create a new UI for the NewBill page
			document.body.innerHTML = NewBillUI();

			// Create an new instance of the Newbill class with the mocked onNavigate, store and localstorage
			const newBillInstance = new NewBill({ document, onNavigate, storeMock, localStorageMock });
		});

		test("Then i should only be able to select image", async () => {
			// TODO Test for file extension : Find a way to test if different file extension are uploaded

			// Querry the "file" form input
			await waitFor(() => screen.getByTestId("file"));
			const fileInput = screen.getByTestId("file");

			// Event to trigger a file upload
			fireEvent.change(fileInput);
		});

		test("Then i should be redirected to the Bills page when submitting a new Bill", async () => {
			// Querry the submit new bill form input
			await waitFor(() => screen.getByTestId("envoyer"));
			const submitButton = screen.getByTestId("envoyer");

			fireEvent.click(submitButton);

			// Querry the new Bill button, which is prevent on the bills page
			await waitFor(() => screen.getByTestId("btn-new-bill"));
			const newBillButton = screen.getByTestId("btn-new-bill");

			expect(newBillButton).toBeDefined();
		});
	});
});
