import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useAuth } from '@/context/AuthContext';

export default function AuthScreen() {
  const { signInWithPhone } = useAuth();
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const [code, setCode] = useState('');

  const onSendCode = async () => {
    if (!phone.trim()) {
      Alert.alert('Ошибка', 'Введите номер телефона');
      return;
    }
    // Demo: имитируем отправку SMS
    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      setCodeSent(true);
      Alert.alert('Код отправлен', 'Введите 1234 для входа (демо)');
    }, 800);
  };

  const onVerify = async () => {
    if (code !== '1234') {
      Alert.alert('Неверный код', 'Попробуйте ещё раз. (подсказка: 1234)');
      return;
    }
    await signInWithPhone(phone.trim(), name.trim() || undefined);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Вход по номеру телефона</Text>
      <TextInput
        style={styles.input}
        placeholder="Ваше имя (необязательно)"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Номер телефона"
        keyboardType="phone-pad"
        value={phone}
        onChangeText={setPhone}
      />

      {!codeSent ? (
        <TouchableOpacity style={styles.button} onPress={onSendCode} disabled={isSending}>
          <Text style={styles.buttonText}>{isSending ? 'Отправка…' : 'Отправить код'}</Text>
        </TouchableOpacity>
      ) : (
        <>
          <TextInput
            style={styles.input}
            placeholder="Код из SMS"
            keyboardType="number-pad"
            value={code}
            onChangeText={setCode}
          />
          <TouchableOpacity style={styles.buttonPrimary} onPress={onVerify}>
            <Text style={styles.buttonText}>Войти</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center', backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 16, textAlign: 'center' },
  input: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#e5e7eb',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonPrimary: {
    backgroundColor: '#1f6feb',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: { color: '#111827', fontWeight: '700' },
});

