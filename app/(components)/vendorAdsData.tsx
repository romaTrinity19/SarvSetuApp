import { fetchBannerImages, fetchUserData } from "@/components/utils/api";
import Feather from "@expo/vector-icons/Feather";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Asset } from "expo-asset";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import * as Sharing from "expo-sharing";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
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
import { SafeAreaView } from "react-native-safe-area-context";
import Carousel from "react-native-reanimated-carousel";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");

type AdCardProps = {
  imageSrc: any;
  payout: number;
  isApprove: string; // "0" or "1"
};

const AdCard: React.FC<AdCardProps> = ({ imageSrc, payout, isApprove }) => {
  const [approved, setApproved] = useState(isApprove === "1");

  const handleEdit = () => {
    console.log("Edit clicked");
  };

  const handleDelete = () => {
    console.log("Delete clicked");
  };

  const handleApprove = () => {
    //setApproved(true);
    console.log("Approved");
  };

  return (
    <View style={styles.card}>
      <View style={styles.payoutBadge}>
        <Text style={styles.payoutText}>Payout: ₹{payout || 0}</Text>
      </View>

      <Image
        source={typeof imageSrc === "string" ? { uri: imageSrc } : imageSrc}
        style={styles.image}
        resizeMode="cover"
      />

      {!approved && (
        <View style={styles.buttonGroup}>
          <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
            <Feather name="edit" size={20} color="white" style={styles.icon} />
            <Text style={styles.buttonText}>Edit</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
            <Feather
              name="trash-2"
              size={20}
              color="white"
              style={styles.icon}
            />
            <Text style={styles.buttonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity
        style={[styles.approveButton, !approved ? {} : styles.disabledButton]}
        onPress={handleApprove}
        disabled={approved}
      >
        <Text style={styles.buttonText}>Approve</Text>
      </TouchableOpacity>
    </View>
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
  useEffect(() => {
    if (userData?.reg_id) {
      fetchDashboardData(userData.reg_id);
    }
  }, [userData]);

  const fetchDashboardData = async (regId: string) => {
    try {
      const response = await fetch(
        `https://sarvsetu.trinitycrm.in/admin/Api/dashboard_api.php?type=getvendorads&reg_id=${encodeURIComponent(
          regId
        )}`
      );

      const json = await response.json();
      console.log("dashboard response:", json);

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

  console.log("dashboard response:", ads);
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
        <ScrollView
          style={styles.container}
          contentContainerStyle={{ paddingTop: 8 }}
        >
          {ads?.map((ad) => (
            <AdCard
              key={ad.ads_id}
              imageSrc={ad.upload_img}
              payout={ad.payamt}
              isApprove={ad?.is_approved}
            />
          ))}
        </ScrollView>
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
    paddingBottom: 12,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
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
  avatarImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
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
    justifyContent: "space-around",
    padding: 10,
  },
  editButton: {
    flex: 1,
    margin: 5,
    paddingVertical: 10,
    flexDirection: "row",
    backgroundColor: "#007bff",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  deleteButton: {
    flex: 1,
    margin: 5,
    paddingVertical: 10,
    flexDirection: "row",
    backgroundColor: "#dc3545",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  approveButton: {
    marginHorizontal: 10,
    marginBottom: 10,
    marginTop: 5,
    paddingVertical: 12,
    backgroundColor: "gray",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  disabledButton: {
    backgroundColor: "#28a745",
  },
  disabledButton2: {
    backgroundColor: "gray",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  icon: {
    marginRight: 8,
  },
});

export default App;
