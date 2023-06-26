const { divisions } = require("../../../tests/fixtures/divisions");
const Division = require("../../models/Division");
const User = require("../../models/User");
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
    expect(response.message).toBe("Get Division successfully");
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

describe('addDivision()', () => {
  it('should return status 201 if all employees and head division are found', async () => {
    const data = divisions[0];
    jest.spyOn(User, 'findById').mockResolvedValue({});
    jest.spyOn(Division.prototype, 'save').mockResolvedValue(data);
    const result = await addDivision(data);
    expect(result.status).toBe(201);
    expect(result.message).toBe('Division added successfully');
    User.findById.mockRestore();
  });

  it('should return status 400 if any employee or head division is not found', async () => {
    const data = divisions[0]
    jest.spyOn(User, 'findById').mockResolvedValue(null);
    const result = await addDivision(data);
    expect(result.status).toBe(400);
    expect(result.message).toBe('Employee or head division not found in user collection');
    expect(result.data).toBeUndefined();
  });

  it('should return status 500 if an error occurs', async () => {
    const errorMessage = "Database error"
    jest.spyOn(User, "findById").mockResolvedValue({});
    jest.spyOn(Division.prototype, "save").mockRejectedValue(new Error(errorMessage));
    const result = await addDivision(divisions[0]);
    expect(result.status).toBe(500);
    expect(result.message).toBe(errorMessage);
    expect(result.data).toBeUndefined();
    User.findById.mockRestore();
  });
});

describe('updateDivision function', () => {
  let divisionId;
  let data;
  let employees;
  let headDivision;

  beforeEach(() => {
    divisionId = '123';
    employees = ['456', '789'];
    headDivision = 'abc';
    data = {
      name: 'Test Division',
      employees,
      head_division: headDivision
    };
  });

  it('should return an error message if division is not found', async () => {
    jest.spyOn(Division, 'findByIdAndUpdate').mockResolvedValue(null);
    jest.spyOn(User, 'findById').mockResolvedValue({});

    const result = await updateDivision(divisionId, data);

    expect(result.status).toBe(400);
    expect(result.message).toBe('Division not found');
  });

  it('should return an error message if employee or head division is not found in user collection', async () => {
    jest.spyOn(User, 'findById').mockResolvedValue(null);

    const result = await updateDivision(divisionId, data);

    expect(result.status).toBe(400);
    expect(result.message).toBe('Employee or head division not found in user collection');
  });

  it('should update division successfully', async () => {
    const updatedDivision = {
      _id: divisionId,
      ...data
    };
    jest.spyOn(Division, 'findByIdAndUpdate').mockResolvedValue(updatedDivision);
    jest.spyOn(User, 'findById').mockResolvedValue({});

    const result = await updateDivision(divisionId, data);

    expect(result.status).toBe(200);
    expect(result.message).toBe('Division updated successfully');
    expect(result.data).toEqual(updatedDivision);
  });

  it('should return an error message if there is an error during update', async () => {
    jest.spyOn(Division, 'findByIdAndUpdate').mockRejectedValue(new Error('Database error'));
    jest.spyOn(User, 'findById').mockResolvedValue({});

    const result = await updateDivision(divisionId, data);

    expect(result.status).toBe(500);
    expect(result.message).toBe('Database error');
  });
});

