const User = require("../../models/User");

async function fetchUser() {
  try {
    const data = await User.find({});
    return { status: 200, message: "Get User successfully", data };
  } catch (err) {
    return {
      status: 500,
      message: err.message
    }
  }
}

async function getUser(id) {
  try {
    const doc = await User.findById(id);
    if (!doc) {
      return {
          status: 404,
          message: "User not found"
        };
    }
    return {
      status: 200,
      message: "Get User successfully",
      data: doc
    };
  } catch (err) {
    return {
      status: 500,
      message: err.message
    }
  }
}

async function deleteUser(id){
  try {
    const doc = await User.findByIdAndDelete(id);
    if (!doc) {
      return { status: 404, message: "User not found" };
    }
    return { status: 200, message: "User delete successfully" }
  } catch (err) {
    return {
      status: 500,
      message: err.message
    }
  }
}

async function addUser(data){
  try{
    const user = new User(data);
    const doc = await user.save({ new: true });
    return {
      status: 201,
      message: "User added successfully",
      data: doc,
    };
  } catch (err){
    return {
      status: 500,
      message: err.message
    };
  }
}

async function updateUser(id, idUser, data){
    try {
        if (idUser === id) {
          const doc = await User.findByIdAndUpdate(id, data, { new: true });
    
          return {
            status: 200,
            message: "User updated successfully",
            data: doc,
          };
        }
        return {
            status: 403,
            message: "Access Denied, Only user can update.",
        };
      } catch (err) {
        return{ status:500, message: err.message };
      }
}

module.exports = {
  fetchUser,
  getUser,
  deleteUser,
  addUser,
  updateUser
};
