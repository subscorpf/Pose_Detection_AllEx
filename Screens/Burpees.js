import React, {useEffect, useState, useRef} from 'react';
import HumanPose from 'react-native-human-pose';
import {View, Text, StyleSheet, TouchableOpacity, Button} from 'react-native';
import Tts from 'react-native-tts';


let step_into_frame= 0;
let set_time_limit= 30; //-->Timer Limit
let set_Limit= 3;

const Burpees = () => {
  //Set counter
  const [set, setSet] = useState(0);

  //
  const [buttonName, setButtonName] = useState('Start');

  //Boolean to Start timer
  const [user_start, setUserStart] = useState(false);

  //Boolean to check of user Visibility (For StopWatch)
  const [user_visibility, setUserVisibility] = useState(false);

  //Stores confidence of Both Right and Left joints
  const [shoulder_confidence, setShoulderCon] = useState (NaN);

  //Stop watch
  const [timer, setTimer] = useState(0);
  const countRef = useRef(null);// reference to the interval ID

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
    setButtonName("Start");
    setUserStart(false);
    setUserVisibility(false);
    setTimer(0);
  };
  
  const handleStartBool = () => {
    if (buttonName == "Start"){
      setUserStart(true);
      setButtonName("Pause");
    }
    else if (buttonName == "Pause"){
      handlePause();
      setUserStart(false);
      setButtonName("Start");
      setUserVisibility(false);
    }
  };
  

  // calculate the time values for display
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  //Pose Detetct
  const onPoseDetected = (pose) => {
    
    setShoulderCon(pose[0]?.pose?.leftShoulder?.confidence + pose[0]?.pose?.rightShoulder?.confidence)
     //Get user Joints
     if (shoulder_confidence > 1.5){

      if(user_start == true){
        if(timer % 60 == set_time_limit){
          handleReset()
          if (set < set_Limit){
            setSet(pre=>pre+1)
          }
        }
        else {
          setUserVisibility(true);
        }
      }
      else {
        setUserVisibility(false);
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

    console.log('************');
    console.log('User Visibility = ', user_visibility);
    console.log('User Start = ', user_start);
    console.log('************');

  }; //POSE Detect

  


  return (
    <>

    <View style={{flex: 1}}>
      <Text>Burpees                                                          Set:{set}</Text>
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
    </View>

      <View style={styles.timerContainer}>
      <TouchableOpacity style={styles.button} onPress={handleStartBool}>
              <Text style={styles.buttonText}>{buttonName}</Text>
        </TouchableOpacity>

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

export default Burpees;