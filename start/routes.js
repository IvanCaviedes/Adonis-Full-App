'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URLs and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')


Route.group(() => {
  // Main Rute
  Route.get('/', ({ request, response }) => {
    response.status(200).send({
      Message: "This api is made with adonis js",
      Version: "5.0.9"
    });
  });
  // Auth Rute
  Route.post('singup', 'AuthController.singup')
  Route.post('login', 'AuthController.login')
  Route.post('password/reset/email', 'AuthController.sendResetEmail');
  Route.post('password/reset/', 'AuthController.resetPassword');
  Route.get('confirm/:token', 'AuthController.confirmAccount');
  Route.post('confirm/resend', 'AuthController.resendConfirmationEmail');

}).prefix('api')

