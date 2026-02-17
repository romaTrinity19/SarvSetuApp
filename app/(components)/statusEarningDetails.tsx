import { fetchUserData } from "@/components/utils/api";
import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type ApiStatusItem = {
  status_id: string;
  image_path: string;
  payamt: number;
  is_approve: number; // 0,1,2
};
type StatusListItem = {
  id: string;
  image: string;
  amount: number;
  status: "approved" | "rejected" | "cancel";
};
export default function StatusEarningDetails() {
  const [loading, setLoading] = useState(true);
  const [statusList, setStatusList] = useState<StatusListItem[]>([]);
  const [userData, setUserData] = useState<any>(null);
  const [totalAmount, setTotalAmount] = useState(0);
  const [approvedCount, setApprovedCount] = useState(0);
  const [rejectedCount, setRejectedCount] = useState(0);
  const [cancelCount, setCancelCount] = useState(0);

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

  const loadStatusReport = async () => {
    try {
      const response = await fetch(
        `https://sarvsetu.trinitycrm.in/admin/Api/package_api.php?type=status_report&reg_id=${userData?.reg_id}`,
      );

      const json = await response.json();

      if (json.status === "success") {
        const list: ApiStatusItem[] = json.data || [];

        setStatusList(
          list.map((item) => ({
            id: item.status_id,
            image: item.image_path,
            amount: item.is_approve == 1 ? Number(item.payamt) : 0,
            status:
              item.is_approve == 1
                ? "approved"
                : item.is_approve == 2
                  ? "rejected"
                  : "cancel",
          })),
        );

        setApprovedCount(json.summary.approved_count || 0);
        setRejectedCount(json.summary.rejected_count || 0);
        setCancelCount(json.summary.pending_count || 0);
        setTotalAmount(json.summary.total_earning || 0);
      }
    } catch (error) {
      console.error("Status report error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAndFetchUser();
  }, []);
  useEffect(() => {
    if (userData?.reg_id) {
      loadStatusReport();
    }
  }, [userData]);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "approved":
        return styles.approved;
      case "rejected":
        return styles.rejected;
      default:
        return styles.cancel;
    }
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#002B5B" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: 5,
          paddingLeft: 10,
          paddingVertical: 20,
        }}
      >
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={{ fontSize: 20, fontWeight: "bold" }}>
          Status Earning Report
        </Text>
      </View>

      {/* Summary Cards */}
      <View style={styles.summaryContainer}>
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Total Earning</Text>
          <Text style={styles.cardValue}>₹ {totalAmount}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardLabel}>Approved</Text>
          <Text style={styles.cardValue}>{approvedCount}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardLabel}>Rejected</Text>
          <Text style={styles.cardValue}>{rejectedCount}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardLabel}>Cancelled</Text>
          <Text style={styles.cardValue}>{cancelCount}</Text>
        </View>
      </View>

      {/* Status List */}
      <FlatList
        data={statusList}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
        renderItem={({ item }) => (
          <View style={styles.listCard}>
            <Image source={{ uri: item.image }} style={styles.image} />

            <View style={{ flex: 1 }}>
              <Text style={styles.amount}>₹ {item.amount}</Text>
              <Text style={[styles.status, getStatusStyle(item.status)]}>
                {item.status.toUpperCase()}
              </Text>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    padding: 15,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#002B5B",
    marginBottom: 15,
  },
  summaryContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  card: {
    width: "48%",
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
  },
  cardLabel: {
    fontSize: 13,
    color: "#666",
  },
  cardValue: {
    fontSize: 18,
    fontWeight: "700",
    marginTop: 5,
    color: "#002B5B",
  },
  listCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 10,
    marginBottom: 12,
    elevation: 2,
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 8,
    marginRight: 10,
  },
  amount: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000",
  },
  status: {
    fontSize: 12,
    marginTop: 4,
    fontWeight: "600",
  },
  approved: {
    color: "green",
  },
  rejected: {
    color: "red",
  },
  cancel: {
    color: "#FF9800",
  },
});
