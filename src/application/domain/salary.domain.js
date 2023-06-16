const Salary = require('../../models/Salary');
const User = require('../../models/User');
const nodemailer = require("nodemailer");
require('dotenv').config()

const EMAIL = process.env.EMAIL
const PASSWORD = process.env.PASSWORD

const transporterEmail = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: EMAIL,
    pass: PASSWORD
  }
})

async function addSalary(data) {
    const salary = new Salary(data);
    const user = await User.findById(data.employee_id);
    const userEmail = user.email;
    const doc = await salary.save({ new: true });
    const mailOptions = {
      from: EMAIL,
      to: userEmail,
      cc: userEmail,
      subject: 'Sallary Paid',
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
      `
    }
    if(data.payment_status === "paid"){
      transporterEmail.sendMail(mailOptions, function(err, info){
        if (err) {
          throw err;
        } else {
          console.log('Email berhasil dikirim ' + info.response);
        }
      })
    }
    return {
        status: 201,
        message: "Salary added successfully",
        data: doc
    }
}

module.exports = {
    addSalary
}