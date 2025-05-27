import Entypo from "@expo/vector-icons/Entypo";
import Feather from "@expo/vector-icons/Feather";
import Ionicons from "@expo/vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useFocusEffect } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  Linking,
  Modal,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const productsData = [
  {
    id: "1",
    name: "Adbiz 24-in-1 Mini Precision Screwdriver",
    price: 449,
    originalPrice: 599,
    image: require("../../assets/images/headphone.webp"),
    images: [
      require("../../assets/images/headphone.webp"),
      require("../../assets/images/headphone.webp"),
    ],
    phoneNumber: "9123456789",
    website: "https://example.com/screwdriver",
    whatsappNumber: "7999559862",
  },
  {
    id: "2",
    name: "Smart LED Voltage Tester Pen",
    price: 399,
    originalPrice: 699,
    image: require("../../assets/images/image.jpeg"),
    images: [
      require("../../assets/images/headphone.webp"),
      require("../../assets/images/headphone.webp"),
    ],
    phoneNumber: "9876543210",
    website: "https://www.google.com/",
    whatsappNumber: "9131732564",
  },
  {
    id: "3",
    name: "Adbiz Unisex Facial Hair Remover",
    price: 499,
    originalPrice: 799,
    image: require("../../assets/images/adbisImage.webp"),
    images: [
      require("../../assets/images/headphone.webp"),
      require("../../assets/images/headphone.webp"),
    ],
    phoneNumber: "9988776655",
    website: "https://example.com/hairremover",
    whatsappNumber: "9988776655",
  },
  {
    id: "4",
    name: "Portable Bladeless Neck Fan",
    price: 599,
    originalPrice: 799,
    image: require("../../assets/images/headphone.webp"),
    images: [
      require("../../assets/images/headphone.webp"),
      require("../../assets/images/headphone.webp"),
    ],
    phoneNumber: "9090909090",
    website: "https://example.com/neckfan",
    whatsappNumber: "9090909090",
  },
  {
    id: "5",
    name: "boAt Airdopes Mango ENx Pods",
    price: 649,
    originalPrice: 999,
    image: require("../../assets/images/image.jpeg"),
    phoneNumber: "7777777777",
    website: "https://example.com/mango-enx",
    whatsappNumber: "7777777777",
  },
];

export default function ProductListScreen() {
  const [products, setProducts] = useState(productsData);
  const [filterVisible, setFilterVisible] = useState(false);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [userData, setUserData] = useState<any>(null);
  const [selectedFilter, setSelectedFilter] = useState("recommended");

  
  const toggleWishlist = (productId: any) => {
    setWishlist((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const getUserData = async () => {
    const userDataString = await AsyncStorage.getItem("userData");
    if (userDataString) {
      const userData = JSON.parse(userDataString);
      console.log("Stored User Dataaaaaaa:", userData);
      setUserData(userData);
    }
  };
  useEffect(() => {
    getUserData();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      const loadShops = async () => {
        const savedShops = await AsyncStorage.getItem("shops");
        const parsed = savedShops ? JSON.parse(savedShops) : [];
        console.log("shop detailssssssssssss", parsed);
        setProducts([...parsed, ...productsData]);
      };
      loadShops();
    }, [])
  );

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

  const handleFilterSelection = (filterType: any) => {
    setSelectedFilter(filterType);
    applyFilter(filterType);
    setFilterVisible(false);
  };

  return (
     <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}  edges={['top']}>
       <StatusBar barStyle="dark-content" backgroundColor="#fff" />  
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Shop & Services</Text>
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
            onPress={() => setProducts(products)}
          >
            <Text style={styles.allProductsText}>All Shop & Services</Text>
          </TouchableOpacity>
          {userData?.role === "vendor" && (
            <TouchableOpacity
              style={styles.allProductsButton}
              onPress={() => router.push("/(components)/createShop")}
            >
              <Text style={styles.allProductsText}>+ Add Shop</Text>
            </TouchableOpacity>
          )}
        </View>

        <FlatList
          data={products}
          keyExtractor={(item) => item.id}
          numColumns={1}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
          renderItem={({ item }) => (
            <View style={styles.productCard}>
              <TouchableOpacity
                style={styles.imageContainer}
                onPress={() =>
                  router.push({
                    pathname: "/(components)/productDetails/[slug]",
                    params: {
                      slug: item.id,
                      name: item.name,
                      price: item.price,
                      originalPrice: item.originalPrice,
                      images: item.image,
                      otherImages: item?.images,
                      phoneNumber: item.phoneNumber,
                      whatsappNumber: item.whatsappNumber,
                      website: item.website,
                    },
                  })
                }
              >
                <Image
                  source={item.image}
                  style={styles.productImage}
                  resizeMode="cover"
                />

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
              </TouchableOpacity>

              <Text style={styles.productName}>{item.name}</Text>
              <Text style={styles.productPrice}>
                ₹ {item.price.toFixed(2)}{" "}
                <Text style={styles.strike}>
                  ₹ {item.originalPrice.toFixed(2)}
                </Text>
              </Text>

              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => Linking.openURL(`tel:${item.phoneNumber}`)}
                >
                  <Text style={styles.buttonText}>Call</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => Linking.openURL(item.website)}
                >
                  <Text style={styles.buttonText}>Visit Now</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() =>
                    Linking.openURL(`https://wa.me/${item.whatsappNumber}`)
                  }
                >
                  <Text style={styles.buttonText}>Contact Us</Text>
                </TouchableOpacity>
              </View>
            </View>
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
    </SafeAreaView> 
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
   paddingTop: 10,
    backgroundColor: "#fff",
    paddingBottom: 140,
  },
  imageContainer: {
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#fff",
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
  productCard: { flex: 1, margin: 5, borderRadius: 10, padding: 10 },
  productImage: {
    width: "100%",
    height: 200,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
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
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  actionButton: {
    flex: 1,
    backgroundColor: "#E0F2FE",
    paddingVertical: 8,
    marginHorizontal: 4,
    borderRadius: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#7DD3FC",
  },
  buttonText: {
    color: "#002B5B",
    fontSize: 13,
    fontWeight: "bold",
  },
});
