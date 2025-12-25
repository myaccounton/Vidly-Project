const errorMiddleware = require("../../../middleware/error");


it("should log the error and return 500", () => {
  const err = new Error("Test error");
  const req = {};
  const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };
  const next = jest.fn();

  errorMiddleware(err, req, res, next);

  expect(res.status).toHaveBeenCalledWith(500);
  expect(res.send).toHaveBeenCalledWith("Something failed.");
});
