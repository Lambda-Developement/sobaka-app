var permissions;

setTimeout(()=>{
    permissions = cordova.plugins.permissions;

    permissions.checkPermission(permissions.CAMERA, (status)=>{
        if(!status.hasPermission){
            permissions.requestPermission(permissions.CAMERA,success,error);
            function error() {
                console.warn('Camera permission is not turned on');
                document.location.href="../ExcursionStart/ExcursionStart.html"; // Должно редиректить на экран где мы просим пользователя подумать еще раз но его нет
            }

            function success( status ) {
                if( !status.hasPermission ) error();
                let options = {
                    x: 0,
                    y: 0,
                    width: window.screen.width,
                    height: window.screen.height,
                    camera: CameraPreview.CAMERA_DIRECTION.BACK,
                    toBack: true,
                    tapPhoto: false,
                    tapFocus: true,
                    previewDrag: false,
                    storeToFile: false,
                    disableExifHeaderStripping: false
                };
                CameraPreview.startCamera(options);
                CameraPreview.show();
            }
        }
    }, null);
},2000);