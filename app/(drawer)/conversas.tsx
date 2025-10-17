import Button from '@/components/Button';
import ChatPersonCard from '@/components/ChatPersonCard';
import CustomSafeArea from '@/components/CustomSafeArea';
import Header from '@/components/Header';
import { useAuth } from '@/contexts/AuthContext';
import { getUserChats } from '@/services/api';
import { ChatMessage } from '@/types';
import { Feather } from '@expo/vector-icons';
import { DrawerActions } from '@react-navigation/native';
import { useFocusEffect, useNavigation } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { FlatList } from 'react-native-gesture-handler';

export default function ChatPage() {
  const navigation = useNavigation();
  const auth = useAuth();
  const userId = auth.user?.uid;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [chats, setChats] = useState<ChatMessage[]>([]);

  const fetchChats = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const fetchedChats = await getUserChats(userId!);
      setChats(fetchedChats);
    } catch (error) {
      setError(error instanceof Error ? error.message : String(error));
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useFocusEffect(
    useCallback(() => {
      fetchChats();
    }, [fetchChats]),
  );

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#88C9BF" />
      </View>
    );
  }

  return (
    <CustomSafeArea style={styles.container}>
      <Header
        leftAction={
          <TouchableOpacity
            onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
          >
            <Feather name="menu" size={24} color="#434343" />
          </TouchableOpacity>
        }
        containerStyle={{ backgroundColor: '#88c9bf' }}
        title="Chat"
        titleStyle={{
          color: '#434343',
          alignSelf: 'flex-start',
          marginLeft: 20,
        }}
      />

      {
        <View style={styles.content}>
          <FlatList
            style={styles.chatList}
            data={chats}
            keyExtractor={(item) => item.userId.toString()}
            ItemSeparatorComponent={() => <View style={{ height: 28 }} />}
            ListEmptyComponent={
              <Text style={{ textAlign: 'center', marginTop: 20, paddingHorizontal: 20 }}>
                Nenhuma conversa encontrada, inicie uma nova após aceitar a solicitação de adoção dos seus pets!
              </Text>
            }
            renderItem={({ item }) => {
              return (
                <ChatPersonCard
                  userId={item.userId}
                  name={item.name}
                  nickname={item.nickname}
                  profileImageUrl={item.profileImageUrl}
                  lastMessage={item.lastMessage}
                  lastMessageTime={item.lastMessageTime}
                  onPress={() =>
                    // @ts-ignore
                    navigation.navigate('chat', {
                      otherUserId: item.userId,
                      otherUserName: item.name,
                    })
                  }
                />
              );
            }}
          />

          <Button
            title="FINALIZAR UM PROCESSO"
            onPress={() => {}}
            textColor="#434343"
            backgroundColor="#88c9bf"
            style={{ marginVertical: 24, alignSelf: 'center', width: '80%' }}
          />
        </View>
      }
    </CustomSafeArea>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: '#589b9b',
  },
  content: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  chatList: {
    flex: 1,
    width: '100%',
    padding: 16,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});
