import React, { useEffect, useState } from 'react';
import { css } from '@emotion/native';
import FallDetectionService from '../FallDetection';

import { View, Text, Button, TextInput } from 'react-native';
import { SensorsSection } from '../Sensors';
import { useVoicebot } from '../BotProvider';
import RNCallKeep from 'react-native-callkeep';

function Home() {
  const [state, setState] = useState('hello world');
  useEffect(() => {
    FallDetectionService.getSecret(2).then(setState);
  });

  const {startCall,endCall} = useVoicebot();

  const getPermissions = () => {
    FallDetectionService.emergencyEventEmitter.removeAllListeners('succ');
    FallDetectionService.emergencyEventEmitter.addListener('succ', data => {
      startCall();
    });
  };

  useEffect(getPermissions,[]);
  
  return (
    <View>
      <Text
        style={css`
          color: red;
        `}>
        {state}
      </Text>
      <SensorsSection />
      <View style={css`
        padding: 20px;
        flex-direction: row;
      `}>
        <Text style={css`flex: 1; align-self: center`}>Phone Number: </Text>
        <TextInput
          style={css`
            border-width: 1px;
            flex: 2;
            padding: 4px 10px;
          `}
          onChangeText={(v)=>{}}
          value={'disabled'}
          placeholder="set phone number"
          keyboardType="phone-pad"
        />
      </View>
      <Button title="Start FallDetectionService" onPress={()=>FallDetectionService.startFallDetectionService(1000)}></Button>
      <Button title="Test calling" onPress={()=>{startCall()}}></Button>
      <Button title="Stop calling" onPress={()=>{endCall()}}></Button>
    </View>
  );
}

export default Home;
