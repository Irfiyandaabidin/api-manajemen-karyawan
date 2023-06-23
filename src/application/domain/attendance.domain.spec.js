const Attendance = require("../../models/Attendance");
const { attendances } = require("../../../tests/fixtures/attendances");
const {
  fetchAttendance,
  getAttendance,
  getAttendanceByUser,
  addAttendance,
  updateAttendance,
  deleteAttendance,
} = require("./attendance.domain");
const moment = require("moment");

describe("/home/irfiyanda/Documents/api-manajemen-karyawan/src/application/domain/attendance.domain.spec.js", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("fetchAttendance()", () => {
    it("should return all attendances", async () => {
      jest.spyOn(Attendance, "find").mockResolvedValue(attendances);
      const response = await fetchAttendance();
      expect(response.data).toBe(attendances);
      expect(response.status).toBe(200);
    });
    it("should return database error", async () => {
      const errorMessage = "Database error";
      jest
        .spyOn(Attendance, "find")
        .mockRejectedValueOnce(new Error(errorMessage));
      const response = await fetchAttendance();
      expect(response.status).toBe(500);
      expect(response.message).toBe(errorMessage);
    });
  });

  describe("getAttendance()", () => {
    it("should return one Attendance", async () => {
      const id = attendances[0]._id;
      const findById = jest
        .spyOn(Attendance, "findById")
        .mockResolvedValue(attendances[0]);
      const response = await getAttendance(id);
      expect(findById).toHaveBeenCalledWith(id);
      expect(response).toHaveProperty("data");
      expect(response.status).toBe(200);
      expect(response.message).toBe("Get attendance successfully");
      expect(response.data).toBe(attendances[0]);
    });
    it("should return attendance not found", async () => {
      const id = "123";
      const findById = jest
        .spyOn(Attendance, "findById")
        .mockResolvedValue(null);
      const response = await getAttendance(id);
      expect(findById).toHaveBeenCalledWith(id);
      expect(response.status).toBe(404);
      expect(response.message).toBe("Id not found");
    });
    it("should return database error", async () => {
      const errorMessage = "Database error";
      const findById = jest
        .spyOn(Attendance, "findById")
        .mockRejectedValueOnce(new Error(errorMessage));
      const response = await getAttendance();
      expect(response.status).toBe(500);
      expect(response.message).toBe(errorMessage);
    });
  });

  describe("addAttendance()", () => {
    it("should add Attendance successfully", async () => {
      const data = attendances[0];
      const saveSpy = jest
        .spyOn(Attendance.prototype, "save")
        .mockResolvedValueOnce(data);
      const findSpy = jest
        .spyOn(Attendance, "findOne")
        .mockResolvedValueOnce(null);
      const result = await addAttendance(data);
      expect(saveSpy).toHaveBeenCalledWith({ new: true });
      expect(result.status).toBe(201);
      expect(result.message).toBe("Attendance added successfully");
      expect(result.data).toEqual(data);
    });

    it("should return you have already checked in today", async () => {
      const data = attendances[0];
      const employee_id = data.employee_id;
      const date = moment().format("YYYY-MM-DD");
      const findSpy = jest
        .spyOn(Attendance, "findOne")
        .mockResolvedValueOnce(data);
      const result = await addAttendance(data);
      expect(findSpy).toHaveBeenCalledWith({ employee_id, date });
      expect(result.status).toBe(400);
      expect(result.message).toBe("You have already checked in today");
    });

    it("should return database error", async () => {
      const data = attendances[0];
      const errorMessage = "Database error";
      const saveSpy = jest
        .spyOn(Attendance.prototype, "save")
        .mockRejectedValueOnce(new Error(errorMessage));
      const findSpy = jest
        .spyOn(Attendance, "findOne")
        .mockResolvedValueOnce(null);
      const result = await addAttendance(data);
      expect(saveSpy).toHaveBeenCalledWith({ new: true });
      expect(result.status).toBe(500);
      expect(result.message).toBe(errorMessage);
    });
  });

  describe("deleteAttendance()", () => {
    it("should delete Attendance successfully", async () => {
      const id = attendances[0]._id;
      const saveSpy = jest
        .spyOn(Attendance, "findByIdAndDelete")
        .mockResolvedValueOnce({});
      const result = await deleteAttendance(id);
      expect(saveSpy).toHaveBeenCalledWith(id);
      expect(result.status).toBe(200);
      expect(result.message).toBe("Attendance delete successfully");
    });

    it("should return Id not found", async () => {
      const id = "123";
      const saveSpy = jest
        .spyOn(Attendance, "findByIdAndDelete")
        .mockResolvedValueOnce(null);
      const result = await deleteAttendance(id);
      expect(saveSpy).toHaveBeenCalledWith(id);
      expect(result.message).toBe("Id not found");
      expect(result.status).toBe(404);
    });

    it("should return Database error", async () => {
      const errorMessage = "Database error";
      const saveSpy = jest
        .spyOn(Attendance, "findByIdAndDelete")
        .mockRejectedValueOnce(new Error(errorMessage));
      const result = await deleteAttendance();
      expect(result.status).toBe(500);
      expect(result.message).toBe(errorMessage);
    });
  });

  describe("updateAttendance()", () => {
    it("should update Attendance successfully", async () => {
      const id = attendances[0]._id;
      const data = attendances[0];
      const date = moment().format("YYYY-MM-DD");
      const time_out =  moment().format('h:mm:ss')
      const dataUpdate = { 
        date : attendances[0].date,
        employee_id : attendances[0].employee_id,
        status: attendances[0].status,
        time_in: attendances[0].time_in,
        time_out 
       }
      const employee_id = data.employee_id;
      const findUserSpy = jest
        .spyOn(Attendance, "findOne")
        .mockResolvedValueOnce(data);
      const updateSpy = jest
        .spyOn(Attendance, "findOneAndUpdate")
        .mockResolvedValueOnce(dataUpdate);

      const result = await updateAttendance(id);

      expect(findUserSpy).toHaveBeenCalledWith({employee_id, date});
      expect(updateSpy).toHaveBeenCalledWith(id, dataUpdate, { new: true });
      expect(result.status).toBe(200);
      expect(result.message).toBe("Attendance updated successfully");
      expect(result.data).toEqual(dataUpdate);
    });

    it("should return employee has not clocked in", async () => {
      const data = attendances[0];
      const date = moment().format("YYYY-MM-DD");
      const employee_id = data.employee_id;
      const findSpy = jest
        .spyOn(Attendance, "findOne")
        .mockResolvedValueOnce(null);
      const result = await updateAttendance(employee_id);
      expect(findSpy).toHaveBeenCalledWith({employee_id, date});
      expect(result.status).toBe(400);
      expect(result.message).toBe("Employee has not clocked in");
    });

    it("should return Database error", async () => {
      const data = attendances[0];
      const employee_id = data.employee_id;
      const date = moment().format("YYYY-MM-DD");
      const errorMessage = "Database error";
      const updateSpy = jest
        .spyOn(Attendance, "findOne")
        .mockRejectedValueOnce(new Error(errorMessage));
      const result = await updateAttendance(employee_id, data);
      expect(updateSpy).toHaveBeenCalledWith({employee_id, date});
      expect(result.status).toBe(500);
      expect(result.message).toBe(errorMessage);
    });
  });
});
