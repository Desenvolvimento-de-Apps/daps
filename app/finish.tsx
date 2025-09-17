import { useLocalSearchParams } from 'expo-router';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import CustomSafeArea from './components/CustomSafeArea';
import { Feather } from '@expo/vector-icons';
import Header from './components/Header';
import Button from './components/Button';
import { router } from 'expo-router';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebaseConfig';

export default function FinishScreen() {
  const [loading, setLoading] = useState(true);
  const params = useLocalSearchParams();
  const petName = params.petName || 'pet';

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user || user.isAnonymous) {
        router.replace('/auth-options');
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <CustomSafeArea
        style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
      >
        <ActivityIndicator size="large" color="#88C9BF" />
      </CustomSafeArea>
    );
  }

  return (
    <CustomSafeArea style={styles.container}>
      <Header
        title="Finalizar Processo"
        leftAction={
          <TouchableOpacity
            onPress={() => {
              router.back();
            }}
          >
            <Feather name="arrow-left" size={24} color="#434343" />
          </TouchableOpacity>
        }
        rightAction={null}
        containerStyle={{ backgroundColor: '#88c9bf' }}
      />
      <View style={styles.body}>
        <Text style={styles.h1}>Oba!</Text>
        <Text style={styles.message}>
          Ficamos muito felizes com o sucesso do seu processo! Esperamos que o
          bichinho esteja curtindo muito essa nova experiência!{'\n'}
          {'\n'}
          Agora, que tal compartilhar a história do {petName} com todos os
          outros membros do Meau?
        </Text>
      </View>

      <Button
        title="COMPARTILHAR HISTÓRIA"
        onPress={() => {}}
        backgroundColor="#88c9bf"
        textColor="#434343"
        style={styles.button}
      />
    </CustomSafeArea>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  body: {
    flex: 1,
    marginTop: 52,
    gap: 52,
    alignItems: 'center',
  },
  h1: {
    fontSize: 72,
    fontFamily: 'Courgette-Regular',
    color: '#88c9bf',
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginHorizontal: 52,
  },
  button: {
    width: 232,
    marginBottom: 24,
    alignSelf: 'center',
  },
});
