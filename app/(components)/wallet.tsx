import {
  fetchAllWalletData,
  fetchUserData,
  getPackageIngfoForUser,
} from "@/components/utils/api";
import { Feather, Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  Modal,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import ProtectedRoute from "./ProtectedRoute";

const screenHeight = Dimensions.get("window").height;
type PackageInfo = {
  is_approved: string;
  amount: string;
  peradd: number;
  // add other fields you use
};

export default function WalletScreen() {
  const [withdrawModalVisible, setWithdrawModalVisible] = useState(false);
  const [addFundModalVisible, setAddFundModalVisible] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [upiId, setUpiId] = useState("");
  const [withdrawStatus, setWithdrawStatus] = useState("Pending");
  const [wallet, setWallet] = useState<any>(null);
  const [statusData, setStatusData] = useState<any>(null);
  const [referral, setReferral] = useState<any>(null);
  const [statusAmt, setStatusAmt] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);
  const [accountNo, setAccountNo] = useState("");
  const [ifscCode, setIfscCode] = useState("");
  const [loadingWithdraw, setLoadingWithdraw] = useState(false);
  const [packageInfoUser, setPackageInfoUser] = useState<PackageInfo[]>([]);
  const [errorMsg, setErrorMsg] = useState("");
  const today = new Date();
  const isMonday = today.getDay() === 1;

  const handleAmountChange = (text: any) => {
    setWithdrawAmount(text);

    const amount = parseFloat(text);

    if (!amount || isNaN(amount)) {
      setErrorMsg("Please enter a valid amount.");
      return;
    }

    if (amount < 500) {
      setErrorMsg("Minimum withdrawal amount is ₹500.");
      return;
    }

    if (amount > wallet) {
      setErrorMsg(`Insufficient balance. You have only ₹${wallet}`);
      return;
    }

    setErrorMsg("");
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
  const getWallet = async () => {
    try {
      const userData = await AsyncStorage.getItem("userData");
      if (userData) {
        const { reg_id } = JSON.parse(userData);

        const walletData = await fetchAllWalletData(reg_id);
        if (walletData) {
          setWallet(walletData?.total);
          setReferral(walletData?.referral);
          setStatusAmt(walletData?.status_amt);
          setStatusData(walletData?.withdraw_data);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getWallet();
    loadAndFetchUser();
  }, []);

  if (userData?.reg_id) {
    getPackageIngfoForUser(userData.reg_id)
      .then((res) => {
        setPackageInfoUser(res);
      })
      .catch((err) => {
        console.error("Failed to fetch package info", err);
      });
  }

  const resetWithdrawFields = () => {
    setWithdrawAmount("");
    setUpiId("");
    setErrorMsg("");
    setWithdrawStatus("Pending");
    setAccountNo("");
    setIfscCode("");
  };

  const handleWithdraw = async () => {
    if (errorMsg) return; // agar error hai to API call hi mat karo

    setLoadingWithdraw(true);
    try {
      const response = await fetch(
        "https://sarvsetu.trinitycrm.in/admin/Api/registration_api.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            payable_amt: withdrawAmount,
            upi_id: upiId,
            account_no: accountNo,
            ifsc_code: ifscCode,
            type: "withdraw",
            reg_id: userData?.reg_id,
          }),
        }
      );

      const data = await response.json();
      if (data.status === "success") {
        Toast.show({
          type: "success",
          text1: data.message,
          text2: "Withdraw reqest successfully submitted",
          position: "top",
        });

        setWithdrawModalVisible(false);
        resetWithdrawFields();
        getWallet();
        loadAndFetchUser();
      } else {
        Toast.show({
          type: "error",
          text1: data.message,
          text2: "Somthing went wrong",
          position: "top",
        });
      }
    } catch (err) {
      alert("Something went wrong. Please try again later.");
      console.error(err);
    } finally {
      setLoadingWithdraw(false);
    }
  };

  return (
    <ProtectedRoute>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
        <StatusBar backgroundColor="#fff" />
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 5,
            paddingLeft: 10,
            paddingVertical: 20,
            borderBottomWidth: 2,
            borderColor: "#eee",
            backgroundColor: "#fff",
            marginBottom: 15,
          }}
        >
          <TouchableOpacity onPress={() => router.back()}>
            <Feather name="arrow-left" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={{ fontSize: 20, fontWeight: "bold" }}>My Wallet</Text>
        </View>
        <ScrollView contentContainerStyle={styles.container}>
          {/* Wallet Card */}
          <LinearGradient
            colors={["#7A92F0", "#1BAAE3", "#1B49F2"]}
            style={styles.card}
          >
            <Text style={styles.cardTitle}>Total Wallet Balance</Text>
            <Text style={styles.cardAmount}>₹ {wallet}</Text>
          </LinearGradient>

          {/* Earnings */}
          <View style={styles.infoCard}>
            <View style={styles.row}>
              <Text style={styles.label}>🎁 Referral Earning</Text>
              <Text style={styles.value}>
                : {"  "}₹ {referral}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>📊 Status Earning</Text>
              <Text style={styles.value}>
                : {"  "}₹ {statusAmt}
              </Text>
            </View>
          </View>
          <View
            style={{
              backgroundColor: "#E8F0FE",
              borderRadius: 8,
              padding: 10,
              marginVertical: 10,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Ionicons
              name="information-circle-outline"
              size={20}
              color="#1B49F2"
            />
            <Text
              style={{
                color: "#1B49F2",
                fontWeight: "600",
                marginLeft: 8,
                fontSize: 14,
              }}
            >
              Withdraw Request allowed only on Monday And Minimum Withdraw
              Request ₹ 500
            </Text>
          </View>
          {/* Buttons */}
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[
                styles.withdrawButton,
                packageInfoUser?.[0]?.is_approved === "1" &&
                isMonday &&
                wallet >= 500
                  ? {}
                  : { backgroundColor: "#ccc" },
              ]}
              onPress={() => {
                if (
                  packageInfoUser?.[0]?.is_approved === "1" &&
                  isMonday &&
                  wallet >= 500
                ) {
                  setWithdrawModalVisible(true);
                }
              }}
              disabled={packageInfoUser?.[0]?.is_approved !== "1"}
            >
              <Ionicons name="cash-outline" size={20} color="#fff" />
              <Text style={styles.buttonText}>Withdraw</Text>
            </TouchableOpacity>
          </View>

          {statusData?.map((item: any, index: any) => {
            let withdrawStatus = "";
            let statusColor = "";

            if (item.status === "0") {
              withdrawStatus = "Pending";
              statusColor = "#FB8C00"; // Darker Orange
            } else if (item.status === "1") {
              withdrawStatus = "Approved";
              statusColor = "#34A853"; // Green
            } else if (item.status === "2") {
              withdrawStatus = "Rejected";
              statusColor = "#E53935"; // Red
            }

            return (
              <View key={index} style={styles.statusBox}>
                {/* Withdraw Amount */}
                <View style={styles.statusRow}>
                  <Text style={styles.statusLabel}>Withdraw Amount</Text>
                  <Text style={[styles.statusValue, { color: "red" }]}>
                    ₹{item.payable_amt}
                  </Text>
                </View>

                {/* UPI ID */}
                <View style={styles.statusRow}>
                  <Text style={styles.statusLabel}>UPI ID</Text>
                  <Text style={styles.statusValue}>{item.upi_id}</Text>
                </View>

                {/* Account No */}
                <View style={styles.statusRow}>
                  <Text style={styles.statusLabel}>Account No</Text>
                  <Text style={styles.statusValue}>{item.account_no}</Text>
                </View>

                {/* IFSC Code */}
                <View style={styles.statusRow}>
                  <Text style={styles.statusLabel}>IFSC Code</Text>
                  <Text style={styles.statusValue}>{item.ifsc_code}</Text>
                </View>

                {/* Withdraw Status */}
                <View style={styles.statusRow}>
                  <Text style={styles.statusLabel}>Withdraw Status</Text>
                  <Text style={[styles.statusValue, { color: statusColor }]}>
                    {withdrawStatus}
                  </Text>
                </View>
              </View>
            );
          })}

          {/* Withdraw Modal */}
          <Modal
            visible={withdrawModalVisible}
            transparent
            animationType="slide"
            onRequestClose={() => {
              setWithdrawModalVisible(false);
              resetWithdrawFields();
            }}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContainer}>
                <TouchableOpacity
                  style={styles.closeIcon}
                  onPress={() => {
                    setWithdrawModalVisible(false);
                    resetWithdrawFields();
                  }}
                >
                  <Ionicons name="close-circle" size={28} color="#888" />
                </TouchableOpacity>

                <Text style={styles.modalTitle}>Withdraw Funds</Text>

                <Text style={styles.balanceInfo}>
                  Available Balance: ₹ {wallet}
                </Text>

                <TextInput
                  placeholder="Enter Amount"
                  placeholderTextColor="#aaa"
                  keyboardType="numeric"
                  value={withdrawAmount}
                  //onChangeText={setWithdrawAmount}
                  onChangeText={(text) => {
                    handleAmountChange(text);
                  }}
                  style={styles.input}
                />
                {errorMsg ? (
                  <Text style={{ color: "red", marginBottom: 10 }}>
                    {errorMsg}
                  </Text>
                ) : null}
                <TextInput
                  placeholder="Enter UPI ID"
                  placeholderTextColor="#aaa"
                  value={upiId}
                  onChangeText={setUpiId}
                  style={styles.input}
                />
                <TextInput
                  placeholder="Enter Account No"
                  placeholderTextColor="#aaa"
                  value={accountNo}
                  onChangeText={setAccountNo}
                  style={styles.input}
                />
                <TextInput
                  placeholder="Enter IFSC Code"
                  placeholderTextColor="#aaa"
                  value={ifscCode}
                  onChangeText={setIfscCode}
                  style={styles.input}
                />

                <TouchableOpacity
                  style={[
                    styles.confirmButton,
                    (errorMsg || loadingWithdraw) && {
                      backgroundColor: "#ccc",
                    },
                  ]}
                  disabled={!!errorMsg || loadingWithdraw}
                  onPress={handleWithdraw}
                >
                  {loadingWithdraw ? (
                    <Text style={styles.confirmButtonText}>Processing...</Text>
                  ) : (
                    <Text style={styles.confirmButtonText}>
                      Confirm Withdrawal
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </ScrollView>
      </SafeAreaView>
    </ProtectedRoute>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    minHeight: screenHeight,
    paddingHorizontal: 16,
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
  headerContainer: {
    backgroundColor: "#4B65E9",
    padding: 16,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    marginBottom: 20,
  },
  header: {
    fontSize: 22,
    fontWeight: "700",
    color: "#fff",
  },
  card: {
    padding: 35,
    borderRadius: 16,
    marginBottom: 20,
  },
  cardTitle: {
    color: "#fff",
    fontSize: 16,
  },
  cardAmount: {
    fontSize: 32,
    color: "#fff",
    fontWeight: "bold",
    marginTop: 8,
  },
  infoCard: {
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 12,
    marginBottom: 20,
    elevation: 3,
  },
  infoText: {
    fontSize: 16,
    color: "#002B5B",
    marginBottom: 8,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  withdrawButton: {
    backgroundColor: "#34A853",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 12,
    borderRadius: 10,
    flex: 1,
    justifyContent: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  statusBox: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 10,
    flexDirection: "column",
    elevation: 2,
    marginTop: 5,
  },
  statusLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    width: "50%",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "#00000099",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "90%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 20,
    position: "relative",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
    color: "#002B5B",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
    color: "#333",
  },
  confirmButton: {
    backgroundColor: "#002B5B",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  confirmButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  closeIcon: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 1,
  },
  balanceInfo: {
    marginBottom: 8,
    fontSize: 16,
    fontWeight: "600",
    color: "#444",
  },
  uploadButton: {
    backgroundColor: "#4B65E9",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    justifyContent: "center",
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
  },
  uploadText: {
    color: "#fff",
    fontWeight: "600",
  },
  previewImage: {
    width: "100%",
    height: 150,
    resizeMode: "contain",
    borderRadius: 10,
    marginBottom: 12,
  },
  statusRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    flexWrap: "wrap",
  },

  statusValue: {
    fontSize: 14,
    fontWeight: "700",
    width: "50%",
  },
});
