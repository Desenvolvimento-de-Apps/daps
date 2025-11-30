import { adoptPet } from '@/services/api';
import ChatScreen from '@/components/Chat';
import CustomSafeArea from '@/components/CustomSafeArea';
import Header from '@/components/Header';
import { auth, db } from '@/firebaseConfig';
import { Feather } from '@expo/vector-icons';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function ChatPage() {
  const navigation = useNavigation();
  const params = useLocalSearchParams();
  const { chatKey, otherUserName, petName } = params;

  // Estados para controlar a lógica
  const [showMenu, setShowMenu] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [adoptionData, setAdoptionData] = useState<{
    petId: string;
    adopterUid: string;
  } | null>(null);

  useEffect(() => {
    checkOwnershipAndPrepareData();
  }, []);

  const checkOwnershipAndPrepareData = async () => {
    const user = auth.currentUser;
    if (!user || !chatKey) return;

    try {
      // Buscar dados do Chat para pegar petId e participantes
      const chatRef = doc(db, 'chats', chatKey as string);
      const chatSnap = await getDoc(chatRef);

      if (chatSnap.exists()) {
        const data = chatSnap.data();
        const participants = data.participants as string[];
        const petId = data.petId;

        // Identificar quem é o adotante (quem não é o usuário atual)
        const adopterUid = participants.find((uid) => uid !== user.uid);

        if (petId && adopterUid) {
          // Buscar dados do Pet para confirmar se sou o dono
          const petRef = doc(db, 'pets', petId);
          const petSnap = await getDoc(petRef);

          if (petSnap.exists() && petSnap.data().ownerUid === user.uid) {
            setIsOwner(true);
            setAdoptionData({ petId, adopterUid });
          }
        }
      }
    } catch (error) {
      console.error('Erro ao verificar dados do chat:', error);
    }
  };

  const handleConfirmAdoption = () => {
    setShowMenu(false);

    Alert.alert(
      'Confirmar Adoção',
      `Deseja confirmar a doação de ${petName} para ${otherUserName}? Essa ação transferirá a propriedade do pet.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Confirmar',
          onPress: performAdoption,
        },
      ],
    );
  };

  const performAdoption = async () => {
    if (!adoptionData) return;

    setIsLoading(true);
    try {
      await adoptPet(adoptionData.petId, adoptionData.adopterUid);
      Alert.alert('Sucesso!', 'Adoção realizada com sucesso.');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível concluir a adoção.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CustomSafeArea style={{ flex: 1, backgroundColor: '#589b9b' }}>
      <Header
        leftAction={
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}
          >
            <Feather name="arrow-left" size={24} color="#434343" />
          </TouchableOpacity>
        }
        rightAction={
          // Só mostra os 3 pontinhos se o usuário for o dono do pet
          isOwner ? (
            <TouchableOpacity onPress={() => setShowMenu(!showMenu)}>
              <Feather name="more-vertical" size={24} color="#434343" />
            </TouchableOpacity>
          ) : null
        }
        containerStyle={{ backgroundColor: '#88c9bf', zIndex: 10 }} // zIndex alto para o Header
        title={(otherUserName as string) + ' - ' + (petName as string)}
        titleStyle={{
          color: '#434343',
          alignSelf: 'flex-start',
          marginLeft: 20,
        }}
      />

      {/* Menu Flutuante (Dropdown) */}
      {showMenu && isOwner && (
        <View style={styles.menuContainer}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={handleConfirmAdoption}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#434343" />
            ) : (
              <Text style={styles.menuText}>Confirmar adoção do Pet</Text>
            )}
          </TouchableOpacity>
        </View>
      )}

      {/* Camada transparente para fechar o menu ao clicar fora */}
      {showMenu && (
        <TouchableOpacity
          style={styles.overlay}
          onPress={() => setShowMenu(false)}
          activeOpacity={1}
        />
      )}

      <ChatScreen chatKey={chatKey as string} />
    </CustomSafeArea>
  );
}

const styles = StyleSheet.create({
  menuContainer: {
    position: 'absolute',
    top: 60,
    right: 10,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 5,
    elevation: 5, // Sombra para Android
    shadowColor: '#000', // Sombra para iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    zIndex: 20,
    minWidth: 180,
  },
  menuItem: {
    padding: 15,
  },
  menuText: {
    fontSize: 16,
    color: '#434343',
    fontWeight: '500',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 15,
  },
});
