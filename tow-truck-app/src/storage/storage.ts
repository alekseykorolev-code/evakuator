import AsyncStorage from '@react-native-async-storage/async-storage';
import { TowRequest, UserProfile } from '@/types';

const KEYS = {
  requests: 'tow_truck_requests_v1',
  user: 'tow_truck_user_v1',
};

export async function loadUser(): Promise<UserProfile | null> {
  try {
    const raw = await AsyncStorage.getItem(KEYS.user);
    return raw ? (JSON.parse(raw) as UserProfile) : null;
  } catch {
    return null;
  }
}

export async function saveUser(user: UserProfile | null): Promise<void> {
  if (!user) {
    await AsyncStorage.removeItem(KEYS.user);
    return;
  }
  await AsyncStorage.setItem(KEYS.user, JSON.stringify(user));
}

export async function loadRequests(): Promise<TowRequest[]> {
  try {
    const raw = await AsyncStorage.getItem(KEYS.requests);
    return raw ? (JSON.parse(raw) as TowRequest[]) : [];
  } catch {
    return [];
  }
}

export async function saveRequests(requests: TowRequest[]): Promise<void> {
  await AsyncStorage.setItem(KEYS.requests, JSON.stringify(requests));
}

