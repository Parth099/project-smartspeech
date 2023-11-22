import "@testing-library/react";
import "@testing-library/jest-dom";
import Canvas from "./Canvas";
import { render, screen } from "@testing-library/react";

const useSizeMockRetVal = {
    width: 640,
    height: 320,
};

jest.mock("../../react-helpers/hooks/useSize", () => {
    return jest.fn(() => useSizeMockRetVal);
});

describe("Renders Canvas", () => {
    it("should render", () => {
        render(<Canvas />);
        //checking for all three elements on page
        const clearButton = screen.getByText("Clear canvas");
        expect(clearButton).toBeInTheDocument;
        const checkButton = screen.getByText("Check Image");
        expect(checkButton).toBeInTheDocument;
        const canvasElement = screen.getByTestId("my-canvas");
        expect(canvasElement).toBeInTheDocument;
    });
});
