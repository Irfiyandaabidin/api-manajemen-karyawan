const Vacation = require('../../models/Vacation');
const {
  fetchVacation,
  getVacation,
  destroyVacation,
  addVacation,
  updVacation
} = require('./vacation.domain');

// Mocking the Vacation model
jest.mock('../../models/Vacation');

describe('Vacation Functions', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('fetchVacation', () => {
    it('should fetch vacations successfully', async () => {
      const mockData = [
        { id: 1, name: 'Vacation 1' },
        { id: 2, name: 'Vacation 2' },
      ];
      Vacation.find.mockResolvedValue(mockData);

      const result = await fetchVacation();

      expect(Vacation.find).toHaveBeenCalled();
      expect(result.status).toBe(200);
      expect(result.message).toBe('Get Vacation successfully');
      expect(result.data).toEqual(mockData);
    });

    it('should handle error while fetching vacations', async () => {
      const errorMessage = 'Error fetching vacations';
      Vacation.find.mockRejectedValue(new Error(errorMessage));

      const result = await fetchVacation();

      expect(Vacation.find).toHaveBeenCalled();
      expect(result.status).toBe(500);
      expect(result.message).toBe(errorMessage);
    });
  });

  describe('getVacation', () => {
    it('should get a vacation successfully', async () => {
      const mockId = '123';
      const mockDoc = { id: mockId, name: 'Vacation 1' };
      Vacation.findById.mockResolvedValue(mockDoc);

      const result = await getVacation(mockId);

      expect(Vacation.findById).toHaveBeenCalledWith(mockId);
      expect(result.status).toBe(200);
      expect(result.message).toBe('Get Vacation successfully');
      expect(result.data).toEqual(mockDoc);
    });

    it('should handle vacation not found', async () => {
      const mockId = '123';
      Vacation.findById.mockResolvedValue(null);

      const result = await getVacation(mockId);

      expect(Vacation.findById).toHaveBeenCalledWith(mockId);
      expect(result.status).toBe(404);
      expect(result.message).toBe('Vacation not found');
    });

    it('should handle error while getting a vacation', async () => {
      const mockId = '123';
      const errorMessage = 'Error getting a vacation';
      Vacation.findById.mockRejectedValue(new Error(errorMessage));

      const result = await getVacation(mockId);

      expect(Vacation.findById).toHaveBeenCalledWith(mockId);
      expect(result.status).toBe(500);
      expect(result.message).toBe(errorMessage);
    });
  });

  describe('destroyVacation', () => {
    it('should destroy a vacation successfully', async () => {
      const mockId = '123';
      const mockDoc = { id: mockId, name: 'Vacation 1' };
      Vacation.findByIdAndDelete.mockResolvedValue(mockDoc);

      const result = await destroyVacation(mockId);

      expect(Vacation.findByIdAndDelete).toHaveBeenCalledWith(mockId);
      expect(result.status).toBe(200);
      expect(result.message).toBe('Vacation delete successfully');
    });

    it('should handle vacation not found during deletion', async () => {
      const mockId = '123';
      Vacation.findByIdAndDelete.mockResolvedValue(null);

      const result = await destroyVacation(mockId);

      expect(Vacation.findByIdAndDelete).toHaveBeenCalledWith(mockId);
      expect(result.status).toBe(404);
      expect(result.message).toBe('Vacation not found');
    });

    it('should handle error while destroying a vacation', async () => {
      const mockId = '123';
      const errorMessage = 'Error destroying a vacation';
      Vacation.findByIdAndDelete.mockRejectedValue(new Error(errorMessage));

      const result = await destroyVacation(mockId);

      expect(Vacation.findByIdAndDelete).toHaveBeenCalledWith(mockId);
      expect(result.status).toBe(500);
      expect(result.message).toBe(errorMessage);
    });
  });

  describe('addVacation', () => {
    it('should add a vacation successfully', async () => {
      const mockData = {
        employee_id: '123',
        start_date: new Date(),
        end_date: new Date(),
        description: 'Vacation description',
        status: 'Pending',
        type: 'Paid',
        duration: 5,
      };
      const mockExistingVacations = [
        { id: '1', duration: 3 },
        { id: '2', duration: 2 },
      ];
      const mockSavedVacation = { id: '3', ...mockData };
      Vacation.find.mockResolvedValue(mockExistingVacations);
      Vacation.prototype.save.mockResolvedValue(mockSavedVacation);

      const result = await addVacation(mockData);

      expect(Vacation.find).toHaveBeenCalled();
      expect(Vacation.prototype.save).toHaveBeenCalled();
      expect(result.status).toBe(201);
      expect(result.message).toBe('Vacation added successfully');
      expect(result.data).toEqual(mockSavedVacation);
    });

    it('should handle requesting more than remaining vacation days', async () => {
      const mockData = {
        employee_id: '123',
        start_date: new Date(),
        end_date: new Date(),
        description: 'Vacation description',
        status: 'Pending',
        type: 'Paid',
        duration: 10,
      };
      const mockExistingVacations = [
        { id: '1', duration: 3 },
        { id: '2', duration: 2 },
      ];
      Vacation.find.mockResolvedValue(mockExistingVacations);

      const result = await addVacation(mockData);

      expect(Vacation.find).toHaveBeenCalled();
      expect(result.status).toBe(400);
      expect(result.message).toContain('You can only request a maximum of');
    });

    it('should handle exceeding the maximum limit of vacation days per year', async () => {
      const mockData = {
        employee_id: '123',
        start_date: new Date(),
        end_date: new Date(),
        description: 'Vacation description',
        status: 'Pending',
        type: 'Paid',
        duration: 10,
      };
      const mockExistingVacations = [
        { id: '1', duration: 3 },
        { id: '2', duration: 8 },
      ];
      Vacation.find.mockResolvedValue(mockExistingVacations);

      const result = await addVacation(mockData);

      expect(Vacation.find).toHaveBeenCalled();
      expect(result.status).toBe(400);
      expect(result.message).toContain('You can only request a maximum of');
    });

    it('should handle error while adding a vacation', async () => {
      const mockData = {
        employee_id: '123',
        start_date: new Date(),
        end_date: new Date(),
        description: 'Vacation description',
        status: 'Pending',
        type: 'Paid',
        duration: 5,
      };
      const errorMessage = 'Error adding a vacation';
      Vacation.find.mockRejectedValue(new Error(errorMessage));

      const result = await addVacation(mockData);

      expect(Vacation.find).toHaveBeenCalled();
      expect(result.status).toBe(500);
      expect(result.message).toBe(errorMessage);
    });
  });

describe('updVacation', () => {
  it('should update the vacation and return a success message', async () => {
    const mockId = '123';
    const mockData = {
      employee_id: '123',
      start_date: new Date(),
      end_date: new Date(),
      description: 'Vacation description',
      status: 'Pending',
      type: 'Paid',
      duration: 5,
    };
    const mockCurrentYear = new Date().getFullYear();
    const mockStartOfYear = new Date(mockCurrentYear, 0, 1);
    const mockEndOfYear = new Date(mockCurrentYear, 11, 31);
    const mockExistingVacations = [
      { id: '1', duration: 3 },
      { id: '2', duration: 2 },
    ];
    const mockUpdatedVacation = {
      id: mockId,
      ...mockData,
    };
    const mockRemainingDays = 12 - mockExistingVacations.reduce(
      (total, vacation) => total + vacation.duration,
      0
    );
    const mockTargetVacation = new Vacation({
      id: mockId,
      ...mockUpdatedVacation,
    });
    Vacation.find.mockResolvedValue(mockExistingVacations);
    Vacation.findById.mockResolvedValue(mockTargetVacation);
    const saveSpy = jest.spyOn(mockTargetVacation, 'save');
  
    const result = await updVacation(mockId, mockData);
  
    expect(Vacation.find).toHaveBeenCalledWith({
      employee_id: mockData.employee_id,
      start_date: { $gte: mockStartOfYear, $lte: mockEndOfYear },
    });
    expect(Vacation.findById).toHaveBeenCalledWith(mockId);
    expect(saveSpy).toHaveBeenCalled();
    expect(result.status).toBe(200);
    expect(result.message).toBe('Vacation updated successfully');
  });
  
  

  it('should handle vacation not found during update', async () => {
    const mockId = '123';
    const mockData = {
      employee_id: '123',
      start_date: new Date(),
      end_date: new Date(),
      description: 'Vacation description',
      status: 'Approved',
      type: 'Paid',
      duration: 7,
    };
    const mockCurrentYear = new Date().getFullYear();
    const mockStartOfYear = new Date(mockCurrentYear, 0, 1);
    const mockEndOfYear = new Date(mockCurrentYear, 11, 31);
    const mockExistingVacations = [
      { id: '1', duration: 3 },
      { id: '2', duration: 2 },
    ];
    Vacation.find.mockResolvedValue(mockExistingVacations);
    Vacation.findById.mockResolvedValue(null);

    const result = await updVacation(mockId, mockData);

    expect(Vacation.find).toHaveBeenCalledWith({
      employee_id: mockData.employee_id,
      start_date: { $gte: mockStartOfYear, $lte: mockEndOfYear },
    });
    expect(Vacation.findById).toHaveBeenCalledWith(mockId);
    expect(result.status).toBe(404);
    expect(result.message).toBe('Vacation not found');
  });

  it('should handle error while updating a vacation', async () => {
    const mockId = '123';
    const mockData = {
      employee_id: '123',
      start_date: new Date(),
      end_date: new Date(),
      description: 'Vacation description',
      status: 'Approved',
      type: 'Paid',
      duration: 7,
    };
    const errorMessage = 'Error updating a vacation';
    Vacation.find.mockRejectedValue(new Error(errorMessage));

    const result = await updVacation(mockId, mockData);

    expect(Vacation.find).toHaveBeenCalled();
    expect(result.status).toBe(500);
    expect(result.message).toBe(errorMessage);
  });
});

})  
