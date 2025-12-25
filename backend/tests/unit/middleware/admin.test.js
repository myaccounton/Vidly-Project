const admin = require("../../../middleware/admin");

describe("admin middleware", () => {
  let req, res, next;

  beforeEach(() => {
    req = { user: { isAdmin: true } };
    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn()
    };
    next = jest.fn();
  });

  it("should call next if user is admin", () => {
    admin(req, res, next);

    expect(next).toHaveBeenCalled();
  });

  it("should return 403 if user is not admin", () => {
    req.user.isAdmin = false;

    admin(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.send).toHaveBeenCalledWith("Access denied.");
  });

  it("should return 403 if req.user is missing", () => {
    req = {}; // simulate missing user

    admin(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.send).toHaveBeenCalledWith("Access denied.");
  });
});
