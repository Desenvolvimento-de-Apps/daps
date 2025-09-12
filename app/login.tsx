import { router } from 'expo-router';
import { signInAnonymously } from 'firebase/auth';
import { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { auth } from '../firebaseConfig';
import Button from './components/Button';
import SocialButton from './components/SocialButton';

export default function LoginScreen() {
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // A lógica de login com email/senha ainda não foi implementada.
  // O botão "ENTRAR" usará o login anônimo por enquanto.
  const handleLogin = async () => {
    setLoading(true);
    try {
      // TODO: Substituir por login com email/senha (signInWithEmailAndPassword)
      const userCredential = await signInAnonymously(auth);
      Alert.alert(
        'Login Provisório',
        `Login anônimo realizado com sucesso! UID: ${userCredential.user.uid}`,
      );
      router.replace('/adopt'); // Navega para a tela de adoção após o login
    } catch (error) {
      console.error('Authentication error:', error);
      Alert.alert(
        'Erro de Autenticação',
        'Não foi possível fazer o login anônimo.',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.content}>
        <Text style={styles.title}>Login</Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Nome de usuário"
            placeholderTextColor="#757575"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholder="Senha"
            placeholderTextColor="#757575"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        <View style={styles.buttonContainer}>
          <Button
            title="ENTRAR"
            onPress={handleLogin}
            loading={loading}
            backgroundColor="#FFD358"
            textColor="#434343"
            textStyle={{ fontWeight: 'bold' }}
          />
          <SocialButton
            title="ENTRAR COM FACEBOOK"
            onPress={() => {
              /* TODO: Implementar login com Facebook */
            }}
            iconName="facebook"
            style={{ backgroundColor: '#FAFAFA' }}
            textStyle={{ color: '#434343' }}
            iconColor="#3b5998"
          />
          <SocialButton
            title="ENTRAR COM GOOGLE"
            onPress={() => {
              /* TODO: Implementar login com Google */
            }}
            iconName="google"
            style={{ backgroundColor: '#FAFAFA' }}
            textStyle={{ color: '#434343' }}
            iconColor="#db4437"
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  title: {
    fontSize: 72,
    fontFamily: 'Courgette-Regular',
    color: '#FAFAFA',
    marginBottom: 48,
  },
  inputContainer: {
    width: '100%',
    gap: 12,
    marginBottom: 24,
  },
  input: {
    backgroundColor: '#FAFAFA',
    borderRadius: 8,
    width: '100%',
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 14,
    color: '#434343',
  },
  buttonContainer: {
    width: '100%',
    gap: 12,
  },
});
