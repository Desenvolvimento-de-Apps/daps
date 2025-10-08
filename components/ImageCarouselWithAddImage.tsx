import { MaterialIcons } from '@expo/vector-icons';
import { ImagePickerAsset } from 'expo-image-picker';
import React, { useRef } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import CustomImagePicker from './ImagePicker';

interface ImageCarouselProps {
  uris: string[];
  onRemoveImage: (uri: string) => void;
  onImagesPicked: (assets: ImagePickerAsset[]) => void;
}

const { width: screenWidth } = Dimensions.get('window');
const ITEM_WIDTH = screenWidth * 0.8;
const SPACING = (screenWidth - ITEM_WIDTH) / 2;

export default function ImageCarouselWithAddImage({
  uris,
  onRemoveImage,
  onImagesPicked: onAddImagePress,
}: ImageCarouselProps) {
  const flatListRef = useRef<FlatList<string | null>>(null);
  const [currentIndex, setCurrentIndex] = React.useState(0);

  const data = uris.length < 5 ? [...uris, null] : uris;

  const scrollToIndex = (index: number) => {
    if (flatListRef.current) {
      flatListRef.current.scrollToIndex({ animated: true, index });
      setCurrentIndex(index);
    }
  };

  const handleScroll = (event: any) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / ITEM_WIDTH);
    setCurrentIndex(index);
  };

  const renderItem = ({
    item,
    index,
  }: {
    item: string | null;
    index: number;
  }) => {
    if (item === null) {
      return (
        <CustomImagePicker
          onImagePicked={onAddImagePress}
          customStyle={styles.addPhotoWrapper}
          limitedSelection={5 - uris.length}
        >
          <View style={styles.placeholderContainer}>
            <Text style={styles.placeholderText}>+ Adicionar Foto</Text>
          </View>
        </CustomImagePicker>
      );
    }

    return (
      <View style={styles.imageWrapper}>
        <Image source={{ uri: item }} style={styles.imagePreview} />
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => onRemoveImage(item)}
        >
          <MaterialIcons name="close" size={18} color="white" />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={data}
        renderItem={renderItem}
        keyExtractor={(item, index) => item || `add-button-${index}`}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.flatListContent}
        snapToAlignment="start"
        snapToInterval={ITEM_WIDTH}
        decelerationRate="fast"
        onScroll={handleScroll}
        scrollEventThrottle={16}
      />

      {currentIndex > 0 && (
        <TouchableOpacity
          style={[styles.arrowButton, styles.leftArrow]}
          onPress={() => scrollToIndex(currentIndex - 1)}
        >
          <MaterialIcons name="keyboard-arrow-left" size={30} color="#333" />
        </TouchableOpacity>
      )}
      {currentIndex < data.length - 1 && (
        <TouchableOpacity
          style={[styles.arrowButton, styles.rightArrow]}
          onPress={() => scrollToIndex(currentIndex + 1)}
        >
          <MaterialIcons name="keyboard-arrow-right" size={30} color="#333" />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 185 + 40,
    justifyContent: 'center',
    marginBottom: 20,
  },
  flatListContent: {
    paddingHorizontal: SPACING,
  },
  imageWrapper: {
    width: ITEM_WIDTH,
    height: 185,
    marginRight: SPACING * 2,
    position: 'relative',
  },
  imagePreview: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
    backgroundColor: '#e0e0e0',
  },
  removeButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addPhotoWrapper: {
    width: ITEM_WIDTH,
    height: 185,
    marginRight: SPACING * 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ccc',
    borderStyle: 'dashed',
    borderRadius: 8,
  },
  placeholderText: {
    color: '#888',
    fontSize: 16,
  },
  arrowButton: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
    top: '50%',
    marginTop: -20,
  },
  leftArrow: {
    left: 10,
  },
  rightArrow: {
    right: 10,
  },
});
