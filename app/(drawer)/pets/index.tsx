import { Feather } from '@expo/vector-icons';
import { useNavigation, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Text,
  View,
} from 'react-native';
import { Pet } from '@/types';
import CustomSafeArea from '@/components/CustomSafeArea';
import Header from '@/components/Header';
import PetCard from '@/components/PetCard';
import { DrawerActions } from '@react-navigation/native';
import { getPets } from '@/services/api';

export default function AdoptScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPets = async () => {
      try {
        setLoading(true);
        setError(null);
        const fetchedPets = await getPets();
        setPets(fetchedPets);
      } catch (e) {
        setError('Não foi possível carregar a lista de animais.');
      } finally {
        setLoading(false);
      }
    };

    fetchPets();
  }, []);

  const handleCardPress = (petId: string) => {
    router.push({ pathname: '/(drawer)/pets/info', params: { petId } });
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#88C9BF" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text>{error}</Text>
      </View>
    );
  }

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
        data={pets}
        renderItem={({ item }) => (
          <PetCard pet={item} onPress={() => handleCardPress(item.id)} />
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Nenhum animal encontrado.</Text>
        }
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
    paddingBottom: 16,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#757575',
  },
});
