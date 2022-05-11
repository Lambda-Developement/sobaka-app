// Базовая функция редиректов
function redirect(url) {
    document.location.href = url;
}
// Функция редиректа в О приложении
function redirect_about() {
    redirect('/screens/About/about.html');
}
// Функция редиректа в Отправку ошибок
function redirect_error_call() {
    redirect('/screens/ErrorCall/errorCall.html');
}
// Функция редиректа в Настройки
function redirect_map_settings() {
    redirect('/screens/MapSettings/mapSettings.html');
}
// Функция редиректа в Достижения
function redirect_achievements() {
    redirect('/screens/Achievements/achievements.html');
}
// Функция редиректа в Профиль
function redirect_profile() {
    redirect('/screens/Profile/profile.html');
}
// Функция редиректа в Подтверждение пароля
function redirect_mail_confirmation() {
    redirect('/screens/MailConfirmation/mailConfirmationInfo.html');
}
// Функция редиректа в Логин
function redirect_login() {
    redirect('/screens/Login/login.html');
}
// Функция редиректа в Главный экран
function redirect_geoposition() {
    redirect('/screens/Map/map.html');
}
// Функция редиректа в Регистрацию
function redirect_registration() {
    redirect('/screens/Registration/registration.html');
}
// Функция редиректа в Главный экран
function redirect_home() {
    redirect('/screens/Map/map.html');
}
// Функция редиректа в Маршруты
function redirect_routes() {
    redirect('/screens/Routes/routes.html');
}
// Функция редиректа в Геоточка
function redirect_geoinfo() {
    redirect('/screens/GeoInfo/geoInfo.html');
}
// Функция редиректа в Начало экскурсии
function redirect_excursion_start(elem_id) {
    if (localStorage != undefined) {
        localStorage.setItem('prev_place', elem_id);
    }
    redirect('/screens/ExcursionStart/excursionStart.html');
}
// Функция редиректа в Камеру
function redirect_camera() {
    redirect('/screens/Camera/camera.html');
}
// Функция редиректа в Не доступно
function redirect_not_available() {
    redirect('/screens/License/license.html');
}
// Функция редиректа в Восстановление пароля
function redirect_reset_password() {
    redirect('/screens/ResetPassword/resetPassword.html');
}
// Функция редиректа в Детали маршрута
function redirect_route_details() {
    redirect('/screens/RouteDetails/routeDetails.html');
}
// Функция редиректа в Конец маршрута
function redirect_excursion_finale() {
    redirect('/screens/ExcursionFinale/excursionFinale.html');
}