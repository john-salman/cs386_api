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

courseCatalogRouter.get('/course-descriptions', Authorize('admin'), CourseCatalogController.courseDescriptionsAllCourses, (err) => console.log(err));
courseCatalogRouter.get('/:subject', Authorize('student'), CourseCatalogController.courseDescriptionsForSubject);
courseCatalogRouter.get('/:subject/:catalog', Authorize('student'), CourseCatalogController.courseDescriptionForSubjectAndCatalog);


const CourseController = new (require('../app/Controllers/CourseController.js'))();
const courseRouter = require('koa-router')({
    prefix: '/courses'
});

courseRouter.get('/', Authorize('admin'), CourseController.allCourses, err => console.log(`allCourses ran intor an error: ${err}`));// return all courses
courseRouter.get('/:term', Authorize('admin'), CourseController.coursesByTerm, err => console.log(`coursesByTerm ran into an error: ${err}`)); // return all courses by term /courses/2193
courseRouter.get('/:term/:department', Authorize('admin'), CourseController.coursesByTermDepartment, err => console.log(`coursesByTermDepartment ran into an error: ${err}`)); // all courses offered by department for term. /courses/2193/CS
courseRouter.get('/:term/:department/:catalog', Authorize('admin'), CourseController.coursesByTermDepartmentCatalog, err => console.log(`coursesByTermDepartmentCatalog ran into an error: ${err}`)); // /courses/2193/CS/385
courseRouter.get('/GE/:term', Authorize('admin'), CourseController.allGECoursesForTerm, err => console.log(`allGECourses ran into an error: ${err}`)); 

const ComponentController = new (require('../app/Controllers/ComponentController.js'))();
const componentRouter = require('koa-router')({
    prefix: '/components'
});

componentRouter.get('/:component', Authorize('admin'), ComponentController.allGECoursesByComponent, err => console.log('coursesByType ran into an error: ${err}'));

componentRouter.get('/open', Authorize('admin'), ComponentController.allGECoursesOpen, err => console.log('CoursesOpen ran into an error: ${err}'));

const InstructorController = new (require('../app/Controllers/InstructorController.js'))();
const instructorRouter = require('koa-router')({
    prefix: '/instructor'
});

instructorRouter.get('/:instructor_id', Authorize('admin'), (err) => console.log("routers.js: intructorRouter error:", err));

/**
 * Register all of the controllers into the default controller.
 */
router.use(
    '',
    courseCatalogRouter.routes(),
    loginRouter.routes(),
    courseRouter.routes(),
    instructorRouter.routes(),
    componentRouter.routes()
);

module.exports = function (app) {
    app.use(router.routes());
    app.use(router.allowedMethods());
};
