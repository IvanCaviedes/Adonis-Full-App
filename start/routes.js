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
  Route.post('singup', 'AuthController.routeTemp')
  Route.post('login', 'AuthController.routeTemp')
  Route.post('logout', 'AuthController.routeTemp')
  Route.post('password/reset/email', 'AuthController.routeTemp');
  Route.post('password/reset', 'AuthController.routeTemp');
  Route.get('confirm/:token', 'AuthController.routeTemp');
  Route.post('confirm/resend', 'AuthController.routeTemp');
  
}).prefix('api')

