import { Text, TextInput, TouchableOpacity, View, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import { Feather } from '@expo/vector-icons';
import RadioGroup from './RadioGroup';
import CheckboxGroup from './CheckboxGroup';
import InputText from './Input';
import AdicionarFotoButton from './AdicionarFotoButton';



interface BasicFormProps {
  title?: string;
}

const BasicForm: React.FC<BasicFormProps> = ({ title }) => {
    const [especie, setEspecie] = useState<string | null>(null);

    const [sexo, setSexo] = useState<string | null>(null);

    const [porte, setPorte] = useState<string | null>(null);

    const [idade, setIdade] = useState<string | null>(null);

    const [temperamentos, setTemperamentos] = useState<string[]>([]);

    const [saude, setSaude] = useState<string[]>([]);
    return (
        <View style={styles.formContainer}>
            <Text style={styles.h1}>{title}</Text>
                    <Text style={styles.formText}>NOME DO ANIMAL</Text>
                    <InputText inputType='text' style={styles.input} placeholder="Nome do animal" placeholderTextColor="#bdbdbd"/>

                    <Text style={styles.formText}>FOTOS DO ANIMAL</Text>
                    <AdicionarFotoButton
                        style={styles.adicionarFotoButton}
                        onPress={() => {}}
                    />

                    <Text style={styles.formText}>ESPÉCIE</Text>
                    <RadioGroup
                        label=""
                        options={['Cachorro', 'Gato']}
                        selectedValue={especie}
                        onValueChange={setEspecie}
                    />
                    
                    <Text style={styles.formText}>SEXO</Text>
                    <RadioGroup
                        label=""
                        options={['Macho', 'Fêmea']}
                        selectedValue={sexo}
                        onValueChange={setSexo}
                    />

                    <Text style={styles.formText}>PORTE</Text>
                    <RadioGroup
                        label=""
                        options={['Pequeno', 'Médio', 'Grande']}
                        selectedValue={porte}
                        onValueChange={setPorte}
                    />

                    <Text style={styles.formText}>IDADE</Text>
                    <RadioGroup
                        label=""
                        options={['Filhote', 'Adulto', 'Idoso']}
                        selectedValue={idade}
                        onValueChange={setIdade}
                    />

                    <Text style={styles.formText}>TEMPERAMENTO</Text>
                    <CheckboxGroup
                        label=""
                        options={['Brincalhão', 'Tímido', 'Calmo', 'Guarda', 'Amoroso', 'Preguiçoso']}
                        selectedValues={temperamentos}
                        onValuesChange={setTemperamentos}
                        quantidadePorLinha={3}
                    />

                    <Text style={styles.formText}>SAÚDE</Text>
                    <CheckboxGroup
                        label=""
                        options={['Vacinado', 'Vermifugado', 'Castrado', 'Doente']}
                        selectedValues={saude}
                        onValuesChange={setSaude}
                        quantidadePorLinha={2}
                    />
                    <InputText inputType='text' style={styles.input} placeholder="Doenças do animal" placeholderTextColor="#bdbdbd"/>
        </View>
    );
}

const styles = StyleSheet.create({
    seletores: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 25,
        alignSelf: 'center'
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
    adicionarFotoButton: {
        alignSelf: 'center',
    },
})

export default BasicForm;