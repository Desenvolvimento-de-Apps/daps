import Feather from '@expo/vector-icons/Feather';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Button from './components/Button';
import CustomSafeArea from './components/CustomSafeArea';
import Header from './components/Header';
import { router } from 'expo-router';

export default function WelcomeScreen() {
  return (
    <CustomSafeArea>
      {/* HEADER */}
      <Header
        leftAction={
          <TouchableOpacity onPress={() => {}}>
            <Feather name="menu" size={24} color="#88C9BF" />
          </TouchableOpacity>
        }
        containerStyle={{ backgroundColor: '#FAFAFA' }}
      />

      {/* BODY */}
      <View style={styles.body}>
        {/* TITLE */}
        <Text style={styles.h1}>Olá!</Text>
        <Text style={styles.bemVindo}>
          Bem vindo ao Meau!{'\n'}
          Aqui você pode adotar, doar e ajudar{'\n'}
          cães e gatos com facilidade.{'\n'}
          Qual o seu interesse?
        </Text>
        {/* BOTÕES */}
        <View style={styles.buttonsContainer}>
          <Button
            title="ADOTAR"
            onPress={() => {
              router.navigate('/adopt');
            }} // A navegação é feita pelo Link
            backgroundColor="#FFD358"
            textColor="#434343"
          />

          <Button
            title="AJUDAR"
            onPress={() => {}}
            backgroundColor="#FFD358"
            textColor="#434343"
          />
          <Button
            title="CADASTRAR ANIMAL"
            onPress={() => {}}
            backgroundColor="#FFD358"
            textColor="#434343"
          />
        </View>

        <TouchableOpacity
          onPress={() => {
            router.navigate('./login');
          }}
        >
          <Text style={styles.loginText}>login</Text>
        </TouchableOpacity>

        <Image
          source={require('../assets/logos/meau.jpg')}
          style={{ width: 122, height: 44 }}
          resizeMode="contain"
        />
      </View>
    </CustomSafeArea>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    alignItems: 'center',
    marginTop: 20,
    gap: 16,
  },
  h1: {
    fontSize: 72,
    fontFamily: 'Courgette-Regular',
    color: '#FFD358',
  },
  bemVindo: {
    width: '100%',
    fontSize: 16,
    color: '#757575',
    textAlign: 'center',
    marginTop: 56,
    lineHeight: 24, // Melhora a legibilidade
  },
  buttonsContainer: {
    width: '100%',
    gap: 12,
    marginTop: 48,
    paddingHorizontal: 63,
  },
  loginText: {
    fontSize: 16,
    color: '#88C9BF',
    marginTop: 42,
    marginBottom: 20,
  },
});
