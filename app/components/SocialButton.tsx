import { FontAwesome } from '@expo/vector-icons';
import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';

interface SocialButtonProps {
  title: string;
  onPress: () => void;
  iconName: React.ComponentProps<typeof FontAwesome>['name'];
  style?: ViewStyle;
  textStyle?: TextStyle;
  iconColor?: string;
  loading?: boolean;
}

const SocialButton: React.FC<SocialButtonProps> = ({
  title,
  onPress,
  iconName,
  style,
  textStyle,
  iconColor = '#434343',
  loading = false,
}) => {
  return (
    <TouchableOpacity
      style={[styles.button, style]}
      onPress={onPress}
      disabled={loading}
    >
      {loading ? (
        <ActivityIndicator color={iconColor} />
      ) : (
        <>
          <FontAwesome
            name={iconName}
            size={20}
            color={iconColor}
            style={styles.icon}
          />
          <Text style={[styles.text, textStyle]}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    minHeight: 48,
  },
  icon: {
    marginRight: 12,
  },
  text: {
    fontSize: 12,
    color: '#434343',
    fontWeight: 'bold',
  },
});

export default SocialButton;
