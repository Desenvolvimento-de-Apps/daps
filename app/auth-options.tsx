import { router } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Button from './components/Button';
import CustomSafeArea from './components/CustomSafeArea';
import { Feather } from '@expo/vector-icons';
import Header from './components/Header';

export default function AuthOptionsScreen() {
  return (
    <CustomSafeArea style={styles.container}>
      <Header
        leftAction={
          <TouchableOpacity
            onPress={() => {
              router.back();
            }}
          >
            <Feather name="arrow-left" size={24} color="#434343" />
          </TouchableOpacity>
        }
        title="Cadastro"
        containerStyle={{ backgroundColor: '#88C9BF' }}
      />

      <View style={styles.content}>
        <Text style={styles.title}>Ops!</Text>
        <Text style={styles.message}>
          Você não pode realizar esta ação sem possuir um cadastro.
        </Text>

        <View style={styles.buttonContainer}>
          <Button
            title="FAZER CADASTRO"
            onPress={() => router.navigate('/cadastro-pessoal')}
            backgroundColor="#88C9BF"
            textColor="#434343"
            textStyle={{ fontSize: 16 }}
            style={styles.button}
          />

          <Text style={styles.loginText}>Já possui cadastro?</Text>

          <Button
            title="FAZER LOGIN"
            onPress={() => router.navigate('/login')}
            backgroundColor="#88C9BF"
            textColor="#434343"
            textStyle={{ fontSize: 16 }}
            style={styles.button}
          />
        </View>
      </View>
    </CustomSafeArea>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  title: {
    fontSize: 48,
    fontFamily: 'Courgette-Regular',
    color: '#88C9BF',
    marginBottom: 24,
  },
  message: {
    fontSize: 16,
    color: '#757575',
    textAlign: 'center',
    marginBottom: 48,
  },
  buttonContainer: {
    width: '100%',
    gap: 12,
  },
  button: {
    height: 48,
    borderRadius: 4,
  },
  loginText: {
    fontSize: 16,
    color: '#88C9BF',
    textAlign: 'center',
    marginTop: 24,
  },
});
