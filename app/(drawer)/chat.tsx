import ChatScreen from '@/components/Chat';
import CustomSafeArea from '@/components/CustomSafeArea';
import React from 'react';
import { StyleSheet, Text } from 'react-native';

export default function ChatPage() {
  const TEST_PARAMS = {
    otherUserId: '0MUIAYirvbNEExHFOWV730B2VzV2',
  };
  return (
    <CustomSafeArea style={styles.container}>
      <Text style={styles.title}>Chat</Text>
      <ChatScreen {...TEST_PARAMS} />
    </CustomSafeArea>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  content: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
});
