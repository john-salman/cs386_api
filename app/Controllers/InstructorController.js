const dbConnection = require('../../database/mySQLconnect');

require('dotenv').config();

class InstructorController {
    async authorizeUser(ctx) {
        return new Promise((resolve, reject) => {
            const match = ctx.params.instructor_id.match(/[^0-9]+/);  // We expect an all digit user-id.
            if (match) {
                console.log('about to return because user input contains non-digit characters..');
                return reject("Incorrect instructor ID.");
            }
            let query = "SELECT * FROM course_instructors WHERE instructor_id = ?";
	    console.log('About to run this query.', query);
	    console.log('ctx.params.instructor_id is', ctx.params.instructor_id);
            dbConnection.query(
                {
                    sql: query,
                    values: [ctx.params.instructor_id]
                }, (error, tuples) => {
                    if (error) {
                        return reject(error);
                    }
                    if (tuples.length > 0) {
                        console.log('from InstructorController. About to return ', tuples[0]);
                        ctx.body = {
                            status: "OK",
                            instructor: tuples,
                        };
                        return resolve();
                    }
                    return reject("No such user.");
                }
            )
        }).catch(err => {
            ctx.body = {
                status: "Failed",
                error: err,
                user: null
            };
        });

    }

}

module.exports = InstructorController;
