import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import HistoryScreen from '../screens/HistoryScreen';

const Tab = createBottomTabNavigator();

export default function BottomTabs({ user, onUserChange }) {
	return (
		<Tab.Navigator initialRouteName="Home" screenOptions={{ headerShown: true, tabBarLabelStyle: { fontSize: 12 } }}>
			<Tab.Screen name="Home" options={{ title: 'Новая заявка' }}>
				{() => <HomeScreen user={user} />}
			</Tab.Screen>
			<Tab.Screen name="History" options={{ title: 'История' }}>
				{() => <HistoryScreen />}
			</Tab.Screen>
		</Tab.Navigator>
	);
}