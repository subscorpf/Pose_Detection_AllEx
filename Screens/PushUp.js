import React, {useEffect, useState} from 'react';
import HumanPose from 'react-native-human-pose';
import {View, Text} from 'react-native';
import Tts from 'react-native-tts';
import { find_angle } from '../Util/HelperFunction';

let step_into_frame =0;
let arms_straight = 0;
let set_Limit= 1;

const PushUp = () => {
    //Rep Counter
    const [noOfReps, setNoOfReps] = useState(0);
    const [set, setSet] = useState(0);
  
    //Confidence Test case
    const [elbow_confidence, setElbowCon] = useState (NaN);
  
    //Outputs
    const [feedback, setFeedback] = useState ('');
    const [stage, setStage] = useState ('');
  
    //Joints Position
    const [shoulderL, setShoulderL] = useState ([]);
    const [elbowL, setElbowL] = useState ([]);
    const [wristL, setWristL] = useState ([]);

    const [shoulderR, setShoulderR] = useState ([]);
    const [elbowR, setElbowR] = useState ([]);
    const [wristR, setWristR] = useState ([]);
  
    //Angles
    const [AngleL, setAngleL] = useState (NaN);
    const [AngleR, setAngleR] = useState (NaN);

    const onPoseDetected = (pose) => {
      
      //Set shoulder confidence and Store visiblity of both shoulders total should add to 2
      setElbowCon(pose[0]?.pose?.rightElbow?.confidence + pose[0]?.pose?.leftElbow?.confidence);
      
      //if shoulder confidence is greater than 1.5 therefore user is present
      if (elbow_confidence>1.5){

        //Left Joints Position
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
        
        if ((AngleL>150 && AngleR<150) || (AngleL<150 && AngleR>150)){
          if(arms_straight>14){
            step_into_frame = 0;
            arms_straight = 0;
            setFeedback('Arms Straight');
            Tts.speak('Arms Straight');
          }
          arms_straight++;
        }
        

         //Check if both your arms straight         
         if (AngleL > 165 && AngleR>165){
          setStage('Up');
         }

         if (stage=='Up' && AngleL<110 && AngleR<110){
          setStage('Down');
          if (set < set_Limit){
            setNoOfReps(pre=>pre+1);
          }
          Tts.speak('Correct Push up');
          // console.log('**********************');
          // console.log('Angle L = ', AngleL);
          // console.log('Angle R = ', AngleR);
          // console.log('**********************');
         }


      }
      else {
        if(step_into_frame>20){
          step_into_frame = 0;
          setFeedback('Step into the frame');
          Tts.speak('Step into the frame');
        }
        step_into_frame++;
      }

      if (set < set_Limit){
        if (noOfReps == 10){
          setNoOfReps(0);
          setSet(pre=>pre+1);
        }
      }

      
    }; //POSE Detect
  


  return (
    <View style={{flex: 1}}>
      <Text>Push Up                                                          Set:{set}</Text>
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
        Push up Reps: {noOfReps}
      </Text>
    </View>
  );
};

export default PushUp;