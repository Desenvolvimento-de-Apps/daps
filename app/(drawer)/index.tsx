import Button from '@/components/Button';
import CustomSafeArea from '@/components/CustomSafeArea';
import Header from '@/components/Header';
import { useAuth } from '@/contexts/AuthContext';
import Feather from '@expo/vector-icons/Feather';
import { DrawerActions } from '@react-navigation/native';
import { router, useNavigation } from 'expo-router';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function WelcomeScreen() {
  const navigation = useNavigation();
  const auth = useAuth();

  return (
    <CustomSafeArea>
      <Header
        leftAction={
          <TouchableOpacity
            onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
          >
            <Feather name="menu" size={24} color="#88C9BF" />
          </TouchableOpacity>
        }
        containerStyle={{ backgroundColor: '#FAFAFA' }}
      />

      <View style={styles.body}>
        <Text style={styles.h1}>Olá!</Text>
        <Text style={styles.bemVindo}>
          Bem vindo ao Meau!{'\n'}
          Aqui você pode adotar, doar e ajudar{'\n'}
          cães e gatos com facilidade.{'\n'}
          Qual o seu interesse?
        </Text>
        <View style={styles.buttonsContainer}>
          {/* A navegação agora é direta. O layout irá proteger as rotas. */}
          <Button
            title="ADOTAR"
            onPress={() => router.push('/(drawer)/pets')}
            backgroundColor="#FFD358"
            textColor="#434343"
          />
          <Button
            title="AJUDAR"
            onPress={() => {
              /* Lógica de navegação para ajudar */
            }}
            backgroundColor="#FFD358"
            textColor="#434343"
          />
          <Button
            title="CADASTRAR ANIMAL"
            onPress={() => router.push('/(drawer)/register-pet')}
            backgroundColor="#FFD358"
            textColor="#434343"
          />
        </View>

        {auth.isAuthenticated && auth.user?.isAnonymous === false ? (
          <TouchableOpacity onPress={() => auth.logout()}>
            <Text style={styles.loginText}>logout</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={() => router.push('/(auth)')}>
            <Text style={styles.loginText}>login</Text>
          </TouchableOpacity>
        )}

        <Image
          source={require('../../assets/logos/meau.jpg')}
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
    lineHeight: 24,
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
