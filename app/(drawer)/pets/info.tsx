import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Feather, Ionicons } from '@expo/vector-icons';
import { PetDetails } from '@/types';
import { getPetById } from '@/services/api';
import CustomSafeArea from '@/components/CustomSafeArea';
import Header from '@/components/Header';

const formatArrayAsCommaSeparatedString = (arr: string[] | null) => {
  if (!arr || arr.length === 0) return null;
  return arr.join(', ');
};

export default function PetInfoScreen() {
  const router = useRouter();
  const { petId } = useLocalSearchParams<{ petId: string }>();

  const [pet, setPet] = useState<PetDetails | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isFavorited, setIsFavorited] = useState(false);

  const [isApiFinished, setIsApiFinished] = useState(false);
  const [isImageRendered, setIsImageRendered] = useState(false);

  useEffect(() => {
    if (!petId) {
      setError('ID do pet não fornecido.');
      setIsApiFinished(true);
      setIsImageRendered(true);
      return;
    }

    const fetchPetDetails = async () => {
      try {
        const petData = await getPetById(petId);
        setPet(petData);
        if (!petData || !petData.image) {
          setIsImageRendered(true);
        }
      } catch (e) {
        setError('Não foi possível carregar os dados do pet.');
        setIsImageRendered(true);
      } finally {
        setIsApiFinished(true);
      }
    };

    fetchPetDetails();
  }, [petId]);

  const handleFavoriteToggle = () => {
    setIsFavorited((previousState) => !previousState);
  };

  const isScreenReady = isApiFinished && isImageRendered;

  if (isApiFinished && (error || !pet)) {
    return (
      <CustomSafeArea style={styles.centered}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButtonHeader}
        >
          <Feather name="arrow-left" size={24} color="#434343" />
        </TouchableOpacity>
        <Text>{error || 'Pet não encontrado.'}</Text>
      </CustomSafeArea>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      {!isScreenReady && (
        <View style={styles.overlayLoader}>
          <ActivityIndicator size="large" color="#88C9BF" />
        </View>
      )}

      {isApiFinished && pet && (
        <CustomSafeArea
          style={[styles.container, { opacity: isScreenReady ? 1 : 0 }]}
        >
          <Header
            title={pet.name}
            leftAction={
              <TouchableOpacity onPress={() => router.back()}>
                <Feather name="arrow-left" size={24} color="#434343" />
              </TouchableOpacity>
            }
            rightAction={null}
          />
          <ScrollView>
            <View style={styles.imageContainer}>
              {pet.image ? (
                <>
                  {typeof pet.image === 'string' ? (
                    <Image
                      source={{ uri: pet.image }}
                      style={styles.petImage}
                      onLoad={() => setIsImageRendered(true)}
                    />
                  ) : (
                    <Image
                      source={pet.image}
                      style={styles.petImage}
                      onLoad={() => setIsImageRendered(true)}
                    />
                  )}
                </>
              ) : (
                <View style={[styles.petImage, styles.placeholderImage]}>
                  <Ionicons name="paw" size={80} color="#cccccc" />
                </View>
              )}

              {/* CORREÇÃO: Removida a condição isImageRendered daqui */}
              <TouchableOpacity
                style={styles.favoriteButton}
                onPress={handleFavoriteToggle}
              >
                <Feather
                  name={isFavorited ? 'heart' : 'heart'}
                  size={24}
                  color={isFavorited ? '#E91E63' : '#434343'}
                  fill={isFavorited ? '#E91E63' : 'none'}
                />
              </TouchableOpacity>
            </View>

            {/* CORREÇÃO: Removida a condição isImageRendered daqui */}
            <View style={styles.contentContainer}>
              <Text style={styles.petName}>{pet.name}</Text>

              <View style={styles.rowContainer}>
                <View>
                  <Text style={styles.sectionTitle}>SEXO</Text>
                  <Text style={styles.sectionContent}>
                    {pet.sex || 'Não informado'}
                  </Text>
                </View>
                <View>
                  <Text style={styles.sectionTitle}>PORTE</Text>
                  <Text style={styles.sectionContent}>
                    {pet.size || 'Não informado'}
                  </Text>
                </View>
                <View>
                  <Text style={styles.sectionTitle}>IDADE</Text>
                  <Text style={styles.sectionContent}>
                    {pet.age || 'Não informado'}
                  </Text>
                </View>
              </View>

              <View style={styles.rowContainer}>
                <View>
                  <Text style={styles.sectionTitle}>LOCALIZAÇÃO</Text>
                  <Text style={styles.sectionContent}>
                    {pet.location || 'Não informado'}
                  </Text>
                </View>
              </View>

              <View style={styles.rowContainer}>
                <View>
                  <Text style={styles.sectionTitle}>CASTRADO</Text>
                  <Text style={styles.sectionContent}>
                    {pet.health?.includes('Castrado') ? 'Sim' : 'Não'}
                  </Text>
                </View>
                <View>
                  <Text style={styles.sectionTitle}>VERMIFUGADO</Text>
                  <Text style={styles.sectionContent}>
                    {pet.health?.includes('Vermifugado') ? 'Sim' : 'Não'}
                  </Text>
                </View>
              </View>

              <View style={styles.rowContainer}>
                <View>
                  <Text style={styles.sectionTitle}>VACINADO</Text>
                  <Text style={styles.sectionContent}>
                    {pet.health?.includes('Vacinado') ? 'Sim' : 'Não'}
                  </Text>
                </View>
                <View>
                  <Text style={styles.sectionTitle}>DOENÇAS</Text>
                  <Text style={styles.sectionContent}>
                    {pet.diseases || 'Nenhuma'}
                  </Text>
                </View>
              </View>

              <View style={styles.rowContainer}>
                <View>
                  <Text style={styles.sectionTitle}>TEMPERAMENTO</Text>
                  <Text style={styles.sectionContent}>
                    {formatArrayAsCommaSeparatedString(pet.temperament) ||
                      'Não informado'}
                  </Text>
                </View>
              </View>

              <View style={styles.rowContainer}>
                <View>
                  <Text style={styles.sectionTitle}>EXIGÊNCIAS DO DOADOR</Text>
                  <Text style={styles.sectionContent}>
                    {formatArrayAsCommaSeparatedString(pet.requirements) ||
                      'Não informado'}
                  </Text>
                </View>
              </View>

              <View style={styles.rowContainer}>
                <View>
                  <Text style={styles.sectionTitle}>
                    MAIS SOBRE {pet.name.toUpperCase()}
                  </Text>
                  <Text style={styles.sectionContent}>
                    {pet.about || 'Nenhuma'}
                  </Text>
                </View>
              </View>
            </View>
          </ScrollView>

          {/* CORREÇÃO: Removida a condição isImageRendered daqui */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.adoptButton}
              onPress={() => alert('Implementar chat!')}
            >
              <Text style={styles.adoptButtonText}>PRETENDO ADOTAR</Text>
            </TouchableOpacity>
          </View>
        </CustomSafeArea>
      )}
    </View>
  );
}

// Estilos (permanecem os mesmos)
const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  overlayLoader: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    zIndex: 10,
  },
  petImage: {
    width: '100%',
    height: width * 0.9,
    resizeMode: 'cover',
    backgroundColor: '#e0e0e0',
  },
  placeholderImage: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    position: 'relative',
    minHeight: width * 0.9,
    backgroundColor: '#e0e0e0',
  },
  backButtonHeader: {
    position: 'absolute',
    top: 20,
    left: 20,
  },
  favoriteButton: {
    position: 'absolute',
    right: 20,
    bottom: -30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  contentContainer: {
    padding: 20,
    paddingTop: 40,
  },
  petName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#434343',
    marginBottom: 16,
  },
  rowContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingBottom: 16,
  },
  sectionTitle: {
    fontSize: 12,
    color: '#f7a800',
    fontWeight: 'bold',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  sectionContent: {
    fontSize: 14,
    color: '#555',
    lineHeight: 24,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    backgroundColor: '#FFFFFF',
  },
  adoptButton: {
    backgroundColor: '#fdcf58',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  adoptButtonText: {
    color: '#434343',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
