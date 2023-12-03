import React, {useEffect, useState} from 'react';
import HumanPose from 'react-native-human-pose';
import {View, Text} from 'react-native';
import Tts from 'react-native-tts';
import { find_angle } from '../Util/HelperFunction';

// function mid_point(A, B){
// var x = (A[0]+ B[0])/2; 
// var y = (A[1]+ B[1])/2;
// const mid = [x, y]
// return mid;
// }

let step_side = 0;
let lean_on_one_side = 0;
let step_into_frame =0;
let difference = 0;
let set_Limit_L = 1;
let set_Limit_R = 1;

const SideLunges = () => {
    //Rep Counter
    const [noOfRepsL, setNoOfRepsL] = useState(0);
    const [noOfRepsR, setNoOfRepsR] = useState(0);
    const [setL, setSetL] = useState(0);
    const [setR, setSetR] = useState(0);

    //Confidence Test case
    const [shoulder_confidence, setShoulderCon] = useState (NaN);
  
    //Outputs
    const [feedback, setFeedback] = useState ('');
    const [stageL, setStageL] = useState ('');
    const [stageR, setStageR] = useState ('');
  
    //Joints Position
    const [hipR, setHipR] = useState ([]);
    const [hipL, setHipL] = useState ([]);
    const [kneeR, setKneeR] = useState ([]);
    const [kneeL, setKneeL] = useState ([]);
    const [ankleL, setAnkleL] = useState ([]);
    const [ankleR, setAnkleR] = useState ([]);
  
    //Angles
    const [legAngleL, setLegAngleL] = useState (NaN);
    const [legAngleR, setLegAngleR] = useState (NaN);

    //Feedback counter
  
    const onPoseDetected = (pose) => {

      //Get user Joints
      if (pose[0]?.pose?.leftShoulder?.confidence + pose[0]?.pose?.rightShoulder?.confidence >1.3){

        setHipL([pose[0]?.pose?.leftHip?.x, pose[0]?.pose?.leftHip?.y]);
        setHipR([pose[0]?.pose?.rightHip?.x, pose[0]?.pose?.rightHip?.y]);
        setKneeL([pose[0]?.pose?.leftKnee?.x, pose[0]?.pose?.leftKnee?.y]);
        setKneeR([pose[0]?.pose?.rightKnee?.x, pose[0]?.pose?.rightKnee?.y]);
        setAnkleL([pose[0]?.pose?.leftAnkle?.x, pose[0]?.pose?.leftAnkle?.y])
        setAnkleR([pose[0]?.pose?.rightAnkle?.x, pose[0]?.pose?.rightAnkle?.y])

        setLegAngleL(find_angle(hipL, kneeL, ankleL));
        setLegAngleR(find_angle(hipR, kneeR, ankleR));

        difference = Math.abs(ankleL[0] - ankleR[0]); 

        if (difference < 170 && legAngleR>165){
          setStageR('Up');
        }

        if (difference < 170 && legAngleL>165){
          setStageL('Up');
        }

        if (difference <170){
          if(step_side>30){
            step_into_frame = 0;
            step_side = 0;
            lean_on_one_side = 0;
            setFeedback('spread leg');
            Tts.speak('spread leg');
          }
          step_side++;
        }
        
        if (difference > 170 && legAngleL>150 && legAngleR>150){
          if(lean_on_one_side>25){
            step_into_frame = 0;
            step_side = 0;
            lean_on_one_side = 0;
            setFeedback('Lean on one side and go lower');
            Tts.speak('Lean on one side and go lower');
          }
          lean_on_one_side++;
        }

        if (stageL =='Up' && difference > 170 && legAngleL<110){
          setStageL('Down');
          if (setL < set_Limit_L){
            setNoOfRepsL(pre=>pre+1); 
            Tts.speak('Correct Now Stand Up');
          }
        }

        if (stageR =='Up' && difference > 170 && legAngleR<110){
          setStageR('Down');
          if (setR < set_Limit_R){
            setNoOfRepsR(pre=>pre+1);
            Tts.speak('Correct Now Stand Up'); 
          }
        }

      }//if check for visbility
      else {
        if(step_into_frame>20){
          step_into_frame = 0;
          step_side = 0;
          lean_on_one_side = 0;
          setFeedback('Step into the frame');
          Tts.speak('Step into the frame');
        }
        step_into_frame++;
      }

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
      <Text>SetL:{setL}                              Side Lunges                             SetR:{setR}</Text>
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

export default SideLunges;