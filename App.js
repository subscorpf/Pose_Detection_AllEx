import React, {useEffect, useState} from 'react';
import HumanPose from 'react-native-human-pose';
import {View, Text, Pressable} from 'react-native';
import BicepCurl from './Screens/BicepCurl';
import PushUp from './Screens/PushUp';
import Squats from './Screens/Squats';
import WallSit from './Screens/WallSit';
import DumbbellDeadlift from './Screens/DumbbellDeadlift';
import JumpingJack from './Screens/JumpingJack';
import ShoulderPress from './Screens/ShoulderPress';

const App = () => {
  const [currentEx, setCurrentEX] = useState(0);
  
  const Helper= () => {
    if (currentEx<0){
      setCurrentEX(0);
      return <Squats/>;
    }
    else if (currentEx>6){
      setCurrentEX(6);
      return <ShoulderPress/>;
    }
    else {
      if (currentEx == 0){
        return <Squats/>;
      }
      else if (currentEx == 1){
        return <BicepCurl/>;
      }
      else if (currentEx == 2){
        return <PushUp/>;
      }
      else if (currentEx == 3){
        return <WallSit/>;
      }
      else if (currentEx == 4){
        return <DumbbellDeadlift/>;
      }
      else if (currentEx == 5){
        return <JumpingJack/>;
      }
      else if (currentEx == 6){
        return <ShoulderPress/>;
      }
    }
  }

  return (
    <View style={{flex: 1}}>
      <Helper/>
      <Pressable style = {{position: 'absolute', top: 50, zIndex: 10, padding:5, backgroundColor: 'rgba(255,255,255,0.3)'}} 
      onPress={()=>{
        setCurrentEX(pre=>pre-1);
      }}>
        <Text>Left</Text>
      </Pressable>
      
      <Pressable style = {{position: 'absolute',left: 220 ,top: 50, zIndex: 10, padding:5, backgroundColor: 'rgba(255,255,255,0.3)'}} 
      onPress={()=>{
        setCurrentEX(pre=>pre+1);
      }}>
        <Text>Right</Text>
      </Pressable>

    </View>
  );
};

export default App;