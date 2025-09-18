import React from 'react';
import { TouchableOpacity, Text } from 'react-native';

export default function Button({ title, onPress, disabled, style }) {
	return (
		<TouchableOpacity
			onPress={onPress}
			disabled={disabled}
			style={{
				backgroundColor: disabled ? '#cccccc' : '#007AFF',
				paddingVertical: 12,
				paddingHorizontal: 16,
				borderRadius: 8,
				alignItems: 'center',
				...style,
			}}
		>
			<Text style={{ color: '#fff', fontWeight: '600', fontSize: 16 }}>{title}</Text>
		</TouchableOpacity>
	);
}