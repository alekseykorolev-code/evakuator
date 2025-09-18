import React from 'react';
import { View, Image, TouchableOpacity, Text, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

type Props = {
  photos: string[];
  onChange: (uris: string[]) => void;
  max?: number;
};

export default function PhotoPicker({ photos, onChange, max = 3 }: Props) {
  const canAdd = photos.length < max;

  const addPhoto = async () => {
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (!perm.granted) return;
    const result = await ImagePicker.launchCameraAsync({ quality: 0.7 });
    if (!result.canceled) {
      const uri = result.assets?.[0]?.uri;
      if (uri) onChange([...photos, uri]);
    }
  };

  const addFromLibrary = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) return;
    const result = await ImagePicker.launchImageLibraryAsync({ quality: 0.7 });
    if (!result.canceled) {
      const uri = result.assets?.[0]?.uri;
      if (uri) onChange([...photos, uri]);
    }
  };

  const removeAt = (idx: number) => {
    const next = photos.filter((_, i) => i !== idx);
    onChange(next);
  };

  return (
    <View>
      <View style={styles.row}>
        {photos.map((uri, idx) => (
          <View key={uri} style={styles.thumbWrapper}>
            <Image source={{ uri }} style={styles.thumb} />
            <TouchableOpacity style={styles.remove} onPress={() => removeAt(idx)}>
              <Text style={{ color: '#fff', fontWeight: '700' }}>×</Text>
            </TouchableOpacity>
          </View>
        ))}
        {canAdd && (
          <TouchableOpacity style={styles.add} onPress={addPhoto}>
            <Text style={styles.addText}>Сделать фото</Text>
          </TouchableOpacity>
        )}
      </View>
      {canAdd && (
        <TouchableOpacity style={styles.secondary} onPress={addFromLibrary}>
          <Text style={styles.secondaryText}>Выбрать из галереи</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  thumbWrapper: { position: 'relative' },
  thumb: { width: 80, height: 80, borderRadius: 8 },
  remove: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#ef4444',
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  add: {
    backgroundColor: '#1f6feb',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
  },
  addText: { color: '#fff', fontWeight: '700' },
  secondary: { marginTop: 8, padding: 10, backgroundColor: '#e5e7eb', borderRadius: 10 },
  secondaryText: { color: '#111827', textAlign: 'center', fontWeight: '600' },
});

