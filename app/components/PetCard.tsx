import { Feather } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Pet } from '../types';

interface PetCardProps {
  pet: Pet;
  onPress: () => void;
}

const PetCard = ({ pet, onPress }: PetCardProps) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.name}>{pet.name}</Text>
        <Feather name="heart" size={24} color="#434343" />
      </View>

      <Image
        source={typeof pet.image === 'string' ? { uri: pet.image } : pet.image}
        style={styles.image}
        contentFit="cover"
        transition={300}
      />

      <View style={styles.infoContainer}>
        <View style={styles.tagsContainer}>
          <Text style={styles.infoText}>{pet.sex}</Text>
          <Text style={styles.infoText}>{pet.age}</Text>
          <Text style={styles.infoText}>{pet.size}</Text>
        </View>
        <Text style={styles.locationText}>{pet.location}</Text>
      </View>
    </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    marginHorizontal: 16,
    marginBottom: 16,
    // Sombra para Android
    elevation: 3,
    // Sombra para iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#FFD358',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#434343',
  },
  image: {
    width: '100%',
    height: 185,
  },
  infoContainer: {
    padding: 12,
    backgroundColor: '#FFF',
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    alignItems: 'center',
  },
  tagsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    width: '100%',
  },
  infoText: {
    fontSize: 12,
    color: '#757575',
    textTransform: 'uppercase',
    textAlign: 'center',
    flex: 1,
  },
  locationText: {
    fontSize: 12,
    color: '#757575',
    textTransform: 'uppercase',
    textAlign: 'center',
  },
});

export default PetCard;
