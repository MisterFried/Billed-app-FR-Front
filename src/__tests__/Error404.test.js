/**
 * @jest-environment jsdom
 */

import { screen } from "@testing-library/dom";
import { ROUTES_PATH } from "../constants/routes.js";
import { localStorageMock } from "../__mocks__/localStorage.js";
import mockStore from "../__mocks__/store.js";
import router from "../app/Router.js";

jest.mock("../app/store", () => mockStore);

describe("Given I am connected as an employee", () => {
	describe("When I get an error", () => {
		// Setup the localStorage so that the user is connected as an employee
		Object.defineProperty(window, "localStorage", { value: localStorageMock });
		window.localStorage.setItem("user", JSON.stringify({ type: "Employee" }));

		beforeEach(() => {
			//Create a "root" div and append it to the document's body (used by the router)
			const root = document.createElement("div");
			root.id = "root";
			document.body.append(root);
		});

		test("Then the correct 404 error message should be displayed", async () => {
			// Spy on mockStore.bills and mock an "Error 404" return value once
			jest.spyOn(mockStore, "bills");
			mockStore.bills.mockImplementationOnce(() => {
				return { list: () => Promise.reject(new Error("Erreur 404")) };
			});

			// Navigate to the Bills page
			router();
			window.onNavigate(ROUTES_PATH.Bills);
			await new Promise(process.nextTick);

			// Query the 404 error message
			const errorMessage = screen.getByText(/Erreur 404/);
			expect(errorMessage).toBeTruthy();
		});

		test("Then the correct 500 error message should be displayed", async () => {
			// Spy on mockStore.bills and mock an "Error 404" return value once
			jest.spyOn(mockStore, "bills");
			mockStore.bills.mockImplementationOnce(() => {
				return { list: () => Promise.reject(new Error("Erreur 500")) };
			});

			// Navigate to the Bills page
			router();
			window.onNavigate(ROUTES_PATH.Bills);
			await new Promise(process.nextTick);

			// Query the 404 error message
			const errorMessage = screen.getByText(/Erreur 500/);
			expect(errorMessage).toBeTruthy();
		});
	});
});
