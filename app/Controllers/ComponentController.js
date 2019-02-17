const dbConnection = require('../../database/mySQLconnect');
const dateFormat = require('dateformat');

function now() {
    return dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
}

let count = 0;

class ComponentController {
    constructor() {
        console.log('Constructor of ComponentController is called.');
    }

    async allGECoursesByComponent(ctx) {
	console.log('allGECoursesByCompoent');
        return new Promise((resolve, reject) => {
            const query = `
                       SELECT cb.term,
                               cb.subject,
                               cb.catalog,
                               cb.course_title, cb.department, cb.units, cc.section, cc.component
                        FROM 
                            course_base cb, course_components cc
                        WHERE 
	                    cb.ge_designation IS NOT NULL AND
                            cc.component = ? AND
                            cc.parent_class_number = cb.class_number
	                ORDER BY cb.course_title
                        `;
            dbConnection.query({
                sql: query,
                values: ctx.params.component
            }, (error, tuples) => {
                if (error) {
                    console.log("Connection error in ComponentController::allCourses", error);
                    ctx.body = [];
                    ctx.status = 200;
                    return reject(error);
                }
                ctx.body = tuples;
                ctx.status = 200;
                return resolve();
            });
        }).catch(err => console.log("Database connection error.", err));
    }

    async allGECoursesOpen(ctx) {
	console.log('allGECoursesOpen');
        return new Promise((resolve, reject) => {
            const query = `SELECT cb.term,                                                                                                                                                                    cb.subject,                                                                                                                                                                cb.catalog,                                                                                                                                                                cb.course_title, cb.class_number, cb.department, cb.units, cc.section, cc.component, ca.available_seats                                                             FROM                                                                                                                                                                           course_base cb, course_components cc, course_attributes ca                                                                                                             WHERE                                                                                                                                                                          cc.parent_class_number = cb.class_number AND                                                                                                                               cb.class_number = ca.class_number AND                                                                                                                                      ca.available_seats > 0                                                                                                                                                 ORDER BY cb.course_title, cb.class_number, cb.department                                                                                                                   LIMIT 10
                        `;

//	    const query = 'select * from course_attributes WHERE available_seats > 0 LIMIT 10';
            dbConnection.query( query, (error, tuples) => {
                if (error) {
                    console.log("Connection error in ComponentController::allCourses", error);
                    ctx.body = [];
                    ctx.status = 200;
                    return reject(error);
                }
		console.log('in allGECoursesOpen', tuples);
                ctx.body = tuples;
                ctx.status = 200;
                return resolve();
            });
	}).catch(err => console.log("Database connection error.", err));
    }

}

module.exports = ComponentController;
