package com.dennis.sceneformanim;

import androidx.appcompat.app.AppCompatActivity;
import androidx.core.content.ContextCompat;

import android.content.Context;
import android.content.res.ColorStateList;
import android.graphics.Color;
import android.os.Bundle;
import android.view.MotionEvent;
import android.view.View;
import android.widget.Toast;

import com.google.android.material.floatingactionbutton.FloatingActionButton;
import com.google.ar.core.Anchor;
import com.google.ar.core.HitResult;
import com.google.ar.core.Plane;
import com.google.ar.sceneform.AnchorNode;
import com.google.ar.sceneform.FrameTime;
import com.google.ar.sceneform.Scene;
import com.google.ar.sceneform.animation.ModelAnimator;
import com.google.ar.sceneform.rendering.AnimationData;
import com.google.ar.sceneform.rendering.ModelRenderable;
import com.google.ar.sceneform.ux.ArFragment;
import com.google.ar.sceneform.ux.BaseArFragment;
import com.google.ar.sceneform.ux.TransformableNode;

import android.content.res.Resources;
import android.widget.Button;

import com.google.ar.sceneform.math.Vector3;
import com.google.ar.sceneform.math.Quaternion;

import android.webkit.WebView;
import android.webkit.WebSettings;
import android.util.Log;

import android.media.MediaPlayer;
import android.content.res.AssetFileDescriptor;

import java.io.InputStream;
import java.io.IOException;
import java.util.Scanner;
import android.util.Base64;
import android.content.Intent;

import android.webkit.JavascriptInterface;
import org.json.JSONArray;

//Post
import java.io.BufferedReader;
import java.net.HttpURLConnection;
import java.io.IOException;
import java.io.OutputStream;
import java.io.InputStreamReader;
import java.net.URL;
import java.net.ProtocolException;
import java.net.MalformedURLException;
import java.io.OutputStreamWriter;

import org.apache.http.impl.client.HttpClientBuilder;
import org.apache.http.client.config.RequestConfig;
import org.json.JSONException;
import org.apache.http.client.methods.HttpPost;


import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.NameValuePair;
import org.apache.http.message.BasicNameValuePair;
import org.apache.http.util.EntityUtils;
import org.json.JSONObject;

import org.apache.http.client.HttpClient;
import org.apache.http.client.entity.UrlEncodedFormEntity;

import java.util.concurrent.CompletableFuture;
import java.util.*;

import java.io.FileNotFoundException;
import java.io.PrintWriter;
import java.util.LinkedHashMap;
import java.util.Map;


import java.io.FileReader;
import java.util.Iterator;
import java.util.Map;


public class HelloArActivity extends AppCompatActivity {

    private ArFragment arFragment;
    private AnchorNode anchorNode;
    private ModelAnimator animator;
    private int nextAnimation;
    private Button btn_anim;
    private ModelRenderable animationCrab;
    private ModelRenderable animationTalkCangrejo;
    private int current_model = 1;
    private boolean played = false;
    private TransformableNode transformableNode;
    private Resources R;
    private boolean walkForward = false;
    private int walkCount = 4;
    private boolean positioned = true;
    private AssetFileDescriptor afd;
    private MediaPlayer mp;
    private String id;
    private String auth_key;
    private static RequestConfig requestConfig = RequestConfig.custom().build();

    private ArrayList<String> list_text;
    private ArrayList<String> list_lengths;
    private long time;
    private int idx = 0;

    public HttpResponse postWithFormData(String url, List<NameValuePair> params) throws IOException {
        HttpClientBuilder hcb = HttpClientBuilder.create();
        HttpClientBuilder hcb1  = hcb.setDefaultRequestConfig(requestConfig);
        HttpClient httpClient = hcb1.build();

        HttpPost request = new HttpPost(url);

        request.setEntity(new UrlEncodedFormEntity(params));
        return httpClient.execute(request);
    }

    public void POSTReq() throws IOException
    {
        final String messageContent = "{\"request\":{\"action\":\"tourdata\", \"data\":{\"id\":"+HelloArActivity.this.id+"}, \"user_key\":\""+HelloArActivity.this.auth_key+"\"}}";
        System.out.println(messageContent);
        String url = "https://trip.backend.xredday.ru/";
        URL urlObj = new URL(url);
        HttpURLConnection postCon = (HttpURLConnection) urlObj.openConnection();
        postCon.setRequestMethod("POST");
        postCon.setRequestProperty("Content-Type", "multipart/form-data");
        postCon.setDoOutput(true);
        OutputStream osObj = postCon.getOutputStream();
        osObj.write(messageContent.getBytes());
        osObj.flush();
        osObj.close();
        int respCode = postCon.getResponseCode();
        System.out.println("Response from the server is: \n");
        System.out.println("The POST Request Response Code :  " + respCode);
        System.out.println("The POST Request Response Message : " + postCon.getResponseMessage());
        if (respCode == HttpURLConnection.HTTP_CREATED)
        {
            InputStreamReader irObj = new InputStreamReader(postCon.getInputStream());
            BufferedReader br = new BufferedReader(irObj);
            String input = null;
            StringBuffer sb = new StringBuffer();
            while ((input = br .readLine()) != null)
            {
                sb.append(input);
            }
            br.close();
            postCon.disconnect();

        }
        else
        {
            System.out.println("POST Request did not work.");
        }
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        this.R = getResources();
        Intent intent = getIntent();
        String message = intent.getStringExtra("message");
        try {
            JSONObject jo = new JSONObject(message);
            this.auth_key = (String) jo.get("user_key").toString();
            this.id = (String) jo.get("id").toString();
        } catch (JSONException je) {
            je.printStackTrace();
        }

        Log.d("aboba",message+"!");


        String result = "";
        setContentView(HelloArActivity.this.R.getIdentifier("activity_main", "layout", getApplicationContext().getPackageName()));
        WebView mywebview = (WebView) findViewById(this.R.getIdentifier("webview-ui", "id", getApplicationContext().getPackageName()));
        String subtitles = "[['sadasd',33],]";
        if (mywebview != null) {
            try{
                InputStream inputStream = getApplicationContext().getAssets().open("top.html");
                Scanner s = new Scanner(inputStream).useDelimiter("\\A");
                result = s.hasNext() ? s.next() : "";
            } catch (IOException e){
                e.printStackTrace();

            }

            WebSettings webs = mywebview.getSettings();
            webs.setJavaScriptEnabled(true);
            String base64wvhtml = Base64.encodeToString(result.getBytes(),
                    Base64.NO_PADDING);

            mywebview.loadData(base64wvhtml, "text/html", "base64");
            mywebview.setBackgroundColor(0x00000000);
        } else {
            Log.e("ERORRR!!! --> ", "Webview top is null");
        }

        // Нижний WebView
        WebView mywebview_bottom = (WebView) findViewById(this.R.getIdentifier("webview-sub", "id", getApplicationContext().getPackageName()));
        if (mywebview_bottom != null) {
            try(InputStream inputStream = getApplicationContext().getAssets().open("bottom.html")){
                Scanner s = new Scanner(inputStream).useDelimiter("\\A");
                result = s.hasNext() ? s.next() : "";
            }
            catch (IOException e){
                e.printStackTrace();
            }
            WebSettings webs = mywebview_bottom.getSettings();
            webs.setJavaScriptEnabled(true);
            String base64wvhtml = Base64.encodeToString(result.getBytes(),
                    Base64.NO_PADDING);
            mywebview_bottom.loadData(base64wvhtml, "text/html", "base64");
            mywebview_bottom.setBackgroundColor(0x00000000);
        } else {
            Log.e("ERORRR!!! --> ", "Webview bottom is null");
        }

        arFragment = (ArFragment) getSupportFragmentManager()
                .findFragmentById(HelloArActivity.this.R.getIdentifier("sceneform_fragment", "id", getApplicationContext().getPackageName()));
        // Обработчик нажатия на плоскость
        arFragment.setOnTapArPlaneListener(new BaseArFragment.OnTapArPlaneListener() {
            @Override
            public void onTapPlane(HitResult hitResult, Plane plane, MotionEvent motionEvent) {
                if (animationCrab == null)
                    return;
                // Создание отправной точки
                Anchor anchor = hitResult.createAnchor();
                if (anchorNode == null)
                {
                    anchorNode = new AnchorNode(anchor);
                    anchorNode.setParent(arFragment.getArSceneView().getScene());

                    transformableNode = new TransformableNode(arFragment.getTransformationSystem());
                    // Масштабирование 3д модели
                    transformableNode.getScaleController().setMinScale(0.25f);
                    transformableNode.getScaleController().setMaxScale(0.75f);

                    transformableNode.setParent(anchorNode);
                    transformableNode.setRenderable(animationCrab);

                    arFragment.getArSceneView().getPlaneRenderer().setEnabled(false);
                }
            }
        });

        // Анимации 3д модели
        arFragment.getArSceneView().getScene()
                .addOnUpdateListener(new Scene.OnUpdateListener() {
                    public void onUpdate(FrameTime frameTime) {
                        if ( HelloArActivity.this.mp != null && HelloArActivity.this.mp.isPlaying() && animator != null && !animator.isRunning()) {
                            animator.start();
                            if (HelloArActivity.this.list_text != null &&  HelloArActivity.this.list_lengths != null &&  mywebview_bottom != null){
                                mywebview_bottom.loadUrl("javascript:playSubtitles('"+ HelloArActivity.this.list_text.get(idx)+"')");
                                if (idx <  HelloArActivity.this.list_text.size()){
                                    if ((System.currentTimeMillis() - HelloArActivity.this.time)/1000 > Long.parseLong( HelloArActivity.this.list_lengths.get(idx))){
                                        idx++;
                                        mywebview_bottom.loadUrl("javascript:playSubtitles('"+ HelloArActivity.this.list_text.get(idx)+"')");
                                        played = true;
                                    }
                                }
                            }
                        } else if (HelloArActivity.this.current_model == 2 && animator != null && HelloArActivity.this.mp != null && HelloArActivity.this.played && !HelloArActivity.this.mp.isPlaying()){
                            transformableNode.setRenderable(animationCrab);
                            AnimationData data = animationCrab.getAnimationData(nextAnimation);
                            nextAnimation = nextAnimation % animationCrab.getAnimationDataCount();
                            animator = new ModelAnimator(data, animationCrab);
                            HelloArActivity.this.current_model = 1;
                            HelloArActivity.this.played = false;
                            HelloArActivity.this.idx = 0;

                        }
                        if (anchorNode == null) {
                            if (btn_anim.isEnabled()) {
                                btn_anim.setBackgroundTintList(ColorStateList.valueOf(Color.GRAY));
                                btn_anim.setEnabled(false);

                            }
                        } else {
                            if (!btn_anim.isEnabled()) {
                                btn_anim.setBackgroundTintList(ContextCompat.getColorStateList(HelloArActivity.this, HelloArActivity.this.R.getIdentifier("colorAccent", "color", getApplicationContext().getPackageName())));
                                btn_anim.setEnabled(true);
                            }
                        }
                        if (walkForward && animator.isRunning()) {
                            float delta = frameTime.getDeltaSeconds();
                            Vector3 dogPosition = Vector3.add(Quaternion.rotateVector(transformableNode.getWorldRotation(), new Vector3(0.0f, 0.0f, -1 * delta * 0.085f)), transformableNode.getWorldPosition());
                            transformableNode.setWorldPosition(dogPosition);
                        } else {
                            if (animator != null && walkCount <= 4) {
                                // Продолжение анимации
                                AnimationData data = animationCrab.getAnimationData(nextAnimation);
                                nextAnimation = nextAnimation % animationCrab.getAnimationDataCount();
                                animator = new ModelAnimator(data, animationCrab);
                                animator.start();

                                walkCount += 1;
                            } else if (animator == null || walkCount > 4) {
                                walkForward = false;

                                if (transformableNode != null && positioned == false) {
                                    // Конец ходьбы
                                    Vector3 cameraPosition = transformableNode.getScene().getCamera().getWorldPosition();
                                    Vector3 cardPosition = transformableNode.getWorldPosition();

                                    Vector3 direction = Vector3.subtract(cameraPosition, cardPosition);
                                    direction = new Vector3(direction.x, 0, direction.z);
                                    transformableNode.setWorldRotation(Quaternion.lookRotation(direction, Vector3.up()));
                                    positioned = true;


                                    // Получение аудио описания с сервера
                                    CompletableFuture.runAsync(() -> {
                                        try {
                                            List<NameValuePair> urlParameters = new ArrayList<>();
                                            final String messageContent = "{\"action\":\"tourdata\", \"data\":{\"id\":"+HelloArActivity.this.id+"}, \"user_key\":\"ec8c77dfbff47adffa3ec10b207b5a6059ac12f334fe4927a3\"}";

                                            urlParameters.add(new BasicNameValuePair("request", messageContent));
                                            System.out.println(messageContent);
                                            HttpResponse response = postWithFormData("https://trip.backend.xredday.ru/", urlParameters);
                                            HttpEntity entity = response.getEntity();
                                            String responseString = EntityUtils.toString(entity);
                                            System.out.println("GOT RESPONSE!!!!!" + response.getStatusLine().getStatusCode() +  responseString );
                                            JSONObject responseObject = new JSONObject(responseString);
                                            System.out.println("GOT JSON OBJECT");



                                                // Обработка полученных данных
                                                try {
                                                    JSONArray ja = responseObject.getJSONArray("subtitles");
                                                    HelloArActivity.this.list_text = new ArrayList<String>();
                                                    HelloArActivity.this.list_lengths = new ArrayList<String>();
                                                    if (ja == null) {
                                                        System.out.println("json is empty");
                                                    }
                                                    else
                                                    {
                                                        int length = ja.length();
                                                        for (int i=0;i<length;i++){
                                                            HelloArActivity.this.list_text.add(ja.getJSONArray(i).get(0).toString());
                                                            HelloArActivity.this.list_lengths.add(ja.getJSONArray(i).get(1).toString());
                                                        }
                                                    }
                                                } catch (JSONException je) {
                                                    je.printStackTrace();
                                                }

                                            String audio_link = responseObject.get("audio").toString();

                                            // Воспроизведение аудио
                                            HelloArActivity.this.mp = new MediaPlayer();
                                            try {
                                                //  HelloArActivity.this.afd = getAssets().openFd("museum.mp3");
                                                //   HelloArActivity.this.mp.setDataSource(HelloArActivity.this.afd.getFileDescriptor(), HelloArActivity.this.afd.getStartOffset(), HelloArActivity.this.afd.getLength());
                                                HelloArActivity.this.mp.setDataSource("https://trip.backend.xredday.ru/" + audio_link);
                                                HelloArActivity.this.mp.prepare();
                                                HelloArActivity.this.mp.start();
                                            } catch (Exception e) {
                                                e.printStackTrace();
                                            }
                                        }
                                        catch (JSONException je){
                                            System.out.println("JSONEXCEPTIONNN!!!!!");
                                            je.printStackTrace(System.out);
                                        }
                                        catch (IOException ioe) {
                                            System.out.println("IOEXCEPTION!!!");
                                            ioe.printStackTrace(System.out);

                                        }
                                        HelloArActivity.this.time = System.currentTimeMillis();

                                    });

                                    // Остановление анимации говорения
                                    transformableNode.setRenderable(animationTalkCangrejo);
                                    AnimationData data = animationTalkCangrejo.getAnimationData(nextAnimation);
                                    nextAnimation = nextAnimation % animationTalkCangrejo.getAnimationDataCount();
                                    animator = new ModelAnimator(data, animationTalkCangrejo);
                                    current_model = 2;
                                    animator.start();






                                }
                            }
                        }

                    }


                });
        btn_anim = (Button) findViewById(HelloArActivity.this.R.getIdentifier("btn_anim", "id", getApplicationContext().getPackageName()));
        btn_anim.setEnabled(false);
        btn_anim.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                if (animator == null || !animator.isRunning()) {

                    AnimationData data = animationCrab.getAnimationData(nextAnimation);
                    nextAnimation = (nextAnimation + 1) % animationCrab.getAnimationDataCount();
                    animator = new ModelAnimator(data, animationCrab);
                    animator.start();
                    walkForward = true;
                    walkCount = 0;
                    positioned = false;




                }
            }
        });

        setupModel();
        setupModelTalk();
    }

    private void setupModel() {
        ModelRenderable.builder()
                .setSource(this, HelloArActivity.this.R.getIdentifier("cangrejo", "raw", getApplicationContext().getPackageName()))
                .build()
                .thenAccept(renderable -> animationCrab = renderable)
                .exceptionally(throwable -> {
                    Toast.makeText(this, "" + throwable.getMessage(), Toast.LENGTH_SHORT).show();
                    return null;
                });
    }

    private void setupModelTalk() {
        ModelRenderable.builder()
                .setSource(this, HelloArActivity.this.R.getIdentifier("cangrejo_talk", "raw", getApplicationContext().getPackageName()))
                .build()
                .thenAccept(renderable -> animationTalkCangrejo = renderable)
                .exceptionally(throwable -> {
                    Toast.makeText(this, "" + throwable.getMessage(), Toast.LENGTH_SHORT).show();
                    return null;
                });
    }
}
