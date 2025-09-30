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

// const InfoTile = ({ title, content }: { title: string; content: string }) => {
//   if (!content) return null;
//   return (
//     <View style={styles.section}>
//       <Text style={styles.sectionTitle}>{title}</Text>
//       <Text style={styles.sectionContent}>{content}</Text>
//     </View>
//   );
// };

const formatArrayAsCommaSeparatedString = (arr: string[] | null) => {
  if (!arr || arr.length === 0) return null;
  return arr.join(', ');
};

export default function PetInfoScreen() {
  const router = useRouter();
  const { petId } = useLocalSearchParams<{ petId: string }>();

  const [pet, setPet] = useState<PetDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFavorited, setIsFavorited] = useState(false);

  useEffect(() => {
    if (!petId) {
      setError('ID do pet não fornecido.');
      setLoading(false);
      return;
    }

    const fetchPetDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const petData = await getPetById(petId);
        setPet(petData);
      } catch (e) {
        setError('Não foi possível carregar os dados do pet.');
      } finally {
        setLoading(false);
      }
    };

    fetchPetDetails();
  }, [petId]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#88C9BF" />
      </View>
    );
  }

  if (error || !pet) {
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

  const handleFavoriteToggle = () => {
    setIsFavorited((previousState) => !previousState);
    // TODO: Adicionar lógica para salvar o favorito no banco de dados
  };

  return (
    <CustomSafeArea style={styles.container}>
      <Header
        title={pet.name}
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
      />
      <ScrollView>
        <View style={styles.imageContainer}>
          <Image source={pet.image} style={styles.petImage} />
          <TouchableOpacity
            style={styles.favoriteButton}
            onPress={handleFavoriteToggle}
          >
            <Feather
              name={isFavorited ? 'heart' : 'heart'}
              size={24}
              color={isFavorited ? '#E91E63' : '#434343'}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.contentContainer}>
          <Text style={styles.petName}>{pet.name}</Text>
          {/* <View style={styles.locationContainer}>
            <Feather name="map-pin" size={16} color="#757575" />
            <Text style={styles.locationText}>{pet.location}</Text>
          </View> */}

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

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.adoptButton}
          onPress={() => alert('Implementar chat!')}
        >
          <Text style={styles.adoptButtonText}>PRETENDO ADOTAR</Text>
        </TouchableOpacity>
      </View>
    </CustomSafeArea>
  );
}

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
    backgroundColor: '#f0f0f0',
  },
  petImage: {
    width: '100%',
    height: width * 0.9,
  },
  imageContainer: {
    position: 'relative',
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
  },
  petName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#434343',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 16,
  },
  locationText: {
    fontSize: 16,
    color: '#757575',
    marginLeft: 8,
  },
  pillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 24,
  },
  rowContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 12,
    color: '#f7a800',
    marginBottom: 8,
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
    color: '##434343',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
