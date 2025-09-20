import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  GestureResponderEvent,
} from 'react-native';

interface AdicionarFotoButtonProps {
  onPress: (event: GestureResponderEvent) => void;
  style?: object;
}

const AdicionarFotoButton = ({ onPress, style }: AdicionarFotoButtonProps) => {
  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.circle}>
        <Text style={styles.plusSign}>+</Text>
      </View>
      <Text style={styles.text}>adicionar foto</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 150,
    height: 150,
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3.84,
    elevation: 5,
  },
  circle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#a9a9a9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  plusSign: {
    color: '#a9a9a9',
    fontSize: 30,
    fontWeight: '300',
    lineHeight: 32,
  },
  text: {
    color: '#a9a9a9',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default AdicionarFotoButton;
