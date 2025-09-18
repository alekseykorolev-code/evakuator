import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { RequestProvider } from '@/context/RequestContext';
import RequestScreen from '@/screens/RequestScreen';
import HistoryScreen from '@/screens/HistoryScreen';
import ProfileScreen from '@/screens/auth/ProfileScreen';
import AuthScreen from '@/screens/auth/AuthScreen';
import { Ionicons } from '@expo/vector-icons';
import { Text, View } from 'react-native';

const Tab = createBottomTabNavigator();

function AppTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: true,
        tabBarActiveTintColor: '#1f6feb',
        tabBarInactiveTintColor: '#6b7280',
        tabBarStyle: { height: 64, paddingBottom: 10, paddingTop: 8 },
        tabBarIcon: ({ color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'ellipse';
          if (route.name === 'Новая заявка') iconName = 'car-outline';
          else if (route.name === 'История') iconName = 'time-outline';
          else if (route.name === 'Профиль') iconName = 'person-circle-outline';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Новая заявка" component={RequestScreen} />
      <Tab.Screen name="История" component={HistoryScreen} />
      <Tab.Screen name="Профиль" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

function Root() {
  const { isAuthenticated } = useAuth();
  return (
    <NavigationContainer theme={{ ...DefaultTheme }}>
      {isAuthenticated ? <AppTabs /> : <AuthScreen />}
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <RequestProvider>
          <Root />
          <StatusBar style="dark" />
        </RequestProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}

