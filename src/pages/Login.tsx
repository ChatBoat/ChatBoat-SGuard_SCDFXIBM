import React from 'react'
import { Image, View } from 'react-native'
import { H4 } from '../components/Misc'
import { GoogleSignin, GoogleSigninButton } from '@react-native-google-signin/google-signin'
import auth from '@react-native-firebase/auth'
import Toast from 'react-native-toast-message'

GoogleSignin.configure({
	webClientId: '390619780775-sl9jri28t4e9tg8ovsvq1vuhuvtb3sn7.apps.googleusercontent.com',
})

function Login() {
	function onGoogleButtonPress() {
		;(async () => {
			const { idToken } = await GoogleSignin.signIn()
			const googleCredential = auth.GoogleAuthProvider.credential(idToken)
			return auth().signInWithCredential(googleCredential)
		})()
			.then(() =>
				Toast.show({
					type: 'success',
					text1: 'Signed In with Google',
				})
			)
			.catch((e) => console.error(e))
	}

	return (
		<View
			style={{
				height: '100%',
				backgroundColor: 'white',
				paddingVertical: 128,
				alignItems: 'center',
				justifyContent: 'center',
			}}>
			<Image style={{ width: 240, height: 240 }} source={require('../img/SGuard.png')} />
			<H4 style={{ marginTop: 48 }}>Login With...</H4>
			<GoogleSigninButton
				style={{ width: 192, height: 48 }}
				size={GoogleSigninButton.Size.Wide}
				color={GoogleSigninButton.Color.Dark}
				onPress={onGoogleButtonPress}
			/>
		</View>
	)
}

export default Login
