import React, { useLayoutEffect, useState } from 'react'

import { View, Text, Button, FlatList } from 'react-native'
import { Card, H3, H4 } from '../components/Misc'
import { Picker } from '@react-native-picker/picker'
import Slider from '@react-native-community/slider'
import { useStorage } from '../..'
import Icon from 'react-native-vector-icons/FontAwesome5'
import Toast from 'react-native-toast-message'

function uuidv4() {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
		var r = (Math.random() * 16) | 0,
			v = c == 'x' ? r : (r & 0x3) | 0x8
		return v.toString(16)
	})
}

interface EntryProps {
	conditionName: string
	seriousness: number
	uuid: string
}

const useMedicalData = () =>
	useStorage('med_history') as unknown as [EntryProps[], (data: EntryProps[]) => void]

function NewHistoryCard() {
	const [condition, setCondition] = useState('High Blood Pressure')
	const [seriousness, setSeriousness] = useState(5)
	const [data, setData] = useMedicalData()
	return (
		<Card>
			<H3>Add History</H3>
			<Picker selectedValue={condition} onValueChange={(itemValue) => setCondition(itemValue)}>
				<Picker.Item label="High Blood Pressure" value="High Blood Pressure" />
				<Picker.Item label="Obesity" value="Obesity" />
				<Picker.Item label="Smoking" value="Smoking" />
				<Picker.Item label="Osteoporosis" value="Osteoporosis" />
				<Picker.Item label="Narcolepsy" value="Narcolepsy" />
				<Picker.Item label="Insomnia" value="Insomnia" />
			</Picker>
			<View style={{ flexDirection: 'row', marginLeft: 16, marginBottom: 8 }}>
				<H4>Seriousness</H4>
				<Slider
					style={{ width: 250, height: 24 }}
					minimumValue={1}
					maximumValue={10}
					value={5}
					onValueChange={setSeriousness}
					step={1}
					minimumTrackTintColor="#ff3333"
					maximumTrackTintColor="#dddddd"
				/>
			</View>
			<View style={{ paddingHorizontal: 128 }}>
				<Button
					onPress={() => {
						setData([
							...(data ?? []),
							{
								conditionName: condition,
								seriousness: seriousness,
								uuid: uuidv4(),
							},
						])
						Toast.show({
							type: 'success',
							text1: 'info added',
						})
					}}
					title="add"
				/>
			</View>
		</Card>
	)
}

function Entry({ conditionName, seriousness, uuid }: EntryProps) {
	const [data, setData] = useMedicalData()
	return (
		<Card style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
			<H4>{conditionName}</H4>
			<View style={{ flexGrow: 1 }}></View>
			<H4>Risk: {seriousness}</H4>
			<Icon.Button
				name="trash"
				size={16}
				iconStyle={{ marginRight: 0, padding: 0, textAlign: 'right' }}
				borderRadius={9999}
				backgroundColor="white"
				color="black"
				onPress={() => {
					setData(data.filter((item) => item.uuid != uuid))
					Toast.show({
						type: 'success',
						text1: 'info deleted',
					})
				}}
			/>
		</Card>
	)
}

function Medical() {
	const [data, setData] = useMedicalData()
	useLayoutEffect(() => {
		if (data == null) setData([])
	}, [])

	return (
		<View style={{ height: '100%', backgroundColor: '#000E44' }}>
			<NewHistoryCard />
			<FlatList
				data={data}
				renderItem={({ item }) => <Entry {...item} />}
				keyExtractor={(item) => item.uuid}
			/>
		</View>
	)
}

export default Medical
