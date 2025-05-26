import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import {
  FlatList,
  Image,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type WishlistItem = {
  id: string;
  title: string;
  price: number;
  originalPrice: number;
  image: any; // Use a more specific type if you know the shape
};
const WishlistScreen = () => {
  const navigation = useNavigation();

  const [wishlistItems, setWishlistItems] = useState([
    {
      id: "1",
      title: "Smart LED Voltage Tester Pen – Multi-Fu...",
      price: 399,
      originalPrice: 699,
      image: require("../../assets/images/image.jpeg"), // Replace with your actual image path
    },
    {
      id: "2",
      title: "Smart LED Voltage Tester Pen – Multi-Fu...",
      price: 399,
      originalPrice: 699,
      image: require("../../assets/images/image.jpeg"), // Replace with your actual image path
    },
    {
      id: "4",
      title: "Smart LED Voltage Tester Pen – Multi-Fu...",
      price: 399,
      originalPrice: 699,
      image: require("../../assets/images/image.jpeg"), // Replace with your actual image path
    },
    {
      id: "3",
      title: "Smart LED Voltage Tester Pen – Multi-Fu...",
      price: 399,
      originalPrice: 699,
      image: require("../../assets/images/image.jpeg"), // Replace with your actual image path
    },
  ]);

  const removeFromWishlist = (id: string) => {
    const updatedList = wishlistItems.filter((item) => item.id !== id);
    setWishlistItems(updatedList);
  };

  const renderItem = ({ item }: { item: WishlistItem }) => (
    <View style={styles.card}>
      <Image source={item.image} style={styles.image} />
      <TouchableOpacity
        style={styles.heartIcon}
        onPress={() => removeFromWishlist(item.id)}
      >
        <AntDesign name="heart" size={20} color="red" />
      </TouchableOpacity>
      <Text style={styles.title}>{item.title}</Text>
      <View style={styles.priceRow}>
        <Text style={styles.price}>₹ {item.price}.00</Text>
        <Text style={styles.originalPrice}>₹ {item.originalPrice}.00</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#000" }}>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <AntDesign name="arrowleft" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerText}>Wishlist</Text>
        </View>

        <FlatList
          data={wishlistItems}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.listContent}
        />
      </View>
    </SafeAreaView>
  );
};

export default WishlistScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop:30
  },
  header: {
    paddingTop: 12,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    height: 56,
    backgroundColor: "#fff",
    elevation: 4,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#000",
  },
  listContent: {
    padding: 12,
  },
  card: {
    flex: 0.5,
    margin: 6,
    backgroundColor: "#fff",
    borderRadius: 12,
    elevation: 2,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: 160,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  heartIcon: {
    position: "absolute",
    right: 8,
    bottom: 8,
    backgroundColor: "#fff",
    borderRadius: 999,
    padding: 4,
    elevation: 2,
  },
  title: {
    fontSize: 14,
    fontWeight: "500",
    paddingHorizontal: 8,
    paddingTop: 8,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingBottom: 10,
    gap: 6,
  },
  price: {
    fontSize: 14,
    fontWeight: "600",
  },
  originalPrice: {
    fontSize: 12,
    color: "#888",
    textDecorationLine: "line-through",
  },
});
