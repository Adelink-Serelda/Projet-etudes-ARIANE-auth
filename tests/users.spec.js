const request = require("supertest");
const { app } = require("../server");
const jwt = require("jsonwebtoken");
const config = require("../config/index");
const mongoose = require("mongoose");
const User = require("../models/user.model");
const usersService = require("../services/user.service");

jest.mock("../models/user.model");

describe("Ariane - Tester auth-service", () => {
  let token;
  const USER_ID = "fake";
  const MOCK_DATA = [
    {
      _id: USER_ID,
      firstName: "John",
      lastName: "Doe",
      email: "johndoe@mail.fr",
      password: "azerty123",
      role: "user",
    },
  ];
  const MOCK_DATA_CREATED = {
    firstName: "Test",
    lastName: "Mocktest",
    email: "mocktest@test.com",
    password: "azerty123",
  };

  beforeEach(() => {
    token = jwt.sign({ userId: USER_ID }, config.secretJwtToken);
    User.find.mockResolvedValue(MOCK_DATA);
    User.findById.mockResolvedValue(MOCK_DATA[0]);
    User.prototype.save = jest.fn().mockResolvedValue(MOCK_DATA_CREATED);
  });
  test("[Users] Get All", async () => {
    const res = await request(app)
      .get("/auth/users")
      .set("x-access-token", token);
    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  test("[Users] Create User", async () => {
    const res = await request(app)
      .post("/auth/register")
      .send(MOCK_DATA_CREATED);
    expect(res.status).toBe(201);
    expect(res.body.firstName).toBe(MOCK_DATA_CREATED.firstName);
  });

  test("Est-ce userService.getAll", async () => {
    const spy = jest
      .spyOn(usersService, "getAll")
      .mockImplementation(() => "test");
    await request(app).get("/auth/users").set("x-access-token", token);
    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveReturnedWith("test");
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });
});
