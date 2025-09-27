import mongoose from "mongoose";
import request from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import User from "../Model/UserModel.js";
import { app, server } from "../index.js";

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  if (mongoose.connection.readyState === 0) await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
  server.close();
});

afterEach(async () => {
  await User.deleteMany({});
});

describe("POST /auth/signup", () => {
  it("should reject if username is missing", async () => {
    const res = await request(app).post("/auth/signup").send({
      FirstName: "John",
      LastName: "Doe",
      Email: "john@example.com",
      Password: "password123",
    });

    expect(res.status).toBe(422);
    expect(res.body.error).toMatch(/Please fill all the fields/i);
  });

  it("should reject if username is invalid", async () => {
    const res = await request(app).post("/auth/signup").send({
      FirstName: "John",
      LastName: "Doe",
      Email: "john@example.com",
      Username: "invalid username!", // invalid chars
      Password: "password123",
    });

    expect(res.status).toBe(400);
    expect(res.body.errors[0].msg).toMatch(
      /Username can only contain letters, numbers, underscores, and dots/i
    );
  });
});
