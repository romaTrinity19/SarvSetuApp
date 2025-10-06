import { fetchUserData } from "@/components/utils/api";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import {
  Clipboard,
  Image,
  Linking,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ProtectedRoute from "../(components)/ProtectedRoute";

const ReferAndEarn = () => {
  const [userData, setUserData] = useState<any>(null);
  const referralCode = userData?.reg_code;

  const copyToClipboard = () => {
    Clipboard.setString(referralCode);
  };

  const loadAndFetchUser = async () => {
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
    loadAndFetchUser();
  }, []);

  const shareOnWhatsApp = () => {
    if (!referralCode) {
      alert("Referral code not available");
      return;
    }

    const message = `🚀 Hey! Download the *SarvSetu App* today.  

🎁 Use my referral code *${referralCode}* while signing up and get *₹50 bonus instantly*! 💸  

👉 Install now: https://sarvsetu.trinitycrm.in`;

    const url = `whatsapp://send?text=${encodeURIComponent(message)}`;

    Linking.openURL(url).catch(() => {
      alert("Make sure WhatsApp is installed on your device");
    });
  };

  return (
    <ProtectedRoute>
      <SafeAreaView
        style={{ flex: 1, backgroundColor: "#fff" }}
        edges={["top"]}
      >
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
        <View style={styles.container}>
          <Text style={styles.header}>Refer & Earn</Text>
          <ScrollView style={styles.container1}>
            <Image
              source={require("../../assets/images/image.jpeg")}
              style={styles.banner}
              resizeMode="cover"
            />

            <View style={{ paddingHorizontal: 18 }}>
              <Text style={styles.subHeader}>How It Works</Text>

              <View style={styles.card}>
                <Text style={styles.cardTitle}>DIRECT REFERRAL</Text>
                <Text style={styles.cardReward}>Earn ₹100.00</Text>
                <Text style={styles.cardDescription}>
                  when someone you refer buys a subscription.
                </Text>
              </View>

              <View style={styles.card}>
                <Text style={styles.cardTitle}>INDIRECT REFERRAL</Text>
                <Text style={styles.cardReward}>Earn Additional ₹50.00</Text>
                <Text style={styles.cardDescription}>
                  When your referred friend refers someone else who buys a
                  subscription.
                </Text>
              </View>

              <View style={styles.referralBox}>
                <TextInput
                  style={styles.referralInput}
                  value={userData?.reg_code}
                  editable={false}
                />
                <TouchableOpacity onPress={copyToClipboard}>
                  <Ionicons name="copy-outline" size={24} color="#002855" />
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={styles.buttonPrimary}
                onPress={shareOnWhatsApp}
              >
                <Text style={styles.buttonText}>Refer Now</Text>
              </TouchableOpacity>

              {/* <TouchableOpacity style={styles.buttonOutline}>
                <Text style={styles.buttonOutlineText}>View Referrals</Text>
              </TouchableOpacity> */}
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    </ProtectedRoute>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
    backgroundColor: "#fff",
  },
  container1: {
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 10,
    paddingLeft: 14,
  },
  banner: {
    width: "100%",
    height: 180,
    marginTop: 10,
  },
  subHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 16,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#FFF4EC",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  cardTitle: {
    color: "#FF7A00",
    fontWeight: "600",
    marginBottom: 6,
  },
  cardReward: {
    fontSize: 20,
    fontWeight: "bold",
  },
  cardDescription: {
    fontSize: 14,
    color: "#555",
  },
  referralBox: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#002855",
    borderRadius: 10,
    padding: 8,
    marginTop: 20,
  },
  referralInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  buttonPrimary: {
    backgroundColor: "#002855",
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 16,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  buttonOutline: {
    borderWidth: 1.5,
    borderColor: "#002855",
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 12,
    marginBottom: 20,
  },
  buttonOutlineText: {
    color: "#002855",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default ReferAndEarn;
