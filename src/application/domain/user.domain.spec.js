const User = require("../../models/User");
const { users } = require("../../../tests/fixtures/users");
const {
  fetchUser,
  getUser,
  addUser,
  updateUser,
  deleteUser,
} = require("./user.domain");

describe("/home/irfiyanda/Documents/api-manajemen-karyawan/src/application/domain/user.domain.spec.js", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("fetchUser()", () => {
    it("should return all users", async () => {
      jest.spyOn(User, "find").mockResolvedValue(users);
      const response = await fetchUser();
      expect(response.data).toBe(users);
      expect(response.status).toBe(200);
    });

    it("should return database error", async() => {
        const errorMessage = "Database error";
        const find = jest
            .spyOn(User, "find")
            .mockRejectedValueOnce(new Error(errorMessage));
        const result = await fetchUser();
        expect(result.status).toBe(500);
        expect(result.message).toBe(errorMessage);
    })
  });

  describe("getUser()", () => {
    it("should return one user", async () => {
      jest.spyOn(User, "findById").mockResolvedValue(users[0]);
      const response = await getUser(users[0]._id);
      expect(response).toHaveProperty("data");
      expect(response.status).toBe(200);
      expect(response.data).toBe(users[0]);
    });

    it("should return User not found", async() => {
        const id = "613";
        const findById = jest
            .spyOn(User, "findById")
            .mockResolvedValueOnce(null);
        const result = await getUser(id);
        expect(findById).toHaveBeenCalledWith(id);
        expect(result.status).toBe(404);
        expect(result.message).toBe("User not found");
    })

    it("should return database error", async() => {
        const id = "713713";
        const errorMessage = "database error"
        const findById = jest
            .spyOn(User, "findById")
            .mockRejectedValueOnce(new Error(errorMessage))
        const result = await getUser(id);
        expect(findById).toHaveBeenCalledWith(id);
        expect(result.status).toBe(500);
        expect(result.message).toBe(errorMessage)
    })
    
  });

  describe("addUser()", () => {
    it("should add user successfully", async () => {
      const data = {
        _id: "6492e02969a5e7cff88b6b04",
        name: "John Doe",
        email: "johndoe@gmail.com",
        password: "password123",
      };
      const saveSpy = jest
        .spyOn(User.prototype, "save")
        .mockResolvedValueOnce(data);

      const result = await addUser(data);

      expect(result.status).toBe(201);
      expect(result.message).toBe("User added successfully");
      expect(result.data).toEqual(data);
      expect(saveSpy).toHaveBeenCalledWith({ new: true });

      saveSpy.mockRestore();
    });

    it("should return error message", async () => {
      const data = { name: "John Doe", email: "john@example.com" };
      const errorMessage = "Database error";
      const saveSpy = jest
        .spyOn(User.prototype, "save")
        .mockRejectedValueOnce(new Error(errorMessage));

      const result = await addUser(data);

      expect(result.status).toBe(500);
      expect(result.message).toBe(errorMessage);
      expect(saveSpy).toHaveBeenCalledWith({ new: true });

      saveSpy.mockRestore();
    });
  });

  describe("updateUser()", () => {
    afterEach(() => {
      jest.restoreAllMocks();
    });

    it("should update user successfully", async () => {
      const id = "456";
      const idUser = "456";
      const data = {
        email: "johndoe@gmail.com",
        password: "password123",
        role: "user",
        nik: "1234567890",
        name: "John Doe",
        birth: "01-01-1990",
        gender: "male",
        address: "Jl. Sudirman No. 1",
        phone: "081234567890",
        entry_date: "01-01-2021",
        image_profile: "profile.jpg",
      };
      const doc = { id, ...data };
      const findByIdAndUpdateSpy = jest
        .spyOn(User, "findByIdAndUpdate")
        .mockResolvedValueOnce(doc);

      const result = await updateUser(id, idUser, doc);

      expect(result.status).toBe(200);
      expect(result.message).toBe("User updated successfully");
      expect(result.data).toEqual(doc);
      expect(findByIdAndUpdateSpy).toHaveBeenCalledWith(id, doc, {
        new: true,
      });

      findByIdAndUpdateSpy.mockRestore();
    });

    it("should return access denied message", async () => {
      const id = "123";
      const idUser = "789";
      const data = {
        id: "456",
        email: "johndoe@gmail.com",
        password: "password123",
        role: "user",
        nik: "1234567890",
        name: "John Doe",
        birth: "01-01-1990",
        gender: "male",
        address: "Jl. Sudirman No. 1",
        phone: "081234567890",
        entry_date: "01-01-2021",
        image_profile: "profile.jpg",
      };

      const result = await updateUser(id, idUser, data);

      expect(result.status).toBe(403);
      expect(result.message).toBe("Access Denied, Only user can update.");
    });

    it("should return error message", async () => {
      const id = "456";
      const idUser = "456";
      const data = {
        id: "456",
        email: "johndoe@gmail.com",
        password: "password123",
        role: "user",
        nik: "1234567890",
        name: "John Doe",
        birth: "01-01-1990",
        gender: "male",
        address: "Jl. Sudirman No. 1",
        phone: "081234567890",
        entry_date: "01-01-2021",
        image_profile: "profile.jpg",
      };
      const errorMessage = "Database error";
      const findByIdAndUpdateSpy = jest
        .spyOn(User, "findByIdAndUpdate")
        .mockRejectedValueOnce(new Error(errorMessage));

      const result = await updateUser(id, idUser, data);

      expect(result.status).toBe(500);
      expect(result.message).toBe(errorMessage);
      expect(findByIdAndUpdateSpy).toHaveBeenCalledWith(
        id,
        expect.any(Object),
        { new: true }
      );
      findByIdAndUpdateSpy.mockRestore();
    });
  });

  describe('deleteUser()', () => {
    it("should delete user successfully", async () => {
      const id = "456";
  
      const findByIdAndDeleteSpy = jest.spyOn(User, "findByIdAndDelete").mockResolvedValueOnce({});  
      const result = await deleteUser(id);
      expect(findByIdAndDeleteSpy).toHaveBeenCalledWith(id);
      expect(result.status).toBe(200);
      expect(result.message).toBe("User delete successfully");
  
      findByIdAndDeleteSpy.mockRestore();
    });

    it("should return user not found", async() => {
        const id = "382";

        const findByIdAndDeleteSpy = jest
            .spyOn(User, "findByIdAndDelete")
            .mockResolvedValueOnce(null)
        const result = await deleteUser(id);
        expect(findByIdAndDeleteSpy).toHaveBeenCalledWith(id);
        expect(result.status).toBe(404);
        expect(result.message).toBe("User not found")
    })

    it("should return database error", async() => {
        const id = "613";
        const errorMessage = "Database error";
        const findByIdAndDeleteSpy = jest
            .spyOn(User, "findByIdAndDelete")
            .mockRejectedValueOnce(new Error(errorMessage));
        const result = await deleteUser(id);
        expect(findByIdAndDeleteSpy).toHaveBeenCalledWith(id);
        expect(result.status).toBe(500);
        expect(result.message).toBe(errorMessage);
    })
  });
  
});
