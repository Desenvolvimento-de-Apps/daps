import CustomSafeArea from '@/components/CustomSafeArea';
import Header from '@/components/Header';
import { useAuth } from '@/contexts/AuthContext';
import {
  adoptPet,
  getBlockedUsersForPet,
  getInterestedUsersForPet,
  rejectInterestedUser,
  startChatBetweenUsers,
  unblockUserForPet,
} from '@/services/api';
import { UserData } from '@/types';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface UserListItemProps {
  user: UserData;
  petId: string;
  petName: string;
  onRemove: (userId: string) => void;
}

const UserListItem = ({
  user,
  petId,
  petName,
  onRemove,
}: UserListItemProps) => {
  const { user: currentUser } = useAuth();
  const router = useRouter();
  const [isAdopting, setIsAdopting] = useState(false);

  const handleDesbloquear = () => {
    Alert.alert(
      'Desbloquear Usuário',
      `Tem certeza que deseja desbloquear ${user.nome}? O usuário será notificado.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Desbloquear',
          style: 'destructive',
          onPress: async () => {
            try {
              await unblockUserForPet(petId, user.uid);
              onRemove(user.uid);
            } catch (error) {
              Alert.alert('Erro', 'Não foi possível desbloquear o usuário.');
            }
          },
        },
      ],
    );
  };

  return (
    <View style={styles.userItemContainer}>
      <View style={styles.userInfo}>
        {user.image ? (
          <Image source={{ uri: user.image }} style={styles.userImage} />
        ) : (
          <View style={[styles.userImage, styles.placeholderIconContainer]}>
            <Ionicons name="person" size={30} color="#a0a0a0" />
          </View>
        )}
        <View>
          <Text style={styles.userName}>{user.nome}</Text>
          <Text style={styles.userHandle}>@{user.nomeUsuario}</Text>
        </View>
      </View>

      <View style={styles.botoesContainer}>
        {/* Botão DESBLOQUEAR */}
        <TouchableOpacity
          style={[styles.botao, styles.aceitarBotao]}
          onPress={handleDesbloquear}
          disabled={isAdopting}
        >
          <Text style={styles.botaoText}>Desbloquear</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default function BlockedUsersListScreen() {
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
        const users = await getBlockedUsersForPet(petId);
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

  const handleRemoveUser = (userIdToRemove: string) => {
    setInterestedUsers((prevUsers) =>
      prevUsers.filter((u) => u.uid !== userIdToRemove),
    );
  };

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
          <Ionicons name="ban" size={60} color="#cccccc" />
          <Text style={styles.emptyText}>
            Ninguém está bloqueado para este pet.
          </Text>
        </View>
      );
    }

    return (
      <FlatList
        data={interestedUsers}
        keyExtractor={(item) => item.uid!}
        renderItem={({ item }) => (
          <UserListItem
            user={item}
            petId={petId}
            petName={petName || 'Pet'}
            onRemove={handleRemoveUser}
          />
        )}
        contentContainerStyle={styles.listContainer}
      />
    );
  };

  return (
    <CustomSafeArea style={styles.container}>
      <Header
        title={`Usuários bloqueados para ${petName || 'Pet'}`}
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
    flexDirection: 'column',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: '#fff',
    gap: 12,
  },

  userInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#e0e0e0',
    marginRight: 16,
  },
  userInfo: {
    flexDirection: 'row',
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    marginTop: 4,
  },
  botao: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  aceitarBotao: {
    backgroundColor: '#88C9BF',
  },
  botaoText: {
    fontSize: 12,
    color: '#434343',
    fontWeight: 'bold',
  },
});
