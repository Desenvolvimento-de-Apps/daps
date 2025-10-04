import Button from '@/components/Button';
import CustomSafeArea from '@/components/CustomSafeArea';
import { Form, FormHandle } from '@/components/Form';
import Header from '@/components/Header';
import CustomImagePicker from '@/components/ImagePicker';
import InputText from '@/components/Input';
import { registerUser } from '@/services/api';
import { UserData } from '@/types';
import InputMasks from '@/utils/masks';
import { Feather } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { ImagePickerAsset } from 'expo-image-picker';
import { router } from 'expo-router';
import { FirebaseError } from 'firebase/app';
import { useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function CadastroPessoal() {
  const formRef = useRef<FormHandle<UserData>>(null);
  const [userImage, setUserImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleImagePicked = (assets: ImagePickerAsset[]) => {
    setUserImage(assets[0].uri);
  };

  const handleSubmit = async (values: UserData): Promise<void> => {
    setIsLoading(true);
    try {
      await registerUser(values, userImage);

      Alert.alert(
        'Cadastro Bem-Sucedido',
        'Seu cadastro foi realizado com sucesso!',
      );
      router.replace('/(drawer)');
    } catch (error) {
      console.log('Error during user registration:', error);
      if (error instanceof FirebaseError && formRef.current) {
        const { setFieldError } = formRef.current;

        switch (error.code) {
          case 'auth/email-already-in-use':
            setFieldError('email', 'Email já está em uso.');
            break;
          case 'auth/weak-password':
            setFieldError('senha', 'Senha muito fraca (mínimo 6 caracteres).');
            break;
          case 'auth/username-already-in-use':
            setFieldError(
              'nomeUsuario',
              'Este nome de usuário já está em uso.',
            );
            break;
          default:
            Alert.alert('Erro de Cadastro', 'Ocorreu um erro inesperado.');
            console.error('Erro Firebase ao criar o usuário:', error.message);
        }
      } else {
        console.error('Erro desconhecido ao criar o usuário:', error);
        Alert.alert('Erro de Cadastro', 'Ocorreu um erro inesperado.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CustomSafeArea style={styles.safeArea}>
      <Header
        containerStyle={{ backgroundColor: '#88C9BF' }}
        title="Cadastro Pessoal"
        leftAction={
          <TouchableOpacity onPress={() => router.navigate('/(drawer)')}>
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

          <Form onSubmit={handleSubmit} ref={formRef} style={styles.form}>
            {/* INFORMAÇÕES PESSOAIS */}
            <View style={styles.section}>
              <Text style={styles.sectionText}>INFORMAÇÕES PESSOAIS</Text>
              <InputText
                name="nome"
                placeholder="Nome Completo"
                inputType="text"
              />
              <InputText name="idade" inputType="number" placeholder="Idade" />
              <InputText
                name="email"
                inputType="email"
                placeholder="E-mail"
                required
              />
              <InputText name="estado" placeholder="Estado" inputType="text" />
              <InputText name="cidade" placeholder="Cidade" inputType="text" />
              <InputText
                name="endereco"
                placeholder="Endereço"
                inputType="text"
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
                placeholder="Nome de usuário"
                inputType="text"
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
              <CustomImagePicker
                multiple={false}
                aspect={[1, 1]}
                customStyle={{}}
                onImagePicked={handleImagePicked}
              >
                {userImage ? (
                  <Image
                    source={{ uri: userImage }}
                    style={styles.imagePreview}
                  />
                ) : (
                  <View style={styles.placeholderContainer}>
                    <Text style={styles.placeholderText}>+ Adicionar Foto</Text>
                  </View>
                )}
              </CustomImagePicker>
            </View>

            <Button
              style={{
                ...styles.cadastroButton,
                ...(isLoading ? styles.cadastroButtonLoading : {}),
              }}
              textColor="#434343"
              textStyle={{ fontWeight: 'bold' }}
              title="FAZER CADASTRO"
              loading={isLoading}
              onPress={() => formRef.current?.submit()}
              disabled={isLoading}
            />
          </Form>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Activity Indicator Overlay */}
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#FFFFFF" />
        </View>
      )}
    </CustomSafeArea>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#88C9BF' },
  body: { flex: 1, backgroundColor: '#FAFAFA' },
  content: { flex: 1, backgroundColor: '#FAFAFA' },
  advice: {
    margin: 16,
    borderRadius: 8,
    backgroundColor: '#CFE9E5',
    padding: 16,
  },
  adviceText: { textAlign: 'center' },
  form: { flex: 1, paddingHorizontal: 16, gap: 16, marginBottom: 32 },
  section: { gap: 16, alignItems: 'center' },
  sectionText: {
    color: '#599B9B',
    alignSelf: 'flex-start',
    fontWeight: 'bold',
  },
  cadastroButton: {
    width: '70%',
    backgroundColor: '#88C9BF',
    alignSelf: 'center',
  },
  cadastroButtonLoading: {
    backgroundColor: '#A0D8CF',
  },
  imagePreview: {
    width: 150,
    height: 150,
    borderRadius: 75,
    alignSelf: 'center',
  },
  placeholderContainer: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    borderWidth: 2,
    borderColor: '#ccc',
    borderStyle: 'dashed',
  },
  placeholderText: { color: '#888' },
  // Estilo para o overlay de carregamento
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1, // Garante que ele fique sobre os outros elementos
  },
});
