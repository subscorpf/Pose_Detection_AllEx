import React, {useEffect, useState} from 'react';
import HumanPose from 'react-native-human-pose';
import {View, Text} from 'react-native';
import Tts from 'react-native-tts';
import { find_angle } from '../Util/HelperFunction';


let step_into_frame= 0;
let foot_aligned = 0;
let difference = 0;

const JumpingJack = () => {
  //Boolean initial
  const [standing, setStanding] = useState(false);

  //Rep Counter
  const [noOfReps, setNoOfReps] = useState(0);
  
  //Confidence Test case
  const [shoulder_confidence, setShoulderCon] = useState (NaN);
  const [knee_confidence, setKneeCon] = useState (NaN);

  //Output
  const [feedback, setFeedback] = useState ('');
  
  //Stages
  const [stage, setStage] = useState ('');

  //Joints Position
  //Right
  const [wristR, setWristR] = useState ([]);
  const [shoulderR, setShoulderR] = useState ([]);
  const [ankleR, setAnkleR] = useState ([]);

  //Left
  const [wristL, setWristL] = useState ([]);
  const [shoulderL, setShoulderL] = useState ([]);
  const [ankleL, setAnkleL] = useState ([]);


  const onPoseDetected = (pose) => {
    setShoulderCon(pose[0]?.pose?.leftShoulder?.confidence + pose[0]?.pose?.rightShoulder?.confidence);
    setKneeCon(pose[0]?.pose?.leftKnee?.confidence + pose[0]?.pose?.rightKnee?.confidence);

    setWristR([pose[0]?.pose?.rightWrist?.x, pose[0]?.pose?.rightWrist?.y]);
    setShoulderR([pose[0]?.pose?.rightShoulder?.x, pose[0]?.pose?.rightShoulder?.y]);
    setWristL([pose[0]?.pose?.leftWrist?.x, pose[0]?.pose?.leftWrist?.y]);

    setAnkleR([pose[0]?.pose?.rightAnkle?.x, pose[0]?.pose?.rightAnkle?.y]);
    setShoulderL([pose[0]?.pose?.leftShoulder?.x, pose[0]?.pose?.leftShoulder?.y]);
    setAnkleL([pose[0]?.pose?.leftAnkle?.x, pose[0]?.pose?.leftAnkle?.y]);

    difference = ankleL[0] - ankleR[0]; 
    console.log(difference);

    if (shoulder_confidence >1.5 && knee_confidence>1.5){
      if ((ankleL[1]>ankleR[1]-30 && ankleL[1]<ankleR[1]+30)){
        if ((wristL[1]>shoulderL[1]) && (wristR[1]>shoulderR[1]) && (difference<30)){
          setStage('Standing');
        }

        if ((stage =='Standing') && (wristL[1]<shoulderL[1]) && (wristR[1]<shoulderR[1]) && difference > 200){
          setStage('not standing');
          setNoOfReps(pre=>pre+1);
        }
        
      }
      else {
        if (foot_aligned>25){
          foot_aligned =0;
          step_into_frame = 0;
          setFeedback('Keep ankles aligned');
          Tts.speak('Keep ankles aligned');
        }
        foot_aligned++;
      }
    }
    else {
      if (step_into_frame > 20){
        step_into_frame = 0;
        adjust_arms =0;
        setFeedback('Step into the frame');
        Tts.speak('Step into the frame');
      }
      step_into_frame++;
    }

  }; //POSE Detect



  return (
    <View style={{flex: 1}}>
      <Text>Jumping Jack</Text>
      <HumanPose
        height={500}
        width={400}
        enableKeyPoints={true}
        flipHorizontal={false}
        enableSkeleton ={true}
        isBackCamera={false}
        color={'255, 0, 0'}
        onPoseDetected={onPoseDetected}
      />
      <Text
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          textAlign: 'center',
          backgroundColor: 'white',
          padding: 10,
          fontSize: 16,
        }}>
       Reps: {noOfReps}
      </Text>
    </View>
  );
};

export default JumpingJack;