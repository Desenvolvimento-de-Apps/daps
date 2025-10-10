import ChatScreen from '@/components/Chat';
import CustomSafeArea from '@/components/CustomSafeArea';
import Header from '@/components/Header';
import { Feather } from '@expo/vector-icons';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { TouchableOpacity } from 'react-native';

export default function ChatPage() {
  const navigation = useNavigation();
  const params = useLocalSearchParams();
  const { otherUserId, otherUserName } = params;

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
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}
          >
            <Feather name="more-vertical" size={24} color="#434343" />
          </TouchableOpacity>
        }
        containerStyle={{ backgroundColor: '#88c9bf' }}
        title={otherUserName as string}
        titleStyle={{
          color: '#434343',
          alignSelf: 'flex-start',
          marginLeft: 20,
        }}
      />
      <ChatScreen otherUserId={otherUserId as string} />
    </CustomSafeArea>
  );
}
