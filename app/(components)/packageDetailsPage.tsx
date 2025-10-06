import { fetchUserData, getPackageIngfoForUser } from "@/components/utils/api";
import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { router } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const PackageInfoScreen = () => {
  const [userData, setUserData] = useState<any>(null);
  const [packageInfoUser, setPackageInfoUser] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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

  useFocusEffect(
    useCallback(() => {
      loadAndFetchUser();
    }, [])
  );

  useFocusEffect(
    useCallback(() => {
      if (userData?.reg_id) {
        setLoading(true);
        getPackageIngfoForUser(userData.reg_id)
          .then((res) => {
            setPackageInfoUser(res);
          })
          .catch((err) => {
            console.error("Failed to fetch package info for user", err);
          })
          .finally(() => setLoading(false));
      }
    }, [userData?.reg_id])
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f5f7ff" }}>
      <View style={styles.headerWrapper}>
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Package Information</Text>
      </View>

      {loading ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#002B5B" />
          <Text style={{ marginTop: 10 }}>Loading package info...</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.container}>
          {packageInfoUser.length === 0 ? (
            <Text style={styles.noData}>No package info available.</Text>
          ) : (
            packageInfoUser.map((item, index) => (
              <View style={styles.card} key={index}>
                <Text style={styles.title}>{item.package_name}</Text>

                <View style={styles.row}>
                  <Text style={styles.label}>Amount</Text>
                  <Text style={styles.value}>
                    {"  "}₹ {item.amount}
                  </Text>
                </View>

                <View style={styles.row}>
                  <Text style={styles.label}>Purchase Date</Text>
                  <Text style={styles.value}>
                    {"  "}
                    {item.approve_date}
                  </Text>
                </View>

                <View style={styles.row}>
                  <Text style={styles.label}>Expiry Date</Text>
                  <Text style={styles.value}>
                    {"  "}
                    {item.Expire_Date}
                  </Text>
                </View>

                <View style={styles.row}>
                  <Text style={styles.label}>Transaction ID</Text>
                  <Text style={styles.value}>
                    {"  "}
                    {item.transection_id || "N/A"}
                  </Text>
                </View>

                <View style={styles.row}>
                  <Text style={styles.label}>Status</Text>
                  <Text
                    style={[
                      styles.statusChip,
                      {
                        color: item.is_approved === "1" ? "#2e7d32" : "#c62828",
                      },
                    ]}
                  >
                    {item.is_approved === "1" ? "✅ Approved" : "❌ Pending"}
                  </Text>
                </View>

                {item.imagename ? (
                  <Image
                    source={{
                      uri: `https://sarvsetu.trinitycrm.in/uploads/${item.imagename}`,
                    }}
                    style={styles.packageImage}
                  />
                ) : null}
              </View>
            ))
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default PackageInfoScreen;

const styles = StyleSheet.create({
  headerWrapper: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    gap: 10,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  headerText: {
    fontSize: 18,
    fontWeight: "600",
  },
  container: {
    padding: 16,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 18,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
    color: "#002B5B",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
    flexWrap: "wrap",
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    width: "50%",
  },
  value: {
    fontSize: 14,
    color: "#444",
    width: "50%",
  },
  statusChip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    fontSize: 13,
    fontWeight: "600",
    width: "50%",
  },
  packageImage: {
    width: "100%",
    height: 180,
    borderRadius: 12,
    marginTop: 12,
    resizeMode: "cover",
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noData: {
    textAlign: "center",
    marginTop: 50,
    fontSize: 16,
    color: "#888",
  },
});
