document.addEventListener('deviceready', () => {
    universalLinks.subscribe(null, function (eventData) {
        console.log(eventData);
        console.log('Link: ' + eventData.url);
        console.log('Args: ' + eventData.params);

        if (eventData.url.includes('password')) {
            // Смена пароля
            document.location.href = 'screens/ResetPassword/resetPassword.html';
        }
        else if (eventData.url.includes('mail')) {
            // Подтверждение регистрации
            conf = eventData.url.split("/")[eventData.url.split("/").length - 1];
            console.log(`api_regconf(${conf})`);
            api_regconf(conf).then(
                (success) => {
                    document.location.href = 'screens/Mail confirmation/mailConfirmation.html';
                }
            );
        }
    });
    window.screen.orientation.lock('portrait');
    api_kval(localStorage.getItem('auth_key')).then((res) => {}, ()=>redirect_login());
    if(isIndex) document.location.href = "screens/Login/login.html";
});