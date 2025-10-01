import React, { useState, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  ImageBackground,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  SafeAreaView,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { auth } from '@/firebaseConfig';
import { getFavoritePets, removeFavoritePet } from '@/services/api';
import { PetDetails } from '@/types';

const PetTag = ({ label }: { label: string | null }) => {
  if (!label) return null;
  return (
    <View style={styles.tagContainer}>
      <Text style={styles.tagText}>{label.toUpperCase()}</Text>
    </View>
  );
};

const PetCard = ({
  item,
  onUnfavorite,
  onPress,
}: {
  item: PetDetails;
  onUnfavorite: (petId: string) => void;
  onPress: () => void;
}) => (
  <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
    <View style={styles.card}>
      <ImageBackground
        source={
          typeof item.image === 'string' ? { uri: item.image } : item.image
        }
        style={styles.imageBackground}
        imageStyle={styles.image}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.petName}>{item.name}</Text>
          {/* O stopPropagation evita que o clique no coração acione o clique do card */}
          <TouchableOpacity
            onPress={(e) => {
              e.stopPropagation();
              onUnfavorite(item.id);
            }}
          >
            <Feather
              name="heart"
              size={24}
              color="#FF6347"
              style={styles.heartIconFilled}
            />
          </TouchableOpacity>
        </View>
      </ImageBackground>
      <View style={styles.cardFooter}>
        <View style={styles.tagsRow}>
          <PetTag label={item.sex} />
          <PetTag label={item.age} />
          <PetTag label={item.size} />
        </View>
        <View style={styles.locationRow}>
          <Feather name="map-pin" size={16} color="#666" />
          <Text style={styles.locationText}>{item.location.toUpperCase()}</Text>
        </View>
      </View>
    </View>
  </TouchableOpacity>
);

const FavoritesScreen = () => {
  const [favoritePets, setFavoritePets] = useState<PetDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFavorites = useCallback(async () => {
    const user = auth.currentUser;
    if (!user) {
      setError('Você precisa estar logado para ver seus favoritos.');
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const pets = await getFavoritePets(user.uid);
      setFavoritePets(pets);
    } catch (err) {
      setError('Não foi possível carregar os pets favoritos. Tente novamente.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchFavorites();
    }, [fetchFavorites]),
  );

  const handleUnfavorite = async (petId: string) => {
    const user = auth.currentUser;
    if (!user) {
      Alert.alert('Erro', 'Você não está logado.');
      return;
    }

    const originalPets = [...favoritePets];
    const newPets = favoritePets.filter((pet) => pet.id !== petId);
    setFavoritePets(newPets);

    try {
      await removeFavoritePet(user.uid, petId);
    } catch (error) {
      setFavoritePets(originalPets);
      Alert.alert('Erro', 'Não foi possível remover o pet dos favoritos.');
      console.error(error);
    }
  };

  const handlePetPress = (petId: string) => {
    console.log('Navegando para detalhes do pet:', petId);
    router.push({ pathname: '/(drawer)/pets/info', params: { petId } });
  };

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#4a90e2" />
        <Text style={styles.infoText}>Carregando favoritos...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Feather name="alert-circle" size={48} color="#d9534f" />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchFavorites}>
          <Text style={styles.retryButtonText}>Tentar Novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (favoritePets.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Feather name="heart" size={48} color="#ccc" />
        <Text style={styles.emptyText}>Você ainda não tem pets favoritos.</Text>
        <Text style={styles.emptySubText}>
          Que tal explorar e encontrar um novo amigo?
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.headerTitle}>Favoritos</Text>
      <FlatList
        data={favoritePets}
        renderItem={({ item }) => (
          <PetCard
            item={item}
            onUnfavorite={handleUnfavorite}
            onPress={() => handlePetPress(item.id)}
          />
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2c3e50',
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 10,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 6,
  },
  imageBackground: {
    width: '100%',
    height: 280,
    justifyContent: 'flex-start',
  },
  image: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'rgba(0,0,0,0.35)',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  petName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  heartIconFilled: {
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  cardFooter: {
    padding: 16,
  },
  tagsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    flexWrap: 'wrap',
  },
  tagContainer: {
    backgroundColor: '#ecf0f1',
    borderRadius: 14,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#34495e',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  locationText: {
    fontSize: 13,
    color: '#7f8c8d',
    marginLeft: 8,
    fontWeight: '600',
  },
  infoText: {
    marginTop: 10,
    color: '#555',
  },
  errorText: {
    fontSize: 16,
    color: '#c0392b',
    textAlign: 'center',
    marginBottom: 20,
    marginTop: 16,
  },
  emptyText: {
    fontSize: 18,
    color: '#7f8c8d',
    fontWeight: '600',
    marginTop: 16,
    textAlign: 'center',
  },
  emptySubText: {
    fontSize: 14,
    color: '#95a5a6',
    marginTop: 8,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  retryButton: {
    backgroundColor: '#3498db',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginTop: 10,
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default FavoritesScreen;
