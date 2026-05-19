import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

import { apiRequest } from "./api.js";

// mock SERVER_URL
vi.mock("./url.js", () => ({
  SERVER_URL: "http://localhost:3000"
}));

describe("apiRequest", () => {

  beforeEach(() => {
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("makes a GET request", async () => {
    const mockResponse = {
      success: true
    };

    fetch.mockResolvedValue({
      ok: true,
      json: async () => mockResponse
    });

    const result = await apiRequest("/test");

    expect(fetch).toHaveBeenCalledWith(
      "http://localhost:3000/test",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        },
        body: null
      }
    );

    expect(result).toEqual(mockResponse);
  });

  it("makes a POST request with body", async () => {
    const mockResponse = {
      created: true
    };

    fetch.mockResolvedValue({
      ok: true,
      json: async () => mockResponse
    });

    const body = {
      name: "John"
    };

    const result = await apiRequest("/users", {
      method: "POST",
      body
    });

    expect(fetch).toHaveBeenCalledWith(
      "http://localhost:3000/users",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
      }
    );

    expect(result).toEqual(mockResponse);
  });

  it("adds authorization header when token is provided", async () => {
    fetch.mockResolvedValue({
      ok: true,
      json: async () => ({ ok: true })
    });

    await apiRequest("/secure", {
      token: "abc123"
    });

    expect(fetch).toHaveBeenCalledWith(
      "http://localhost:3000/secure",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer abc123"
        },
        body: null
      }
    );
  });

  it("throws API error message when response is not ok", async () => {
    fetch.mockResolvedValue({
      ok: false,
      json: async () => ({
        message: "Unauthorized"
      })
    });

    await expect(
      apiRequest("/secure")
    ).rejects.toThrow("Unauthorized");
  });

  it("throws default API error when message is missing", async () => {
    fetch.mockResolvedValue({
      ok: false,
      json: async () => ({})
    });

    await expect(
      apiRequest("/secure")
    ).rejects.toThrow("API Error");
  });

});