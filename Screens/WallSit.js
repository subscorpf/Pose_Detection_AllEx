import React, {useEffect, useState, useRef} from 'react';
import HumanPose from 'react-native-human-pose';
import {View, Text, StyleSheet, TouchableOpacity, Button} from 'react-native';
import Tts from 'react-native-tts';
import { find_angle } from '../Util/HelperFunction';

let step_into_frame= 0;
let go_lower =0;
const WallSit = () => {
  //Boolean to check of user Visibility (For StopWatch)
  const [user_visibility, setUserVisibility] = useState(false);

  //Stores confidence of Both Right and Left joints
  const [shoulder_confidence, setShoulderCon] = useState (NaN);
  const [knee_confidence, setKneeCon] = useState (NaN);
  
  //Joints
  const [knee, setKnee] = useState ([]);
  const [hip, setHip] = useState ([]);
  const [ankle, setAnkle] = useState ([]);

  //Stop watch
  const [timer, setTimer] = useState(0);
  const countRef = useRef(null);// reference to the interval ID

  //Set Angle
  const [kneeAngle, setKneeAngle] = useState (NaN);

  // function to handle the start button press
  const handleStart = () => {
    countRef.current = setInterval(() => {
      setTimer((timer) => timer + 1);
    }, 1000);
  };

  //Everytime visbility changes run useEfftect
  useEffect(()=> {
    if (user_visibility){
      handleStart();
    }
    else {
      handlePause();
    }
  }, [user_visibility])

  // function to handle the pause button press
  const handlePause = () => {
    clearInterval(countRef.current);
  };

  // function to handle the reset button press
  const handleReset = () => {
    clearInterval(countRef.current);
    setTimer(0);
  };
  // calculate the time values for display
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  //Pose Detetct
  const onPoseDetected = (pose) => {
    
     //Get user Joints
     if (pose[0]?.pose?.leftShoulder?.confidence > pose[0]?.pose?.rightShoulder?.confidence){
        
      setHip([pose[0]?.pose?.leftHip?.x, pose[0]?.pose?.leftHip?.y]);
      setKnee([pose[0]?.pose?.leftKnee?.x, pose[0]?.pose?.leftKnee?.y]);
      setAnkle([pose[0]?.pose?.leftAnkle?.x, pose[0]?.pose?.leftAnkle?.y]);
      setKneeCon(pose[0]?.pose?.leftKnee?.confidence);
      setShoulderCon(pose[0]?.pose?.leftShoulder?.confidence);
      //console.log("Left");
 
    }
    else {
      setHip([pose[0]?.pose?.rightHip?.x, pose[0]?.pose?.rightHip?.y]);
      setKnee([pose[0]?.pose?.rightKnee?.x, pose[0]?.pose?.rightKnee?.y]);
      setAnkle([pose[0]?.pose?.rightAnkle?.x, pose[0]?.pose?.rightAnkle?.y]);
      setKneeCon(pose[0]?.pose?.rightKnee?.confidence);
      setShoulderCon(pose[0]?.pose?.leftShoulder?.confidence);
      //console.log("Right");
    }
    setKneeAngle(find_angle(hip, knee, ankle));
    console.log('Knee angle = ', kneeAngle);

    if (shoulder_confidence > 0.6 && knee_confidence > 0.6){
      if (kneeAngle<=120){
        setUserVisibility(true);
      }
      else {
        setUserVisibility(false);
        if(go_lower>20){
          go_lower = 0;
          step_into_frame = 0;
          Tts.speak('Go Lower');
        }
        go_lower++;

      }
      
    }
    else{
      setUserVisibility(false);
      if(step_into_frame>20){
        step_into_frame = 0;
        Tts.speak('Step into the frame');
      }
      step_into_frame++;
    }



  }; //POSE Detect



  return (
    <>

    <View style={{flex: 1}}>
      <Text>Wall Sit</Text>
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
    </View>

      <View style={styles.timerContainer}>
        <Text style={styles.timer}>{formatTime(timer)}</Text>

        <TouchableOpacity style={styles.button} onPress={handleReset}>
              <Text style={styles.buttonText}>Reset</Text>
        </TouchableOpacity>
      </View>

</>
  );
};

const styles = StyleSheet.create({
  timer: {
    fontSize: 30,
    color: 'black',
  },
  timerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  buttonContainer: {
      flexDirection: 'row',
      marginTop: 30,
  },
  button: {
    width: 50,
    height: 50,
    borderRadius: 80 / 2,
    backgroundColor: 'blue',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5,
  },
  buttonText: {
    fontSize: 15,
    color: '#fff',
  },
});

export default WallSit;