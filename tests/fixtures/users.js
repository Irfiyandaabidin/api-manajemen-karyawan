const User = require("../../src/models/User");
const bcrypt = require("bcryptjs");

const newUser = {
email: "janedoe@admin.com",
password: "password",
role: "employee",
nik: 1234567890123456,
name: "Jane Doe",
birth: "1992-05-10",
gender: "female",
address: "456 Oak Avenue",
phone: "987-654-3210",
entry_date: "2021-02-01",
image_profile: "profile2.jpg",
}

const users = [
  {
    _id: "12ab34cd56ef7890fe1d2c3b",
    email: "bobsmith@admin.com",
    password: "password",
    role: "employee",
    nik: 2345678901234567,
    name: "Bob Smith",
    birth: "1985-12-25",
    gender: "male",
    address: "789 Elm Street",
    phone: "456-789-1230",
    entry_date: "2021-03-01",
    image_profile: "profile3.jpg"
  },
  {
    _id: "f00dcafebadb002a5e7f1c3d",
    email: "sarahjones@admin.com",
    password: "password",
    role: "employee",
    nik: 3456789012345678,
    name: "Sarah Jones",
    birth: "1994-09-15",
    gender: "female",
    address: "321 Maple Road",
    phone: "789-123-4560",
    entry_date: "2021-04-01",
    image_profile: "profile4.jpg",
  },
  {
    _id: "1a2b3c4d5e6f7a8b9c0d1e2f",
    email: "michaeljohnson@admin.com",
    password: "password",
    role: "employee",
    nik: 4567890123456789,
    name: "Michael Johnson",
    birth: "1991-07-20",
    gender: "male",
    address: "567 Pine Street",
    phone: "321-654-9870",
    entry_date: "2021-05-01",
    image_profile: "profile5.jpg",
  },
  {
    _id: "deadc0dedeadc0dedeadc0de",
    email: "emilywilson@admin.com",
    password: "password",
    role: "employee",
    nik: 5678901234567890,
    name: "Emily Wilson",
    birth: "1988-03-05",
    gender: "female",
    address: "234 Cedar Lane",
    phone: "654-321-7890",
    entry_date: "2021-06-01",
    image_profile: "profile6.jpg",
  }
];

async function insertManyUsers() {
  const salt = await bcrypt.genSalt(10);
  for(const user of users){
    user.password = await bcrypt.hash(user.password, salt); 
  }
  return await User.insertMany(users);
}

async function insertHrUser() {
  const hr = await new User({
    email: "hr@example.com",
    password: "password123",
    role: "hr",
    name: "John Doe",
    nik: 1234567371747284,
    birth: "1990-01-01",
    gender: "male",
    address: "123 Main St, Anytown USA",
    phone: "555-1234",
  });
  const salt = await bcrypt.genSalt(10);
  hr.password = await bcrypt.hash(hr.password, salt);
  hr.save();
}

async function insertEmployeeUser() {
  const employee = await new User({
    email: "employee@example.com",
    password: "password123",
    role: "employee",
    name: "Bob Johnson",
    nik: 3456788492857396,
    birth: "1995-12-31",
    gender: "male",
    address: "789 Oak St, Anytown USA",
    phone: "555-9012",
  });
  const salt = await bcrypt.genSalt(10);
  employee.password = await bcrypt.hash(employee.password, salt);
  employee.save();
}

async function insertSupervisorUser() {
  const supervisor = await new User({
    email: "supervisor@example.com",
    password: "password123",
    role: "supervisor",
    name: "Jane Smith",
    nik: 2345678472947365,
    birth: "1985-05-05",
    gender: "female",
    address: "456 Elm St, Anytown USA",
    phone: "555-5678",
  });
  const salt = await bcrypt.genSalt(10);
  supervisor.password = await bcrypt.hash(supervisor.password, salt);
  supervisor.save();
}

async function deleteManyUsers() {
  await User.deleteMany({});
}

module.exports = {
  users,
  newUser,
  insertManyUsers,
  deleteManyUsers,
  insertHrUser,
  insertEmployeeUser,
  insertSupervisorUser,
};
