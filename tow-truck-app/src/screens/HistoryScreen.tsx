import React from 'react';
import { View, Text, FlatList, StyleSheet, Image } from 'react-native';
import { useRequests } from '@/context/RequestContext';

export default function HistoryScreen() {
  const { requests } = useRequests();

  return (
    <View style={styles.container}>
      <FlatList
        data={requests}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        ListEmptyComponent={<Text style={{ textAlign: 'center', color: '#6b7280' }}>Заявок пока нет</Text>}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.date}>{new Date(item.createdAt).toLocaleString()}</Text>
            <Text style={styles.status}>Статус: {item.status}</Text>
            <Text style={styles.rowText}>Откуда: {item.pickupLocation.address || `${item.pickupLocation.latitude.toFixed(5)}, ${item.pickupLocation.longitude.toFixed(5)}`}</Text>
            <Text style={styles.rowText}>Куда: {item.dropoffAddress}</Text>
            {item.comment ? <Text style={styles.comment}>Комментарий: {item.comment}</Text> : null}
            {item.photos?.length ? (
              <View style={styles.photosRow}>
                {item.photos.slice(0, 3).map((uri) => (
                  <Image key={uri} source={{ uri }} style={styles.thumb} />
                ))}
              </View>
            ) : null}
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  card: { borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 12, padding: 12, marginBottom: 12 },
  date: { fontSize: 12, color: '#6b7280' },
  status: { marginTop: 4, fontWeight: '600' },
  rowText: { marginTop: 6 },
  comment: { marginTop: 6, fontStyle: 'italic', color: '#374151' },
  photosRow: { flexDirection: 'row', gap: 8, marginTop: 8 },
  thumb: { width: 60, height: 60, borderRadius: 8 },
});

