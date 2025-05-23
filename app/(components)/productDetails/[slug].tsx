import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Modal,
  Dimensions,
  LayoutAnimation,
  ImageSourcePropType,
  Share,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";

const ProductDetail = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState<
    ImageSourcePropType | undefined
  >(undefined);
  const { name, price, originalPrice, image } = useLocalSearchParams();
  const [showDescription, setShowDescription] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  console.log("image", image);
  const images = [
    require("../../../assets/images/image.jpeg"),
    require("../../../assets/images/image.jpeg"),
    require("../../../assets/images/image.jpeg"),
    require("../../../assets/images/image.jpeg"),
    require("../../../assets/images/image.jpeg"),
    require("../../../assets/images/image.jpeg"),
  ];

  const handleScroll = (event: any) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / screenWidth);
    setCurrentIndex(index);
  };

  const openImageModal = (image: ImageSourcePropType) => {
    setSelectedImage(image);
    setModalVisible(true);
  };
  const toggleDescription = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setShowDescription(!showDescription);
  };

  const handleShare = async () => {
    try {
      const result = await Share.share({
        message:
          "Check out this product: Adbiz Unisex Facial Hair Remover – 30-Min Cordless Trimmer! ₹499 only. Buy now!",
      });

      // Optional: handle result
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      if (error instanceof Error) {
        alert("Error sharing: " + error.message);
      } else {
        alert("An unknown error occurred during sharing.");
      }
    }
  };

  return (
    <ScrollView style={styles.container}>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {images.map((image, index) => (
          <TouchableOpacity key={index} onPress={() => openImageModal(image)}>
            <Image
              source={image}
              style={styles.productImage}
              resizeMode="cover"
            />
          </TouchableOpacity>
        ))}
      </ScrollView>
      <View style={styles.dotsContainer}>
        {images.map((_, index) => (
          <View
            key={index}
            style={[styles.dot, currentIndex === index && styles.activeDot]}
          />
        ))}
      </View>

      <Modal visible={modalVisible} transparent>
        <TouchableOpacity
          style={styles.modalContainer}
          onPress={() => setModalVisible(false)}
        >
          <Image
            source={selectedImage}
            style={styles.fullImage}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </Modal>

      <View style={styles.detailsContainer}>
        <Text style={styles.title}>{name}</Text>
        <Text style={styles.rating}>⭐⭐⭐⭐☆ - 4.0 out of 5 stars (428)</Text>
        <Text style={styles.description}>
          Effortlessly remove facial hair with this sleek and gentle trimmer,
          perfect for upper lip, chin, and beard areas. Powered by a 1200mAh
          rechargeable battery, it offers up to 30 minutes of cordless use.
          Compact, travel-friendly, and safe for all skin types. Ideal for both
          men and women seeking smooth, salon-like results at home.
        </Text>
        <View style={styles.priceContainer}>
          <Text style={styles.price}>₹ {price}</Text>
          <Text style={styles.originalPrice}>₹ {originalPrice}</Text>
        </View>
        <Text style={styles.taxInfo}>MRP(incl. of all taxes)</Text>

        <TouchableOpacity style={styles.buttonOutline} onPress={handleShare}>
          <Text style={styles.buttonOutlineText}>Share Now</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.buttonPrimary} onPress={()=>router.push('/(components)/addToCart')}>
          <Text style={styles.buttonPrimaryText}>Add To Cart</Text>
        </TouchableOpacity>

        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text style={{ fontSize: 14, fontWeight: "bold" }}>Description</Text>
          <TouchableOpacity
            onPress={toggleDescription}
            style={styles.toggleDescriptionButton}
          >
            <Text style={styles.toggleDescriptionText}>
              {showDescription ? "-" : "+"}
            </Text>
          </TouchableOpacity>
        </View>

        {showDescription && (
          <Text style={styles.description}>
            Effortlessly remove facial hair with this sleek and gentle trimmer,
            perfect for upper lip, chin, and beard areas. Powered by a 1200mAh
            rechargeable battery, it offers up to 30 minutes of cordless use.
            Compact, travel-friendly, and safe for all skin types. Ideal for
            both men and women seeking smooth, salon-like results at home.
          </Text>
        )}
      </View>
    </ScrollView>
  );
};

const screenWidth = Dimensions.get("window").width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 30,
  },
  productImage: {
    width: screenWidth,
    height: 300,
  },
  toggleDescriptionButton: {
    marginBottom: 10,
  },
  toggleDescriptionText: {
    color: "#002855",
    fontWeight: "bold",
    fontSize: 16,
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ccc",
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: "#002855",
    width: 10,
    height: 10,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  fullImage: {
    width: "100%",
    height: "100%",
  },
  detailsContainer: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 8,
  },
  rating: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: "#444",
    marginBottom: 16,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  price: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  originalPrice: {
    fontSize: 14,
    textDecorationLine: "line-through",
    color: "#888",
    marginLeft: 10,
  },
  taxInfo: {
    fontSize: 12,
    color: "#777",
    marginVertical: 8,
  },
  buttonOutline: {
    borderWidth: 1.5,
    borderColor: "#002855",
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 12,
  },
  buttonOutlineText: {
    color: "#002855",
    fontWeight: "bold",
    fontSize: 16,
  },
  buttonPrimary: {
    backgroundColor: "#002855",
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 12,
    marginBottom: 20,
  },
  buttonPrimaryText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default ProductDetail;
