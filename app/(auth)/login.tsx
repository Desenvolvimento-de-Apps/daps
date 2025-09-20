import { router } from 'expo-router';
import {
  GoogleAuthProvider,
  signInAnonymously,
  signInWithCredential,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { auth } from '@/firebaseConfig';
import Button from '@/components/Button';
import SocialButton from '@/components/SocialButton';
import { useEffect, useState } from 'react';
import CustomSafeArea from '@/components/CustomSafeArea';
import { Feather } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import InputText from '@/components/Input';

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const [loading, setLoading] = useState(false);
  const [loadingAnonymous, setLoadingAnonymous] = useState(false);
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [requestGoogle, responseGoogle, promptAsyncGoogle] =
    Google.useAuthRequest({
      webClientId:
        '303833510013-s19v0fak32mt3kcj2if7qu87emvg8qeo.apps.googleusercontent.com',
      iosClientId:
        '270765835083-55pqst7cb99optkqs4dq1n7parrip2gt.apps.googleusercontent.com',
      androidClientId:
        '270765835083-k5sb1pi685093qlcl9j65366vtpcqk2s.apps.googleusercontent.com',
    });

  const handleEmailPasswordLogin = async () => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.replace('/(drawer)');
    } catch (error) {
      console.error('Email/Password auth error:', error);
      Alert.alert(
        'Erro de Autenticação',
        'Não foi possível fazer o login. Verifique suas credenciais.',
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAnonymousLogin = async () => {
    setLoadingAnonymous(true);
    try {
      await signInAnonymously(auth);
      router.replace('/(drawer)');
    } catch (error) {
      console.error('Anonymous auth error:', error);
      Alert.alert(
        'Erro de Autenticação',
        'Não foi possível fazer o login anônimo.',
      );
    } finally {
      setLoadingAnonymous(false);
    }
  };

  useEffect(() => {
    if (responseGoogle?.type === 'success') {
      setLoadingGoogle(true);
      const { id_token } = responseGoogle.params;
      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credential)
        .then(() => {
          router.replace('/(drawer)');
        })
        .catch((error) => {
          console.error('Google Sign-In Error:', error);
          Alert.alert('Erro', 'Não foi possível fazer login com o Google.');
        })
        .finally(() => {
          setLoadingGoogle(false);
        });
    } else if (responseGoogle?.type === 'error') {
      console.log('Erro na resposta do Google:', responseGoogle.error);
      setLoadingGoogle(false);
    }
  }, [responseGoogle]);

  return (
    <CustomSafeArea style={styles.safeArea}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Feather name="arrow-left" size={28} color="#FFFFFF" />
      </TouchableOpacity>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.content}
        >
          <Text style={styles.title}>Login</Text>

          <View style={styles.inputContainer}>
            <InputText
              inputType="email"
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#BDBDBD"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
            />
            <InputText
              inputType="password"
              style={styles.input}
              placeholder="Senha"
              placeholderTextColor="#BDBDBD"
              value={password}
              onChangeText={setPassword}
            />
          </View>

          <View style={styles.buttonContainer}>
            <Button
              title="ENTRAR"
              onPress={handleEmailPasswordLogin}
              loading={loading}
              backgroundColor="#FFD358"
              textColor="#434343"
              textStyle={{ fontWeight: 'bold' }}
              style={styles.button}
            />

            <Button
              title="ENTRAR COMO ANÔNIMO"
              onPress={handleAnonymousLogin}
              loading={loadingAnonymous}
              backgroundColor="#FFD358"
              textColor="#434343"
              textStyle={{ fontWeight: 'bold' }}
              style={styles.button}
            />

            <SocialButton
              title="ENTRAR COM GOOGLE"
              onPress={() => {
                if (requestGoogle) {
                  promptAsyncGoogle();
                }
              }}
              iconName="google"
              style={{ backgroundColor: '#FFFFFF' }}
              textStyle={{ color: '#434343' }}
              iconColor="#db4437"
              loading={loadingGoogle}
            />
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </CustomSafeArea>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#88C9BF',
  },
  backButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
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
    color: '#FFFFFF',
    marginBottom: 48,
  },
  inputContainer: {
    width: '100%',
    gap: 12,
    marginBottom: 24,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    width: '100%',
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 14,
    color: '#757575',
  },
  buttonContainer: {
    width: '100%',
    gap: 12,
  },
  button: {
    height: 48,
    borderRadius: 4,
  },
});
