import Entypo from "@expo/vector-icons/Entypo";
import Feather from "@expo/vector-icons/Feather";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  FlatList,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const productsData = [
  {
    id: "1",
    name: "Adbiz 24-in-1 Mini Precision Screwdriver",
    price: 449,
    originalPrice: 599,
    image: require("../../assets/images/headphone.webp"),
  },
  {
    id: "2",
    name: "Smart LED Voltage Tester Pen",
    price: 399,
    originalPrice: 699,
    image: require("../../assets/images/image.jpeg"),
  },
  {
    id: "3",
    name: "Adbiz Unisex Facial Hair Remover",
    price: 499,
    originalPrice: 799,
    image: require("../../assets/images/adbisImage.webp"),
  },
  {
    id: "4",
    name: "Portable Bladeless Neck Fan",
    price: 599,
    originalPrice: 799,
    image: require("../../assets/images/headphone.webp"),
  },
  {
    id: "5",
    name: "boAt Airdopes Mango ENx Pods",
    price: 649,
    originalPrice: 999,
    image: require("../../assets/images/image.jpeg"),
  },
  {
    id: "6",
    name: "boAt ENx Airdopes Mango Pods",
    price: 649,
    originalPrice: 999,
    image: require("../../assets/images/headphone.webp"),
  },
  {
    id: "7",
    name: "boAt Airdopes Mango ENx Pods Bronze",
    price: 649,
    originalPrice: 999,
    image: require("../../assets/images/react-logo.png"),
  },
  {
    id: "8",
    name: "boAt Yo Yo Pods Airdopes White",
    price: 649,
    originalPrice: 1099,
    image: require("../../assets/images/react-logo.png"),
  },
];

export default function ProductListScreen() {
  const [products, setProducts] = useState(productsData);
  const [filterVisible, setFilterVisible] = useState(false);
  const [wishlist, setWishlist] = useState<string[]>([]);

  const applyFilter = (type: any) => {
    setFilterVisible(false);
    if (type === "lowest") {
      setProducts([...products].sort((a, b) => a.price - b.price));
    } else if (type === "highest") {
      setProducts([...products].sort((a, b) => b.price - a.price));
    } else {
      setProducts(productsData);
    }
  };

  const [selectedFilter, setSelectedFilter] = useState("recommended");

  const handleFilterSelection = (filterType: any) => {
    setSelectedFilter(filterType);
    applyFilter(filterType);
    setFilterVisible(false);
  };

  const toggleWishlist = (productId: any) => {
    setWishlist((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Products</Text>
        <Feather name="shopping-bag" size={24} color="black" />
      </View>
      <View style={styles.horizontalLine} />
      <View style={{ marginHorizontal: 15 }}>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            marginVertical: 10,
          }}
        >
          <TouchableOpacity onPress={() => setFilterVisible(true)}>
            <Ionicons name="filter" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.allProductsButton}
            onPress={() => setProducts(productsData)}
          >
            <Text style={styles.allProductsText}>All Products</Text>
          </TouchableOpacity>
          {/* {role === "vendor" && ( */}
  <TouchableOpacity
    style={styles.allProductsButton}
    // onPress={() => router.push("/(components)/AddProduct")}
  >
    <Text style={styles.allProductsText}>+ Add Product</Text>
  </TouchableOpacity>
{/* )} */}
        </View>

        <FlatList
          data={products}
          keyExtractor={(item) => item.id}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.productCard}  onPress={() =>
            router.push({
              pathname: '/(components)/productDetails/[slug]',
              params: {
                slug: item.id,
                name: item.name,
                price: item.price,
                originalPrice: item.originalPrice,
                images:item.image,
              },
            })
          }>
              <View style={styles.imageContainer}>
                <Image source={item.image} style={styles.productImage} />
                <TouchableOpacity
                  style={styles.heartIcon}
                  onPress={() => toggleWishlist(item.id)}
                >
                  <Ionicons
                    name={
                      wishlist.includes(item.id) ? "heart" : "heart-outline"
                    }
                    size={22}
                    color={wishlist.includes(item.id) ? "red" : "gray"}
                  />
                </TouchableOpacity>
              </View>
              <Text style={styles.productName}>{item.name}</Text>
              <Text style={styles.productPrice}>
                ₹ {item.price.toFixed(2)}{" "}
                <Text style={styles.strike}>
                  ₹ {item.originalPrice.toFixed(2)}
                </Text>
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      <Modal visible={filterVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Sort By</Text>

            {["recommended", "lowest", "highest"].map((type) => (
              <TouchableOpacity
                key={type}
                style={styles.radioRow}
                onPress={() => handleFilterSelection(type)}
              >
                <Text style={styles.radioLabel}>
                  {type === "recommended"
                    ? "RECOMMENDED"
                    : type === "lowest"
                    ? "LOWEST PRICE"
                    : "HIGHEST PRICE"}
                </Text>

                <Ionicons
                  name={
                    selectedFilter === type
                      ? "radio-button-on"
                      : "radio-button-off"
                  }
                  size={20}
                  color="#002B5B"
                  style={{ marginRight: 10 }}
                />
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              onPress={() => setFilterVisible(false)}
              style={styles.closeButton}
            >
              <Entypo name="cross" size={24} color="black" />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 30,
    backgroundColor: "#fff",
    paddingBottom: 140,
  },
  imageContainer: {
    position: "relative",
  },
  heartIcon: {
    position: "absolute",
    bottom: 5,
    right: 5,
    backgroundColor: "white",
    borderRadius: 12,
    padding: 3,
    elevation: 3,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 10,
    paddingHorizontal: 15,
  },
  headerText: { fontSize: 20, fontWeight: "bold" },
  filterIcon: { fontSize: 24 },
  allProductsButton: {
    alignSelf: "flex-start",
    backgroundColor: "#002B5B",
    paddingVertical: 10,
    borderRadius: 8,
    marginStart: 15,
    paddingHorizontal: 20,
  },
  allProductsText: { color: "#fff", fontWeight: "bold" },
  listContainer: { paddingBottom: 20 },
  productCard: { flex: .5, margin: 5, borderRadius: 10, padding: 10 },
  productImage: {
    width: "100%",
    height: 100,
    resizeMode: "contain",
    marginBottom: 5,
  },
  productName: { fontSize: 13, marginBottom: 5 },
  productPrice: { fontWeight: "bold", fontSize: 16 },
  strike: { textDecorationLine: "line-through", color: "gray", fontSize: 12 },
  radioRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
    justifyContent: "space-between",
  },
  horizontalLine: {
    height: 1,
    backgroundColor: "#A2ADB0",
    marginBottom: 15,
  },
  radioLabel: {
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  closeButton: {
    position: "absolute",
    right: 15,
    top: 15,
  },
});
