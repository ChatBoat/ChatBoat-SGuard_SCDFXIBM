/**
 * @format
 */

import React, {useEffect, useRef, useState} from 'react';
import styled, {css} from '@emotion/native';

import {
  FlatList,
  View,
  Text,
  useWindowDimensions,
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
import { SensorProvider,useAccelerometer } from './Sensor';

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
    {name: 'ySpeed (ms^2 against time/s)', color:'#823722', useSensor: useAccelerometer}
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
  return (
    <SensorProvider>
      <View>
        <Text
          style={css`
            color: red;
          `}>
          lmao
        </Text>
        <SensorsSection />
      </View>
    </SensorProvider>
  );
}

export default App;
