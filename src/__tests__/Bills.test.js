/**
 * @jest-environment jsdom
 */

import { fireEvent, screen, waitFor } from "@testing-library/dom";
import BillsUI from "../views/BillsUI.js";
import Bills from "../containers/Bills.js";
import { bills } from "../fixtures/bills.js";
import { ROUTES_PATH, ROUTES } from "../constants/routes.js";
import { localStorageMock } from "../__mocks__/localStorage.js";
import storeMock from "../__mocks__/store.js";
import router from "../app/Router.js";

describe("Given I am connected as an employee", () => {
	describe("When I am on Bills Page", () => {
		// Setup the localStorage so that the user is connected as an employee
		Object.defineProperty(window, "localStorage", { value: localStorageMock });
		window.localStorage.setItem("user", JSON.stringify({ type: "Employee" }));

		// Mock of the onNavigate function (used by the router)
		const onNavigate = pathname => {
			document.body.innerHTML = ROUTES({ pathname });
		};

		test("Then bill icon in vertical layout should be highlighted", async () => {
			//Create a "root" div and append it to the document's body (used by the router)
			const root = document.createElement("div");
			root.id = "root";
			document.body.append(root);

			// Initialize the router and navigate to the Bills page to get the vertical layout
			router();
			window.onNavigate(ROUTES_PATH.Bills);

			// Querry the "icon-window" icon
			await waitFor(() => screen.getByTestId("icon-window"));
			const windowIcon = screen.getByTestId("icon-window");

			// The icon is highlighted when it has the "active-icon" class
			const hasActiveClass = windowIcon.className.includes("active-icon");
			expect(hasActiveClass).toBeTruthy();
		});

		test("Then bills should be ordered from earliest to latest", () => {
			// Create a new UI based on sample bills data (router not used here)
			document.body.innerHTML = BillsUI({ data: bills });

			// Querry all the dates on the screen (one per bill)
			const dates = screen
				.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i)
				.map(a => a.innerHTML);

			// Define a function that sorts date from the most recent to the most ancient
			const antiChrono = (a, b) => (a < b ? 1 : -1);

			// Sort the querried dates from most recent to most ancient
			const datesSorted = [...dates].sort(antiChrono);

			// Check if the sorted dates and the querried dates are in the same order
			expect(dates).toEqual(datesSorted);
		});

		test("Then clicking on the eye icon should open the bill's image", async () => {
			// Create a new UI based on sample bills data (router not used here)
			document.body.innerHTML = BillsUI({ data: bills });

			// Mock of the showModal function from bootstrap
			const showModalMock = jest.fn();
			$.fn.modal = showModalMock;

			// Querry for all the icon eye (one per Bill)
			await waitFor(() => screen.getAllByTestId("icon-eye"));
			const allIconEye = screen.getAllByTestId("icon-eye");

			// Create an new instance of the bills class with the mocked onNavigate, store and localstorage
			const billsInstance = new Bills({ document, onNavigate, storeMock, localStorageMock });

			// Simulate a click on theicon eye of the first Bill
			fireEvent.click(allIconEye[0]);

			// The bill's image has been opened if the showModal function has been called with "show" parameter
			expect(showModalMock).toHaveBeenCalledWith("show");

			// Clean up the modal mock
			$.fn.modal = undefined;
		});

		test("Then clicking on New Bill should redirect to the new bills page", async () => {
			// Create a new UI based on sample bills data (router not used here)
			document.body.innerHTML = BillsUI({ data: bills });

			// Querry the New Bill Button
			await waitFor(() => screen.getByTestId("btn-new-bill"));
			const testButtonDOM = screen.getByTestId("btn-new-bill");

			// Create an instance of the bills class with the mocked onNavigate, store and localstorage
			const billsInstance = new Bills({ document, onNavigate, storeMock, localStorageMock });

			// Simulate a click on the new Bill button
			fireEvent.click(testButtonDOM);

			// Querry for the input field "expense name" (present in the new bill page)
			await waitFor(() => screen.getByTestId("expense-name"));
			const newBillNameField = screen.getByTestId("expense-name");

			// Check if the "expanse name" input field exist
			expect(newBillNameField).toBeDefined();
		});

		test("Then the bills should be correctly rerieved and their date formatted", () => {
			// Create an instance of the bills class with the mocked onNavigate, store and localstorage
			const billsInstance = new Bills({ document, onNavigate, storeMock, localStorageMock });

			const results = billsInstance.getBills();

			console.log(storeMock);
		});
	});
});
