import React from 'react'

import { FlatList, View, Text } from 'react-native'
import { Card, H4 } from '../components/Misc'
import { css } from '@emotion/native'

export interface BubbleProps {
	sender: 'SGuardian' | 'SGuardAI'
	msg: string
	timestamp: string
}
function Bubble({ sender, msg, timestamp }: BubbleProps) {
	return (
		<View
			style={[
				css`
					border: 1px;
					border-color: black;
					width: 60%;
					height: auto;
					elevation: 5;
					border-radius: 12px;
					margin-bottom: 8px;
					padding: 4px;
				`,
				sender == 'SGuardian'
					? css`
							border-bottom-right-radius: 0px;
							margin-left: auto;
							background-color: lightgreen;
					  `
					: css`
							background-color: white;
							margin-right: auto;
							border-bottom-left-radius: 0px;
					  `,
			]}>
			<Text style={{ fontSize: 10 }}>{`${sender}`}</Text>
			<Text>{`${msg}`}</Text>
		</View>
	)
}

const ChatData: BubbleProps[] = [
	{
		sender: 'SGuardAI',
		msg: `Hello. I've detected a fall. Is this a false alarm, or is there an emergency?`,
		timestamp: '1',
	},
	{
		sender: 'SGuardian',
		msg: `there is an emergency`,
		timestamp: '2',
	},
	{
		sender: 'SGuardAI',
		msg: `Is the person responsive?`,
		timestamp: '3',
	},
	{
		sender: 'SGuardian',
		msg: `the person is not responsive`,
		timestamp: '4',
	},
	{
		sender: 'SGuardAI',
		msg: `Does the person report any of the following: chest pains, shortness of breath, dizziness, heartburn?`,
		timestamp: '5',
	},
	{
		sender: 'SGuardian',
		msg: `yes`,
		timestamp: '6',
	},
	{
		sender: 'SGuardAI',
		msg: `This person may have had a heart attack. Emergency services have been contacted and will be there shortly. Please place the person in the recovery position and conttinue to monitor their pulse.`,
		timestamp: '7',
	},
	{
		sender: 'SGuardian',
		msg: `okay`,
		timestamp: '8',
	},
	{
		sender: 'SGuardian',
		msg: `what I do next`,
		timestamp: '9',
	},
	{
		sender: 'SGuardAI',
		msg: `The conversation thus far has been directly extracted from a test session between the developer, John-Henry, and the voicebot. Unfortunately, conversation retrieval requires an enterprise plan on IBM Cloud hence why this conversation is hardcoded.`,
		timestamp: '10',
	},
]

function Conversation() {
	return (
		<View style={{ height: '100%', backgroundColor: '#000E44' }}>
			<Card style={{ height: '80%' }}>
				<H4 style={{ marginBottom: 12 }}>Previous Emergency: 25 June 2021</H4>
				<FlatList
					data={ChatData}
					renderItem={({ item }) => <Bubble {...item} />}
					keyExtractor={(_, index) => index.toString()}
				/>
			</Card>
		</View>
	)
}

export default Conversation
