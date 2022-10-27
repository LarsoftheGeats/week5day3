//require('.dotenv').config()
const Sequelize = require('sequelize')
const user_id =3;

let nextEmp = 5
const {CONNECTION_STRING} = process.env

const sequelize = new Sequelize(CONNECTION_STRING, {
    dialect: 'postgres',
    dialectOptions: {
        ssl: {
            rejectUnauthorized: false
        }
    }
})

module.exports = {
    getUpcomingAppointments: (req, res) => {
        sequelize.query(`select a.appt_id, a.date, a.service_type, a.approved, a.completed, u.first_name, u.last_name 
        from cc_appointments a
        join cc_emp_appts ea on a.appt_id = ea.appt_id
        join cc_employees e on e.emp_id = ea.emp_id
        join cc_users u on e.user_id = u.user_id
        where a.approved = true and a.completed = false
        order by a.date desc;`)
            .then(dbRes => res.status(200).send(dbRes[0]))
            .catch(err => console.log(err))
    },

    approveAppointment: (req, res) => {
        let {apptId} = req.body
        //console.log(req.body)
    
        sequelize.query(`
        
        insert into cc_emp_appts (emp_id, appt_id)
        values (${nextEmp}, ${apptId}),
        (${nextEmp + 1}, ${apptId});
        UPDATE cc_appointments
            SET
                approved = true
            WHERE 
                appt_id = ${apptId};`)
            .then(dbRes => {
                res.status(200).send(dbRes[0])
                nextEmp += 2
            })
            .catch(err => console.log(err))
    },
    getAllClients: (req, res) => {
        sequelize.query(`
            SELECT * FROM cc_clients AS c
            JOIN cc_users AS u
            ON c.user_id = u.user_id
            WHERE u.user_id = ${user_id};`
        )
        .then ((dbRes) => {
            //console.log("got here")
            res.send(dbRes[0])

        })
        .catch((err) => {
            console.log(err)
            res.status(500).send('sequelize error')
        })

    },

    getPendingAppointments: (req, res) => {
        sequelize.query(`
            select * from cc_appointments a
            where a.approved = false 
            order by a.date desc;`)
        
        .then ((dbRes) => {
            //console.log("got here")
            //console.log(dbRes[0])
            //console.log('pending stuff')
            res.send(dbRes[0])

        })
        .catch((err) => {
            console.log(err)
            res.status(500).send('sequelize error')
        })

    },

    getPastAppointments: (req, res ) =>{
        sequelize.query(`select a.appt_id, a.date, a.service_type, a.notes, u.first_name, u.last_name 
        from cc_appointments a
        join cc_emp_appts ea on a.appt_id = ea.appt_id
        join cc_employees e on e.emp_id = ea.emp_id
        join cc_users u on e.user_id = u.user_id
        where a.approved = true and a.completed = true
        order by a.date desc;`)
        .then ((dbRes) => {
            //console.log("got here")
            res.send(dbRes[0])

        })
        .catch((err) => {
            console.log(err)
            res.status(500).send('sequelize error')
        })

    },
    completeAppointment: (req, res) => {
        console.log("got here")
        let {apptId} = req.body
        //console.log(req.body)
    
        sequelize.query(`
        UPDATE cc_appointments
            SET
                completed = true
            WHERE 
                appt_id = ${apptId};`)
            .then(dbRes => {
                console.log("got here")
                res.status(200).send(dbRes[0])
                nextEmp += 2
            })
            .catch(err => console.log(err))

    }
}
