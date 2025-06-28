import {
  fetchBannerImages,
  fetchUserData,
  getPackageIngfo,
  getPackageIngfoForUser,
} from "@/components/utils/api";
import { FontAwesome, Ionicons, MaterialIcons } from "@expo/vector-icons";
import Feather from "@expo/vector-icons/Feather";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Asset } from "expo-asset";
import {
  router,
  useFocusEffect,
  useLocalSearchParams,
  useRouter,
} from "expo-router";
import * as Sharing from "expo-sharing";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  ImageBackground,
  Modal,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Carousel from "react-native-reanimated-carousel";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

type AdCardProps = {
  imageSrc: any;
  payout: number;
  subscription: boolean;
  userData: any;
  id: any;
};

const AdCard: React.FC<AdCardProps> = ({ imageSrc, payout, userData, id }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [fullscreenVisible, setFullscreenVisible] = useState(false);
  const [packageInfo, setPackageInfo] = useState<any[]>([]);

  const [uploadDisabled, setUploadDisabled] = useState(false);
  const { uploaded, adID } = useLocalSearchParams();

  if (userData?.reg_id) {
    getPackageIngfoForUser(userData.reg_id)
      .then((res) => setPackageInfo(res))
      .catch((err) => console.error("Failed to fetch package info", err));
  }

  const isSubscribed = packageInfo[0]?.is_approved == 1;

  const shareImageOnWhatsApp = async () => {
    try {
      const asset = Asset.fromModule(imageSrc);
      await asset.downloadAsync();

      const localUri = asset.localUri || asset.uri;

      if (!(await Sharing.isAvailableAsync())) {
        alert("Sharing is not available on this device");
        return;
      }

      await Sharing.shareAsync(localUri, {
        mimeType: "image/jpeg",
        dialogTitle: "Share via",
      });
    } catch (error) {
      console.error("Error sharing image:", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (uploaded === "true") {
        setUploadDisabled(true); // ✅ Disable button if upload was done
      }
    }, [uploaded])
  );

  return (
    <View style={styles.card}>
      <View style={styles.payoutBadge}>
        <Text style={styles.payoutText}>Payout: ₹{payout}</Text>
      </View>

      <TouchableOpacity onPress={() => setFullscreenVisible(true)}>
        <Image
          source={typeof imageSrc === "string" ? { uri: imageSrc } : imageSrc}
          style={styles.image}
          resizeMode="cover"
        />
      </TouchableOpacity>

      <View style={styles.buttonGroup}>
        {/* Status Button */}
        <TouchableOpacity
          style={[styles.statusButton, { backgroundColor: "#34A853" }]}
          onPress={() => {
            if (isSubscribed) {
              shareImageOnWhatsApp();
            } else {
              setModalVisible(true);
            }
          }}
        >
          <FontAwesome
            name="whatsapp"
            size={20}
            color="white"
            style={styles.icon}
          />
          <Text style={styles.buttonText}>Status</Text>
        </TouchableOpacity>

        {/* Upload Button */}
        <TouchableOpacity
          style={[
            styles.statusButton,
            { backgroundColor: "#002B5B" },
            uploadDisabled && { backgroundColor: "gray" },
          ]}
          onPress={() => {
            if (isSubscribed && !uploadDisabled) {
              router.push({
                pathname: "/(components)/uploadImage",
                params: { adID: id },
              });
            } else {
              setModalVisible(true);
            }
          }}
          disabled={uploadDisabled}
        >
          <Feather name="upload" size={20} color="white" style={styles.icon} />
          <Text style={styles.buttonText}>Upload</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.statusButton, { backgroundColor: "#1e90ff" }]}
        >
          <Ionicons
            name="globe-outline"
            size={20}
            color="white"
            style={styles.icon}
          />
          <Text style={styles.buttonText}>Visit Now</Text>
        </TouchableOpacity>

        {/* {showCall && (
    <TouchableOpacity style={[styles.statusButton, { backgroundColor: "#1e90ff",}]}>
      <Feather name="phone-call" size={20} color="white" style={styles.icon} />
      <Text style={styles.buttonText}>Call</Text>
    </TouchableOpacity>
  )}

  {showEnquiry && (
    <TouchableOpacity style={[styles.statusButton, { backgroundColor: "#1e90ff",}]}>
      <MaterialIcons name="support-agent" size={20} color="white" style={styles.icon} />
      <Text style={styles.buttonText}>Enquiry</Text>
    </TouchableOpacity>
  )} */}
      </View>

      {/* Subscription Modal */}
      <Modal
        transparent
        visible={modalVisible}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Unlock Exclusive Features</Text>
            <Text style={styles.modalText}>
              Subscribe now to access premium benefits and elevate your
              experience!
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalNo}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalNoText}>No</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalOk}
                onPress={() => {
                  setModalVisible(false);
                  router.push("/(components)/memberShip");
                }}
              >
                <Text style={styles.modalOkText}>Ok</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Fullscreen Image Modal */}
      <Modal
        visible={fullscreenVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setFullscreenVisible(false)}
      >
        <TouchableOpacity
          style={styles.fullscreenOverlay}
          onPress={() => setFullscreenVisible(false)}
        >
          <Image
            source={typeof imageSrc === "string" ? { uri: imageSrc } : imageSrc}
            style={styles.fullscreenImage}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const VendorWelcomeScreen = ({
  userData,
  banners,
}: {
  userData: any;
  banners: any;
}) => {
  const router = useRouter();
  const [packageInfo, setPackageInfo] = useState<any[]>([]);

  if (userData?.reg_id) {
    getPackageIngfo(userData.reg_id)
      .then((res) => {
        setPackageInfo(res);
      })
      .catch((err) => {
        console.error("Failed to fetch package info", err);
      });
  }

  return (
    <ScrollView contentContainerStyle={{ paddingBottom: 60 }}>
      <View
        style={{
          flex: 1,

          alignItems: "center",
          // paddingTop: 10,
        }}
      >
        <Carousel
          width={width * 1}
          height={200}
          autoPlay
          data={banners}
          scrollAnimationDuration={1000}
          renderItem={({ item }) => (
            <View style={styles.slide}>
              <ImageBackground
                source={{ uri: item as string }}
                style={styles.image2}
                //imageStyle={{ borderRadius: 15 }}
              ></ImageBackground>
            </View>
          )}
          style={{ marginTop: 30 }}
          loop
        />

        <Text style={styles.welcome}>
          👋 Welcome, {`${userData.first_name} ${userData.last_name}`}!
        </Text>
        <Text style={styles.description}>
          🚀 We're thrilled to have you onboard. Start showcasing your products
          and reach customers instantly!
        </Text>

        <View style={styles.packageBox}>
          {packageInfo[0]?.is_approved === "1" ? (
            <>
              <Text style={styles.packageTitle}>
                🎉 Premium Package Activated!
              </Text>
              <Text style={styles.packageText}>
                💰 <Text style={styles.bold}>Package Amount:</Text> ₹
                {packageInfo[0].amount}
              </Text>
              <Text style={styles.packageText}>
                📦 <Text style={styles.bold}>Ads Allowed:</Text>{" "}
                {packageInfo[0].peradd}
              </Text>
              <Text style={styles.statusText}>
                🟢 <Text style={styles.bold}>Status:</Text>{" "}
                <Text style={styles.statusActive}>Active</Text>
              </Text>
              <Text style={styles.packageText}>
                ✅ Enjoy your benefits and manage your ads like a pro!
              </Text>
              {packageInfo[0].remaining_ads == "0" &&
                packageInfo[0]?.is_approved === "1" && (
                  <TouchableOpacity
                    style={styles.buttonPrimary}
                    onPress={() =>
                      router.push("/(components)/vendorMembership")
                    }
                  >
                    <Text style={styles.buttonText2}>💳 Buy New Package</Text>
                  </TouchableOpacity>
                )}

              {packageInfo[0].remaining_ads > "0" && (
                <TouchableOpacity
                  style={[styles.buttonPrimary, { marginTop: 12 }]}
                  onPress={() => router.push("/(components)/createShop")}
                >
                  <Text style={styles.buttonText2}>⚙️ Create Ads</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={[styles.buttonSecondary, { marginTop: 10 }]}
                onPress={() => router.push("/(components)/vendorAdsData")}
              >
                <Text style={styles.buttonText2}>📊 My Ads</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Text style={styles.packageTitle}>🎯 Want to grow faster?</Text>
              <Text style={styles.packageText}>
                Buy a premium package to unlock powerful features and boost your
                reach today! 📈
              </Text>
              <Text style={styles.statusText}>
                🔴 <Text style={styles.bold}>Status:</Text>{" "}
                <Text style={styles.statusInactive}>Inactive</Text>
              </Text>
              <TouchableOpacity
                style={styles.buttonPrimary}
                onPress={() => router.push("/(components)/vendorMembership")}
              >
                <Text style={styles.buttonText2}>💳 Buy Package</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

const Header = ({ userData }: { userData: any }) => {
  const firstName = userData?.first_name || "";
  const lastName = userData?.last_name || "";
  const initial = firstName?.charAt(0)?.toUpperCase() || "?";
  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity
        style={styles.initialCircle}
        onPress={() => router.push("/(main)/Account")}
      >
        {userData?.profile_image ? (
          <Image
            source={{ uri: userData.profile_image }}
            style={styles.avatarImage}
          />
        ) : (
          <Text style={styles.initialText}>{initial}</Text>
        )}
      </TouchableOpacity>
      <View style={styles.headerTextContainer}>
        <Text style={styles.profileName}>
          {firstName.toUpperCase()} {" " + lastName.toUpperCase()}
        </Text>
      </View>
    </View>
  );
};

const App = () => {
  const [ads, setAds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [banners, setBanners] = useState<string[]>([]);

  const loadBanners = async () => {
    try {
      const bannerUrls = await fetchBannerImages();
      setBanners(bannerUrls);
    } catch (error) {
      console.error("Failed to load banners");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    loadBanners();
  }, []);

  useEffect(() => {
    banners.forEach((url) => {
      Image.prefetch(url);
    });
  }, [banners]);

  const loadData = async () => {
    try {
      const storedUser = await AsyncStorage.getItem("userData");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        const regId = parsedUser?.reg_id;
        const freshUserData = await fetchUserData(regId);
        setUserData(freshUserData || parsedUser);
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch(
        "https://sarvsetu.trinitycrm.in/admin/Api/dashboard_api.php?type=dashboard"
      );
      const json = await response.json();

      if (json.status === "success" && json.message?.add_data) {
        setAds(json.message.add_data);
      } else {
        console.warn("Invalid data format");
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  console.log('adsssssss', ads)
  
  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([
      fetchDashboardData(),
      loadData(),
      loadBanners(), // ✅ Refresh banners too
    ]);
    setRefreshing(false);
  };
 

  if (loading || !userData) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }} edges={["top"]}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={{ flex: 1 }}>
        <Header userData={userData} />

        {userData.role === "user" ? (
          <FlatList
            data={ads}
            keyExtractor={(item) => item.ads_id.toString()}
            ListHeaderComponent={() => (
              <Carousel
                width={width}
                height={200}
                autoPlay
                data={banners}
                scrollAnimationDuration={1000}
                renderItem={({ item }) => (
                  <View style={styles.slide}>
                    <ImageBackground
                      source={{ uri: item as string }}
                      style={styles.image2}
                    />
                  </View>
                )}
                style={{ marginTop: 10 }}
                loop
              />
            )}
            renderItem={({ item }) => (
              <AdCard
                imageSrc={item.imagepath}
                payout={item.payamt}
                subscription={item?.is_subscribe}
                userData={userData}
                id={item.ads_id}
              />
            )}
            contentContainerStyle={{ paddingBottom: 80 }}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <Text style={{ textAlign: "center", marginTop: 20 }}>
                No Ads Available
              </Text>
            }
            refreshing={refreshing}
            onRefresh={handleRefresh}
          />
        ) : (
          <VendorWelcomeScreen userData={userData} banners={banners} />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 8,
    backgroundColor: "#fff",
    shadowColor: "#000",
    zIndex: 100,
  },

  avatarImage: {
    width: 40,
    height: 40,
    borderRadius: 20, // match initialCircle's radius
    resizeMode: "cover",
  },

  initialCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#002B5B",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  initialText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  headerTextContainer: {
    flexDirection: "column",
  },
  profileName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
  },
  card: {
    margin: 16,
    borderRadius: 10,
    backgroundColor: "#fff",
    overflow: "hidden",
    elevation: 3,
    position: "relative",
  },
  payoutBadge: {
    position: "absolute",
    top: 0,
    left: 0,
    backgroundColor: "#f36c21",
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderBottomEndRadius: 5,
    zIndex: 1,
  },
  payoutText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
  image: {
    width: "100%",
    height: 300,
  },
  buttonGroup: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    margin: 10,
  },
  statusButton: {
    backgroundColor: "#34A853",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    marginRight: 8,
    marginBottom: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    marginLeft: 6,
  },
  icon: {
    marginRight: 2,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalText: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  modalNo: {
    padding: 10,
    borderRadius: 5,
    borderColor: "#002B5B",
    borderWidth: 2,
    marginRight: 10,
    flex: 1,
    alignItems: "center",
  },
  modalNoText: {
    color: "#002B5B",
    fontSize: 14,
    fontWeight: "bold",
  },
  modalOk: {
    padding: 10,
    backgroundColor: "#002B5B",
    borderRadius: 5,
    flex: 1,
    alignItems: "center",
  },
  modalOkText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
  fullscreenOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.95)",
    justifyContent: "center",
    alignItems: "center",
  },

  fullscreenImage: {
    width: "100%",
    height: "100%",
  },

  slide: {
    borderRadius: 10,
    overflow: "hidden",
  },
  image2: {
    width: "100%",
    height: "100%",
    justifyContent: "flex-end",
  },
  gradient: {
    height: "100%",
    width: "100%",
    borderRadius: 15,
  },
  welcome: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 40,
    textAlign: "center",
    color: "#002B5B",
  },
  description: {
    fontSize: 16,
    color: "#002B5B",
    textAlign: "center",
    marginTop: 10,
    marginBottom: 20,
    paddingHorizontal: 25,
    lineHeight: 22,
  },
  packageBox: {
    backgroundColor: "#e6f0ff",
    padding: 25,
    borderRadius: 20,
    marginTop: 20,
    width: "90%",
    alignItems: "center",
    shadowColor: "#007AFF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 25,
    borderWidth: 1,
    borderColor: "#cce0ff",
  },
  packageTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#002B5B",
    marginBottom: 10,
    textAlign: "center",
  },
  packageText: {
    fontSize: 15,
    textAlign: "center",
    color: "#333",
    marginBottom: 10,
    lineHeight: 22,
  },
  bold: {
    fontWeight: "bold",
  },
  statusText: {
    fontSize: 15,
    color: "#444",
    marginBottom: 10,
  },
  statusActive: {
    color: "green",
    fontWeight: "bold",
  },
  statusInactive: {
    color: "red",
    fontWeight: "bold",
  },
  buttonPrimary: {
    backgroundColor: "#002B5B",
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 30,
    width: "80%",
    alignItems: "center",
  },
  buttonSecondary: {
    backgroundColor: "#002B5B",
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 30,
    width: "80%",
    alignItems: "center",
  },
  buttonText2: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default App;
