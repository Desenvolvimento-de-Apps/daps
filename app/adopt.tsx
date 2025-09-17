import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { Pet } from '../types';
import CustomSafeArea from './components/CustomSafeArea';
import Header from './components/Header';
import PetCard from './components/PetCard';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebaseConfig';

// Dados mocados (mock data) para a lista de pets.
// O ideal é que esses dados venham de uma API no futuro.
const MOCK_PETS: Pet[] = [
  {
    id: '1',
    name: 'Pequi',
    image: require('../assets/images/pets/pequi.jpg'),
    sex: 'MACHO',
    age: 'ADULTO',
    size: 'MÉDIO',
    location: 'SAMAMBAIA SUL - DISTRITO FEDERAL',
  },
  {
    id: '2',
    name: 'Bidu',
    image: require('../assets/images/pets/bidu.jpg'),
    sex: 'MACHO',
    age: 'ADULTO',
    size: 'MÉDIO',
    location: 'SAMAMBAIA SUL - DISTRITO FEDERAL',
  },
  {
    id: '3',
    name: 'Alec',
    image: require('../assets/images/pets/alec.jpg'),
    sex: 'MACHO',
    age: 'FILHOTE',
    size: 'PEQUENO',
    location: 'ÁGUAS CLARAS - DISTRITO FEDERAL',
  },
];

export default function AdoptScreen() {
  const [loading, setLoading] = useState(true);

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

  const handleCardPress = (petName: string) => {
    router.navigate({ pathname: '/finish', params: { petName } });
  };

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
        title="Adotar"
        leftAction={
          <TouchableOpacity
            onPress={() => {
              router.back();
            }}
          >
            <Feather name="menu" size={24} color="#434343" />
          </TouchableOpacity>
        }
        rightAction={
          <TouchableOpacity
            onPress={() => {
              /* Lógica para busca */
            }}
          >
            <Feather name="search" size={24} color="#434343" />
          </TouchableOpacity>
        }
      />

      <FlatList
        data={MOCK_PETS}
        renderItem={({ item }) => (
          <PetCard pet={item} onPress={() => handleCardPress(item.name)} />
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
      />
    </CustomSafeArea>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  list: {
    paddingTop: 16,
  },
});
