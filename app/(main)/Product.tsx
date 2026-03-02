import { fetchShopServices } from "@/components/utils/api";
import Ionicons from "@expo/vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { router, useFocusEffect } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Linking,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { SafeAreaView } from "react-native-safe-area-context";
import ProtectedRoute from "../(components)/ProtectedRoute";
type ShopService = {
  service_id: string;
  shop_name: string;
  cat_name: string;
  mobile: string;
  whatsapp_no: string;
  upload_service_img: string;
  map_link: string;
  status: string;
  description: string;
  imagepath: string;
};

export default function ProductListScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [category, setCategory] = useState<any[]>([]);

  const [services, setServices] = useState<ShopService[]>([]);
  const [filteredServices, setFilteredServices] = useState<ShopService[]>([]);

  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [products, setProducts] = useState(services);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getData = async () => {
      try {
        const data = await fetchShopServices();
        setServices(data?.message?.service_data || []);
      } catch (err: any) {
        setError(err.message || "Error fetching data");
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const data = await fetchShopServices();
      setServices(data?.message?.service_data || []);
      const savedShops = await AsyncStorage.getItem("shops");
      const parsed = savedShops ? JSON.parse(savedShops) : [];
      setProducts([...parsed, ...(data?.message?.service_data || [])]);
    } catch (err: any) {
      setError(err.message || "Error refreshing data");
    } finally {
      setRefreshing(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      const loadShops = async () => {
        const savedShops = await AsyncStorage.getItem("shops");
        const parsed = savedShops ? JSON.parse(savedShops) : [];
        setProducts([...parsed, ...services]);
      };
      loadShops();
    }, []),
  );

  useEffect(() => {
    let filtered = services;

    if (searchText.trim() !== "") {
      filtered = filtered.filter((item) =>
        item.shop_name?.toLowerCase().includes(searchText.toLowerCase()),
      );
    }

    setFilteredServices(filtered);
  }, [searchText, services]);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await axios.get(
          "https://sarvsetu.trinitycrm.in/admin/Api/registration_api.php?type=get_category",
        );

        if (response.data && Array.isArray(response.data.data)) {
          const apiCategories = response.data.data;

          const updatedCategories = [
            { category_id: "all", cat_name: "Select All" },
            ...apiCategories,
          ];

          setCategory(updatedCategories);
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    fetchCategory();
  }, []);

  const applyCategoryFilter = () => {
    let filtered = services;

    if (selectedCategory && selectedCategory !== "all") {
      filtered = filtered.filter(
        (item: any) => item.category_id == selectedCategory,
      );
    }

    if (searchText.trim() !== "") {
      filtered = filtered.filter((item) =>
        item.shop_name?.toLowerCase().includes(searchText.toLowerCase()),
      );
    }

    setFilteredServices(filtered);
  };
  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#fff",
        }}
      >
        <ActivityIndicator size="large" color="#002B5B" />
      </View>
    );
  }
  return (
    <ProtectedRoute>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.headerText}>Shop & Services</Text>
          </View>
          <View style={styles.horizontalLine} />

          {/* Search Input */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "#E0F2FE",
              borderColor: "#002B5B",
              borderWidth: 0.5,
              borderRadius: 10,
              paddingHorizontal: 12,
              marginTop: 15,
              marginHorizontal: 15,
            }}
          >
            <Ionicons name="search" size={20} color="#888" />
            <TextInput
              placeholder="Search by shop name..."
              value={searchText}
              onChangeText={setSearchText}
              style={{
                flex: 1,
                height: 40,
                marginLeft: 8,
                color: "#000",
                fontSize: 16,
              }}
              autoCorrect={false}
              autoCapitalize="none"
              clearButtonMode="while-editing"
            />
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginHorizontal: 15,
              marginTop: 15,
            }}
          >
            <View style={{ flex: 1 }}>
              <Dropdown
                style={{
                  borderWidth: 1,
                  borderColor: "#ccc",
                  borderRadius: 8,
                  paddingHorizontal: 10,
                  height: 45,
                }}
                data={category}
                search
                labelField="cat_name"
                valueField="category_id"
                placeholder="Select Category"
                searchPlaceholder="Search category..."
                value={selectedCategory}
                onChange={(item) => {
                  setSelectedCategory(item.category_id);
                }}
              />
            </View>

            {/* 🔥 Mini Apply Button */}
            <TouchableOpacity
              style={{
                marginLeft: 8,
                backgroundColor: "#002B5B",
                paddingVertical: 10,
                paddingHorizontal: 12,
                borderRadius: 8,
              }}
              onPress={applyCategoryFilter}
            >
              <Text style={{ color: "#fff", fontSize: 12, fontWeight: "bold" }}>
                Apply
              </Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={filteredServices}
            keyExtractor={(item) => item?.service_id}
            numColumns={1}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContainer}
            refreshing={refreshing}
            onRefresh={handleRefresh}
            renderItem={({ item }) => (
              <View style={styles.productCard}>
                <TouchableOpacity
                  style={styles.imageContainer}
                  onPress={() =>
                    router.push({
                      pathname: "/(components)/productDetails/[slug]",
                      params: {
                        slug: item.service_id,
                        serviceId: item.service_id,
                      },
                    })
                  }
                >
                  <Image
                    source={{ uri: item.imagepath }}
                    style={styles.productImage}
                    resizeMode="cover"
                  />
                </TouchableOpacity>

                <Text style={styles.productName}>
                  {item?.shop_name.charAt(0).toUpperCase() +
                    item.shop_name.slice(1)}
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: "600",
                    color: "#555",
                    marginTop: 4,
                    textTransform: "capitalize",
                  }}
                >
                  {item?.cat_name}
                </Text>

                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => Linking.openURL(`tel:${item.mobile}`)}
                  >
                    <Text style={styles.buttonText}>Call</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => Linking.openURL(item.map_link)}
                  >
                    <Text style={styles.buttonText}>Visit Now</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() =>
                      Linking.openURL(`https://wa.me/91${item.whatsapp_no}`)
                    }
                  >
                    <Text style={styles.buttonText}>WhatsApp </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
        </View>
      </SafeAreaView>
    </ProtectedRoute>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
    backgroundColor: "#fff",
  },
  imageContainer: {
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#fff",
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
  productCard: { flex: 1, borderRadius: 10, padding: 10, marginHorizontal: 10 },
  productImage: {
    width: "100%",
    height: 200,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    objectFit: "contain",
  },

  productName: {
    fontSize: 16,
    marginBottom: 5,
    marginTop: 5,
    fontWeight: "bold",
  },
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
