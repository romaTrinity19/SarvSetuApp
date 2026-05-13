import { fetchUserData } from "@/components/utils/api";
import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type CashbackItem = {
  amount: number;
  remark: string;
  create_date: string;
  created_by: string;
};

export default function CashbackDetails() {
  const [loading, setLoading] = useState(true);
  const [cashbackList, setCashbackList] = useState<CashbackItem[]>([]);
  const [totalCashback, setTotalCashback] = useState(0);
  const [userData, setUserData] = useState<any>(null);

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

  const loadCashback = async () => {
    try {
      const res = await fetch(
        "https://sarvsetu.trinitycrm.in/admin/Api/registration_api.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            type: "get_wallet_cashback",
            reg_id: userData?.reg_id,
          }),
        },
      );

      const json = await res.json();

      if (json.status === "success") {
        setCashbackList(json.cashback_list || []);
        setTotalCashback(json.total_cashback || 0);
      }
    } catch (err) {
      console.log("Cashback error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAndFetchUser();
  }, []);
  useEffect(() => {
    if (userData?.reg_id) {
      loadCashback();
    }
  }, [userData]);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#5975D9" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Cashback Details</Text>
      </View>

      {/* Total Card */}
      <View style={styles.totalCard}>
        <Text style={styles.totalLabel}>Total Cashback</Text>
        <Text style={styles.totalValue}>₹ {totalCashback}</Text>
      </View>

      {/* List */}
      <FlatList
        data={cashbackList}
        keyExtractor={(_, i) => i.toString()}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.row}>
              <Text style={styles.amount}>₹ {item.amount}</Text>
              <Text style={styles.date}>{item.create_date}</Text>
            </View>

            <Text style={styles.remark}>{item.remark}</Text>

            <Text style={styles.by}>
              Given by: {item.created_by || "Admin"}
            </Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F1F5F9",
  },

  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  /* 🔷 HEADER */
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 15,

    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },

  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000000",
  },

  /* 🔷 TOTAL CARD */
  totalCard: {
    backgroundColor: "#002B5B",
    margin: 15,
    padding: 20,
    borderRadius: 15,
    elevation: 5,
  },

  totalLabel: {
    color: "#C7D3E3",
    fontSize: 14,
  },

  totalValue: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 5,
  },

  /* 🔷 LIST CARD */
  card: {
    backgroundColor: "#fff",
    marginHorizontal: 15,
    marginBottom: 12,
    padding: 15,
    borderRadius: 12,
    elevation: 3,
    borderLeftWidth: 5,
    borderLeftColor: "#002B5B",
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  amount: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#002B5B",
  },

  date: {
    fontSize: 12,
    color: "#666",
  },

  remark: {
    marginTop: 8,
    fontSize: 14,
    color: "#333",
  },

  by: {
    marginTop: 6,
    fontSize: 12,
    color: "#888",
  },
});
