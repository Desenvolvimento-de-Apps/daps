import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export interface ChatPersonCardProps {
  userId: string;
  name: string;
  nickname?: string;
  profileImageUrl: string;
  lastMessage: string;
  lastMessageTime: string;
  onPress: () => void;
}

const formatText = (text: string, maxLength: number) => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

const formatDate = (dateString: string) => {
  if (!dateString) return '';

  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInMinutes = Math.floor(diffInMs / 60000);

  if (diffInMinutes < 1) return 'Agora';
  if (diffInMinutes < 60) return `${diffInMinutes} min atrás`;
  if (diffInMinutes < 1440) {
    const hours = Math.floor(diffInMinutes / 60);
    if (hours > 1) return `Há ${hours} horas`;
    return `Há ${hours}h`;
  }

  const days = Math.floor(diffInMinutes / 1440);
  if (days > 1) return `Há ${days} dias`;
  return `Há ${days}dia`;
};

export default function ChatPersonCard(props: ChatPersonCardProps) {
  return (
    <TouchableOpacity style={styles.container} onPress={props.onPress}>
      <Image source={{ uri: props.profileImageUrl }} style={styles.userImage} />
      <View>
        <View style={styles.dataContainer}>
          <View style={styles.nameContainer}>
            <Text numberOfLines={2} style={styles.name}>
              {props.name.toUpperCase()}
            </Text>
            {/* {props.nickname && (
              <Text style={styles.name}>|{props.nickname.toUpperCase()}</Text>
            )} */}
          </View>
          <Text style={{ justifyContent: 'flex-end' }}>
            {props.lastMessageTime && formatDate(props.lastMessageTime)}
          </Text>
        </View>
        <Text style={{ width: '80%' }}>
          {props.lastMessage && formatText(props.lastMessage, 38)}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    width: '100%',
  },
  userImage: {
    borderRadius: 100,
    width: 50,
    height: 50,
    marginRight: 8,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 12,
    color: '#589b9b',
  },
  nameContainer: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  dataContainer: {
    flex: 1,
    width: '90%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
