import request from "supertest";
import mongoose from "mongoose";
import app from "../index";
import Event from "../models/event";
require("dotenv").config();

jest.mock("../config/db", () => () => Promise.resolve());

const authHeaders = {
  Authorization:
    "bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjZiNTcwMTY1ZDIzN2NmOWQyZGI1YjBjIn0sImlhdCI6MTcyMzM3MDYyM30.YRYNMWQhmCuowJKi9pA0AJxLCr5mlsSJgCbguzrg0No",
};
describe("Event API", () => {
  beforeAll(async () => {
    const url = `${process.env.MONGO_DB_LOCAL}_shadow` || "";
    await mongoose.connect(url, {});
  });

  afterEach(async () => {
    await Event.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });
  it("should create a new event", async () => {
    const res = await request(app)
      .post("/api/v1/event")
      .set(authHeaders)
      .send({
        name: "Birthday Party",
        dates: ["2024-01-05", "2024-08-12"],
      });
    expect(res.status).toBe(200);
  });

  it("should not create an event with invalid data", async () => {
    const res = await request(app).post("/api/v1/event").set(authHeaders).send({
      name: "",
      dates: [],
    });
    expect(res.status).toBe(400);
  });

  it("should list all events", async () => {
    await Event.create({
      name: "Event 1",
      dates: ["2023-01-01"],
      createdBy: "66b88ee9b7b29455286929b9",
    });
    await Event.create({
      name: "Event 2",
      dates: ["2023-01-02"],
      createdBy: "66b88ee9b7b29455286929b9",
    });

    const res = await request(app).get("/api/v1/event/list").set(authHeaders);
    expect(res.status).toBe(200);
    expect(res.body.events).toHaveLength(2);
    expect(res.body.events[0]).toHaveProperty("id");
    expect(res.body.events[0]).toHaveProperty("name");
  });

  it("should get a specific event", async () => {
    const event = await Event.create({
      name: "Test Event",
      dates: ["2023-01-01"],
      createdBy: "66b88ee9b7b29455286929b9",
    });

    const res = await request(app)
      .get(`/api/v1/event/${event._id}`)
      .set(authHeaders);
    expect(res.status).toBe(200);
    expect(res.body.data.name).toBe("Test Event");
  });

  it("should add votes to an event", async () => {
    const event = await Event.create({
      name: "Test Event",
      dates: ["2023-01-01", "2023-01-02"],
      createdBy: "66b88ee9b7b29455286929b9",
    });

    const res = await request(app)
      .post(`/api/v1/event/${event._id}/vote`)
      .set(authHeaders)
      .send({
        name: "John",
        votes: ["2023-01-01"],
      });
    expect(res.status).toBe(200);
    expect(res.body.data.votes[0].people).toContain("John");
  });

  it("should get event results", async () => {
    const event = await Event.create({
      name: "Test Event",
      dates: ["2023-01-01", "2023-01-02"],
      votes: [
        { date: "2023-01-01", people: ["John", "Jane"] },
        { date: "2023-01-02", people: ["John"] },
      ],
      createdBy: "66b88ee9b7b29455286929b9",
    });

    const res = await request(app)
      .get(`/api/v1/event/${event._id}/results`)
      .set(authHeaders);
    expect(res.status).toBe(200);
    expect(res.body.suitableDates).toHaveLength(1);
    expect(res.body.suitableDates[0].date).toBe("2023-01-01");
    expect(res.body).toHaveProperty("name");
  });
});
