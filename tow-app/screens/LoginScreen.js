import React, { useState } from 'react';
import { View, Text, Alert } from 'react-native';
import Input from '../components/Input';
import Button from '../components/Button';
import { saveUser } from '../utils/storage';

export default function LoginScreen({ onLoginSuccess }) {
	const [step, setStep] = useState('phone'); // 'phone' | 'code'
	const [phone, setPhone] = useState('');
	const [name, setName] = useState('');
	const [code, setCode] = useState('');

	function handleSendCode() {
		if (!phone.trim()) {
			Alert.alert('Ошибка', 'Введите номер телефона');
			return;
		}
		setStep('code');
	}

	async function handleVerifyCode() {
		if (code.trim() !== '1234') {
			Alert.alert('Ошибка', 'Неверный код. Введите 1234.');
			return;
		}
		const user = { phone: phone.trim(), name: name.trim() || null };
		await saveUser(user);
		onLoginSuccess(user);
	}

	return (
		<View style={{ flex: 1, padding: 16, backgroundColor: '#fff' }}>
			<Text style={{ fontSize: 22, fontWeight: '700', marginBottom: 16 }}>Вход</Text>
			{step === 'phone' ? (
				<View>
					<Input label="Номер телефона" value={phone} onChangeText={setPhone} keyboardType="phone-pad" placeholder="+7 900 000-00-00" />
					<Input label="Имя (опционально)" value={name} onChangeText={setName} placeholder="Иван" />
					<Button title="Получить код" onPress={handleSendCode} />
				</View>
			) : (
				<View>
					<Input label="Код из SMS" value={code} onChangeText={setCode} keyboardType="number-pad" placeholder="1234" />
					<Button title="Войти" onPress={handleVerifyCode} />
				</View>
			)}
		</View>
	);
}