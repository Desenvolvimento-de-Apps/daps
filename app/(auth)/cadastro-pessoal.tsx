import AdicionarFotoButton from '@/components/AdicionarFotoButton';
import Button from '@/components/Button';
import CustomSafeArea from '@/components/CustomSafeArea';
import { Form, FormHandle } from '@/components/Form';
import Header from '@/components/Header';
import InputText from '@/components/Input';
import { auth, db } from '@/firebaseConfig';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { FirebaseError } from 'firebase/app';
import { createUserWithEmailAndPassword, UserCredential } from 'firebase/auth';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { useRef } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import InputMasks from '@/utils/masks';

type UserData = {
  nome: string;
  idade: string;
  email: string;
  estado: string;
  cidade: string;
  endereco: string;
  telefone: string;
  nomeUsuario: string;
  senha: string;
  confirmacaoSenha: string;
};

export default function CadastroPessoal() {
  const formRef = useRef<FormHandle<UserData>>(null);

  const handleSubmit = async (values: UserData): Promise<void> => {
    let userCredential: UserCredential | null = null;

    try {
      const { email, senha, confirmacaoSenha, ...userData } = values;

      userCredential = await createUserWithEmailAndPassword(auth, email, senha);
      const uid = userCredential.user.uid;

      const usernameRef = doc(db, 'usernames', userData.nomeUsuario);
      const usernameDoc = await getDoc(usernameRef);

      if (usernameDoc.exists()) {
        throw new FirebaseError(
          'nome-usuario-already-in-use',
          'Este nome de usuário já está em uso.',
        );
      }

      await setDoc(usernameRef, { uid });
      const userRef = doc(db, 'users', uid);
      await setDoc(userRef, {
        ...userData,
        uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      Alert.alert(
        'Cadastro Bem-Sucedido',
        'Seu cadastro foi realizado com sucesso!',
      );
      router.replace('/(drawer)');
    } catch (error) {
      if (error instanceof FirebaseError && formRef.current) {
        const { setFieldError } = formRef.current;

        switch (error.code) {
          case 'auth/email-already-in-use':
            setFieldError('email', 'Email já está em uso.');
            break;
          case 'auth/weak-password':
            setFieldError('senha', 'Senha muito fraca (mínimo 6 caracteres).');
            break;
          case 'nome-usuario-already-in-use':
            setFieldError(
              'nomeUsuario',
              'Este nome de usuário já está em uso.',
            );
            break;
          case 'missing-username':
            setFieldError('nomeUsuario', 'O nome de usuário é obrigatório.');
            break;
          default:
            Alert.alert('Erro de Cadastro', 'Ocorreu um erro inesperado.');
            console.error('Erro Firebase ao criar o usuário:', error.message);
        }

        if (userCredential) {
          try {
            await userCredential.user.delete();
          } catch (e) {
            console.warn('Falha ao remover usuário após erro:', e);
          }
        }
      } else {
        console.error('Erro desconhecido ao criar o usuário:', error);
        Alert.alert('Erro de Cadastro', 'Ocorreu um erro inesperado.');
      }
    }
  };

  return (
    <CustomSafeArea style={styles.safeArea}>
      <Header
        containerStyle={{ backgroundColor: '#88C9BF' }}
        title="Cadastro Pessoal"
        leftAction={
          <TouchableOpacity
            onPress={() => {
              router.back();
            }}
          >
            <Feather name="arrow-left" size={24} color="#434343" />
          </TouchableOpacity>
        }
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}
      >
        <ScrollView style={styles.body}>
          <View style={styles.advice}>
            <Text style={styles.adviceText}>
              As informações preenchidas serão divulgadas apenas para a pessoa
              com a qual você realizar o processo de adoção e/ou apadrinhamento,
              após a formalização do processo.
            </Text>
          </View>

          {/* FORMULÁRIO DE CADASTRO */}
          <Form onSubmit={handleSubmit} ref={formRef} style={styles.form}>
            {/* INFORMAÇÕES PESSOAIS */}
            <View style={styles.section}>
              <Text style={styles.sectionText}>INFORMAÇÕES PESSOAIS</Text>

              <InputText
                name="nome"
                inputType="text"
                placeholder="Nome Completo"
              />

              <InputText name="idade" inputType="number" placeholder="Idade" />

              <InputText
                name="email"
                inputType="email"
                placeholder="E-mail"
                required
              />

              <InputText name="estado" inputType="text" placeholder="Estado" />

              <InputText name="cidade" inputType="text" placeholder="Cidade" />

              <InputText
                name="endereco"
                inputType="text"
                placeholder="Endereço"
              />

              <InputText
                name="telefone"
                inputType="phone"
                placeholder="Telefone"
                maxLength={15}
                mask={InputMasks.phone}
              />
            </View>

            {/* INFORMAÇÕES DE PERFIL */}
            <View style={styles.section}>
              <Text style={styles.sectionText}>INFORMAÇÕES DE PERFIL</Text>

              <InputText
                name="nomeUsuario"
                inputType="text"
                placeholder="Nome de usuário"
                required
              />

              <InputText
                name="senha"
                inputType="password"
                placeholder="Senha"
                required
              />

              <InputText
                name="confirmacaoSenha"
                inputType="password"
                placeholder="Confirmação de senha"
                required
                customValidator={(value) => {
                  if (value !== formRef.current?.getValues().senha) {
                    return 'As senhas não coincidem';
                  }
                  return null;
                }}
              />
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionText}>FOTO DE PERFIL</Text>
              <AdicionarFotoButton
                style={styles.adicionarFotoButton}
                onPress={() => {}}
              />
            </View>

            <Button
              style={styles.cadastroButton}
              textColor="#434343"
              textStyle={{ fontWeight: 'bold' }}
              title="FAZER CADASTRO"
              onPress={() => formRef.current?.submit()}
            />
          </Form>
        </ScrollView>
      </KeyboardAvoidingView>
    </CustomSafeArea>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#88C9BF' },
  body: { flex: 1, backgroundColor: '#FAFAFA' },
  content: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  advice: {
    margin: 16,
    borderRadius: 8,
    backgroundColor: '#CFE9E5',
    padding: 16,
  },
  adviceText: {
    textAlign: 'center',
  },
  form: {
    flex: 1,
    paddingHorizontal: 16,
    gap: 16,
    marginBottom: 32,
  },
  section: {
    gap: 16,
  },
  sectionText: {
    color: '#599B9B',
    textAlign: 'left',
  },
  cadastroButton: {
    width: '70%',
    backgroundColor: '#88C9BF',
    alignSelf: 'center',
  },
  adicionarFotoButton: {
    alignSelf: 'center',
  },
});
