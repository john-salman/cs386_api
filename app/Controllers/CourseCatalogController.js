
const dbConnection = require('../../database/mySQLconnect');

class CourseCatalogController    {
    constructor() {
        console.log('constructor of CourseCatalogController.');
    }

    async courseDescriptionsAllCourses(ctx) {

        return new Promise((resolve, reject) => {
            let query = `SELECT * FROM course_catalog LIMIT 20`;
            dbConnection.query(query, (error, tuples, fields) => {
                if (error) {
                    return reject(`Connection error in CourseCatalogController::courseDescriptionsAllCourses ${error}`);
                }
                ctx.body = tuples;
                console.log('courseDescriptionsAllCourses: returning', tuples.length, 'course descriptions.');
                ctx.status = 200;
                return resolve();
            });
        }).catch(err => {
            console.log("Database connection error.", err);
            ctx.status = 500,
            ctx.body = err
        });
    }


    async courseDescriptionsForSubject(ctx) {
        return new Promise((resolve, reject) => {
            console.log()
            const subject = ctx.params.subject;
            let query = `SELECT * FROM course_catalog WHERE subject = ?`;
            console.log(query);
            dbConnection.query({
                sql: query,
                values: [subject]
            }, (error, tuples) => {
                if (error) {
                    return reject(`Error when trying to retrieve course descriptions for ${subject} --- 
                                    in courseDescriptionsForSubject. The error msg: ${error}`);
                }
                ctx.body = tuples;
                ctx.status = 200;
                return resolve();
            })
        }).catch(err => {
            console.log(`Error in courseDescriptionsForSubject for subject ${subject}: ${err}`);
            ctx.body = {error: err};
            ctx.status = "Failed";
        });
    }


    async courseDescriptionForSubjectAndCatalog(ctx) {
        return new Promise((resolve, reject) => {
            let query = `SELECT * from course_catalog where subject = ? AND catalog = ?`;
            const subject = ctx.params.subject, catalog = ctx.params.catalog;

            dbConnection.query({
                sql: query,
                values: [subject, catalog]
            }, (error, tuples) => {
                if (error) {
                    return reject(`Database issue in courseDescriptionForSubjectAndCatalog: Error: ${error}`);
                }
                ctx.body = tuples;
                ctx.status = 200;
                return resolve();
            });
        }).catch(err => {
            console.log('Database connection error.', err);
            ctx.body = err;
        });
    }

}

module.exports = CourseCatalogController;
