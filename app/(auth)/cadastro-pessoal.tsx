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
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
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
import InputMasks from '../utils/masks';
import { validateNomeUsuario } from '../utils/validators';

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
  const formRef = useRef<FormHandle>(null);
  const onSubmit = async () => {
    if (formRef.current) {
      const {
        formValues,
        hasErrors,
        setFieldError: setError,
      } = formRef.current;
      if (hasErrors()) {
        return null;
      }
      const { email, senha, confirmacaoSenha, ...userData } =
        formValues as UserData;

      if (senha !== confirmacaoSenha) {
        setError('confirmacaoSenha', 'As senhas não coincidem.');
        return null;
      }

      try {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          senha,
        );

        const user = {
          email: userCredential.user.email,
          ...userData,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        if (userData.nome) {
          const userDocRef = doc(db, 'users', userCredential.user.uid);
          await setDoc(userDocRef, user);
        }

        console.log('Usuário criado com sucesso!');
        router.replace('/login');
      } catch (error) {
        if (error instanceof FirebaseError) {
          switch (error.code) {
            case 'auth/email-already-in-use':
              setError('email', 'Email já está em uso.');
              break;
            case 'auth/weak-password':
              setError(
                'senha',
                'Senha é muito fraca. Deve ter no mínimo 6 caracteres.',
              );
              break;
            default:
              Alert.alert('Erro de Cadastro', 'Ocorreu um erro inesperado.');
              console.error(
                'Ocorreu um erro do Firebase ao criar o usuário:',
                error.message,
              );
          }
        } else {
          console.error('Erro desconhecido ao criar o usuário:', error);
          Alert.alert('Erro de Cadastro', 'Ocorreu um erro inesperado.');
        }
        return null;
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
          <Form ref={formRef} style={styles.form}>
            {/* INFORMAÇÕES PESSOAIS */}
            <View style={styles.section}>
              <Text style={styles.sectionText}>INFORMAÇÕES PESSOAIS</Text>

              <InputText
                name="nome"
                inputType="text"
                placeholder="Nome Completo"
              />

              <InputText name="idade" inputType="number" placeholder="Idade" />

              <InputText name="email" inputType="email" placeholder="E-mail" />

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
                customValidator={(value) =>
                  validateNomeUsuario(value as string)
                }
              />

              <InputText
                name="senha"
                inputType="password"
                placeholder="Senha"
              />

              <InputText
                name="confirmacaoSenha"
                inputType="password"
                placeholder="Confirmação de senha"
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
              onPress={onSubmit}
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
