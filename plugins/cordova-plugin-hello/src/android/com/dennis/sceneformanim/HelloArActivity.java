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


public class HelloArActivity extends AppCompatActivity {

    //Variable
    private ArFragment arFragment;
    private AnchorNode anchorNode;
    private ModelAnimator animator;
    private int nextAnimation;
    private FloatingActionButton btn_anim;
    private ModelRenderable animationCrab;
    private TransformableNode transformableNode;
    private Resources R = getResources();

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(HelloArActivity.this.R.getIdentifier("activity_main", "layout", getApplicationContext().getPackageName()));

        arFragment = (ArFragment)getSupportFragmentManager()
                .findFragmentById(HelloArActivity.this.R.getIdentifier("sceneform_fragment", "id", getApplicationContext().getPackageName()));
        //Tap on plane event
        arFragment.setOnTapArPlaneListener(new BaseArFragment.OnTapArPlaneListener() {
            @Override
            public void onTapPlane(HitResult hitResult, Plane plane, MotionEvent motionEvent) {
                if(animationCrab ==null)
                    return;
                //Create the Anchor
                Anchor anchor = hitResult.createAnchor();
                if(anchorNode == null) //If crab is not place on plane
                {
                    anchorNode = new AnchorNode(anchor);
                    anchorNode.setParent(arFragment.getArSceneView().getScene());

                    transformableNode = new TransformableNode(arFragment.getTransformationSystem());
                    //Scale model
                    transformableNode.getScaleController().setMinScale(0.09f);
                    transformableNode.getScaleController().setMaxScale(0.1f);
                    transformableNode.setParent(anchorNode);
                    transformableNode.setRenderable(animationCrab);
                }
            }
        });

        //Add frame update to control state of button
        arFragment.getArSceneView().getScene()
                .addOnUpdateListener(new Scene.OnUpdateListener(){
                    public void onUpdate(FrameTime frameTime){
                        if (anchorNode == null)
                        {
                            if (btn_anim.isEnabled())
                            {
                                btn_anim.setBackgroundTintList(ColorStateList.valueOf(Color.GRAY));
                                btn_anim.setEnabled(false);
                            }
                        }
                        else
                        {
                            if (!btn_anim.isEnabled())
                            {
                                btn_anim.setBackgroundTintList(ContextCompat.getColorStateList(HelloArActivity.this,HelloArActivity.this.R.getIdentifier("colorAccent","color", getApplicationContext().getPackageName())));
                                btn_anim.setEnabled(true);
                            }
                        }
                    }
                });
        btn_anim = (FloatingActionButton)findViewById(HelloArActivity.this.R.getIdentifier("btn_anim","id",getApplicationContext().getPackageName()));
        btn_anim.setEnabled(false);
        btn_anim.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                if(animator == null || !animator.isRunning())
                {
                    AnimationData data = animationCrab.getAnimationData(nextAnimation);
                    nextAnimation = (nextAnimation+1)%animationCrab.getAnimationDataCount();
                    animator = new ModelAnimator(data,animationCrab);
                    animator.start();
                }
            }
        });
        
        setupModel();
    }

    private void setupModel() {
        ModelRenderable.builder()
                .setSource(this, HelloArActivity.this.R.getIdentifier("cangrejo","raw",getApplicationContext().getPackageName()))
                .build()
                .thenAccept(renderable -> animationCrab = renderable)
                .exceptionally(throwable -> {
                    Toast.makeText(this, ""+throwable.getMessage(), Toast.LENGTH_SHORT).show();
                            return null;
                });
    }
}
