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
import { getPetsByOwner, updatePetVisibility } from '@/services/api';
import { Alert } from 'react-native';

export default function MyPetsScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMyPets = async () => {
      try {
        setLoading(true);
        setError(null);
        const fetchedPets = await getPetsByOwner();
        setPets(fetchedPets);
      } catch (e) {
        setError('Não foi possível carregar a sua lista de animais.');
      } finally {
        setLoading(false);
      }
    };

    fetchMyPets();
  }, []);

  const handleVisibilityToggle = async (
    petId: string,
    currentVisibility: boolean,
  ) => {
    const newVisibility = !currentVisibility;

    setPets((currentPets) =>
      currentPets.map((p) =>
        p.id === petId ? { ...p, isVisible: newVisibility } : p,
      ),
    );

    try {
      await updatePetVisibility(petId, newVisibility);
    } catch (apiError) {
      Alert.alert('Erro', 'Não foi possível alterar a visibilidade do pet.');
      setPets((currentPets) =>
        currentPets.map((p) =>
          p.id === petId ? { ...p, isVisible: currentVisibility } : p,
        ),
      );
    }
  };

  const handleCardPress = (petId: string) => {
    router.push({ pathname: '/(drawer)/pets/info', params: { petId } });
  };

  const handleAddNewPet = () => {
    router.push('/(drawer)/register-pet');
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
        title="Meus Pets"
        leftAction={
          <TouchableOpacity
            onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
          >
            <Feather name="menu" size={24} color="#434343" />
          </TouchableOpacity>
        }
        rightAction={
          <TouchableOpacity onPress={handleAddNewPet}>
            <Feather name="plus" size={26} color="#434343" />
          </TouchableOpacity>
        }
      />

      <FlatList
        data={pets}
        renderItem={({ item }) => (
          <PetCard
            pet={item}
            onPress={() => handleCardPress(item.id)}
            showVisibilityToggle={true}
            onVisibilityChange={() =>
              handleVisibilityToggle(item.id, item.isVisible ?? true)
            }
          />
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            Você ainda não cadastrou nenhum pet.
          </Text>
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
    padding: 20,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#757575',
  },
});
