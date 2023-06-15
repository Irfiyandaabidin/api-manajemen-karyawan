const User = require("../../src/models/User");
const bcrypt = require('bcryptjs');

const newUser = {
    email: "johndoe@admin.com",
    password: "password",
    role: "employee",
    nik: 123456,
    name: "John Doe",
    birth: "1990-01-01",
    gender: "male",
    address: "123 Main Street",
    phone: "123-456-7890",
    entry_date: "2021-01-01",
    image_profile: "profile.jpg",
};

async function insertManyUsers() {
    await User.insertMany(newUser)
}

async function insertHrUser() {
    const hr = await new User({
      email: 'hr@example.com',
      password: 'password123',
      role: 'hr',
      name: 'John Doe',
      nik: 123456,
      birth: '1990-01-01',
      gender: 'male',
      address: '123 Main St, Anytown USA',
      phone: '555-1234',
    })
    const salt = await bcrypt.genSalt(10);
    hr.password = await bcrypt.hash(hr.password, salt);
    hr.save();
}

async function insertEmployeeUser() {
  const employee = await new User({
    email: 'employee@example.com',
    password: 'password123',
    role: 'employee',
    name: 'Bob Johnson',
    nik: 345678,
    birth: '1995-12-31',
    gender: 'male',
    address: '789 Oak St, Anytown USA',
    phone: '555-9012',
  })
  const salt = await bcrypt.genSalt(10);
  employee.password = await bcrypt.hash(employee.password, salt);
  employee.save();
}

async function insertSupervisorUser() {
  const supervisor = await new User({
    email: 'supervisor@example.com',
    password: 'password123',
    role: 'supervisor',
    name: 'Jane Smith',
    nik: 234567,
    birth: '1985-05-05',
    gender: 'female',
    address: '456 Elm St, Anytown USA',
    phone: '555-5678',
  })
  const salt = await bcrypt.genSalt(10);
  supervisor.password = await bcrypt.hash(supervisor.password, salt);
  supervisor.save();
}

async function deleteManyUsers() {
    await User.deleteMany({})
}

module.exports = {
    newUser,
    insertManyUsers,
    deleteManyUsers,
    insertHrUser,
    insertEmployeeUser,
    insertSupervisorUser
}