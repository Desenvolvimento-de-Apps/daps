import { MaterialIcons } from '@expo/vector-icons';
import React, { useRef } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

interface ImageCarouselProps {
  uris: string[];
  containerStyle?: object;
}

const { width: screenWidth } = Dimensions.get('window');
const ITEM_WIDTH = screenWidth;
const SPACING = (screenWidth - ITEM_WIDTH) / 2;

export default function ImageCarousel({
  uris,
  containerStyle,
}: ImageCarouselProps) {
  const flatListRef = useRef<FlatList<string>>(null);
  const [currentIndex, setCurrentIndex] = React.useState(0);

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

  const renderItem = ({ item }: { item: string }) => {
    return (
      <View style={styles.imageWrapper}>
        <Image source={{ uri: item }} style={styles.imagePreview} />
      </View>
    );
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <FlatList
        ref={flatListRef}
        data={uris}
        renderItem={renderItem}
        keyExtractor={(item, index) => `${item}-${index}`}
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
      {currentIndex < uris.length - 1 && (
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
    width: '100%',
    justifyContent: 'center',
  },
  flatListContent: {
    paddingHorizontal: SPACING,
  },
  imageWrapper: {
    width: ITEM_WIDTH,
    height: '100%',
    marginRight: SPACING * 2,
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
    overflow: 'hidden',
  },
  imagePreview: {
    width: '100%',
    height: '100%',
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
