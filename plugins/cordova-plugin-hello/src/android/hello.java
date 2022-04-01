package cordova.plugin.hello;

import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CallbackContext;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;


//Activity system stuff
import androidx.appcompat.app.AppCompatActivity;
import android.content.Intent;
import android.content.Context;


//My imports
//import com.google.ar.core;
import com.dennis.sceneformanim;


/**
 * This class echoes a string called from JavaScript.
 */
public class hello extends CordovaPlugin {

    @Override
    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
        if (action.equals("actionShow")) {
            String message = args.getString(0);
            this.actionShow(message, callbackContext);
            return true;
        }
        if (action.equals("startActivity")) {
        // Suggestion one - cordova is an activity and we can switch it
        //    callbackContext.success("BEFORE INTENT");
            Context context = this.cordova.getActivity().getApplicationContext();
            Intent intent = new Intent(context, HelloArActivity.class);
            intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            context.startActivity(intent);
            callbackContext.success("AFTER INTENT");
            return true;
        }
        return false;
    }

    private void actionShow(String message, CallbackContext callbackContext) {
        if (message != null && message.length() > 0) {
            callbackContext.success(message);
        } else {
            callbackContext.error("Expected one non-empty string argument.");
        }
    }
}
