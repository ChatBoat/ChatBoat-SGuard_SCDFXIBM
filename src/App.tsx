/**
 * @format
 */

import React, {useEffect, useRef, useState} from 'react';
import styled, {css} from '@emotion/native';
import FallDetectionService from './FallDetection';
import RNCallKeep from 'react-native-callkeep';

import {
  FlatList,
  View,
  Text,
  useWindowDimensions,
  Button,
} from 'react-native';
import {
  Area,
  Chart,
  ChartDataPoint,
  HorizontalAxis,
  Line,
  VerticalAxis,
} from 'react-native-responsive-linechart';
import {
  H2,
  H3,
} from './Misc';

interface SensorGraphProps {
  name: string;
  color: string;
  /** Hook to get array of points. x is in seconds, y determines on the sensor. */
  useSensor: () => ChartDataPoint[];
}

function fakeHeartRateHook() {
  const [data, setData] = useState<ChartDataPoint[]>([
    {x: 0, y: 60},
    {x: 10, y: 70},
    {x: 20, y: 30},
    {x: 30, y: 20},
    {x: 40, y: 80},
    {x: 50, y: 60},
    {x: 60, y: 12},
    {x: 70, y: 58},
    {x: 80, y: 98},
    {x: 90, y: 45},
    {x: 99, y: 30},
  ]);
  return data;
}

function SensorGraph({name, color, useSensor}: SensorGraphProps) {
  /*
   * x should be in seconds I guess, though sub-second values will probably be used.
   * for now, tick rate is hardcoded as 5 seconds.
   */
  const {width} = useWindowDimensions();
  const data = useSensor();
  const chartRef = useRef(null);

  const xMax = Math.max(...data.map(i => i.x));
  const yMax = Math.max(...data.map(i => i.y))*4/3;
  const tickRate = 5;

  useEffect(() => {
    chartRef?.current?.setViewportOrigin({ x: xMax, y: 0 });
  })

  return (
    <View>
      <H3>{name}</H3>
      
      <Chart
        data={data}
        padding={{left: 25, bottom: 20, right: 20, top: 20}}
        style={{height: 200, width: width}}
        xDomain={{min: 0, max: xMax}}
        yDomain={{min: 0, max: yMax}}
        {/* @ts-ignore */...[]}
        ref={chartRef}
        viewport={{
          initialOrigin: {x: 0, y: 0},
          size: {width: tickRate*10, height: yMax},
        }}>
        <VerticalAxis
          tickCount={11}
          theme={{labels: {formatter: v => v.toFixed(0)}}}
        />
        <HorizontalAxis
          tickCount={Math.floor(xMax/tickRate)}
          theme={{labels: {formatter: v => v.toFixed(0)}}}
        />
        <Area
          theme={{
            gradient: {
              from: {color: color},
              to: {color: color, opacity: 0.2},
            },
          }}
        />
        <Line theme={{stroke: {color: color, width: 5}}} />
      </Chart>
    </View>
  );
}

function SensorsSection() {
  // sensorData array is retrieved somehow by some process detecting what sensors are available
  const sensors: SensorGraphProps[] = [
    {name: 'HeartRate (bpm against time/s)', color:'#44bd32', useSensor: fakeHeartRateHook},
    //{name: 'ySpeed (ms^2 against time/s)', color:'#823722', useSensor: useAccelerometer}
  ];
  return (
    <View>
      <H2>Sensors</H2>
      <FlatList
        data={sensors}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({item}) => <SensorGraph {...item} />}
      />
    </View>
  );
}

function App() {
  const [state, setState] = useState("hello world");
  useEffect(() => {
    FallDetectionService.getSecret(2).then(setState);
  });

  const getPermissions = () => {
    /*
    * background tasks might be here idk
    */
    const options = {
      ios: {
        appName: 'My app name',
      },
      android: {
        alertTitle: 'Permissions required',
        alertDescription: 'This application needs to access your phone accounts',
        cancelButton: 'Cancel',
        okButton: 'ok',
        imageName: 'phone_account_icon',
        additionalPermissions: [''],
        // Required to get audio in background when using Android 11
        foregroundService: {
          channelId: 'EMERGENCY_CALL_SERVICE',
          channelName: 'Lmao you dead',
          notificationTitle: 'pew pew',
          notificationIcon: 'phone_account_icon',
        },
      },
    };

    RNCallKeep.setup(options).then(accepted => {
      
    });
    FallDetectionService.emergencyEventEmitter.addListener('succ', data => {
      console.debug(data); //will probably send some sensor data? idk
      RNCallKeep.startCall('well_test_call_1', '+6591504882', 'chatbot');
    });
  };
  
  return (
    <View>
      <Text
        style={css`
          color: red;
        `}>
        {state}
      </Text>
      <SensorsSection />
      <Button title="Start FallDetectionService" onPress={()=>FallDetectionService.startFallDetectionService(1000)}></Button>
      <Button title="Register chatbot permissions" onPress={getPermissions}></Button>
      <Button title="skip" onPress={()=>{RNCallKeep.startCall('well_test_call_1', '+6591504882', 'chatbot')}}></Button>
    </View>
  );
}

export default App;
