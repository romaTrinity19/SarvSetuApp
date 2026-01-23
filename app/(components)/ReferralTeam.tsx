import { getReferralTeam } from "@/components/utils/api";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ProtectedRoute from "../(components)/ProtectedRoute";
/* ================= TYPES ================= */

type GrandChild = {
  reg_id: number;
  name: string;
  contact_no: string;
};

type ReferralUser = {
  reg_id: number;
  name: string;
  contact_no: string;
  children: GrandChild[];
};

type ReferralApiResponse = {
  status: string;
  team: ReferralUser[];
  summary: {
    direct_referrals: number;
    indirect_referrals: number;
    total_team: number;
  };
};

/* ================= COMPONENT ================= */

const ReferralTeam = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [teamData, setTeamData] = useState<ReferralUser[]>([]);
  const [summary, setSummary] = useState<ReferralApiResponse["summary"] | null>(
    null,
  );

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    try {
      const storedUser = await AsyncStorage.getItem("userData");
      if (!storedUser) return;

      const parsedUser = JSON.parse(storedUser);
      const regId = parsedUser?.reg_id;

      if (!regId) return;

      const res: ReferralApiResponse = await getReferralTeam(regId);

      if (res.status === "success") {
        setTeamData(res.team);
        setSummary(res.summary);
      }
    } catch (error) {
      console.error("Referral team error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return <ActivityIndicator size="large" style={{ marginTop: 40 }} />;

  /* ================= RENDERERS ================= */

  const renderGrandChild = (child: GrandChild) => (
    <View key={child.reg_id} style={styles.grandChildRow}>
      <View style={styles.verticalLine} />
      <View style={styles.grandChildCard}>
        <Text style={styles.grandChildName}>{child.name}</Text>
        <Text style={styles.grandChildMobile}>{child.contact_no}</Text>
      </View>
    </View>
  );

  const renderItem = ({ item }: { item: ReferralUser }) => (
    <View style={styles.parentContainer}>
      {/* CHILD */}
      <View style={styles.card}>
        <View style={{ flex: 1 }}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.mobile}>{item.contact_no}</Text>
        </View>

        <View style={[styles.badge, styles.directBadge]}>
          <Text style={styles.badgeText}>Child</Text>
        </View>
      </View>

      {/* GRAND CHILDREN */}
      {item.children.length > 0 && (
        <View style={styles.childrenWrapper}>
          {item.children.map(renderGrandChild)}
        </View>
      )}
    </View>
  );

  /* ================= UI ================= */

  return (
    <ProtectedRoute>
      <SafeAreaView style={styles.container} edges={["top"]}>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
        <View style={styles.headerContainer}>
          <TouchableOpacity
            onPress={() => {
              if (navigation.canGoBack()) {
                navigation.goBack();
              } else {
                router.push("/(main)/Home");
              }
            }}
          >
            <Ionicons name="arrow-back" color="#000" size={24} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Referral Team</Text>
        </View>

        {summary && (
          <View style={styles.summaryCard}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Direct</Text>
              <Text style={styles.summaryValue}>
                {summary.direct_referrals}
              </Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Indirect</Text>
              <Text style={styles.summaryValue}>
                {summary.indirect_referrals}
              </Text>
            </View>
          </View>
        )}

        <FlatList
          data={teamData}
          keyExtractor={(item) => item.reg_id.toString()}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
        />
      </SafeAreaView>
    </ProtectedRoute>
  );
};

export default ReferralTeam;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 14,
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 12,
  },

  parentContainer: {
    marginBottom: 14,
  },

  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F2F6FF",
    borderRadius: 12,
    padding: 14,
    elevation: 2,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
  },
  mobile: {
    fontSize: 13,
    color: "#555",
    marginTop: 2,
  },

  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  directBadge: {
    backgroundColor: "#002855",
  },
  badgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },

  /* GRAND CHILD TREE */
  childrenWrapper: {
    marginLeft: 18,
    marginTop: 6,
  },
  grandChildRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  verticalLine: {
    width: 2,
    height: "100%",
    backgroundColor: "#CBD5E1",
    marginRight: 10,
  },
  grandChildCard: {
    flex: 1,
    backgroundColor: "#FFF7ED",
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
  },
  grandChildName: {
    fontSize: 14,
    fontWeight: "600",
  },
  grandChildMobile: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
  summaryCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#EEF2FF",
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 20,
    marginBottom: 14,
    elevation: 2,
  },

  summaryItem: {
    alignItems: "center",
    flex: 1,
  },

  summaryLabel: {
    fontSize: 13,
    color: "#475569",
    marginBottom: 4,
  },

  summaryValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1E293B",
  },

  divider: {
    width: 1,
    height: "100%",
    backgroundColor: "#CBD5E1",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 15,
    backgroundColor: "#fff",

    zIndex: 100,
  },
  headerTitle: {
    color: "#000",
    fontSize: 20,
    fontWeight: 600,
    flex: 1,
    marginHorizontal: 12,
  },
});
