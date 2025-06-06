import { fetchShopServiceDetail } from "@/components/utils/api";
import { Ionicons } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import { router, useLocalSearchParams } from "expo-router";
import { decode } from "html-entities";
import React, { useEffect, useState } from "react";

import {
  ActivityIndicator,
  Dimensions,
  Image,
  ImageSourcePropType,
  Linking,
  Modal,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import RenderHTML from "react-native-render-html";
import { SafeAreaView } from "react-native-safe-area-context";
type ShopServiceDetail = {
  service_id: string;
  shop_name: string;
  mobile: string;
  whatsapp_no: string;
  main_image: string;
  map_link: string;
  status: string;
  description: string;
  createdby: string;
  ipaddress: string;
  createdate: string;
  lastupdated: string;
  images: string[];
};

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
const ProductDetail = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState<
    ImageSourcePropType | undefined
  >(undefined);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [services, setServices] = useState<ShopServiceDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { serviceId } = useLocalSearchParams();
  const { width } = useWindowDimensions();

  const decodedHtml = decode(services?.description || "");

  const handleScroll = (event: any) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / Dimensions.get("window").width);
    setCurrentIndex(index);
  };

  const openImageModal = (image: ImageSourcePropType) => {
    setSelectedImage(image);
    setModalVisible(true);
  };

  const handleCall = () => {
    if (services?.mobile) Linking.openURL(`tel:${services.mobile}`);
  };

  const handleVisit = () => {
    if (services?.map_link) Linking.openURL(services.map_link);
  };

  const handleWhatsApp = () => {
    if (services?.whatsapp_no)
      Linking.openURL(`https://wa.me/${services.whatsapp_no}`);
  };

  const handleShare = async () => {
    try {
      const result = await Share.share({
        message: `Check out this service: ${services?.shop_name}\n\n Visit: ${
          services?.map_link || "Link not available"
        }\n\nCall: ${services?.mobile || "N/A"}\nWhatsApp: ${
          services?.whatsapp_no || "N/A"
        }`,
      });

      if (result.action === Share.sharedAction) {
        // Optional: handle shared result
      }
    } catch (error) {
      alert(
        "Error sharing: " +
          (error instanceof Error ? error.message : "Unknown error")
      );
    }
  };

  const handleDownload = async () => {
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== "granted") {
        alert("Permission to access media library is required!");
        return;
      }

      const allImages = [
        services?.main_image,
        ...(services?.images || []),
      ].filter(Boolean);
      const uri = allImages[currentIndex];
      if (!uri) return alert("No image to download.");

      const fileName = uri.split("/").pop() || "downloaded.jpg";
      const fileUri = FileSystem.documentDirectory + fileName;

      const downloadResumable = FileSystem.createDownloadResumable(
        uri,
        fileUri
      );
      const downloadResult = await downloadResumable.downloadAsync();
      if (!downloadResult) return alert("Failed to download image.");

      const asset = await MediaLibrary.createAssetAsync(downloadResult.uri);
      await MediaLibrary.createAlbumAsync("Download", asset, false);

      alert("Image saved to gallery!");
    } catch (error) {
      alert("Failed to download image.");
      console.error(error);
    }
  };

  const allImages = [services?.main_image, ...(services?.images || [])].filter(
    Boolean
  );

  useEffect(() => {
    const getData = async () => {
      try {
        if (typeof serviceId === "string") {
          const data = await fetchShopServiceDetail(serviceId);
          setServices(data?.message || null);
        } else {
          setError("Invalid service ID");
        }
      } catch (err: any) {
        setError(err.message || "Error fetching data");
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, [serviceId]);
  
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#002855" />
      </View>
    );
  }

  if (error)
    return (
      <Text style={{ color: "red", textAlign: "center", marginTop: 100 }}>
        {error}
      </Text>
    );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView style={styles.container}>
        <View style={styles.headerIcons}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.iconButton}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity onPress={handleDownload} style={styles.iconButton}>
            <Ionicons name="download-outline" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        >
          {allImages.map((image, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => openImageModal({ uri: image })}
            >
              <Image
                source={{ uri: image }}
                style={styles.productImage}
                resizeMode="cover"
              />
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.dotsContainer}>
          {allImages.map((_, index) => (
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
          <Text style={styles.title}>{services?.shop_name}</Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 10, marginTop: 16, marginBottom: 16 }}
          >
            <TouchableOpacity style={styles.actionButton} onPress={handleCall}>
              <Ionicons name="call-outline" size={18} color="#002855" />
              <Text style={styles.actionText}>Call</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton} onPress={handleVisit}>
              <Ionicons name="globe-outline" size={18} color="#002855" />
              <Text style={styles.actionText}>Visit</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleWhatsApp}
            >
              <Ionicons name="logo-whatsapp" size={18} color="#002855" />
              <Text style={styles.actionText}>Contact</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
              <Ionicons name="share-social-outline" size={18} color="#002855" />
              <Text style={styles.actionText}>Share</Text>
            </TouchableOpacity>
          </ScrollView>

          <RenderHTML
            contentWidth={width}
            source={{ html: decodedHtml }}
            tagsStyles={{
              p: {
                textAlign: "justify",
                color: "#333",
                fontSize: 14,
                lineHeight: 25,
              },
            }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const screenWidth = Dimensions.get("window").width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 5,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 14,
    backgroundColor: "#fff",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#002855",
    marginRight: 8,
  },
  actionText: {
    color: "#002855",
    fontWeight: "600",
    fontSize: 14,
    marginLeft: 6,
  },
  productImage: {
    width: screenWidth,
    height: 300,
    objectFit: "contain",
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
    borderRadius: 5,
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
  headerIcons: {
    position: "absolute",
    top: 20,
    left: 0,
    right: 0,
    zIndex: 10,
    paddingHorizontal: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  iconButton: {
    backgroundColor: "rgba(0,0,0,0.6)",
    borderRadius: 20,
    padding: 6,
  },
});

export default ProductDetail;
