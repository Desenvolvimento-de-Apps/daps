import CustomSafeArea from '@/components/CustomSafeArea';
import Header from '@/components/Header';
import Button from '@/components/Button';
import CheckboxGroup from '@/components/CheckboxGroup';
import BasicForm from '@/components/BasicForm';
import InputText from '@/components/Input';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';

export default function RegisterPetScreen() {
  const [adocaoAtivo, setAdocaoAtivo] = useState(false);
  const [apadrinharAtivo, setApadrinharAtivo] = useState(false);
  const [ajudaAtivo, setAjudaAtivo] = useState(false);

  const COR_ATIVA = '#ffd358';
  const COR_TEXTO_ATIVO = '#434343';
  const COR_INATIVA = '#F1F2F2';
  const COR_TEXTO_INATIVO = '#434343';

  const handleAdocaoClick = () => {
    const novoEstado = !adocaoAtivo;
    setAdocaoAtivo(novoEstado);
    // Se ativar Adoção, Apadrinhar é desativado
    if (novoEstado) {
      setApadrinharAtivo(false);
    }
  };

  const handleApadrinharClick = () => {
    const novoEstado = !apadrinharAtivo;
    setApadrinharAtivo(novoEstado);
    // Se ativar Apadrinhar, Adoção é desativado
    if (novoEstado) {
      setAdocaoAtivo(false);
    }
  };

  const handleAjudaClick = () => {
    setAjudaAtivo(!ajudaAtivo);
  };

  const [especie, setEspecie] = useState<string | null>(null);
  const [sexo, setSexo] = useState<string | null>(null);
  const [porte, setPorte] = useState<string | null>(null);
  const [idade, setIdade] = useState<string | null>(null);
  const [temperamentos, setTemperamentos] = useState<string[]>([]);
  const [saude, setSaude] = useState<string[]>([]);
  const [exigencias, setExigencias] = useState<string[]>([]);
  const [acompanhamento, setAcompanhamento] = useState<string[]>([]);
  const [auxilio, setAuxilio] = useState<string[]>([]);
  const [necessidades, setNecessidades] = useState<string[]>([]);

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
      <ScrollView style={styles.body}>
        <Text>Tenho interesse em cadastrar o animal para:</Text>
        <View style={styles.seletores}>
          <Button
            title="ADOÇÃO"
            onPress={handleAdocaoClick}
            disabled={apadrinharAtivo}
            backgroundColor={adocaoAtivo ? COR_ATIVA : COR_INATIVA}
            textColor={adocaoAtivo ? COR_TEXTO_ATIVO : COR_TEXTO_INATIVO}
            style={styles.buttonWrapper}
            borderRadius={2}
          />

          <Button
            title="APADRINHAR"
            onPress={handleApadrinharClick}
            disabled={adocaoAtivo}
            backgroundColor={apadrinharAtivo ? COR_ATIVA : COR_INATIVA}
            textColor={apadrinharAtivo ? COR_TEXTO_ATIVO : COR_TEXTO_INATIVO}
            style={styles.buttonWrapper}
            borderRadius={2}
          />

          <Button
            title="AJUDA"
            onPress={handleAjudaClick}
            backgroundColor={ajudaAtivo ? COR_ATIVA : COR_INATIVA}
            textColor={ajudaAtivo ? COR_TEXTO_ATIVO : COR_TEXTO_INATIVO}
            style={styles.buttonWrapper}
            borderRadius={2}
          />
        </View>

        {adocaoAtivo && (
          <View style={styles.formContainer}>
            <BasicForm title="Adoção"></BasicForm>

            <Text style={styles.formText}>EXIGÊNCIAS PARA ADOÇÃO</Text>
            <CheckboxGroup
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
              label=""
              options={['1 mês', '3 meses', '6 meses']}
              selectedValues={acompanhamento}
              onValuesChange={setAcompanhamento}
              quantidadePorLinha={1}
              style={{ marginLeft: 36 }}
            />

            <Text style={styles.formText}>SOBRE O ANIMAL</Text>
            <InputText
              inputType="text"
              style={styles.input}
              placeholder="Compartilhe a história do animal"
              placeholderTextColor="#bdbdbd"
            />

            <Button
              title="COMPARTILHAR HISTÓRIA"
              onPress={() => {}}
              backgroundColor="#ffd358"
              textColor="#434343"
              style={styles.button}
            />
          </View>
        )}

        {apadrinharAtivo && (
          <View style={styles.formContainer}>
            <BasicForm title="Apadrinhar"></BasicForm>

            <Text style={styles.formText}>EXIGÊNCIAS PARA APADRINHAMENTO</Text>
            <CheckboxGroup
              label=""
              options={['Termo de apadrinhamento', 'Auxilio financeiro']}
              selectedValues={exigencias}
              onValuesChange={setExigencias}
              quantidadePorLinha={1}
            />

            <CheckboxGroup
              label=""
              options={['Alimentação', 'Saúde', 'Objetos']}
              selectedValues={auxilio}
              onValuesChange={setAuxilio}
              quantidadePorLinha={1}
              style={{ marginLeft: 36 }}
            />

            <Text style={styles.formText}>SOBRE O ANIMAL</Text>
            <InputText
              inputType="text"
              style={styles.input}
              placeholder="Compartilhe a história do animal"
              placeholderTextColor="#bdbdbd"
            />

            <Button
              title="PROCURAR PADRINHO"
              onPress={() => {}}
              backgroundColor="#ffd358"
              textColor="#434343"
              style={styles.button}
            />
          </View>
        )}

        {ajudaAtivo && (
          <View style={styles.formContainer}>
            {!adocaoAtivo && !apadrinharAtivo && (
              <BasicForm title="Ajudar"></BasicForm>
            )}

            {(adocaoAtivo || apadrinharAtivo) && (
              <View style={styles.formContainer}>
                <View style={styles.divider} />
                <Text style={styles.h1}>Ajudar</Text>
              </View>
            )}

            <Text style={styles.formText}>NECESSIDADES DO ANIMAL</Text>
            <CheckboxGroup
              label=""
              options={[
                'Alimento',
                'Auxílio financeiro',
                'Medicamento',
                'Objetos',
              ]}
              selectedValues={necessidades}
              onValuesChange={setNecessidades}
              quantidadePorLinha={1}
            />

            <InputText
              inputType="text"
              style={styles.input}
              placeholder="Nome do medicamento"
              placeholderTextColor="#bdbdbd"
            />
            <InputText
              inputType="text"
              style={styles.input}
              placeholder="Especifique o(s) objeto(s)"
              placeholderTextColor="#bdbdbd"
            />

            <Text style={styles.formText}>SOBRE O ANIMAL</Text>
            <InputText
              inputType="text"
              style={styles.input}
              placeholder="Compartilhe a história do animal"
              placeholderTextColor="#bdbdbd"
            />

            <Button
              title="COMPARTILHAR HISTÓRIA"
              onPress={() => {}}
              backgroundColor="#ffd358"
              textColor="#434343"
              style={styles.button}
            />
          </View>
        )}
      </ScrollView>
    </CustomSafeArea>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffffff',
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
});
