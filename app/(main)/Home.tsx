import Feather from "@expo/vector-icons/Feather";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Asset } from "expo-asset";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import * as Sharing from "expo-sharing";
import React, { useEffect, useState } from "react";
import {
  Image,
  Modal,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const adsData = [
  {
    id: 1,
    image:
      "https://images.pexels.com/photos/674010/pexels-photo-674010.jpeg?cs=srgb&dl=pexels-anjana-c-169994-674010.jpg&fm=jpg",
    payout: 12.0,
    subscription: true,
  },
  {
    id: 2,
    image: require("../../assets/images/image.jpeg"),
    payout: 12.0,
    subscription: false,
  },
  {
    id: 3,
    image: require("../../assets/images/adbisImage.webp"),
    payout: 12.0,
    subscription: true,
  },
  {
    id: 4,
    image: require("../../assets/images/headphone.webp"),
    payout: 12.0,
    subscription: false,
  },
];

type AdCardProps = {
  imageSrc: any;
  payout: number;
  subscription: boolean;
};

const AdCard: React.FC<AdCardProps> = ({ imageSrc, payout, subscription }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [uploadDisabled, setUploadDisabled] = useState(false);
  const [userData, setUserData] = useState<any>(null);
const [fullscreenVisible, setFullscreenVisible] = useState(false);

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

  const pickAndUploadImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      setUploadDisabled(true);
      // Do your upload logic here if needed
      console.log("Image uploaded:", result.assets[0].uri);
    }
  };

  const getUserData = async () => {
    const userDataString = await AsyncStorage.getItem("userData");
    if (userDataString) {
      const userData = JSON.parse(userDataString);
      console.log("Stored User Data:", userData);
      setUserData(userData);
    }
  };
  useEffect(() => {
    getUserData();
  }, []);

  return (
    <View style={styles.card}>
      <View style={styles.payoutBadge}>
        <Text style={styles.payoutText}>Payout: ₹{payout.toFixed(2)}</Text>
      </View>
      <TouchableOpacity onPress={() => setFullscreenVisible(true)}>
        <Image
          source={typeof imageSrc === "string" ? { uri: imageSrc } : imageSrc}
          style={styles.image}
          resizeMode="cover"
        />
      </TouchableOpacity>

      <View style={styles.buttonGroup}>
        <TouchableOpacity
          style={styles.statusButton}
          onPress={() => {
            if (subscription) {
              shareImageOnWhatsApp();
            } else {
              setModalVisible(true);
            }
          }}
        >
          <Text style={styles.buttonText}>Status</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.uploadButton,
            uploadDisabled && { backgroundColor: "gray" },
          ]}
          onPress={() => {
            if (subscription && !uploadDisabled) {
              //pickAndUploadImage();
              router.push("/(components)/uploadImage");
            } else if (!subscription) {
              setModalVisible(true);
            }
          }}
          disabled={uploadDisabled}
        >
          <Feather name="upload" size={20} color="white" style={styles.icon} />
          <Text style={styles.buttonText}>Upload</Text>
        </TouchableOpacity>
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

       {/* 🔍 Fullscreen Image Modal */}
      <Modal
        visible={fullscreenVisible}
        transparent={true}
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

const Header = () => {
  const [userData, setUserData] = useState<any>(null);
  const name = userData?.firstName;
  console.log("nameww", name);
  const initial = name?.charAt(0).toUpperCase();
  const getUserData = async () => {
    const userDataString = await AsyncStorage.getItem("userData");
    if (userDataString) {
      const userData = JSON.parse(userDataString);
      console.log("Stored User Data:", userData);
      setUserData(userData);
    }
  };
  useEffect(() => {
    getUserData();
  }, []);
  return (
    <View style={styles.headerContainer}>
      <View style={styles.initialCircle}>
        <Text style={styles.initialText}>{initial}</Text>
      </View>
      <View style={styles.headerTextContainer}>
        <Text style={styles.profileName}>
          {name} {userData?.lastName}
        </Text>
      </View>
    </View>
  );
};

const App = () => {
  return (
     <SafeAreaView style={{ flex: 1, backgroundColor: "#fff"}}  edges={['top']}>  
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
    <View style={{ flex: 1  }}>
      <Header />
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingTop: 8 }}
      >
        {adsData.map((ad) => (
          <AdCard
            key={ad.id}
            imageSrc={ad.image}
            payout={ad.payout}
            subscription={ad.subscription}
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
    paddingTop: 20,
    paddingBottom: 12,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    zIndex: 100,
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
    justifyContent: "space-around",
    padding: 10,
  },
  statusButton: {
    flex: 1,
    margin: 5,
    paddingVertical: 10,
    flexDirection: "row",
    backgroundColor: "#25D366",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  uploadButton: {
    flex: 1,
    margin: 5,
    paddingVertical: 10,
    flexDirection: "row",
    backgroundColor: "#002B5B",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  icon: {
    marginRight: 8,
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

});

export default App;
