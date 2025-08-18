import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useAuth } from '@/context/AuthContext';

export default function ProfileScreen() {
  const { user, signOut } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Профиль</Text>
      <View style={styles.card}>
        <Text style={styles.label}>Имя</Text>
        <Text style={styles.value}>{user?.name || '—'}</Text>
        <Text style={[styles.label, { marginTop: 12 }]}>Телефон</Text>
        <Text style={styles.value}>{user?.phone}</Text>
      </View>
      <TouchableOpacity style={styles.button} onPress={signOut}>
        <Text style={styles.buttonText}>Выйти</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 16 },
  card: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: 16,
    backgroundColor: '#fff',
    marginBottom: 24,
  },
  label: { color: '#6b7280', fontSize: 12 },
  value: { fontSize: 16, fontWeight: '600' },
  button: { backgroundColor: '#ef4444', padding: 14, borderRadius: 12, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: '700' },
});

