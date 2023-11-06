import React, {useEffect, useState} from 'react';
import HumanPose from 'react-native-human-pose';
import {View, Text} from 'react-native';
import Tts from 'react-native-tts';
import { find_angle } from '../Util/HelperFunction';

let lean_forward = 0;  
let lean_backward = 0;
let lower_hip = 0;
let step_into_frame =0;
const Squats = () => {
    //Rep Counter
    const [noOfReps, setNoOfReps] = useState(0);
  
    //Confidence Test case
    const [knee_confidence, setKneeCon] = useState (NaN);
    const [hip_confidence, setHipCon] = useState (NaN);
    const [shoulder_confidence, setShoulderCon] = useState (NaN);
  
    //Outputs
    const [feedback, setFeedback] = useState ('');
    const [stage, setStage] = useState ('');
  
    //Joints Position
    const [shoulder, setShoulder] = useState ([]);
    const [hip, setHip] = useState ([]);
    const [knee, setKnee] = useState ([]);
    const [ankle, setAnkle] = useState ([]);
    
    //Vert Joints for Test case 
    const [vertKnee, setVertKnee] = useState ([]);
    const [vertHip, setVertHip] = useState ([]);
  
    //Angles
    const [hipAngle, setHipAngle] = useState (NaN);
    const [kneeAngle, setKneeAngle] = useState (NaN);
    const [vert_kneeAngle, setVertKneeAngle] = useState (NaN);
    const [vert_hipAngle, setVertHipAngle] = useState (NaN);

    //Feedback counter
  
    const onPoseDetected = (pose) => {

      //Get user Joints
      if (pose[0]?.pose?.leftShoulder?.confidence > pose[0]?.pose?.rightShoulder?.confidence){
        
        setShoulder([pose[0]?.pose?.leftShoulder?.x, pose[0]?.pose?.leftShoulder?.y]);
        setHip([pose[0]?.pose?.leftHip?.x, pose[0]?.pose?.leftHip?.y]);
        setKnee([pose[0]?.pose?.leftKnee?.x, pose[0]?.pose?.leftKnee?.y]);
        setAnkle([pose[0]?.pose?.leftAnkle?.x, pose[0]?.pose?.leftAnkle?.y]);
        setKneeCon(pose[0]?.pose?.leftKnee?.confidence);
        setHipCon(pose[0]?.pose?.leftHip?.confidence);
        setShoulderCon(pose[0]?.pose?.leftShoulder?.confidence)
        //console.log("Left");
   
      }
      else {
        setShoulder([pose[0]?.pose?.rightShoulder?.x, pose[0]?.pose?.rightShoulder?.y]);
        setHip([pose[0]?.pose?.rightHip?.x, pose[0]?.pose?.rightHip?.y]);
        setKnee([pose[0]?.pose?.rightKnee?.x, pose[0]?.pose?.rightKnee?.y]);
        setAnkle([pose[0]?.pose?.rightAnkle?.x, pose[0]?.pose?.rightAnkle?.y]);
        setKneeCon(pose[0]?.pose?.rightKnee?.confidence);
        setHipCon(pose[0]?.pose?.rightHip?.confidence);
        setShoulderCon(pose[0]?.pose?.rightShoulder?.confidence)
        //console.log("Right");
  
      }
  
      if (knee_confidence > 0.5 && hip_confidence>0.5 && shoulder_confidence>0.5){

        //Determine the Vert Position for Test
      setVertHip([hip[0], (hip[1]-40)]);
      setVertKnee([knee[0], (knee[1]-40)]);
  
      //Set the angle 
      setHipAngle(find_angle(shoulder, hip, knee));
      setKneeAngle(find_angle(hip, knee, ankle));
  
      setVertKneeAngle(find_angle(vertKnee, knee, hip));
      setVertHipAngle(find_angle(vertHip, hip, shoulder))
  
      //console.log("Hip Angle = ", hipAngle, " Knee Angle = ", kneeAngle);
      //console.log("Vert Hip Angle = ", vert_hipAngle, " Vert Knee Angle = ", vert_kneeAngle);
      
      // console.log('*************************************');
      // console.log('Hip Angle = ', hipAngle);
      // console.log('Knee Angle = ', kneeAngle);
      // console.log('Vert Hip Angle = ', vert_hipAngle);
      //console.log('Vert knee Angle = ', vert_kneeAngle);
      //console.log('Confidence = ', knee_confidence);
      // console.log('*************************************');
      
      //Test cases
      if (hipAngle > 170 && kneeAngle > 165){
        setStage('Standing');
      }
      
      if (stage == 'Standing' && vert_hipAngle < 20 && hip_confidence>0.50){
        if(lean_forward>17){
          lean_forward = 0;
          lean_backward = 0;
          lower_hip = 0;
          setFeedback('Lean Forward');
          Tts.speak('Lean Forward');
        }
        lean_forward++;
        console.log('LF = ',lean_forward);
      }
      else if(stage == 'Standing' && vert_hipAngle > 44 && hip_confidence>0.50){
        if(lean_backward>17){
          lean_backward = 0;
          lean_forward = 0;
          lower_hip = 0;
          setFeedback('Lean Backwards');
          Tts.speak('Lean Backwards');
        }
        lean_backward++;
        console.log('LB = ',lean_backward);
      }
      else if (stage == 'Standing' && vert_kneeAngle < 75 && knee_confidence>0.50){
        if(lower_hip>17){
          lower_hip = 0;
          lean_backward = 0;
          lean_forward = 0;
          setFeedback('Lower your hips');
          Tts.speak('Lower your hips');
        }
        lower_hip++;
        console.log('LH = ',lower_hip);
      }
      else if (stage =='Standing' && vert_hipAngle>=20 && vert_hipAngle<=44 && vert_kneeAngle>=75 && vert_kneeAngle<=85){
        setStage('Down');
        Tts.speak('Correct Squat');
        setNoOfReps(pre=>pre+1); 
      }




      }//if check for visbility
      else {
        if(step_into_frame>20){
          step_into_frame = 0;
          lower_hip = 0;
          lean_backward = 0;
          lean_forward = 0;
          setFeedback('Step into the frame');
          Tts.speak('Step into the frame');
        }
        step_into_frame++;
      }
      
      
    }; //POSE Detect
  


  return (
    <View style={{flex: 1}}>
      <Text>Squats</Text>
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
        Squat Reps: {noOfReps}
      </Text>
    </View>
  );
};

export default Squats;