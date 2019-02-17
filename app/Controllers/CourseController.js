const dbConnection = require('../../database/mySQLconnect');
const dateFormat = require('dateformat');

function now() {
    return dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
}

let count = 0;

class CourseController {
    constructor() {
        console.log('Constructor of CourseController is called.');
    }

    async allCourses(ctx) {
	return new Promise((resolve, reject) => {
	    const query = `SELECT * FROM course_base LIMIT 10`;
	    dbConnection.query({sql: query}, (error, tuples) => {
		if (error) {
		    console.log("Connection error in CourseController::allCourses: ", error);
		    ctx.body =[];
		    ctx.status = 200;
		    return reject(error);
		}
		ctx.body = tuples;
		ctx.status = 200;
		return resolve();
	    });
	}).catch(err => console.log("Database connection error.", err));
    }

    async coursesByTerm(ctx) {
	return new Promise((resolve, reject) => {
	    const query = `SELECT * FROM course_base WHERE term = ? LIMIT 10`;
	    dbConnection.query({
		sql: query,
		values: [ctx.params.term]
	    }, (error, tuples) => {
		if (error) {
		    console.log("Connection error in CourseController::coursesByTerm: ${error}");
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

    async coursesByTermDepartment(ctx) {
	console.log('Entry in coursesByTermDepartment');
	return new Promise((resolve,reject) => {
	    const query = `SELECT * FROM course_base WHERE term = ? AND subject = ? LIMIT 10`;
	    dbConnection.query({
		sql: query,
		values: [ctx.params.term, ctx.params['department']]
	    }, (error, tuples) => {
		if (error) {
		    console.log("Connection Error in CourseController::coursesByTermSubject: ${error}");
		    ctx.body = [];
		    ctx.status = 200;
		    return reject(error);
		}
		ctx.body = tuples;
		console.log("test:", tuples);
		ctx.status = 200;
		return resolve();
	    });
	}).catch(err => console.log("Database connection error: ", err));
    }

    async coursesByTermDepartmentCatalog(ctx) {
	return new Promise((resolve, reject) => {
	    const query = `SELECT * FROM course_base WHERE term = ? AND subject = ? AND catalog = ? LIMIT 10`;
	    dbConnection.query({
		sql: query,
		values: [ctx.params.term, ctx.params['department'], ctx.params.catalog]
	    }, (error, tuples) => {
		if (error) {
		    console.log(`Connection Error in CourseController::coursesByTermSubjectCatalog: ${error}`);
		    ctx.body = [];
		    ctx.status = 200;
		    return reject(error);
		}
		ctx.body = tuples;
		ctx.status = 200;
		return resolve();
	    });
	}).catch(err => console.log(`Database Connection error: ${err}`));
    }

    async allGECoursesForTerm(ctx) {
        return new Promise((resolve, reject) => {
            const query = `
                       SELECT cb.term             term,
                               cb.subject          subject,
                               cb.catalog          catalog,
                               cb.course_title     course_title,
	                       cb.department       department,
                               cb.units
                        FROM 
                            course_base cb
                        WHERE 
	                    cb.ge_designation IS NOT NULL AND
                            cb.term = ? 
	                ORDER BY cb.term, cb.subject, cb.catalog, cb.units
                        `;
            dbConnection.query({
                sql: query,
                values: [ctx.params.term, ctx.params.subject]
            }, (error, tuples) => {
                if (error) {
                    console.log("Connection error in CourseController::allCourses", error);
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

}

module.exports = CourseController
