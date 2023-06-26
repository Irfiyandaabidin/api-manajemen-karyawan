const Salary = require("../../models/Salary");
const { salaries } = require("../../../tests/fixtures/salaries");
const {
  fetchSalary,
  getSalary,
  addSalary,
  deleteSalary,
  updateSalary,
} = require("./salary.domain");
const User = require("../../models/User");
const { users } = require("../../../tests/fixtures/users");

describe("/home/irfiyanda/Documents/api-manajemen-karyawan/src/application/domain/salary.domain.spec.js", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("fetchSalary()", () => {
    it("should return all salaries", async () => {
      jest.spyOn(Salary, "find").mockResolvedValue(salaries);
      const response = await fetchSalary();
      expect(response.data).toBe(salaries);
      expect(response.status).toBe(200);
    });
    it("should return database error", async () => {
      const errorMessage = "Database error";
      jest.spyOn(Salary, "find").mockRejectedValueOnce(new Error(errorMessage));
      const response = await fetchSalary();
      expect(response.status).toBe(500);
      expect(response.message).toBe(errorMessage);
    });
  });

  describe("getSalary()", () => {
    it("should return one salary", async () => {
      const id = salaries[0]._id;
      const findById = jest
        .spyOn(Salary, "findById")
        .mockResolvedValue(salaries[0]);
      const response = await getSalary(id);
      expect(findById).toHaveBeenCalledWith(id);
      expect(response).toHaveProperty("data");
      expect(response.status).toBe(200);
      expect(response.message).toBe("Get salary successfully");
      expect(response.data).toBe(salaries[0]);
    });
    it("should return salary not found", async () => {
      const id = "123";
      const findById = jest.spyOn(Salary, "findById").mockResolvedValue(null);
      const response = await getSalary(id);
      expect(findById).toHaveBeenCalledWith(id);
      expect(response.status).toBe(404);
      expect(response.message).toBe("Id not found");
    });
    it("should return database error", async () => {
      const errorMessage = "Database error";
      const findById = jest
        .spyOn(Salary, "findById")
        .mockRejectedValueOnce(new Error(errorMessage));
      const response = await getSalary();
      expect(response.status).toBe(500);
      expect(response.message).toBe(errorMessage);
    });
  });

  describe("addSalary()", () => {
    it("should add salary successfully", async () => {
      const data = salaries[0];
      const saveSpy = jest
        .spyOn(Salary.prototype, "save")
        .mockResolvedValueOnce(data);
      const saveUserSpy = jest
        .spyOn(User, "findById")
        .mockResolvedValueOnce(users[0]);
      const result = await addSalary(data);
      expect(saveSpy).toHaveBeenCalledWith({ new: true });
      expect(result.status).toBe(201);
      expect(result.message).toBe("Salary added successfully");
      expect(result.data).toEqual(data);
    });

    it("should return id employee not found", async () => {
      const data = salaries[0];
      const saveSpy = jest
        .spyOn(Salary.prototype, "save")
        .mockResolvedValueOnce(data);
      const saveUserSpy = jest
        .spyOn(User, "findById")
        .mockResolvedValueOnce(null);
      const result = await addSalary(data);
      expect(saveUserSpy).toHaveBeenCalledWith(data.employee_id);
      expect(result.status).toBe(404);
      expect(result.message).toBe("Id employee not found");
    })

    it("should return database error", async () => {
      const data = salaries[0];
      const errorMessage = "Database error";
      const saveSpy = jest
        .spyOn(User, "findById")
        .mockRejectedValueOnce(new Error(errorMessage));
      const result = await addSalary(data);
      expect(saveSpy).toHaveBeenCalledWith(data.employee_id);
      expect(result.status).toBe(500);
      expect(result.message).toBe(errorMessage);
    })
  });

  describe("deleteSalary()", () => {
    it("should delete salary successfully", async () => {
      const id = salaries[0]._id;
      const saveSpy = jest
        .spyOn(Salary, "findByIdAndDelete")
        .mockResolvedValueOnce({})
      const result = await deleteSalary(id);
      expect(saveSpy).toHaveBeenCalledWith(id);
      expect(result.status).toBe(200);
      expect(result.message).toBe("Salary delete successfully")
    })

    it("should return Id not found", async () => {
      const id = "123";
      const saveSpy = jest
        .spyOn(Salary, "findByIdAndDelete")
        .mockResolvedValueOnce(null)
      const result = await deleteSalary(id);
      expect(saveSpy).toHaveBeenCalledWith(id);
      expect(result.message).toBe("Id not found");
      expect(result.status).toBe(404);
    })

    it("should return Database error", async () => {
      const errorMessage = "Database error";
      const saveSpy = jest
        .spyOn(Salary, "findByIdAndDelete")
        .mockRejectedValueOnce(new Error(errorMessage));
      const result = await deleteSalary();
      expect(result.status).toBe(500);
      expect(result.message).toBe(errorMessage);
    })
  })

  describe("updateSalary()", () => {
    it("should update salary successfully", async () => {
      const id = salaries[0]._id;
      const data = salaries[0];
      const updateData = { ...data, amount: 3000 };
      const updateSpy = jest
        .spyOn(Salary, "findByIdAndUpdate")
        .mockResolvedValueOnce(updateData);
      const user = { id: data.employee_id };
      const findUserSpy = jest
        .spyOn(User, "findById")
        .mockResolvedValueOnce(user);
    
      const result = await updateSalary(id, data);
    
      expect(updateSpy).toHaveBeenCalledWith(id, data, { new: true });
      expect(findUserSpy).toHaveBeenCalledWith(data.employee_id);
      expect(result.status).toBe(200);
      expect(result.message).toBe("Salary updated successfully");
      expect(result.data).toEqual(updateData);
    });

    it("should return id not found", async () => {
      const id = "123";
      const data = salaries[0];
      const updateSpy = jest
        .spyOn(Salary, "findByIdAndUpdate")
        .mockResolvedValueOnce(null);
      const userSpy = jest
        .spyOn(User, "findById")
        .mockResolvedValueOnce(null);
      const result = await updateSalary(id, data);
      expect(updateSpy).toHaveBeenCalledWith(id, data, {new: true})
      expect(userSpy).toHaveBeenCalledWith(data.employee_id)
      expect(result.status).toBe(404); 
      expect(result.message).toBe("Id not found"); 
    })

    it("should return Database error", async () => {
      const id = "123";
      const data = salaries[0];
      const errorMessage = "Database error"
      const updateSpy = jest
        .spyOn(Salary, "findByIdAndUpdate")
        .mockRejectedValueOnce(new Error(errorMessage));
      const result = await updateSalary(id, data);
      expect(updateSpy).toHaveBeenCalledWith(id, data, {new: true})
      expect(result.status).toBe(500); 
      expect(result.message).toBe(errorMessage); 
    })
  })
});
