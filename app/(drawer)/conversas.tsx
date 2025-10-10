import Button from '@/components/Button';
import ChatPersonCard, {
  ChatPersonCardProps,
} from '@/components/ChatPersonCard';
import CustomSafeArea from '@/components/CustomSafeArea';
import Header from '@/components/Header';
import { Feather } from '@expo/vector-icons';
import { DrawerActions } from '@react-navigation/native';
import { useNavigation } from 'expo-router';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';

const mockMessages: ChatPersonCardProps[] = [
  {
    userId: 'rTz12xtCoXb5bOY7WMXk8ssCThq1',
    name: 'Cassio Borges',
    profileImageUrl:
      'https://scontent-bsb1-1.cdninstagram.com/v/t51.2885-19/221272418_826568084660263_1883689967699555897_n.jpg?stp=dst-jpg_s150x150_tt6&efg=eyJ2ZW5jb2RlX3RhZyI6InByb2ZpbGVfcGljLmRqYW5nby45MzcuYzIifQ&_nc_ht=scontent-bsb1-1.cdninstagram.com&_nc_cat=107&_nc_oc=Q6cZ2QFDV1w03lsLfGt44tUcgAAikE41XHzcSY9EbuH0eQ9_SSoMRgMjc6UBiA1djeN3vZ8AwtOuPvRFITAvmW4YgvgA&_nc_ohc=8IZjjX_PFhgQ7kNvwG1HL_2&_nc_gid=CZiOkzf14_SH4-h9BqZ23w&edm=ALGbJPMBAAAA&ccb=7-5&oh=00_Afe78C_f7gNs6M9j8MHEmCpEdkvxDD-GRhKOMUECaSyYiw&oe=68EE4254&_nc_sid=7d3ac5',
    lastMessage: 'Receba esse chat!',
    lastMessageTime: '00:00',
  },
  {
    userId: '2',
    name: 'Maria Silva',
    nickname: 'mariasilva',
    profileImageUrl: 'https://randomuser.me/api/portraits/women/1.jpg',
    lastMessage: 'Oi, tudo bem? Gostaria de saber mais sobre o animal.',
    lastMessageTime: '10:30',
  },
  {
    userId: '3',
    name: 'Maria Silva',
    nickname: 'mariasilva',
    profileImageUrl: 'https://randomuser.me/api/portraits/women/1.jpg',
    lastMessage: 'Oi, tudo bem? Gostaria de saber mais sobre o animal.',
    lastMessageTime: '10:30',
  },
  {
    userId: '4',
    name: 'Maria Silva',
    nickname: 'mariasilva',
    profileImageUrl: 'https://randomuser.me/api/portraits/women/1.jpg',
    lastMessage: 'Oi, tudo bem? Gostaria de saber mais sobre o animal.',
    lastMessageTime: '10:30',
  },
  {
    userId: '5',
    name: 'Maria Silva',
    nickname: 'mariasilva',
    profileImageUrl: 'https://randomuser.me/api/portraits/women/1.jpg',
    lastMessage: 'Oi, tudo bem? Gostaria de saber mais sobre o animal.',
    lastMessageTime: '10:30',
  },
];

export default function ChatPage() {
  const navigation = useNavigation();

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

      <View style={styles.content}>
        <FlatList
          style={styles.chatList}
          data={mockMessages}
          keyExtractor={(item) => item.userId.toString()}
          ItemSeparatorComponent={() => <View style={{ height: 28 }} />}
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
});
