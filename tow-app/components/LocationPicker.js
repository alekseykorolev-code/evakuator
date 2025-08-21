import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import * as Location from 'expo-location';
import Input from './Input';

export default function LocationPicker({ onCoordsChange, onAddressChange, coords, address }) {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const getCurrent = useCallback(async () => {
		setLoading(true);
		setError(null);
		try {
			let { status } = await Location.requestForegroundPermissionsAsync();
			if (status !== 'granted') {
				setError('Доступ к геолокации не предоставлен');
				return;
			}
			const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
			onCoordsChange({ latitude: loc.coords.latitude, longitude: loc.coords.longitude });
			try {
				const geocoded = await Location.reverseGeocodeAsync({ latitude: loc.coords.latitude, longitude: loc.coords.longitude });
				if (geocoded && geocoded[0]) {
					const g = geocoded[0];
					const composed = [g.city, g.street, g.name, g.postalCode].filter(Boolean).join(', ');
					onAddressChange(composed || '');
				}
			} catch {}
		} catch (e) {
			setError('Не удалось определить местоположение');
		} finally {
			setLoading(false);
		}
	}, [onCoordsChange, onAddressChange]);

	useEffect(() => {
		if (!coords) {
			getCurrent();
		}
	}, [coords, getCurrent]);

	return (
		<View>
			<View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
				<Text style={{ fontWeight: '600', marginRight: 8 }}>Текущее местоположение</Text>
				<TouchableOpacity onPress={getCurrent} style={{ paddingHorizontal: 10, paddingVertical: 6, backgroundColor: '#eee', borderRadius: 6 }}>
					<Text>Обновить</Text>
				</TouchableOpacity>
			</View>
			{loading ? (
				<ActivityIndicator />
			) : (
				<Text style={{ marginBottom: 6 }}>
					{coords ? `${coords.latitude.toFixed(6)}, ${coords.longitude.toFixed(6)}` : error || 'Не определено'}
				</Text>
			)}
			<Input
				label="Адрес местоположения"
				value={address || ''}
				onChangeText={onAddressChange}
				placeholder="Введите адрес или нажмите Обновить"
			/>
		</View>
	);
}