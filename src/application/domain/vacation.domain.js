const Vacation = require('../../models/Vacation');

async function fetchVacation() {
    try{
        const data = await Vacation.find({});
        return { status: 200, message: "Get Vacation successfully", data};
    } catch (err) {
        return {
            status: 500,
            message: err.message
        }
    }
}

async function getVacation(id) {
    try {
        const doc = await Vacation.findById(id);
        if (!doc) {
            return {
                status: 404,
                message: "Vacation not found"
            };
        }
        return {
            status: 200,
            message: "Get Vacation successfully",
            data: doc
        };
    } catch (err) {
        return {
            status: 500,
            message: err.message
        }
    }
}

async function destroyVacation(id){
    try {
        const doc = await Vacation.findByIdAndDelete(id);
        if (!doc) {
            return { status: 404, message: "Vacation not found"};
        }
        return { status: 200, message: "Vacation delete successfully"}
    } catch (err) {
        return {
            status: 500,
            message: err.message
        }
    }
}

async function addVacation(data) {
  try {
    const currentYear = new Date().getFullYear();
    const startOfYear = new Date(currentYear, 0, 1);
    const endOfYear = new Date(currentYear, 11, 31);

    const existingVacations = await Vacation.find({
      employee_id: data.employee_id,
      start_date: { $gte: startOfYear, $lte: endOfYear },
    });

    const totalDuration = existingVacations.reduce((total, vacation) => {
      return total + vacation.duration;
    }, 0);

    const remainingDays = 12 - totalDuration;

    if (data.duration > remainingDays) {
      return {
        status: 400,
        message: `You can only request a maximum of ${remainingDays} days of vacation.`,
      };
    }

    if (totalDuration + data.duration > 12) {
      return {
        status: 400,
        message: `You have reached the maximum limit of 12 days of vacation per year.`,
      };
    }

    const vacation = new Vacation(data);
vacation.remaining = remainingDays - data.duration;
const doc = await vacation.save();


    return {
      status: 201,
      message: "Vacation added successfully",
      data: doc,
    };
  } catch (err) {
    return {
      status: 500,
      message: err.message,
    };
  }
}   

async function updVacation(id, data){
        try {
          const currentYear = new Date().getFullYear();
          const startOfYear = new Date(currentYear, 0, 1);
          const endOfYear = new Date(currentYear, 11, 31);
      
          const existingVacations = await Vacation.find({
            employee_id: data.employee_id,
            start_date: { $gte: startOfYear, $lte: endOfYear },
          });
      
          const totalDuration = existingVacations.reduce((total, vacation) => {
            return total + vacation.duration;
          }, 0);
      
          const remainingDays = 12 - totalDuration;
      
          const targetVacation = await Vacation.findById(id);
      
          if (!targetVacation) {
            return {
              status: 404,
              message: "Vacation not found",
            };
          }
      
          const updatedDuration = data.duration - targetVacation.duration;
      
          if (updatedDuration > remainingDays) {
            return {
              status: 400,
              message: `You can only request a maximum of ${remainingDays} days of vacation.`,
            };
          }
      
          if (totalDuration + updatedDuration > 12) {
            return {
              status: 400,
              message: `You have reached the maximum limit of 12 days of vacation per year.`,
            };
          }
      
          targetVacation.start_date = data.start_date;
          targetVacation.end_date = data.end_date;
          targetVacation.description = data.description;
          targetVacation.status = data.status;
          targetVacation.type = data.type;
          targetVacation.duration = data.duration;
          targetVacation.remaining = remainingDays - updatedDuration;
      
          const updatedDoc = await targetVacation.save();
      
          return {
            status: 200,
            message: "Vacation updated successfully",
            data: updatedDoc,
          };
        } catch (err) {
          return {
            status: 500,
            message: err.message,
          };
        }
      }

  module.exports = {
    fetchVacation,
    getVacation,
    destroyVacation,
    addVacation,
    updVacation
  };