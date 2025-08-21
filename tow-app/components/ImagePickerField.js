import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import * as ImgPicker from 'expo-image-picker';

export default function ImagePickerField({ imageUris = [], onChange }) {
	const [error, setError] = useState(null);

	async function requestPermission() {
		const camera = await ImgPicker.requestCameraPermissionsAsync();
		const media = await ImgPicker.requestMediaLibraryPermissionsAsync();
		return camera.status === 'granted' || media.status === 'granted';
	}

	async function addFromCamera() {
		setError(null);
		const ok = await requestPermission();
		if (!ok) {
			setError('Нет доступа к камере/галерее');
			return;
		}
		const res = await ImgPicker.launchCameraAsync({ quality: 0.7 });
		if (!res.canceled) {
			const uri = res.assets[0]?.uri;
			if (uri) onChange([...(imageUris || []), uri].slice(0, 3));
		}
	}

	async function addFromLibrary() {
		setError(null);
		const ok = await requestPermission();
		if (!ok) {
			setError('Нет доступа к галерее');
			return;
		}
		const res = await ImgPicker.launchImageLibraryAsync({ quality: 0.7, selectionLimit: 1 });
		if (!res.canceled) {
			const uri = res.assets[0]?.uri;
			if (uri) onChange([...(imageUris || []), uri].slice(0, 3));
		}
	}

	function removeAt(idx) {
		const next = (imageUris || []).filter((_, i) => i !== idx);
		onChange(next);
	}

	return (
		<View style={{ marginTop: 8 }}>
			<Text style={{ marginBottom: 8, fontWeight: '600' }}>Фото автомобиля (до 3)</Text>
			<View style={{ flexDirection: 'row', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
				{(imageUris || []).map((uri, idx) => (
					<View key={uri} style={{ position: 'relative', marginRight: 8, marginBottom: 8 }}>
						<Image source={{ uri }} style={{ width: 90, height: 90, borderRadius: 8 }} />
						<TouchableOpacity onPress={() => removeAt(idx)} style={{ position: 'absolute', top: -8, right: -8, backgroundColor: '#000000aa', borderRadius: 12, paddingHorizontal: 6, paddingVertical: 2 }}>
							<Text style={{ color: '#fff' }}>×</Text>
						</TouchableOpacity>
					</View>
				))}
			</View>
			<View style={{ flexDirection: 'row', gap: 8 }}>
				<TouchableOpacity onPress={addFromCamera} style={{ paddingHorizontal: 12, paddingVertical: 10, backgroundColor: '#eee', borderRadius: 8 }}>
					<Text>Сделать фото</Text>
				</TouchableOpacity>
				<TouchableOpacity onPress={addFromLibrary} style={{ paddingHorizontal: 12, paddingVertical: 10, backgroundColor: '#eee', borderRadius: 8 }}>
					<Text>Выбрать из галереи</Text>
				</TouchableOpacity>
			</View>
			{error ? <Text style={{ color: 'red', marginTop: 6 }}>{error}</Text> : null}
		</View>
	);
}