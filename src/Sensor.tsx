import React,{ createContext, ReactNode, useEffect, useState, useContext } from "react";
import { ChartDataPoint } from "react-native-responsive-linechart";
import {
  accelerometer,
  setUpdateIntervalForType,
  SensorTypes
} from "react-native-sensors";
import { map } from "rxjs/operators";

const SensorContext = createContext<ChartDataPoint[]>([]);

export function SensorProvider({children}: {children: ReactNode}){
	const accelerometerPollRate = 100; //ms
	const [data, setData] = useState<ChartDataPoint[]>([{x:0,y:0},{x:0,y:10}]);
	const [polls, setPolls] = useState(0);
	setUpdateIntervalForType(SensorTypes.accelerometer, accelerometerPollRate);
	useEffect(()=>{
		const subscription = accelerometer.pipe(map(({y}) => y)).subscribe(
			ySpeed => {
				setData([...data,
					{x:polls*accelerometerPollRate/1000,y:ySpeed}
				])
				setPolls(polls+1);
			}
		);
		return ()=>subscription.unsubscribe();
	});
	return (
		<SensorContext.Provider value={data}>
			{children}
		</SensorContext.Provider>
	);
}

export function useAccelerometer(){
	const data = useContext(SensorContext);

	return data.slice(-100);
}
