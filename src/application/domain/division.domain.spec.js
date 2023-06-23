const Division = require("../../models/Division");
const {
  fetchDivision,
  getDivision,
  deleteDivision,
  addDivision,
  updateDivision
} = require("./division.domain");

jest.mock("../../models/Division");

describe("fetchDivision()", () => {
  it("should fetch all divisions", async () => {
    const divisions = [
      { _id: "1", name: "Division 1" },
      { _id: "2", name: "Division 2" }
    ];

    Division.find.mockResolvedValue(divisions);

    const response = await fetchDivision();

    expect(Division.find).toHaveBeenCalledWith({});
    expect(response.status).toBe(200);
    expect(response.message).toBe("Get Division successfully");
    expect(response.data).toEqual(divisions);
  });

  it("should return an error message if fetching divisions fails", async () => {
    const errorMessage = "Failed to fetch divisions";

    Division.find.mockRejectedValue(new Error(errorMessage));

    const response = await fetchDivision();

    expect(Division.find).toHaveBeenCalledWith({});
    expect(response.status).toBe(500);
    expect(response.message).toBe(errorMessage);
  });
});

describe("getDivision()", () => {
  it("should get a specific division by id", async () => {
    const id = "1";
    const division = { _id: id, name: "Division 1" };

    Division.findById.mockResolvedValue(division);

    const response = await getDivision(id);

    expect(Division.findById).toHaveBeenCalledWith(id);
    expect(response.status).toBe(200);
    expect(response.message).toBe("Get Division successfully.");
    expect(response.data).toEqual(division);
  });

  it("should return 'Division not found' if the division does not exist", async () => {
    const id = "1";

    Division.findById.mockResolvedValue(null);

    const response = await getDivision(id);

    expect(Division.findById).toHaveBeenCalledWith(id);
    expect(response.status).toBe(404);
    expect(response.message).toBe("Division not found");
  });

  it("should return an error message if getting a division fails", async () => {
    const id = "1";
    const errorMessage = "Failed to get division";

    Division.findById.mockRejectedValue(new Error(errorMessage));

    const response = await getDivision(id);

    expect(Division.findById).toHaveBeenCalledWith(id);
    expect(response.status).toBe(500);
    expect(response.message).toBe(errorMessage);
  });
});

describe("deleteDivision()", () => {
  it("should delete a specific division by id", async () => {
    const id = "1";
    const division = { _id: id, name: "Division 1" };

    Division.findByIdAndDelete.mockResolvedValue(division);

    const response = await deleteDivision(id);

    expect(Division.findByIdAndDelete).toHaveBeenCalledWith(id);
    expect(response.status).toBe(200);
    expect(response.message).toBe("Division delete successfully");
  });

  it("should return 'Division not found' if the division does not exist", async () => {
    const id = "1";

    Division.findByIdAndDelete.mockResolvedValue(null);

    const response = await deleteDivision(id);

    expect(Division.findByIdAndDelete).toHaveBeenCalledWith(id);
    expect(response.status).toBe(404);
    expect(response.message).toBe("Division not found");
  });

  it("should return an error message if deleting a division fails", async () => {
    const id = "1";
    const errorMessage = "Failed to delete division";

    Division.findByIdAndDelete.mockRejectedValue(new Error(errorMessage));

    const response = await deleteDivision(id);

    expect(Division.findByIdAndDelete).toHaveBeenCalledWith(id);
    expect(response.status).toBe(500);
    expect(response.message).toBe(errorMessage);
  });
});

describe("addDivision()", () => {
  it("should add a new division", async () => {
    const data = { name: "New Division" };
    const division = { _id: "1", name: "New Division" };

    Division.mockImplementationOnce(() => {
      return { save: jest.fn().mockResolvedValue(division) };
    });

    const response = await addDivision(data);

    expect(Division).toHaveBeenCalledWith(data);
    expect(response.status).toBe(201);
    expect(response.message).toBe("Division added successfully");
    expect(response.data).toEqual(division);
  });

  it("should return an error message if adding a division fails", async () => {
    const data = { name: "New Division" };
    const errorMessage = "Failed to add division";

    Division.mockImplementationOnce(() => {
      return { save: jest.fn().mockRejectedValue(new Error(errorMessage)) };
    });

    const response = await addDivision(data);

    expect(Division).toHaveBeenCalledWith(data);
    expect(response.status).toBe(500);
    expect(response.message).toBe(errorMessage);
  });
});

describe("updateDivision()", () => {
  it("should update an existing division", async () => {
    const id = "1";
    const data = { name: "Updated Division" };
    const division = { _id: id, name: "Updated Division" };

    Division.findByIdAndUpdate.mockResolvedValue(division);

    const response = await updateDivision(id, data);

    expect(Division.findByIdAndUpdate).toHaveBeenCalledWith(id, data, { new: true });
    expect(response.status).toBe(200);
    expect(response.message).toBe("Division updated successfully");
    expect(response.data).toEqual(division);
  });

  it("should return 'Division not found' if the division does not exist", async () => {
    const id = "1";
    const data = { name: "Updated Division" };

    Division.findByIdAndUpdate.mockResolvedValue(null);

    const response = await updateDivision(id, data);

    expect(Division.findByIdAndUpdate).toHaveBeenCalledWith(id, data, { new: true });
    expect(response.status).toBe(400);
    expect(response.message).toBe("Division not found");
  });

  it("should return an error message if updating a division fails", async () => {
    const id = "1";
    const data = { name: "Updated Division" };
    const errorMessage = "Failed to update division";

    Division.findByIdAndUpdate.mockRejectedValue(new Error(errorMessage));

    const response = await updateDivision(id, data);

    expect(Division.findByIdAndUpdate).toHaveBeenCalledWith(id, data, { new: true });
    expect(response.status).toBe(500);
    expect(response.message).toBe(errorMessage);
  });
});
