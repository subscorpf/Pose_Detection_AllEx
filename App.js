import React, {useEffect, useState} from 'react';
import HumanPose from 'react-native-human-pose';
import {View, Text, Pressable} from 'react-native';
import { Dimensions } from 'react-native';

import BicepCurl from './Screens/BicepCurl';
import PushUp from './Screens/PushUp';
import Squats from './Screens/Squats';
import WallSit from './Screens/WallSit';
import DumbbellDeadlift from './Screens/DumbbellDeadlift';
import JumpingJack from './Screens/JumpingJack';
import ShoulderPress from './Screens/ShoulderPress';

//New
import Burpees from './Screens/Burpees';
import ButtKicks from './Screens/ButtKicks';
import HighKnees from './Screens/HighKnees';
import LateralRaises from './Screens/LateralRaises';
import MoutainClimbers from './Screens/MountainClimbers';
import SideLunges from './Screens/SideLunges';
import SideHeelSquat from './Screens/SideHeelSquat';

const App = () => {
  const [ExArr, setExArr] = useState (['Burpees','BicepCurl', 'PushUp', 'Squats', 'WallSit', 'DumbbellDeadlift', 'JumpingJack', 
                                       'ShoulderPress', 'LateralRaises', 'SideLunges','ButtKicks', 'HighKnees', 
                                       'MountainClimbers', 'SideHeelSquat']);
                                       
  const [itr, setItr] = useState(0);
  const [currentEx, setCurrentEX] = useState(ExArr[itr]);
  const {width, height} = Dimensions.get('screen');

  console.log('Width = ', width);
  console.log('Height = ', height);

  const Helper= () => {
    
    if (currentEx == 'Squats'){
       return <Squats/>;
     }
    else if (currentEx == 'BicepCurl'){
       return <BicepCurl/>;
     }
    else if (currentEx == 'PushUp'){
       return <PushUp/>;
     }
    else if (currentEx == 'WallSit'){
       return <WallSit/>;
     }
    else if (currentEx == 'DumbbellDeadlift'){
       return <DumbbellDeadlift/>;
     }
    else if (currentEx == 'JumpingJack'){
       return <JumpingJack/>;
     }
    else if (currentEx == 'ShoulderPress'){
       return <ShoulderPress/>;
     }
    else if (currentEx == 'LateralRaises'){
       return <LateralRaises/>;
     }
    else if (currentEx == 'ButtKicks'){
       return <ButtKicks/>;
     }
    else if (currentEx == 'SideLunges'){
       return <SideLunges/>;
     }
    else if (currentEx == 'HighKnees'){
       return <HighKnees/>;
     }
    else if (currentEx == 'Burpees'){
       return <Burpees/>;
    }
    else if (currentEx == 'MountainClimbers'){
      return <MoutainClimbers/>;
   }
   else if (currentEx == 'SideHeelSquat'){
    return <SideHeelSquat/>;
   }
    
  }
  

  return (
    <View style={{flex: 1}}>
      <Helper/>
      <Pressable style = {{position: 'absolute', top: 50, zIndex: 10, padding:5, backgroundColor: 'rgba(255,255,255,0.3)'}} 
      onPress={()=>{
       if (itr<=0){
        setItr(0);
        setCurrentEX(ExArr[itr]);
       }
       else {
        setCurrentEX(ExArr[itr -1]);
        setItr(pre=>pre-1); 
       }
      }}>
        <Text>Left</Text>
      </Pressable>
      
      <Pressable style = {{position: 'absolute',left: 220 ,top: 50, zIndex: 10, padding:5, backgroundColor: 'rgba(255,255,255,0.3)'}} 
      onPress={()=>{
        if (itr >= ExArr.length-1){
          setItr(ExArr.length-1);
          setCurrentEX(ExArr[itr]);
        }
        else {
          setCurrentEX(ExArr[itr+1]);
          setItr(pre=>pre+1);
        }
      }}>
        <Text>Right</Text>
      </Pressable>

    </View>
  );
};

export default App;