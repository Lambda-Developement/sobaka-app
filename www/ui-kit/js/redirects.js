function redirect(url) {
    document.location.href = url;
}
function redirect_about() {
    redirect('/screens/About/about.html');
}
function redirect_error_call() {
    redirect('/screens/ErrorCall/errorCall.html');
}
function redirect_map_settings() {
    redirect('/screens/MapSettings/mapSettings.html');
}
function redirect_achievements() {
    redirect('/screens/Achievements/achievements.html');
}
function redirect_profile() {
    redirect('/screens/Profile/profile.html');
}
function redirect_mail_confirmation() {
    redirect('/screens/MailConfirmation/mailConfirmationInfo.html');
}
function redirect_login() {
    redirect('/screens/Login/login.html');
}
function redirect_geoposition() {
    redirect('/screens/Map/map.html');
}
function redirect_registration() {
    redirect('/screens/Registration/registration.html');
}
function redirect_home() {
    redirect('/screens/Map/map.html');
}
function redirect_routes() {
    redirect('/screens/Routes/routes.html');
}
function redirect_geoinfo() {
    redirect('/screens/GeoInfo/geoInfo.html');
}
function redirect_excursion_start(elem_id) {
    if (localStorage != undefined) {
        localStorage.setItem('prev_place', elem_id);
    }
    redirect('/screens/ExcursionStart/excursionStart.html');
}
function redirect_camera() {
    redirect('/screens/Camera/camera.html');
}
function redirect_not_available() {
    redirect('/screens/License/license.html');
}
function redirect_reset_password() {
    redirect('/screens/ResetPassword/resetPassword.html');
}
function redirect_route_details() {
    redirect('/screens/RouteDetails/routeDetails.html');
}