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

		let newBillsInstance;

		beforeAll(() => {
			// Create a new UI for the NewBill page
			document.body.innerHTML = NewBillUI();

			// Create an new instance of the Newbill class with the mocked onNavigate, store and localstorage
			newBillsInstance = new NewBill({ document, onNavigate, storeMock, localStorageMock });
			newBillsInstance.store = storeMock;
		});

		test("Then i should only be able to select image", async () => {
			// Reference for the accepted files
			const acceptedFilesReference = ["image/png", "image/jpeg", "image/jpg"];

			// Querry the file input element
			await waitFor(() => screen.getByTestId("file"));
			const fileInput = screen.getByTestId("file");

			// Retrieve the accept attribute from the input and split it into an array
			const acceptedFiles = fileInput.accept.split(",");
			expect(acceptedFiles.sort()).toEqual(acceptedFilesReference.sort()); // Sorted in case the order is different
		});

		test("Then it should setup file change correctly", async () => {
			const spy = jest.spyOn(storeMock, "bills");

			// Querry the file input
			await waitFor(() => screen.getByTestId("file"));
			const fileInput = screen.getByTestId("file");
			
			// Simulate a change in the file input
			fireEvent.change(fileInput, { target: { value: "" } });

			await new Promise(res => setTimeout(() => {
				console.log(`L'URL du fichier à l'issu du test est : ${newBillsInstance.fileUrl}`);
				// Check if the fileUrl has been correctly changed
				expect(newBillsInstance.fileUrl).not.toBe(null);
				res();
			}, 100));
		});

		// test("handlechangefile call", () => {
		// 	const spy = jest.spyOn(newBillsInstance, "handleChangeFile");
		// 	const event = new Event("change");
		// 	newBillsInstance.handleChangeFile(event);

		// 	expect(spy).toHaveBeenCalledTimes();

		// });

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
