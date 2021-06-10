import styled, { css } from '@emotion/native'
import React, { ComponentProps, ReactText } from 'react'
import { Pressable, Text } from 'react-native'

export const H1 = styled.Text`
	font-size: 64px;
`
export const H2 = styled.Text`
	font-size: 48px;
`
export const H3 = styled.Text`
	font-size: 24px;
`
export const H4 = styled.Text`
	font-size: 16px;
`

export const Card = styled.View`
	margin: 8px;
	padding: 4px;
	flex-direction: column;
	border-width: 1px;
	border-radius: 4px;
	border-color: lightgray;
	background-color: white;
	elevation: 5;
`

export interface ButtonProps extends ComponentProps<typeof Pressable> {
	children: ReactText
}

export const Button = ({ children, style, ...props }: ButtonProps) => {
	return (
		<Pressable
			style={({ pressed }) =>
				[
					css`
						background-color: hsl(240, 100%, 50%);
						align-items: center;
						justify-content: center;
						padding: 8px 16px;
						border-radius: 8px;
						border-width: 4px;
						border-color: transparent;
					`,
					pressed &&
						css`
							background-color: hsl(240, 60%, 50%);
							border-color: hsl(240, 30%, 50%);
						`,
					,
					style,
				] as any
			}
			{...props}>
			{({ pressed }) => (
				<H4
					style={[
						css`
							color: white;
						`,
						pressed &&
							css`
								color: hsl(240, 50%, 70%);
							`,
					]}>
					{children}
				</H4>
			)}
		</Pressable>
	)
}

export const Row = styled.View`
	flex-direction: row;
	padding: 4px 0px;
`
