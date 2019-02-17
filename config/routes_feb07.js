const Authorize = require('../app/Authorize.js');

/*
|--------------------------------------------------------------------------
| Default router
|--------------------------------------------------------------------------
|
| Default router is used to define any routes that don't belong to a
| controller. Also used as a parent container for the other routers.
|
*/
const router = require('koa-router')({
    prefix: '/api/v1'
});

router.get('/', function (ctx) {
    return ctx.body = 'What is up?';
});


/*
|--------------------------------------------------------------------------
| Students router
|--------------------------------------------------------------------------
|
| Description
|
*/

const LoginController = new (require('../app/Controllers/LoginController.js'))();
const loginRouter = require('koa-router')({
    prefix: '/login'
});
loginRouter.get('/:user_id', LoginController.authorizeUser, (err) => console.log("routers.js: loginRouter error:", err));


const CourseCatalogController = new (require('../app/Controllers/CourseCatalogController.js'))();
const courseCatalogRouter = require('koa-router')({
    prefix: '/course-catalog'
});

courseCatalogRouter.get('/all-course-descriptions', Authorize('admin'), CourseCatalogController.courseDescriptionsAllCourses, (err) => console.log(err));
courseCatalogRouter.get('/:subject/course-descriptions', Authorize('student'), CourseCatalogController.courseDescriptionsForSubject);
courseCatalogRouter.get('/:subject/:catalog/course-description', Authorize('student'), CourseCatalogController.courseDescriptionForSubjectAndCatalog);


const CourseController = new (require('../app/Controllers/CourseController.js'))();
const courseRouter = require('koa-router')({
    prefix: '/courses'
});

courseRouter.get('/:term/all-ge-courses', Authorize('admin'), CourseController.allGECoursesForTerm, err => console.log(`allCourses ran into an error: ${err}`)); 

const InstructorController = new (require('../app/Controllers/InstructorController.js'))();
const instructorRouter = require('koa-router')({
    prefix: '/instructor'
});

instructorRouter.get('/:instructor_id', InstructorController.authorizeUser, (err) => console.log("routers.js: intructorRouter error:", err));

/**
 * Register all of the controllers into the default controller.
 */
router.use(
    '',
    courseCatalogRouter.routes(),
    loginRouter.routes(),
    courseRouter.routes(),
    instructorRouter.routes()
);

module.exports = function (app) {
    app.use(router.routes());
    app.use(router.allowedMethods());
};
