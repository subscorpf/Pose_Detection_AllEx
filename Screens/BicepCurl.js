import React, {useEffect, useState} from 'react';
import HumanPose from 'react-native-human-pose';
import {View, Text} from 'react-native';
import Tts from 'react-native-tts';
import { find_angle } from '../Util/HelperFunction';

let step_into_frame= 0;
let put_arms_close = 0;
let set_Limit_L = 1;
let set_Limit_R = 1;

const BicepCurl = () => {
  //Rep Counter
  const [noOfRepsL, setNoOfRepsL] = useState(0);
  const [noOfRepsR, setNoOfRepsR] = useState(0);
  const [setL, setSetL] = useState(0);
  const [setR, setSetR] = useState(0);
  
  //Confidence Test case
  const [shoulder_confidenceR, setShoulderConR] = useState (NaN);
  const [shoulder_confidenceL, setShoulderConL] = useState (NaN);

  //Outputs Left
  const [feedback, setFeedback] = useState ('');
  

  //Stages
  const [stageR, setStageR] = useState ('');
  const [stageL, setStageL] = useState ('');

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

      if ( ((pose[0]?.pose?.leftShoulder?.x+95 <= pose[0]?.pose?.leftElbow?.x) || 
          (pose[0]?.pose?.rightShoulder?.x-95 >= pose[0]?.pose?.rightElbow?.x))){
            if(put_arms_close>18){
              put_arms_close = 0;
              step_into_frame = 0;
              setFeedback('Put your arms close to your chest');
              Tts.speak('Put your arms close to your chest');
            }
            put_arms_close++;
          } 
      else{

        //Left Joints Position
        setShoulderL([pose[0]?.pose?.leftShoulder?.x, pose[0]?.pose?.leftShoulder?.y]);  
        setElbowL([pose[0]?.pose?.leftElbow?.x, pose[0]?.pose?.leftElbow?.y]);
        setWristL([pose[0]?.pose?.leftWrist?.x, pose[0]?.pose?.leftWrist?.y]);

        //Right Joints Positionw
        setShoulderR([pose[0]?.pose?.rightShoulder?.x, pose[0]?.pose?.rightShoulder?.y]);  
        setElbowR([pose[0]?.pose?.rightElbow?.x, pose[0]?.pose?.rightElbow?.y]);
        setWristR([pose[0]?.pose?.rightWrist?.x, pose[0]?.pose?.rightWrist?.y]);

        //Left and Right arm angle
        setAngleL(find_angle(shoulderL, elbowL, wristL));
        setAngleR(find_angle(shoulderR, elbowR, wristR));

        if(AngleL>165){
          setStageL('Down');
        }
        if (stageL=='Down' && AngleL<35){
          setStageL('Up');
          if (setL < set_Limit_L){
            setNoOfRepsL(pre=>pre+1); 
          }
        }

        if(AngleR>165){
          setStageR('Down');
        }
        if (stageR=='Down' && AngleR<35){
          setStageR('Up');
          if (setR < set_Limit_R){
            setNoOfRepsR(pre=>pre+1); 
          }
          
        }

      } 

    }//IF to check users visivility
    else {
      if(step_into_frame>20){
        step_into_frame = 0;
        put_arms_close = 0;
        setFeedback('Step into the frame');
        Tts.speak('Step into the frame');
      }
      step_into_frame++;
    }//else user is not visible

    //Check set
    if (setL < set_Limit_L){
      if (noOfRepsL == 10){
        setNoOfRepsL(0);
        setSetL(pre=>pre+1);
      }
    }

    if (setR < set_Limit_R){
      if (noOfRepsR == 10){
        setNoOfRepsR(0);
        setSetR(pre=>pre+1);
      }
    }


  }; //POSE Detect



  return (
    <View style={{flex: 1}}>
      <Text> SetL:{setL}                                Bicep Curl                             SetR:{setR}</Text>
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
        L Reps: {noOfRepsL}  |  R Reps: {noOfRepsR}
      </Text>
    </View>
  );
};

export default BicepCurl;