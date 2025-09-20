import { Feather } from '@expo/vector-icons';
import { useNavigation, useRouter } from 'expo-router';
import React from 'react';
import { FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { Pet } from '@/types';
import CustomSafeArea from '@/components/CustomSafeArea';
import Header from '@/components/Header';
import PetCard from '@/components/PetCard';
import { DrawerActions } from '@react-navigation/native';

// Dados mocados (mock data) para a lista de pets.
const MOCK_PETS: Pet[] = [
  {
    id: '1',
    name: 'Pequi',
    image: require('@/assets/images/pets/pequi.jpg'),
    sex: 'MACHO',
    age: 'ADULTO',
    size: 'MÉDIO',
    location: 'SAMAMBAIA SUL - DISTRITO FEDERAL',
  },
  {
    id: '2',
    name: 'Bidu',
    image: require('@/assets/images/pets/bidu.jpg'),
    sex: 'MACHO',
    age: 'ADULTO',
    size: 'MÉDIO',
    location: 'SAMAMBAIA SUL - DISTRITO FEDERAL',
  },
  {
    id: '3',
    name: 'Alec',
    image: require('@/assets/images/pets/alec.jpg'),
    sex: 'MACHO',
    age: 'FILHOTE',
    size: 'PEQUENO',
    location: 'ÁGUAS CLARAS - DISTRITO FEDERAL',
  },
];

export default function AdoptScreen() {
  const router = useRouter();
  const navigation = useNavigation();

  const handleCardPress = (petName: string) => {
    router.push({ pathname: '/(drawer)/pets/finish', params: { petName } });
  };

  return (
    <CustomSafeArea style={styles.container}>
      <Header
        title="Adotar"
        leftAction={
          <TouchableOpacity
            onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
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
