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
		test("Then bill icon in vertical layout should be highlighted", async () => {
			Object.defineProperty(window, "localStorage", { value: localStorageMock });
			window.localStorage.setItem(
				"user",
				JSON.stringify({
					type: "Employee",
				})
			);
			const root = document.createElement("div");
			root.setAttribute("id", "root");
			document.body.append(root);
			router();
			window.onNavigate(ROUTES_PATH.Bills);
			await waitFor(() => screen.getByTestId("icon-window"));
			const windowIcon = screen.getByTestId("icon-window");
			// Here we want to test if the windowIcon is highlighted
			// The icon is highlighted when it has the active-icon class
			expect(windowIcon.className).toEqual("active-icon");
		});
		test("Then bills should be ordered from earliest to latest", () => {
			document.body.innerHTML = BillsUI({ data: bills });
			const dates = screen
				.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i)
				.map(a => a.innerHTML);
			const antiChrono = (a, b) => (a < b ? 1 : -1);
			const datesSorted = [...dates].sort(antiChrono);
			expect(dates).toEqual(datesSorted);
		});
		test("Then clicking on the eye icon should open the bill's image", async () => {
			// Mock of the onNavigate function
			const onNavigate = pathname => {
				document.body.innerHTML = ROUTES({ pathname });
			};

			const showModalMock = jest.fn();
			$.fn.modal = showModalMock;

			// Querry for all the icon eye
			await waitFor(() => screen.getAllByTestId("icon-eye"));
			const allIconEye = screen.getAllByTestId("icon-eye");

			// Create an instance of the bills class with the mocked onNavigate, store and localstorage
			const billsInstance = new Bills({ document, onNavigate, storeMock, localStorageMock });

			// Simulate a click on the first icon eye
			fireEvent.click(allIconEye[0]);

			expect(showModalMock).toHaveBeenCalledWith("show");

			// Clean up the modal mock
			$.fn.modal = undefined;

		});
		test("Then clicking on New Bill should redirect to the new bills page", async () => {
			// mock of the onNavigate function
			const onNavigate = pathname => {
				document.body.innerHTML = ROUTES({ pathname });
			};

			// Querry the New Bill Button
			await waitFor(() => screen.getByTestId("btn-new-bill"));
			const testButtonDOM = screen.getByTestId("btn-new-bill");
			// Check if the New Bill button exist / is defined
			expect(testButtonDOM).toBeDefined();

			// Create an instance of the bills class with the mocked onNavigate, store and localstorage
			const billsInstance = new Bills({ document, onNavigate, storeMock, localStorageMock });

			// Simulate a click on the new Bill button
			fireEvent.click(testButtonDOM);

			// Querry for the input field "expense name" (present in the new bill page)
			await waitFor(() => screen.getByTestId("expense-name"));
			const newBillNameField = screen.getByTestId("expense-name");

			// Check if the "expanse name" input field exist / is defined.
			// If yes --> User was correctly redirect to the new bill page
			expect(newBillNameField).toBeDefined();
		});
		test("Then it should retrieve the bills correctly", () => {
			// Mock the onNavigate function
			const onNavigate = pathname => {
				document.body.innerHTML = ROUTES({ pathname });
			};

			// Create an instance of the bills class with the mocked onNavigate, store and localstorage
			const billsInstance = new Bills({ document, onNavigate, storeMock, localStorageMock });

			// Call the get bills function
			billsInstance.getBills();

			// Expect
		});
	});
});
