const Salary = require("../../models/Salary");
const User = require("../../models/User");
const nodemailer = require("nodemailer");
require("dotenv").config();

const EMAIL = process.env.EMAIL;
const PASSWORD = process.env.PASSWORD;

const transporterEmail = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: EMAIL,
    pass: PASSWORD,
  },
});

const sendEmail = async (user, data) => {
  const userEmail = user.email;
  const mailOptions = {
    from: EMAIL,
    to: userEmail,
    cc: userEmail,
    subject: "Sallary Paid",
    text: `
    Dear ${user.name},

    Kami informasikan bahwa gaji Anda untuk bulan ${data.month} telah kami transfer ke rekening bank yang terdaftar pada sistem kami. Silakan cek rekening bank Anda untuk memastikan bahwa dana sudah masuk.
    
    Berikut adalah rincian gaji Anda untuk bulan ${data.month}:
    - Gaji Pokok: ${data.basic_salary}
    - Tunjangan: ${data.allowance}
    - Potongan: ${data.deduction}
    - Total Gaji: ${data.total_salary}
    
    Jika ada pertanyaan atau masalah terkait gaji Anda, silakan hubungi tim HR kami.
    
    Terima kasih atas kerja keras dan dedikasi Anda.
    
    Salam,
    HR Perusahaan
    `,
  };
  if (data.payment_status === "paid") {
    transporterEmail.sendMail(mailOptions, function (err, info) {
      if (err) {
        throw err;
      } else {
        console.log("Email berhasil dikirim " + info.response);
      }
    });
  }
}

async function fetchSalary() {
  try {
    const doc = await Salary.find();
    return {
      status: 200,
      message: "Get salary successfully",
      data: doc,
    };
  } catch (err) {
    return {
      status: 500,
      message: err.message,
    };
  }
}

async function getSalary(id) {
  try {
    const doc = await Salary.findById(id);
    if (!doc) {
      return {
        status: 404,
        message: "Id not found",
      };
    }
    return {
      status: 200,
      message: "Get salary successfully",
      data: doc,
    };
  } catch (err) {
    return { status: 500, message: err.message };
  }
}

async function addSalary(data) {
  try {
    const user = await User.findById(data.employee_id);
    if (user) {
      const salary = new Salary(data);
      const doc = await salary.save({ new: true });
      sendEmail(user,data)
      return {
        status: 201,
        message: "Salary added successfully",
        data: doc,
      };
    } return {
      status: 404,
      message: "Id employee not found"
    }
  } catch (err) {
    return {
      status: 500,
      message: err.message,
    };
  }
}

async function deleteSalary(id) {
  try {
    const doc = await Salary.findByIdAndDelete(id);
    if (!doc) {
      return {
        status: 404,
        message: "Id not found",
      };
    }
    return {
      status: 200,
      message: "Salary delete successfully",
    };
  } catch (err) {
    return {
      status: 500,
      message: err.message,
    };
  }
}

async function updateSalary(id, data) {
  try {
    const doc = await Salary.findByIdAndUpdate(id, data, { new: true });
    const user = await User.findById(data.employee_id);
    if(user){
      sendEmail(user, data)
    }
    if (doc) {
      return {
        status: 200,
        message: "Salary updated successfully",
        data: doc,
      };
    }
    return {
      status: 404,
      message: "Id not found",
    };
  } catch (err) {
    return {
      status: 500,
      message: err.message,
    };
  }
}
module.exports = {
  addSalary,
  fetchSalary,
  getSalary,
  deleteSalary,
  updateSalary,
};
