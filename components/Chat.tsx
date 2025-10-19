import { Feather } from '@expo/vector-icons';
import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  Timestamp,
} from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { auth, db } from '@/firebaseConfig';
import { useAuth } from '@/contexts/AuthContext';

interface Message {
  id: string;
  text: string;
  createdAt: Timestamp;
  userId: string;
}

interface ChatScreenProps {
  otherUserId: string;
}

export default function ChatScreen({ otherUserId }: ChatScreenProps) {
  const auth = useAuth();

  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');

  const userId = auth.user?.uid || null;
  const chatId = [userId, otherUserId].sort().join('_');

  useEffect(() => {
    if (!chatId) return;

    const messagesRef = collection(db, 'chat', chatId, 'messages');
    const q = query(messagesRef, orderBy('createdAt', 'asc'));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const loadedMessages: Message[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Message[];
        setMessages(loadedMessages);
      },
      (error) => {
        console.error('Erro ao carregar mensagens:', error);
      },
    );

    return () => unsubscribe();
  }, [chatId]);

  const sendMessage = async () => {
    if (newMessage.trim() === '' || !chatId || !userId) return;

    try {
      await addDoc(collection(db, 'chat', chatId, 'messages'), {
        text: newMessage,
        createdAt: Timestamp.now(),
        userId,
      });
      setNewMessage('');
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
    }
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <View
      style={[
        styles.messageContainer,
        item.userId === userId ? styles.sentMessage : styles.receivedMessage,
      ]}
    >
      <Text style={styles.messageText}>{item.text}</Text>
      <Text style={styles.messageUser}>
        {item.createdAt.toDate().toLocaleString()}
      </Text>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        style={styles.messageList}
        contentContainerStyle={{ paddingBottom: 10 }}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Digite sua mensagem..."
          placeholderTextColor="#666"
        />
        <TouchableOpacity style={styles.sendButton} onPress={() => sendMessage()}>
          <Feather name="send" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  messageList: {
    flex: 1,
  },
  messageContainer: {
    padding: 10,
    marginVertical: 5,
    marginHorizontal: 10,
    borderRadius: 8,
    maxWidth: '80%',
  },
  sentMessage: {
    backgroundColor: '#DCF8C6',
    alignSelf: 'flex-end',
  },
  receivedMessage: {
    backgroundColor: '#FFFFFF',
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: '#ECECEC',
  },
  messageText: {
    fontSize: 16,
    color: '#000',
  },
  messageUser: {
    fontSize: 11,
    color: '#999',
    marginTop: 4,
    textAlign: 'right',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 15,
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: '#fff',
  },
  sendButton: {
    backgroundColor: '#88c9bf',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
