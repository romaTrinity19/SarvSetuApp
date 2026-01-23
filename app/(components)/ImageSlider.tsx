import React, { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

type Props = {
  images: string[];
  height?: number;
};

const ImageSlider = ({ images, height = 200 }: Props) => {
  const scrollRef = useRef<ScrollView>(null);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;

    const timer = setInterval(() => {
      const nextIndex = (index + 1) % images.length;
      scrollRef.current?.scrollTo({
        x: nextIndex * width,
        animated: true,
      });
      setIndex(nextIndex);
    }, 3000);

    return () => clearInterval(timer);
  }, [index, images.length]);

  const onScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const newIndex = Math.round(e.nativeEvent.contentOffset.x / width);
    setIndex(newIndex);
  };

  return (
    <View style={{ height }}>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onScrollEnd}
      >
        {images.map((img, i) => (
          <Image
            key={i}
            source={{ uri: img }}
            style={[styles.image, { height }]}
            resizeMode="cover"
          />
        ))}
      </ScrollView>

      {/* DOT INDICATORS */}
      <View style={styles.dots}>
        {images.map((_, i) => (
          <View key={i} style={[styles.dot, i === index && styles.activeDot]} />
        ))}
      </View>
    </View>
  );
};

export default ImageSlider;

const styles = StyleSheet.create({
  image: {
    width,
  },
  dots: {
    position: "absolute",
    bottom: 10,
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#CBD5E1",
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: "#1E3A8A",
    width: 12,
  },
});
