import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import AdicionarFotoButton from './components/AdicionarFotoButton';
import Button from './components/Button';
import CustomSafeArea from './components/CustomSafeArea';
import Header from './components/Header';
import InputText from './components/Input';

export default function CadastroPessoal() {
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
          <View style={styles.form}>
            {/* INFORMAÇÕES PESSOAIS */}
            <View style={styles.section}>
              <Text style={styles.sectionText}>INFORMAÇÕES PESSOAIS</Text>

              <InputText inputType="text" placeholder="Nome Completo" />

              <InputText inputType="number" placeholder="Idade" />

              <InputText inputType="email" placeholder="E-mail" />

              <InputText inputType="text" placeholder="Estado" />

              <InputText inputType="text" placeholder="Cidade" />

              <InputText inputType="text" placeholder="Endereço" />

              <InputText inputType="phone" placeholder="Telefone" />
            </View>

            {/* INFORMAÇÕES DE PERFIL */}
            <View style={styles.section}>
              <Text style={styles.sectionText}>INFORMAÇÕES DE PERFIL</Text>

              <InputText inputType="text" placeholder="Nome de usuário" />

              <InputText inputType="password" placeholder="Senha" />

              <InputText
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
              onPress={() => {}}
            />
          </View>
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
