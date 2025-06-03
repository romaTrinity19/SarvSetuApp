import { fetchShopServices } from "@/components/utils/api";
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
type ShopService = {
  service_id: string;
  shop_name: string;
  mobile: string;
  whatsapp_no: string;
  upload_service_img: string;
  map_link: string;
  status: string;
  description: string;
  imagepath: string;
};

export default function ProductListScreen() {
  const [filterVisible, setFilterVisible] = useState(false);

  const [selectedFilter, setSelectedFilter] = useState("recommended");
  const [services, setServices] = useState<ShopService[]>([]);

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

  useFocusEffect(
    React.useCallback(() => {
      const loadShops = async () => {
        const savedShops = await AsyncStorage.getItem("shops");
        const parsed = savedShops ? JSON.parse(savedShops) : [];
        setProducts([...parsed, ...services]);
      };
      loadShops();
    }, [])
  );

  const applyFilter = (type: any) => {
    setFilterVisible(false);
    if (type === "lowest") {
      setProducts([...products].sort((a: any, b: any) => a.price - b.price));
    } else if (type === "highest") {
      setProducts([...products].sort((a: any, b: any) => b.price - a.price));
    } else {
      setProducts(services);
    }
  };

  const handleFilterSelection = (filterType: any) => {
    setSelectedFilter(filterType);
    applyFilter(filterType);
    setFilterVisible(false);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }} edges={["top"]}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Shop & Services</Text>
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
          </View>

          <FlatList
            data={services}
            keyExtractor={(item) => item?.service_id}
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
                        slug: item.service_id,
                        serviceId:item.service_id
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

                <Text style={styles.productName}>{item.shop_name}</Text>
                {/* <Text style={styles.productPrice}>
                  ₹ {item.price.toFixed(2)}{" "}
                  <Text style={styles.strike}>
                    ₹ {item.originalPrice.toFixed(2)}
                  </Text>
                </Text> */}

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
    objectFit: "contain",
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
