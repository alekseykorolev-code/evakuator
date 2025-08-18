import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import * as Location from 'expo-location';

type Props = {
  value: { latitude: number; longitude: number; address?: string } | null;
  onChange: (loc: { latitude: number; longitude: number; address?: string }) => void;
};

export default function LocationPicker({ value, onChange }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isManual, setIsManual] = useState(false);
  const [manualAddress, setManualAddress] = useState('');

  const locate = async () => {
    setIsLoading(true);
    setError(null);
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setError('Доступ к геолокации отклонён');
      setIsLoading(false);
      return;
    }
    const pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
    const coords = {
      latitude: pos.coords.latitude,
      longitude: pos.coords.longitude,
    };
    try {
      const geocode = await Location.reverseGeocodeAsync(coords);
      const first = geocode[0];
      const address = first
        ? `${first.city || first.region || ''}, ${first.street || ''} ${first.name || ''}`.trim()
        : undefined;
      onChange({ ...coords, address });
    } catch {
      onChange(coords);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (!value) locate();
  }, []);

  return (
    <View>
      <View style={styles.row}>
        <Text style={styles.value}>
          {value?.address || (value ? `${value.latitude.toFixed(5)}, ${value.longitude.toFixed(5)}` : '—')}
        </Text>
        <TouchableOpacity style={styles.button} onPress={locate}>
          <Text style={styles.buttonText}>{isLoading ? 'Определение…' : 'Моё местоположение'}</Text>
        </TouchableOpacity>
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <View style={{ height: 8 }} />
      {!isManual ? (
        <TouchableOpacity style={styles.secondary} onPress={() => setIsManual(true)}>
          <Text style={styles.secondaryText}>Ввести адрес вручную</Text>
        </TouchableOpacity>
      ) : (
        <View>
          <TextInput
            style={styles.input}
            placeholder="Например: Москва, Тверская 1"
            value={manualAddress}
            onChangeText={setManualAddress}
          />
          <TouchableOpacity
            style={[styles.button, { backgroundColor: '#1f6feb' }]}
            onPress={async () => {
              if (!manualAddress.trim()) return;
              setIsLoading(true);
              try {
                const list = await Location.geocodeAsync(manualAddress.trim());
                const first = list[0];
                if (first) {
                  onChange({ latitude: first.latitude, longitude: first.longitude, address: manualAddress.trim() });
                  setError(null);
                } else {
                  setError('Не удалось найти адрес');
                }
              } catch (e) {
                setError('Ошибка геокодирования');
              }
              setIsLoading(false);
            }}
          >
            <Text style={[styles.buttonText, { color: '#fff' }]}>{isLoading ? 'Поиск…' : 'Найти адрес'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.secondary, { marginTop: 8 }]} onPress={() => setIsManual(false)}>
            <Text style={styles.secondaryText}>Отмена</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  value: { flex: 1, color: '#111827' },
  button: { backgroundColor: '#e5e7eb', paddingHorizontal: 10, paddingVertical: 8, borderRadius: 10 },
  buttonText: { color: '#111827', fontWeight: '600' },
  error: { color: '#ef4444', marginTop: 4 },
  secondary: { padding: 10, backgroundColor: '#f3f4f6', borderRadius: 10, alignItems: 'center' },
  secondaryText: { color: '#111827', fontWeight: '600' },
  input: { borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 10, padding: 12, backgroundColor: '#fff', marginBottom: 8 },
});

