import CustomSafeArea from '@/components/CustomSafeArea';
import Header from '@/components/Header';
import ImageCarousel from '@/components/ImageCarousel';
import { auth } from '@/firebaseConfig';
import {
  addFavoritePet,
  checkInterestStatus,
  getPetById,
  isPetFavorited,
  markInterestInPet,
  removeFavoritePet,
  removeInterestInPet,
} from '@/services/api';
import { PetDetails } from '@/types';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const formatArrayAsCommaSeparatedString = (arr: string[] | null) => {
  if (!arr || arr.length === 0) return null;
  return arr.join(', ');
};

export default function PetInfoScreen() {
  const router = useRouter();
  const { petId } = useLocalSearchParams<{ petId: string }>();

  const user = auth.currentUser;

  const [pet, setPet] = useState<PetDetails | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isFavorited, setIsFavorited] = useState(false);
  const [isCheckingFavorite, setIsCheckingFavorite] = useState(true);
  const [interestStatus, setInterestStatus] = useState<
    'none' | 'pending' | 'rejected'
  >('none');
  const [isSubmittingInterest, setIsSubmittingInterest] = useState(false);
  const [isOwner, setIsOwner] = useState(false);

  const [isApiFinished, setIsApiFinished] = useState(false);
  const [isImageRendered, setIsImageRendered] = useState(false);

  useEffect(() => {
    if (!petId) {
      setError('ID do pet não fornecido.');
      setIsApiFinished(true);
      setIsImageRendered(true);
      setIsCheckingFavorite(false);
      return;
    }

    const fetchPetDetails = async () => {
      try {
        // Busca os dados do pet
        const petData = await getPetById(petId);
        setPet(petData);
        if (petData && petData.image.length > 0) {
          setIsImageRendered(true);
        }

        if (user) {
          const isMyPet = petData?.ownerUid === user.uid;
          setIsOwner(isMyPet);

          // Se não for o dono, verifica se é favorito ou interessado
          if (!isMyPet) {
            const favoritedStatus = await isPetFavorited(user.uid, petId);
            setIsFavorited(favoritedStatus);

            // NOVA VERIFICAÇÃO DE STATUS
            const status = await checkInterestStatus(user.uid, petId);
            setInterestStatus(status);
          }
        }
      } catch (e) {
        setError('Não foi possível carregar os dados do pet.');
        setIsImageRendered(true);
      } finally {
        setIsApiFinished(true);
        setIsCheckingFavorite(false);
      }
    };

    fetchPetDetails();
  }, [petId, user]);

  const handleFavoriteToggle = async () => {
    const user = auth.currentUser;
    if (!user) {
      Alert.alert(
        'Login Necessário',
        'Você precisa estar logado para favoritar um pet.',
      );
      return;
    }

    if (!petId) return;

    // Inverte o estado atual para a chamada da API
    const newFavoritedState = !isFavorited;

    try {
      if (newFavoritedState) {
        await addFavoritePet(user.uid, petId);
      } else {
        await removeFavoritePet(user.uid, petId);
      }
      // Atualiza o estado da UI apenas se a operação no banco for bem-sucedida
      setIsFavorited(newFavoritedState);
    } catch (err) {
      console.error('Erro ao atualizar favorito:', err);
      Alert.alert('Erro', 'Não foi possível atualizar o status de favorito.');
    }
  };

  const handleEditPet = () => {
    // Navegue para a tela de edição, passando o ID do pet
    Alert.alert('Funcionalidade Futura', 'Navegar para a tela de edição.');
  };

  const handleListInterested = () => {
    // Navegue para a nova tela, passando o ID e o nome do pet
    router.push({
      pathname: '/(drawer)/pets/interested',
      params: { petId: petId, petName: pet?.name },
    });
  };

  const handleListBlockedUser = () => {
    router.push({
      pathname: '/(drawer)/pets/blocked-users',
      params: { petId: petId, petName: pet?.name },
    });
  };

  const handleRemovePet = () => {
    Alert.alert(
      'Remover Pet',
      'Tem certeza que deseja remover este pet? Esta ação não pode ser desfeita.',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Remover',
          style: 'destructive',
          onPress: async () => {
            try {
              // Chame a sua função da API para deletar o pet
              // await deletePet(petId);
              Alert.alert('Sucesso', '(Mas ainda não implementado)');
              router.back(); // Volta para a tela anterior
            } catch (err) {
              console.error('Erro ao remover pet:', err);
              Alert.alert('Erro', 'Não foi possível remover o pet.');
            }
          },
        },
      ],
    );
  };

  const handleShare = async () => {
    if (!pet) return; // Garante que temos os dados do pet

    try {
      const result = await Share.share({
        message: `Olha que pet fofinho para adoção! Conheça o(a) ${pet.name}.`,
        // Você pode adicionar uma URL para o seu app ou para o perfil do pet aqui
        // url: `https://meuapp.com/pet/${petId}`,
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // compartilhado com o tipo de atividade result.activityType
        } else {
          // compartilhado
        }
      } else if (result.action === Share.dismissedAction) {
        // dispensado
      }
    } catch (error: any) {
      Alert.alert('Erro', error.message);
    }
  };

  const handleInterestToggle = async () => {
    const user = auth.currentUser;
    if (!user || !petId) {
      Alert.alert(
        'Erro',
        'Não foi possível completar a ação. Tente novamente.',
      );
      return;
    }

    setIsSubmittingInterest(true); // Inicia o loading

    try {
      if (interestStatus === 'pending') {
        // Remover interesse (apenas se estiver pendente)
        await removeInterestInPet(petId);
        setInterestStatus('none');
      } else if (interestStatus === 'none') {
        // Adicionar interesse
        await markInterestInPet(petId);
        setInterestStatus('pending');
      }
    } catch (error) {
      console.error('Erro ao alternar interesse:', error);
      Alert.alert('Erro', 'Não foi possível atualizar seu interesse.');
    } finally {
      setIsSubmittingInterest(false); // Finaliza o loading
    }
  };

  const isScreenReady = isApiFinished && isImageRendered && !isCheckingFavorite;

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

  const getButtonConfig = () => {
    if (interestStatus === 'rejected') {
      return {
        text: 'RECUSADO PELO DONO',
        style: { backgroundColor: '#FF6B6B', opacity: 0.8 },
        disabled: true,
      };
    }
    if (interestStatus === 'pending') {
      return {
        text: 'REMOVER INTERESSE',
        style: { backgroundColor: '#BDBDBD' },
        disabled: false,
      };
    }
    return {
      text: 'PRETENDO ADOTAR',
      style: styles.adoptButton,
      disabled: false,
    };
  };

  const buttonConfig = getButtonConfig();

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
            rightAction={
              // Botão de compartilhar aparece para todos
              <View style={{ flexDirection: 'row', gap: 8, marginRight: 16 }}>
                {isOwner && (
                  <TouchableOpacity onPress={handleListBlockedUser}>
                    <Feather name="delete" size={24} color="#434343" />
                  </TouchableOpacity>
                )}
                <TouchableOpacity onPress={handleShare}>
                  <Feather name="share-2" size={24} color="#434343" />
                </TouchableOpacity>
              </View>
            }
            containerStyle={isOwner ? { backgroundColor: '#cfe9e5' } : {}}
          />
          <ScrollView>
            <View style={styles.imageContainer}>
              {pet.image.length > 0 ? (
                <>
                  <ImageCarousel
                    containerStyle={styles.petImage}
                    uris={Array.isArray(pet.image) ? pet.image : [pet.image]}
                  />
                </>
              ) : (
                <View style={[styles.petImage, styles.placeholderImage]}>
                  <Ionicons name="paw" size={80} color="#cccccc" />
                </View>
              )}
              <TouchableOpacity
                style={styles.favoriteButton}
                onPress={isOwner ? handleEditPet : handleFavoriteToggle}
                disabled={isCheckingFavorite && !isOwner}
              >
                {isOwner ? (
                  <Feather name="edit-2" size={24} color="#434343" />
                ) : (
                  <Feather
                    name="heart"
                    size={24}
                    color={isFavorited ? '#E91E63' : '#434343'}
                    fill={isFavorited ? '#E91E63' : 'none'}
                  />
                )}
              </TouchableOpacity>
            </View>

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

          <View style={styles.footer}>
            {isOwner ? (
              <View style={styles.ownerActionsContainer}>
                <TouchableOpacity
                  style={styles.listButton}
                  onPress={handleListInterested}
                >
                  <Text style={styles.listButtonText}>LISTAR INTERESSADOS</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={handleRemovePet}
                >
                  <Text style={styles.removeButtonText}>REMOVER PET</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                style={[styles.adoptButton, buttonConfig.style]}
                onPress={handleInterestToggle}
                disabled={isSubmittingInterest || buttonConfig.disabled}
              >
                {isSubmittingInterest ? (
                  <ActivityIndicator color="#434343" />
                ) : (
                  <Text style={styles.adoptButtonText}>
                    {buttonConfig.text}
                  </Text>
                )}
              </TouchableOpacity>
            )}
          </View>
        </CustomSafeArea>
      )}
    </View>
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
  ownerActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 16,
  },
  listButton: {
    flex: 1,
    backgroundColor: '#88c9bf',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  listButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  removeButton: {
    flex: 1,
    backgroundColor: '#88c9bf',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  removeButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  adoptButtonActive: {
    backgroundColor: '#BDBDBD',
  },
});
