import React, { useEffect, useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import { getRequests } from '../utils/storage';

function formatDate(dateIso) {
	try {
		const d = new Date(dateIso);
		const pad = (n) => (n < 10 ? `0${n}` : `${n}`);
		return `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
	} catch {
		return dateIso;
	}
}

export default function HistoryScreen() {
	const [items, setItems] = useState([]);

	useEffect(() => {
		getRequests().then(setItems).catch(() => setItems([]));
	}, []);

	return (
		<View style={{ flex: 1, backgroundColor: '#fff' }}>
			<FlatList
				contentContainerStyle={{ padding: 16 }}
				data={items}
				keyExtractor={(item) => String(item.id)}
				ListEmptyComponent={<Text style={{ color: '#555' }}>История пуста</Text>}
				renderItem={({ item }) => (
					<View style={{ paddingVertical: 12, borderBottomColor: '#eee', borderBottomWidth: 1 }}>
						<Text style={{ fontWeight: '600', marginBottom: 4 }}>{formatDate(item.createdAt)}</Text>
						<Text style={{ color: '#333' }}>Забор: {item.pickupAddress || (item.coords ? `${item.coords.latitude.toFixed(4)}, ${item.coords.longitude.toFixed(4)}` : '-')}</Text>
						<Text style={{ color: '#333' }}>Доставка: {item.destinationAddress}</Text>
					</View>
				)}
			/>
		</View>
	);
}