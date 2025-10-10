import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export interface ChatPersonCardProps {
  userId: string;
  name: string;
  nickname: string;
  profileImageUrl: string;
  lastMessage: string;
  lastMessageTime: string;
  onPress?: () => void;
}

export default function ChatPersonCard(props: ChatPersonCardProps) {
  const formatText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  };

  return (
    <TouchableOpacity style={styles.container} onPress={props.onPress}>
      <Image source={{ uri: props.profileImageUrl }} style={styles.userImage} />
      <View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <View style={styles.nameContainer}>
            <Text numberOfLines={2} style={styles.name}>
              {props.name.toUpperCase()}
            </Text>
            {props.nickname && (
              <Text style={styles.name}>| {props.nickname.toUpperCase()}</Text>
            )}
          </View>
          <Text style={{ justifyContent: 'flex-end' }}>
            {props.lastMessageTime}
          </Text>
        </View>
        <Text style={{ width: '80%' }}>
          {formatText(props.lastMessage, 38)}
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
});
