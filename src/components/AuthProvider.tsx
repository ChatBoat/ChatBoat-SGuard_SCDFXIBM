import React, { useLayoutEffect, createContext, useContext, useState, useEffect } from 'react'
import firebaseAuth, { FirebaseAuthTypes } from '@react-native-firebase/auth'
import Toast from 'react-native-toast-message'
import { Alert } from 'react-native'

export type authState = 'AUTH_LOADING' | 'LOGGED_IN' | 'LOGGED_OUT'

export interface authData {
	state: authState
	user?: FirebaseAuthTypes.User
	auth: FirebaseAuthTypes.Module
}

const auth = firebaseAuth()

export const AuthContext = createContext<authData>({
	state: 'AUTH_LOADING',
	user: null,
	auth: auth,
})
export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }) {
	const [state, setState] = useState<authState>('AUTH_LOADING')
	const [user, setUser] = useState<FirebaseAuthTypes.User>(null)

	useLayoutEffect(
		() =>
			auth.onAuthStateChanged((user) => {
				setUser(user)
				setState(user ? 'LOGGED_IN' : 'LOGGED_OUT')
			}),
		[]
	)

	useEffect(() => {
		if (state != 'AUTH_LOADING') return
		const id = setTimeout(
			() =>
				Toast.show({
					type: 'error',
					text1: 'Taking a while to connect, check your internet connection',
					autoHide: false,
				}),
			5000
		)
		return () => {
			Toast.hide()
			clearTimeout(id)
		}
	}, [state])

	return <AuthContext.Provider value={{ state, user, auth }}>{children}</AuthContext.Provider>
}
