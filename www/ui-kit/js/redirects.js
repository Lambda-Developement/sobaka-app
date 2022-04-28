function redirect(url) {
    document.location.href = url;
}
function redirect_about() {
    redirect('../About/about.html');
}
function redirect_error_call() {
    redirect('../ErrorCall/errorCall.html');
}
function redirect_map_settings() {
    redirect('../MapSettings/mapSettings.html');
}
function redirect_achievements() {
    redirect('../Achievements/achievements.html');
}
function redirect_profile() {
    redirect('../../screens/Profile/profile.html');
}
function redirect_mail_confirmation() {
    redirect('../MailConfirmation/mailConfirmationInfo.html');
}
function redirect_login() {
    redirect('../Login/login.html');
}
function redirect_geoposition() {
    redirect('../Map/map.html');
}
function redirect_registration() {
    redirect('../Registration/registration.html');
}
function redirect_home() {
    redirect('../Map/map.html');
}
function redirect_routes() {
    redirect('../Routes/routes.html');
}
function redirect_geoinfo() {
    redirect('../GeoInfo/geoInfo.html');
}
function redirect_excursion_start(elem_id) {
    if (localStorage != undefined) {
        localStorage.setItem('prev_place', elem_id);
    }
    redirect('../ExcursionStart/excursionStart.html');
}
function redirect_camera() {
    redirect('../Camera/camera.html');
}
function redirect_not_available() {
    redirect('../License/license.html');
}
function redirect_reset_password() {
    redirect('screens/ResetPassword/resetPassword.html');
}
function redirect_route_details() {
    redirect('../RouteDetails/routeDetails.html');
}