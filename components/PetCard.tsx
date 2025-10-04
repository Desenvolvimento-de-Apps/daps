import { Feather } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Pet } from '@/types';
import ImageCarousel from './ImageCarousel';

interface PetCardProps {
  pet: Pet;
  onPress: () => void;
  showVisibilityToggle?: boolean;
  onVisibilityChange?: (newVisibility: boolean) => void;
}

const PetCard = ({
  pet,
  onPress,
  showVisibilityToggle = false,
  onVisibilityChange,
}: PetCardProps) => {
  const isVisible = pet.isVisible ?? true;

  const handleTogglePress = () => {
    if (onVisibilityChange) {
      onVisibilityChange(!isVisible);
    }
  };

  return (
    // Removido o TouchableOpacity daqui para evitar clique duplo
    <View style={styles.card}>
      <TouchableOpacity onPress={onPress}>
        <View style={styles.header}>
          <Text style={styles.name}>{pet.name}</Text>
          <Feather name="heart" size={24} color="#434343" />
        </View>

        <Image
          source={pet.image}
          style={styles.image}
          contentFit="cover"
          transition={300}
        />
      </TouchableOpacity>

      <View style={styles.infoContainer}>
        <TouchableOpacity onPress={onPress} style={styles.tagsLocationWrapper}>
          <View style={styles.tagsContainer}>
            <Text style={styles.infoText}>{pet.sex}</Text>
            <Text style={styles.infoText}>{pet.age}</Text>
            <Text style={styles.infoText}>{pet.size}</Text>
          </View>
          <Text style={styles.locationText}>{pet.location}</Text>
        </TouchableOpacity>

        {/* --- LÓGICA DO TOGGLE DE VISIBILIDADE --- */}
        {showVisibilityToggle && (
          <TouchableOpacity
            style={styles.visibilityToggle}
            onPress={handleTogglePress}
          >
            <Feather
              name={isVisible ? 'eye' : 'eye-off'}
              size={24}
              color={isVisible ? '#3D9A8D' : '#757575'}
            />
            <Text
              style={[
                styles.visibilityText,
                { color: isVisible ? '#3D9A8D' : '#757575' },
              ]}
            >
              {isVisible ? 'Visível' : 'Invisível'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    marginHorizontal: 16,
    marginBottom: 16,
    elevation: 3,
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
    paddingVertical: 12,
    paddingHorizontal: 0,
    backgroundColor: '#FFF',
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    alignItems: 'center',
  },
  tagsLocationWrapper: {
    width: '100%',
    paddingHorizontal: 12,
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
  visibilityToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    width: '100%',
  },
  visibilityText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '500',
  },
});

export default PetCard;
