import React, {useEffect, useState} from 'react';
import HumanPose from 'react-native-human-pose';
import {View, Text} from 'react-native';
import Tts from 'react-native-tts';
import { find_angle } from '../Util/HelperFunction';

let step_into_frame= 0;
let put_arms_close = 0;
let arms_straight = 0;
let go_lower = 0;
let set_Limit= 1;

const DumbbellDeadlift = () => {
  //Rep Counter
  const [noOfReps, setNoOfReps] = useState(0);
  const [set, setSet] = useState(0);
  
  //Confidence Test case
  const [shoulder_confidence, setShoulderCon] = useState (NaN);
  const [knee_confidence, setKneeCon] = useState (NaN);

  //Output
  const [feedback, setFeedback] = useState ('');
  
  //Stages
  const [stage, setStage] = useState ('');

  //Joints Position
  //--> Right Joints
  const [shoulderR, setShoulderR] = useState ([]);
  const [elbowR, setElbowR] = useState ([]);
  const [wristR, setWristR] = useState ([]);

  //-->Left Joints
  const [shoulderL, setShoulderL] = useState ([]);
  const [elbowL, setElbowL] = useState ([]);
  const [wristL, setWristL] = useState ([]);

  //Angles
  const [AngleR, setAngleR] = useState (NaN);
  const [AngleL, setAngleL] = useState (NaN);

  const onPoseDetected = (pose) => {
    setShoulderCon(pose[0]?.pose?.rightShoulder?.confidence + pose[0]?.pose?.leftShoulder?.confidence);
    setKneeCon(pose[0]?.pose?.rightKnee?.confidence + pose[0]?.pose?.leftKnee?.confidence);

    //Left Joints position
    setShoulderL([pose[0]?.pose?.leftShoulder?.x, pose[0]?.pose?.leftShoulder?.y]);  
    setElbowL([pose[0]?.pose?.leftElbow?.x, pose[0]?.pose?.leftElbow?.y]);
    setWristL([pose[0]?.pose?.leftWrist?.x, pose[0]?.pose?.leftWrist?.y]);

    //Right Joints Position
    setShoulderR([pose[0]?.pose?.rightShoulder?.x, pose[0]?.pose?.rightShoulder?.y]);  
    setElbowR([pose[0]?.pose?.rightElbow?.x, pose[0]?.pose?.rightElbow?.y]);
    setWristR([pose[0]?.pose?.rightWrist?.x, pose[0]?.pose?.rightWrist?.y]);

    //Left and Right arm angle
    setAngleL(find_angle(shoulderL, elbowL, wristL));
    setAngleR(find_angle(shoulderR, elbowR, wristR));


    console.log(AngleL);
    console.log(AngleR);

    if (shoulder_confidence >1.5 && knee_confidence>1.5){
      if ( ((pose[0]?.pose?.leftShoulder?.x+95 <= pose[0]?.pose?.leftElbow?.x) || 
      (pose[0]?.pose?.rightShoulder?.x-95 >= pose[0]?.pose?.rightElbow?.x))) {
        if(put_arms_close>20){
          step_into_frame = 0;
          put_arms_close = 0;
          go_lower =0;
          arms_straight = 0;
          setFeedback('Put your arms close to your chest');
          Tts.speak('Put your arms close to your chest');
        }
        put_arms_close++;
      }
      else if(AngleL <130 || AngleR<130){
        if (arms_straight>20){
        step_into_frame = 0;
        put_arms_close = 0;
        go_lower =0;
        arms_straight = 0;
        setFeedback('Arms Straight');
          Tts.speak('Arms Straight');
        }
        arms_straight++;
      }
      else {
        if (pose[0]?.pose?.leftWrist?.y < pose[0]?.pose?.leftKnee?.y+20 && pose[0]?.pose?.rightWrist?.y < pose[0]?.pose?.rightKnee?.y+20){
          setStage('Up');
          if (go_lower >20){
            step_into_frame = 0;
            put_arms_close = 0;
            go_lower =0;
            arms_straight = 0;
            setFeedback('Go Lower');
            Tts.speak('Go Lower');
          }
          go_lower++;
        }
        if (stage=='Up' && pose[0]?.pose?.leftWrist?.y > pose[0]?.pose?.leftKnee?.y+20 && pose[0]?.pose?.rightWrist?.y > pose[0]?.pose?.rightKnee?.y+20){
          setStage('Down');
          if (set < set_Limit){
            setNoOfReps(pre=>pre+1);
          }
          }
        
      }

    }
    else {
      if (step_into_frame > 20){
        step_into_frame = 0;
        put_arms_close = 0;
        go_lower =0;
        arms_straight = 0;
        setFeedback('Step into the frame');
        Tts.speak('Step into the frame');
      }
      step_into_frame++;
    }

    //Check set
    if (set < set_Limit){
      if (noOfReps == 10){
        setNoOfReps(0);
        setSet(pre=>pre+1);
      }
    }

  }; //POSE Detect



  return (
    <View style={{flex: 1}}>
      <Text>Dumbbell Deadlift                                                          Set:{set}</Text>
      <HumanPose
        height={500}
        width={400}
        enableKeyPoints={true}
        flipHorizontal={true}
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

export default DumbbellDeadlift;