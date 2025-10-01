import React, { useState, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  SafeAreaView,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { auth } from '@/firebaseConfig';
import { getFavoritePets, removeFavoritePet } from '@/services/api';
import { PetDetails } from '@/types';

const HIGHLIGHT_COLOR = '#88C9BF';

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
}) => {
  const [isImageLoading, setIsImageLoading] = useState(true);

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.9} style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.petName}>{item.name}</Text>
        <TouchableOpacity
          onPress={(e) => {
            e.stopPropagation();
            onUnfavorite(item.id);
          }}
        >
          <Ionicons name="heart" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.imageContainer}>
        <Image
          source={
            typeof item.image === 'string' ? { uri: item.image } : item.image
          }
          style={styles.petImage}
          onLoadEnd={() => setIsImageLoading(false)} // Esconde o loader quando a imagem termina de carregar
        />
        {isImageLoading && (
          <View style={styles.imagePlaceholder}>
            <ActivityIndicator color={HIGHLIGHT_COLOR} />
          </View>
        )}
      </View>

      <View style={styles.cardFooter}>
        <View style={styles.tagsRow}>
          <PetTag label={item.sex} />
          <PetTag label={item.age} />
          <PetTag label={item.size} />
        </View>
        <View style={styles.locationRow}>
          <Feather name="map-pin" size={16} color="#757575" />
          <Text style={styles.locationText}>{item.location.toUpperCase()}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

// Componente principal da tela de Favoritos
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
    router.push({ pathname: '/(drawer)/pets/info', params: { petId } });
  };

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={HIGHLIGHT_COLOR} />
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
        <Feather name="heart" size={48} color="#E0E0E0" />
        <Text style={styles.emptyText}>Você ainda não tem pets favoritos.</Text>
        <Text style={styles.emptySubText}>
          Encontre um novo amigo para chamar de seu!
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
    backgroundColor: '#FFFFFF',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#434343',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#EFEFEF',
    overflow: 'hidden', // Importante para as bordas da imagem
  },
  cardHeader: {
    backgroundColor: HIGHLIGHT_COLOR,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  petName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  imageContainer: {
    height: 250,
    backgroundColor: '#F0F0F0',
  },
  petImage: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
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
    backgroundColor: '#F0F0F0',
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#434343',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  locationText: {
    fontSize: 13,
    color: '#757575',
    marginLeft: 8,
    fontWeight: '600',
  },
  infoText: {
    marginTop: 16,
    color: '#555',
    fontSize: 16,
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
    color: '#757575',
    fontWeight: '600',
    marginTop: 16,
    textAlign: 'center',
  },
  emptySubText: {
    fontSize: 14,
    color: '#A0A0A0',
    marginTop: 8,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  retryButton: {
    backgroundColor: HIGHLIGHT_COLOR,
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
