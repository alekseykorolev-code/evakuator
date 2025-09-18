import React from 'react';
import { TextInput, View, Text } from 'react-native';

export default function Input({ label, value, onChangeText, placeholder, keyboardType = 'default', secureTextEntry, style, multiline }) {
	return (
		<View style={{ marginBottom: 12 }}>
			{label ? <Text style={{ marginBottom: 6, color: '#333' }}>{label}</Text> : null}
			<TextInput
				value={value}
				onChangeText={onChangeText}
				placeholder={placeholder}
				keyboardType={keyboardType}
				secureTextEntry={secureTextEntry}
				multiline={multiline}
				style={{
					borderWidth: 1,
					borderColor: '#ddd',
					borderRadius: 8,
					paddingHorizontal: 12,
					paddingVertical: multiline ? 10 : 12,
					minHeight: multiline ? 80 : undefined,
					...style,
				}}
			/>
		</View>
	);
}