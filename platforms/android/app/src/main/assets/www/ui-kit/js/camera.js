var permissions;

setTimeout(()=>{
    permissions = cordova.plugins.permissions;
    var list = [
        permissions.CAMERA
    ];

    permissions.checkPermission(list, success, null);

    function error() {
        console.warn('Camera or Accounts permission is not turned on');
        document.location.href = "../../screens/AccessError/accessError.html";
    }

    function success( status ) {
        if( !status.hasPermission ) {

            permissions.requestPermissions(
                list,
                function(status) {
                    if( !status.hasPermission ) error();
                },
                error);
        }
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
},2000);

if(localStorage != undefined){
    localStorage.setItem('prev_page','../../screens/Camera/camera.html');
}