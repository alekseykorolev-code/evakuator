import AsyncStorage from '@react-native-async-storage/async-storage';

const USER_KEY = '@towapp:user';
const REQUESTS_KEY = '@towapp:requests';

export async function saveUser(user) {
	await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
	return user;
}

export async function getStoredUser() {
	const raw = await AsyncStorage.getItem(USER_KEY);
	return raw ? JSON.parse(raw) : null;
}

export async function clearUser() {
	await AsyncStorage.removeItem(USER_KEY);
}

export async function addRequest(request) {
	const list = await getRequests();
	const next = [request, ...list];
	await AsyncStorage.setItem(REQUESTS_KEY, JSON.stringify(next));
	return next;
}

export async function getRequests() {
	const raw = await AsyncStorage.getItem(REQUESTS_KEY);
	return raw ? JSON.parse(raw) : [];
}