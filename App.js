import React, {useEffect, useState} from 'react';
import HumanPose from 'react-native-human-pose';
import {View, Text} from 'react-native';
import Tts from 'react-native-tts';

function find_angle(A,B,C) {
  var AB = Math.sqrt(Math.pow(B[0]-A[0],2)+ Math.pow(B[1]-A[1],2));    
  var BC = Math.sqrt(Math.pow(B[0]-C[0],2)+ Math.pow(B[1]-C[1],2)); 
  var AC = Math.sqrt(Math.pow(C[0]-A[0],2)+ Math.pow(C[1]-A[1],2));
  const angle = (Math.acos((BC*BC+AB*AB-AC*AC)/(2*BC*AB))*180)/Math.PI;
  return angle;
}

let step_into_frame= 0;
let put_arms_close = 0;
const App = () => {
  //Rep Counter
  const [noOfRepsL, setNoOfRepsL] = useState(0);
  const [noOfRepsR, setNoOfRepsR] = useState(0);
  
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

        //Right Joints Position
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
          setNoOfRepsL(pre=>pre+1); 
        }

        if(AngleR>165){
          setStageR('Down');
        }
        if (stageR=='Down' && AngleR<35){
          setStageR('Up');
          setNoOfRepsR(pre=>pre+1); 
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



  }; //POSE Detect



  return (
    <View style={{flex: 1}}>
      <Text>Human Pose</Text>
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
        L Reps: {noOfRepsL}  |  R Reps: {noOfRepsR}
      </Text>
    </View>
  );
};

export default App;