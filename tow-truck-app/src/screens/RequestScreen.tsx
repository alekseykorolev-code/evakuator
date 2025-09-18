import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import LocationPicker from '@/components/LocationPicker';
import PhotoPicker from '@/components/PhotoPicker';
import { useRequests } from '@/context/RequestContext';

export default function RequestScreen() {
  const { createRequest } = useRequests();
  const [pickup, setPickup] = useState<{ latitude: number; longitude: number; address?: string } | null>(null);
  const [dropoff, setDropoff] = useState('');
  const [comment, setComment] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async () => {
    if (!pickup) {
      Alert.alert('Укажите местоположение', 'Определите или введите адрес подачи');
      return;
    }
    if (!dropoff.trim()) {
      Alert.alert('Укажите адрес', 'Введите адрес доставки');
      return;
    }
    setIsSubmitting(true);
    await createRequest({ pickupLocation: pickup, dropoffAddress: dropoff.trim(), comment: comment.trim() || undefined, photos });
    setIsSubmitting(false);
    setDropoff('');
    setComment('');
    setPhotos([]);
    Alert.alert('Заявка отправлена', 'Мы скоро свяжемся с вами.');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>
      <Text style={styles.title}>Новая заявка</Text>

      <Text style={styles.label}>Текущее местоположение</Text>
      <View style={styles.card}>
        <LocationPicker value={pickup} onChange={setPickup} />
      </View>

      <Text style={styles.label}>Адрес доставки</Text>
      <TextInput
        style={styles.input}
        placeholder="Куда везти авто"
        value={dropoff}
        onChangeText={setDropoff}
      />
      {/* Можно добавить выбор из истории адресов позже */}

      <Text style={styles.label}>Фото автомобиля (до 3)</Text>
      <View style={styles.card}>
        <PhotoPicker photos={photos} onChange={setPhotos} max={3} />
      </View>

      <Text style={styles.label}>Комментарий (опционально)</Text>
      <TextInput
        style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
        placeholder="Например: не работает руль, нужна платформа"
        value={comment}
        onChangeText={setComment}
        multiline
      />

      <TouchableOpacity style={styles.buttonPrimary} onPress={onSubmit} disabled={isSubmitting}>
        <Text style={styles.buttonText}>{isSubmitting ? 'Отправка…' : 'Отправить заявку'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 16 },
  label: { color: '#6b7280', fontSize: 12, marginBottom: 6, marginTop: 14 },
  card: { borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 12, padding: 12, backgroundColor: '#fff' },
  input: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    padding: 12,
    backgroundColor: '#fff',
  },
  buttonPrimary: { backgroundColor: '#1f6feb', padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 16, marginBottom: 40 },
  buttonText: { color: '#fff', fontWeight: '700' },
});

