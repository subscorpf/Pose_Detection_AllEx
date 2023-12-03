import React, {useEffect, useState} from 'react';
import HumanPose from 'react-native-human-pose';
import {View, Text} from 'react-native';
import Tts from 'react-native-tts';
import { find_angle } from '../Util/HelperFunction';


let step_into_frame= 0;
let arms_straight = 0;
let raise_arm =0;
let arms_down = 0;
let set_Limit= 1;

const LateralRaises = () => {
  //Rep Counter
  const [noOfReps, setNoOfReps] = useState(0);
  const [set, setSet] = useState(0);

  //Confidence Test case
  const [shoulder_confidenceR, setShoulderConR] = useState (NaN);
  const [shoulder_confidenceL, setShoulderConL] = useState (NaN);

  //Outputs Left
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
    
    //get right and left shoulder confidence
    setShoulderConR(pose[0]?.pose?.rightShoulder?.confidence);
    setShoulderConL(pose[0]?.pose?.leftShoulder?.confidence);

    if (shoulder_confidenceR > 0.50  && shoulder_confidenceL>0.50){

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

        if (AngleL<140 || AngleR<140){
          if(arms_straight>20){
            step_into_frame = 0;
            arms_straight = 0;
            raise_arm = 0;
            arms_down
            setFeedback('Arms Straight');
            Tts.speak('Arms Straight');
          }
          arms_straight++;
        }

        if ((elbowL[1]>shoulderL[1]+30 && wristL[1]>shoulderL[1]+50) && (elbowR[1]>shoulderR[1]+30 && wristR[1]>shoulderR[1]+50)){
          setStage('Down');
          if(raise_arm>20){
            step_into_frame = 0;
            arms_straight = 0;
            raise_arm =0;
            arms_down
            setFeedback('raise arm');
            Tts.speak('raise arm');
          }
          raise_arm++;
        }
        else {
          if (stage =='Down'){
            setStage('Up');
            if (set < set_Limit){
                setNoOfReps(pre=>pre+1);
              } 
          }

          if(arms_down>20){
            step_into_frame = 0;
            arms_straight = 0;
            raise_arm =0;
            arms_down = 0;
            setFeedback('arms down');
            Tts.speak('arms down');
          }
          arms_down++;


        }

        
      

    }//IF to check users visivility
    else {
      if(step_into_frame>20){
        step_into_frame = 0;
        arms_straight = 0;
        raise_arm =0;
        arms_down
        setFeedback('Step into the frame');
        Tts.speak('Step into the frame');
      }
      step_into_frame++;
    }//else user is not visible

    if (set < set_Limit){
        if (noOfReps == 10){
          setNoOfReps(0);
          setSet(pre=>pre+1);
        }
      }

  }; //POSE Detect



  return (
    <View style={{flex: 1}}>
      <Text>Lateral Raises</Text>
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

export default LateralRaises;