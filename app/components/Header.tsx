import { StyleSheet, Text, View, ViewStyle } from 'react-native';

interface HeaderProps {
  icon: React.ReactNode;
  title?: string;
  containerStyle?: ViewStyle;
}

export default function Header({ icon, containerStyle, title }: HeaderProps) {
  return (
    <View style={[
        styles.container,
        containerStyle,
      ]}>
      {icon}
      <Text style={styles.text}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        backgroundColor: '#FAFAFA',
        height: 56,
        paddingHorizontal: 12,
    },
    text: {
        marginLeft: 30,
        fontSize: 20,
        fontWeight: 'bold',
    },
})
