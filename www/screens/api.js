

const __backend_url = "https://trip.backend.xredday.ru/";
async function __basic_api_call(method, data, auth_key = null) {
    let request_body = {
        'request':
        {
            "action": method,
            "data": data,
            "user_key": auth_key,
        }
    };
    let headers = {}

    return await new Promise((resolve, reject) => {
        cordovaHTTP.post(__backend_url, request_body, headers,
            function (response) {
                // Success
                // prints 200
                console.log(`=== API CALL: "action":"${method}" ===`);
                console.log(`SUCCESS:${response.status}`);
                console.log(`RESPONSE DATA:${response.data}`);
                console.log(`=== API CALL: "action":"${method} END ==="`);
                // Get JSON
                try {
                    resolve(JSON.parse(response.data));
                } catch (except) {
                    if (except instanceof SyntaxError) resolve(response.data);
                }
            },
            function (response) {
                // Fail
                // prints 403
                console.log(`=== API CALL: "action":"${method} ==="`);
                console.log(`FAIL:${response.status}`);
                console.log(`FAIL LOG:\n${response.data}\nFAIL LOG END.`);
                console.log(`=== API CALL: "action":"${method} END ==="`);
                // Callback
                reject(response.status);
            }
        );
    });
}

async function api_login(login, password) {
    // "login" api call (auth_key not required)
    // Returns auth_key
    let data = {
        'login': login,
        'pass': password,
    };
    return await __basic_api_call("login", data);
}

async function api_kval(auth_key) {
    // "kval" api call (auth_key not required)
    // returns nothing (resolve if good reject if bad)
    let data = {
        'key': auth_key,
    }
    return await __basic_api_call("kval", data);
}

async function api_register(name, mail, pass) {
    // "reg" api call (auth_key not required)
    // returns nothing (resolve if good reject if bad)
    let data = {
        'name': name,
        'mail': mail,
        'pass': pass,
    }
    return await __basic_api_call("reg", data);
}

async function api_regconf(conf) {
    // "regconf" api call (auth_key not required)
    // returns nothing (resolve if good reject if bad)
    let data = {
        'conf': conf,
    }
    return await __basic_api_call("regconf", data);
}



function api_test() {
    // Credentials
    login = "mfh53342@jiooq.com"
    pass = "nana1231"

    // Promise common functions
    err = (err) => { console.log(`err: ${err}`) }


    // login
    api_login(login, pass).then(
        (res_key) => {
            console.log(`res_key: ${res_key}`);
            localStorage.setItem("auth_key", res_key);
            console.log(`localStorage["auth_key"]: ${localStorage.getItem("auth_key")}`);

            // kval
            api_kval(res_key).then(
                (res) => {
                    console.log(`kval: ${res == ""}`);
                }, err
            );
        },
        err
    );

    // reg
    name_t = "Коков Степан";
    mail_t = "bzo07598@jiooq.com";
    pass_t = "koko3214";
    api_register(name_t, mail_t, pass_t).then(
        (res) => console.log(`reg: success ${res}`)
        , err
    );

    //regconf
    //no working example because you get conf in runtime
    conf = ""
    api_regconf().then((res) => console.log(`regconf: ${res == 0}`), err);

}
