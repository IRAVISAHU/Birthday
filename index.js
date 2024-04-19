let express = require('express')
let { Sequelize, DataTypes } = require('sequelize')
let App = express()
App.use(express.json())
let bodyParser = require('body-parser')
App.use(bodyParser.json())
let nodemailer = require('nodemailer')
const twilio = require('twilio');
const cron = require('node-cron');
//////////////////////////

let sequelize = new Sequelize(
    'Manage',
    'root',
    '',
    {
        host: 'localhost',
        dialect: 'mysql'
    }
)
////////////////////////////////////////////////


///////////////////////////////////////////
cron.schedule('*  * * 12 *', async () => {
    const today = new Date();
    const employees = await Employee.findAll({
        where: sequelize.where(sequelize.fn('MONTH', sequelize.col('dob')), today.getMonth() + 1)
    });

    employees.forEach(employee => {
        if (employee.dob.getDate() === today.getDate()) {
            transporter.sendMail({
                from: 'r8936033768@gmail.com', 
                to: employee.email,
                subject: 'Happy Birthday!',
                text: `Happy Birthday, ${employee.empname}! Have a fantastic day!`
            }, (error, info) => {
                if (error) {
                    console.error('Error sending birthday email:', error);
                } else {
                    console.log('Birthday email sent:', info.response);
                }
            });
            twilioClient.messages.create({
                body: `Happy Birthday, ${employee.empname}! Have a fantastic day!`,
                from: '+16592011602',
                to: employee.mobile_no
                
            })
            .then(message => console.log('Birthday message sent:', message.sid))
            .catch(error => console.error('Error sending birthday message:', error));
        }
    });
});


//////////////////////////////////////////////
const Employee = sequelize.define('Employee', {
    empid: {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    empname: {
        type: DataTypes.STRING,
        allowNull: false
    },
    city: {
        type: DataTypes.STRING,
        allowNull: false
    },
    dob: {
        type: DataTypes.DATE,
        allowNull: false

    },
    salary: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    mobile_no: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        primaryKey: true
    }
})
// Employee.sync()
sequelize.authenticate().then(() => {
    console.log("Database connected")

}).catch((err) => {
    console.log("error", err)
})
App.get("/view", async (req, res) => {
    try {
        let result = await Employee.findAll()
        res.send(result)
    }
    catch (err) {
        res.send(err)
    }
})

App.post("/posted", (req, res) => {
    let { empid, empname, city, dob, salary, mobile_no, email } = req.body
    console.log(req.body)
    Employee.create({ empid, empname, city, dob, salary, mobile_no, email }).then((result) => {
        res.send(result)
    }).catch((err) => { res.send(err) })

})
App.delete("/deleted", (req, res) => {
    let empid = req.query.empid
    console.log(empid)
    Employee.destroy({ where: { empid } }).then((result) => {
        res.send(result.json)
    }).catch((err) => { res.send(err) })

})
App.put("/updated", (req, res) => {
    let empid = req.query.empid
    let { empname, city, dob, salary, mobile_no, email } = req.body
    Employee.update({ empname, city, dob, salary, mobile_no, email }, { where: { empid } }).then((result) => {
        res.send(result.json)
    }).catch((err) => { res.send(err) })

})


////////////////////

App.listen(8000, () => {
    console.log('server is running');
   
})