import CustomSafeArea from '@/components/CustomSafeArea';
import Header from '@/components/Header';
import { useAuth } from '@/contexts/AuthContext';
import {
  getInterestedUsersForPet,
  startChatBetweenUsers,
} from '@/services/api'; // Ajuste o caminho
import { UserData } from '@/types'; // Ajuste o caminho
import { Feather, Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

// Componente para renderizar cada item da lista
const UserListItem = ({ user, petId }: { user: UserData; petId: string }) => {
  const { user: currentUser } = useAuth();
  const router = useRouter();

  const handleIniciarChat = async () => {
    await startChatBetweenUsers(currentUser?.uid!, user.uid, petId);
  };

  return (
    <View style={styles.userItemContainer}>
      {user.image ? (
        // Se o usuário TEM imagem, renderiza a imagem
        <Image source={{ uri: user.image }} style={styles.userImage} />
      ) : (
        // Se NÃO TEM imagem, renderiza um ícone dentro de uma View
        <View style={[styles.userImage, styles.placeholderIconContainer]}>
          <Ionicons name="person" size={30} color="#a0a0a0" />
        </View>
      )}
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{user.nome}</Text>
        <Text style={styles.userHandle}>@{user.nomeUsuario}</Text>
      </View>

      <View style={styles.botoesContainer}>
        <TouchableOpacity style={[styles.botao, styles.recusarBotao]}>
          <Text>Recusar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.botao, styles.aceitarBotao]}
          onPress={handleIniciarChat}
        >
          <Text>Conversar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default function InterestedListScreen() {
  const router = useRouter();
  const { petId, petName } = useLocalSearchParams<{
    petId: string;
    petName: string;
  }>();

  const [interestedUsers, setInterestedUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!petId) {
      setError('ID do pet não fornecido.');
      setLoading(false);
      return;
    }

    const fetchUsers = async () => {
      try {
        const users = await getInterestedUsersForPet(petId);
        setInterestedUsers(users);
      } catch (e) {
        setError('Não foi possível carregar a lista de interessados.');
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [petId]);

  const renderContent = () => {
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
          <Text style={styles.errorText}>{error}</Text>
        </View>
      );
    }

    if (interestedUsers.length === 0) {
      return (
        <View style={styles.centered}>
          <Ionicons name="paw-outline" size={60} color="#cccccc" />
          <Text style={styles.emptyText}>
            Ninguém demonstrou interesse neste pet ainda.
          </Text>
        </View>
      );
    }

    return (
      <FlatList
        data={interestedUsers}
        keyExtractor={(item) => item.uid!}
        renderItem={({ item }) => <UserListItem user={item} petId={petId} />}
        contentContainerStyle={styles.listContainer}
      />
    );
  };

  return (
    <CustomSafeArea style={styles.container}>
      <Header
        title={`Interessados em ${petName || 'Pet'}`}
        leftAction={
          <TouchableOpacity onPress={() => router.back()}>
            <Feather name="arrow-left" size={24} color="#434343" />
          </TouchableOpacity>
        }
      />
      {renderContent()}
    </CustomSafeArea>
  );
}

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
  listContainer: {
    paddingVertical: 10,
  },
  errorText: {
    fontSize: 16,
    color: '#D32F2F',
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: '#757575',
    textAlign: 'center',
  },
  userItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: '#fff',
  },
  userImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#e0e0e0',
    marginRight: 16,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#434343',
  },
  userHandle: {
    fontSize: 14,
    color: '#757575',
  },
  placeholderIconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  botoesContainer: {
    gap: 8,
  },
  botao: {
    padding: 10,
    borderRadius: 5,
    marginLeft: 5,
  },
  aceitarBotao: {
    backgroundColor: '#88C9BF',
    alignItems: 'center',
  },
  recusarBotao: {
    backgroundColor: '#F08080',
    alignItems: 'center',
  },
});
