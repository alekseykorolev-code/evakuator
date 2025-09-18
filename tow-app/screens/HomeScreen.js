import React, { useState } from 'react';
import { View, Text, Alert, ScrollView } from 'react-native';
import LocationPicker from '../components/LocationPicker';
import Input from '../components/Input';
import Button from '../components/Button';
import ImagePickerField from '../components/ImagePickerField';
import { sendRequestEmail } from '../utils/sendEmail';
import { addRequest } from '../utils/storage';

export default function HomeScreen({ user }) {
	const [coords, setCoords] = useState(null);
	const [pickupAddress, setPickupAddress] = useState('');
	const [destinationAddress, setDestinationAddress] = useState('');
	const [comment, setComment] = useState('');
	const [imageUris, setImageUris] = useState([]);
	const [submitting, setSubmitting] = useState(false);

	async function handleSubmit() {
		if (!coords) {
			Alert.alert('Ошибка', 'Не определено местоположение');
			return;
		}
		if (!destinationAddress.trim()) {
			Alert.alert('Ошибка', 'Введите адрес доставки');
			return;
		}
		setSubmitting(true);
		try {
			await sendRequestEmail({
				phone: user?.phone || '',
				coords,
				pickupAddress: pickupAddress || '',
				destinationAddress: destinationAddress.trim(),
				comment: comment.trim() || '',
				imageUris,
			});
			await addRequest({
				id: Date.now(),
				createdAt: new Date().toISOString(),
				phone: user?.phone || '',
				coords,
				pickupAddress: pickupAddress || '',
				destinationAddress: destinationAddress.trim(),
				comment: comment.trim() || '',
				imageUris,
			});
			Alert.alert('Готово', 'Заявка отправлена');
			// clear form
			setDestinationAddress('');
			setComment('');
			setImageUris([]);
		} catch (e) {
			Alert.alert('Ошибка', 'Не удалось отправить письмо. Попробуйте ещё раз.');
		} finally {
			setSubmitting(false);
		}
	}

	return (
		<ScrollView contentContainerStyle={{ padding: 16, backgroundColor: '#fff' }}>
			<Text style={{ fontSize: 20, fontWeight: '700', marginBottom: 12 }}>Новая заявка</Text>
			<LocationPicker coords={coords} address={pickupAddress} onCoordsChange={setCoords} onAddressChange={setPickupAddress} />
			<Input label="Адрес доставки" value={destinationAddress} onChangeText={setDestinationAddress} placeholder="Куда доставить" />
			<ImagePickerField imageUris={imageUris} onChange={setImageUris} />
			<Input label="Комментарий (опционально)" value={comment} onChangeText={setComment} placeholder="Например: не крутится руль" multiline />
			<Button title={submitting ? 'Отправка...' : 'Отправить заявку'} onPress={handleSubmit} disabled={submitting} style={{ marginTop: 16 }} />
		</ScrollView>
	);
}