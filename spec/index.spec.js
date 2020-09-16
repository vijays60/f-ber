const appMock = require("../src/app");
require("../src/index.js");

jest.mock("../src/app");

describe("index.js - app entry", () => {
  it("should call app.listen()", () => {
    expect(appMock.listen).toHaveBeenCalled();
  });
});
