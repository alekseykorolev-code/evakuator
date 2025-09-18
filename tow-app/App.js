import React, { useEffect, useState, useCallback } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import BottomTabs from './navigation/BottomTabs';
import LoginScreen from './screens/LoginScreen';
import { getStoredUser } from './utils/storage';

const navTheme = {
	...DefaultTheme,
	colors: {
		...DefaultTheme.colors,
		background: '#ffffff',
	},
};

export default function App() {
	const [isLoading, setIsLoading] = useState(true);
	const [user, setUser] = useState(null);

	const loadUser = useCallback(async () => {
		try {
			const u = await getStoredUser();
			setUser(u);
		} finally {
			setIsLoading(false);
		}
	}, []);

	useEffect(() => {
		loadUser();
	}, [loadUser]);

	if (isLoading) {
		return (
			<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
				<ActivityIndicator />
			</View>
		);
	}

	return (
		<NavigationContainer theme={navTheme}>
			{user ? (
				<BottomTabs user={user} onUserChange={setUser} />
			) : (
				<LoginScreen onLoginSuccess={setUser} />
			)}
		</NavigationContainer>
	);
}
