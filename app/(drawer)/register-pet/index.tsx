import Button from '@/components/Button';
import CheckboxGroup from '@/components/CheckboxGroup';
import CustomSafeArea from '@/components/CustomSafeArea';
import { Form, FormHandle } from '@/components/Form';
import Header from '@/components/Header';
import CustomImagePicker from '@/components/ImagePicker';
import InputText from '@/components/Input';
import RadioGroup from '@/components/RadioGroup';
import { createPet, uploadImageAsync } from '@/services/api';
import { Feather } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
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

type Especie = 'Cachorro' | 'Gato';
type Sexo = 'Macho' | 'Fêmea';
type Porte = 'Pequeno' | 'Médio' | 'Grande';
type Idade = 'Filhote' | 'Adulto' | 'Idoso';

type Acompanhamento = '1 mês' | '3 mêses' | '6 mêses';

type PetData = {
  nome: string;
  especie: Especie | null;
  sexo: Sexo | null;
  porte: Porte | null;
  idade: Idade | null;
  temperamento: string[] | null;
  saude: string[] | null;
  doencas: string;
  exigencias: string[] | null;
  acompanhamento: Acompanhamento | null;
  sobre: string;
};

export default function RegisterPetScreen() {
  const formRef = useRef<FormHandle<PetData>>(null);

  const [especie, setEspecie] = useState<string | null>(null);
  const [sexo, setSexo] = useState<string | null>(null);
  const [porte, setPorte] = useState<string | null>(null);
  const [idade, setIdade] = useState<string | null>(null);
  const [temperamentos, setTemperamentos] = useState<string[]>([]);
  const [saude, setSaude] = useState<string[]>([]);
  const [exigencias, setExigencias] = useState<string[]>([]);
  const [acompanhamento, setAcompanhamento] = useState<string[]>([]);

  const [petImage, setPetImage] = useState<string | null>(null);
  const handleImagePicked = (uri: string) => {
    console.log('Image picked:', uri);
    setPetImage(uri);
  };

  const [isAcompanhamentoSelected, setIsAcompanhamentoSelected] =
    useState(false);

  useEffect(() => {
    const isEnabled = exigencias.includes('Acompanhamento pós adoção');
    setIsAcompanhamentoSelected(isEnabled);

    if (!isEnabled) {
      setAcompanhamento([]);
    }
  }, [exigencias]);

  const cleanForm = () => {
    setEspecie(null);
    setSexo(null);
    setPorte(null);
    setIdade(null);
    setTemperamentos([]);
    setSaude([]);
    setExigencias([]);
    setAcompanhamento([]);

    if (formRef.current) {
      formRef.current.setFieldValue('nome', '');
      formRef.current.setFieldValue('doencas', '');
      formRef.current.setFieldValue('sobre', '');
      formRef.current.setFieldValue('especie', null);
      formRef.current.setFieldValue('sexo', null);
      formRef.current.setFieldValue('porte', null);
      formRef.current.setFieldValue('idade', null);
      formRef.current.setFieldValue('temperamento', []);
      formRef.current.setFieldValue('saude', []);
      formRef.current.setFieldValue('exigencias', []);
      formRef.current.setFieldValue('acompanhamento', []);
    }
  };

  const handleSubmit = async (values: PetData): Promise<void> => {
    try {
      const fileName = `images/pets/${new Date().getTime()}-${Math.random().toString(36).substring(7)}.jpg`;
      const imageUrl = petImage
        ? await uploadImageAsync(petImage, fileName)
        : null;
      if (petImage && !imageUrl) {
        return;
      }

      const petFormData = {
        ...values,
        image: imageUrl,
        acompanhamento:
          values.acompanhamento == null
            ? null
            : Array.isArray(values.acompanhamento)
              ? values.acompanhamento
              : [values.acompanhamento],
      };

      await createPet(petFormData);

      Alert.alert('Sucesso!', 'O cadastro do pet foi realizado com sucesso.');
      cleanForm();
      router.replace('/(drawer)');
    } catch (error) {
      console.error('Erro ao cadastrar o pet:', error);
      Alert.alert(
        'Erro',
        error instanceof Error
          ? error.message
          : 'Ocorreu um erro ao cadastrar o pet. Tente novamente.',
      );
    }
  };

  return (
    <CustomSafeArea style={styles.container}>
      <Header
        title="Cadastro do Animal"
        leftAction={
          <TouchableOpacity
            onPress={() => {
              router.back();
            }}
          >
            <Feather name="arrow-left" size={24} color="#434343" />
          </TouchableOpacity>
        }
        rightAction={null}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}
      >
        <ScrollView style={styles.body}>
          <Form
            onSubmit={handleSubmit}
            ref={formRef}
            style={styles.formContainer}
          >
            <Text style={styles.h1}>Adoção</Text>
            <Text style={styles.formText}>NOME DO ANIMAL</Text>
            <InputText
              inputType="text"
              style={styles.input}
              placeholder="Nome do animal"
              placeholderTextColor="#bdbdbd"
              name="nome"
            />

            <Text style={styles.formText}>FOTOS DO ANIMAL</Text>

            <CustomImagePicker onImagePicked={handleImagePicked}>
              {petImage ? (
                <Image source={{ uri: petImage }} style={styles.imagePreview} />
              ) : (
                <View style={styles.placeholderContainer}>
                  <Text style={styles.placeholderText}>+ Adicionar Foto</Text>
                </View>
              )}
            </CustomImagePicker>

            <Text style={styles.formText}>ESPÉCIE</Text>
            <RadioGroup
              name="especie"
              label=""
              options={['Cachorro', 'Gato']}
              selectedValue={especie}
              onValueChange={setEspecie}
            />

            <Text style={styles.formText}>SEXO</Text>
            <RadioGroup
              name="sexo"
              label=""
              options={['Macho', 'Fêmea']}
              selectedValue={sexo}
              onValueChange={setSexo}
            />

            <Text style={styles.formText}>PORTE</Text>
            <RadioGroup
              name="porte"
              label=""
              options={['Pequeno', 'Médio', 'Grande']}
              selectedValue={porte}
              onValueChange={setPorte}
            />

            <Text style={styles.formText}>IDADE</Text>
            <RadioGroup
              name="idade"
              label=""
              options={['Filhote', 'Adulto', 'Idoso']}
              selectedValue={idade}
              onValueChange={setIdade}
            />

            <Text style={styles.formText}>TEMPERAMENTO</Text>
            <CheckboxGroup
              name="temperamento"
              label=""
              options={[
                'Brincalhão',
                'Tímido',
                'Calmo',
                'Guarda',
                'Amoroso',
                'Preguiçoso',
              ]}
              selectedValues={temperamentos}
              onValuesChange={setTemperamentos}
              quantidadePorLinha={3}
            />

            <Text style={styles.formText}>SAÚDE</Text>
            <CheckboxGroup
              name="saude"
              label=""
              options={['Vacinado', 'Vermifugado', 'Castrado', 'Doente']}
              selectedValues={saude}
              onValuesChange={setSaude}
              quantidadePorLinha={2}
            />
            <InputText
              inputType="text"
              name="doencas"
              style={styles.input}
              placeholder="Doenças do animal"
              placeholderTextColor="#bdbdbd"
            />

            <Text style={styles.formText}>EXIGÊNCIAS PARA ADOÇÃO</Text>
            <CheckboxGroup
              name="exigencias"
              label=""
              options={[
                'Termo de adoção',
                'Fotos da casa',
                'Visita prévia ao animal',
                'Acompanhamento pós adoção',
              ]}
              selectedValues={exigencias}
              onValuesChange={setExigencias}
              quantidadePorLinha={1}
            />

            <CheckboxGroup
              name="acompanhamento"
              label=""
              options={['1 mês', '3 meses', '6 meses']}
              selectedValues={acompanhamento}
              onValuesChange={setAcompanhamento}
              quantidadePorLinha={1}
              style={{ marginLeft: 36 }}
              disabled={!isAcompanhamentoSelected}
              singleSelection={true}
            />

            <Text style={styles.formText}>SOBRE O ANIMAL</Text>
            <InputText
              name="sobre"
              inputType="text"
              placeholder="Compartilhe a história do animal"
            />

            <Button
              title="COMPARTILHAR HISTÓRIA"
              onPress={() => {
                formRef.current?.submit();
              }}
              backgroundColor="#ffd358"
              textColor="#434343"
              style={styles.button}
            />
          </Form>
        </ScrollView>
      </KeyboardAvoidingView>
    </CustomSafeArea>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffffff',
  },
  content: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  body: {
    flex: 1,
    marginTop: 16,
    gap: 20,
    marginHorizontal: 24,
  },
  seletores: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 25,
    alignSelf: 'center',
  },
  buttonWrapper: {
    flex: 1,
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  h1: {
    fontSize: 16,
    color: '#434343',
    fontWeight: 'bold',
  },
  formContainer: {
    width: '100%',
    gap: 20,
  },
  formText: {
    fontSize: 12,
    color: '#f7a800',
  },
  input: {
    fontSize: 14,
    color: '#434343',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
  },
  addPhotoButton: {
    width: '100%',
    paddingVertical: 44,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    backgroundColor: '#f1f2f2',
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 0.3,
  },
  addPhotoText: {
    color: '#757575',
    fontSize: 14,
  },
  grayText: {
    color: '#bdbdbd',
    fontSize: 14,
  },
  button: {
    width: '80%',
    marginBottom: 24,
    alignSelf: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    width: '100%',
  },
  adicionarFotoButton: {
    alignSelf: 'center',
  },
  imagePreview: {
    width: '100%',
    height: 185,
    marginBottom: 20,
    backgroundColor: '#e0e0e0',
  },
  placeholderContainer: {
    width: '100%',
    height: 185,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#ccc',
    borderStyle: 'dashed',
  },
  placeholderText: {
    color: '#888',
  },
});
