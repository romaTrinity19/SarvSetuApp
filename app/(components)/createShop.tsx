// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   Image,
//   ScrollView,
//   TouchableOpacity,
//   Button,
//   StyleSheet,
// } from "react-native";
// import * as ImagePicker from "expo-image-picker";
// import { useRouter } from "expo-router";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { SafeAreaView } from "react-native-safe-area-context";

// const CreateShopScreen = () => {
//   const router = useRouter();

//   const [mainImage, setMainImage] = useState<string | null>(null);
//   const [otherImages, setOtherImages] = useState<string[]>([]);
//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");
//   const [callNumber, setCallNumber] = useState("");
//   const [website, setWebsite] = useState("");
//   const [whatsapp, setWhatsapp] = useState("");

//   const pickMainImage = async () => {
//     const result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       quality: 1,
//     });

//     if (!result.canceled) {
//       setMainImage(result.assets[0].uri);
//     }
//   };

//   const pickOtherImages = async () => {
//     const result = await ImagePicker.launchImageLibraryAsync({
//       allowsMultipleSelection: true,
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       quality: 1,
//       selectionLimit: 5,
//     });

//     if (!result.canceled) {
//       const selectedUris = result.assets.map((asset) => asset.uri);
//       setOtherImages(selectedUris);
//     }
//   };

//   const handleSubmit = async () => {
//     const shopData = {
//       id: Date.now().toString(),
//       name: title,
//       price: 0,
//       originalPrice: 0,
//       image: { uri: mainImage || "" },
//       images: otherImages,
//       phoneNumber: callNumber,
//       website,
//       whatsappNumber: whatsapp,
//     };

//     const existing = await AsyncStorage.getItem("shops");
//     const shops = existing ? JSON.parse(existing) : [];
//     shops.push(shopData);
//     await AsyncStorage.setItem("shops", JSON.stringify(shops));

//     router.push("/(main)/Product");
//   };

//   return (
//     <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
//     <ScrollView style={styles.container}>
//       <Text style={styles.heading}>Create Shop</Text>

//       <Text style={styles.label}>Main Image</Text>
//       <TouchableOpacity onPress={pickMainImage} style={styles.imageButton}>
//         <Text style={styles.imageButtonText}>Pick Main Image</Text>
//       </TouchableOpacity>
//       {mainImage && (
//         <Image source={{ uri: mainImage }} style={styles.mainImage} />
//       )}

//       <Text style={styles.label}>Other Images</Text>
//       <TouchableOpacity onPress={pickOtherImages} style={styles.imageButton}>
//         <Text style={styles.imageButtonText}>Pick Other Images</Text>
//       </TouchableOpacity>
//       <ScrollView horizontal showsHorizontalScrollIndicator={false}>
//         {otherImages.map((uri, index) => (
//           <Image key={index} source={{ uri }} style={styles.otherImage} />
//         ))}
//       </ScrollView>

//       <Text style={styles.label}>Shop Title</Text>
//       <TextInput
//         value={title}
//         onChangeText={setTitle}
//         style={styles.input}
//         placeholder="Enter shop title"
//       />

//       <Text style={styles.label}>Description</Text>
//       <TextInput
//         value={description}
//         onChangeText={setDescription}
//         style={[styles.input, { height: 80 }]}
//         placeholder="Write a short description"
//         multiline
//       />

//       <Text style={styles.label}>Call Number</Text>
//       <TextInput
//         value={callNumber}
//         onChangeText={setCallNumber}
//         keyboardType="phone-pad"
//         style={styles.input}
//         placeholder="Enter contact number"
//       />

//       <Text style={styles.label}>Website</Text>
//       <TextInput
//         value={website}
//         onChangeText={setWebsite}
//         style={styles.input}
//         placeholder="https://example.com"
//       />

//       <Text style={styles.label}>WhatsApp Contact</Text>
//       <TextInput
//         value={whatsapp}
//         onChangeText={setWhatsapp}
//         keyboardType="phone-pad"
//         style={styles.input}
//         placeholder="Enter WhatsApp number"
//       />

//       <TouchableOpacity onPress={handleSubmit} style={styles.button}>
//         <Text style={styles.buttonText}>Create Shop</Text>
//       </TouchableOpacity>
//     </ScrollView>
//      </SafeAreaView>
//   );
// };

// const PRIMARY = "#002B5B";

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: "#fff",
//   },
//   heading: {
//     fontSize: 24,
//     fontWeight: "bold",
//     color: PRIMARY,
//     marginBottom: 20,
//   },
//   label: {
//     fontSize: 16,
//     fontWeight: "500",
//     marginTop: 12,
//     marginBottom: 4,
//     color: PRIMARY,
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: "#ccc",
//     borderRadius: 8,
//     padding: 10,
//     backgroundColor: "#f9f9f9",
//   },
//   imageButton: {
//     backgroundColor: PRIMARY,
//     padding: 10,
//     borderRadius: 6,
//     alignItems: "center",
//     marginBottom: 10,
//   },
//   imageButtonText: {
//     color: "#fff",
//     fontWeight: "600",
//   },
//   mainImage: {
//     width: "100%",
//     height: 180,
//     borderRadius: 10,
//     marginBottom: 10,
//   },
//   otherImage: {
//     width: 80,
//     height: 80,
//     borderRadius: 8,
//     marginRight: 10,
//   },
//   button: {
//     backgroundColor: PRIMARY,
//     padding: 15,
//     borderRadius: 8,
//     marginTop: 25,
//     alignItems: "center",
//     marginBottom:100
//   },
//   buttonText: {
//     color: "#fff",
//     fontSize: 16,
//     fontWeight: "600",
//   },
// });

// export default CreateShopScreen;

import { fetchUserData } from "@/components/utils/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

const SimpleFormScreen = () => {
  const [image, setImage] = useState<string | null>(null);
  const [payout, setPayout] = useState("");
  const [validUpto, setValidUpto] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
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

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleDateChange = (_: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === "ios"); // keep picker open on iOS
    if (selectedDate) {
      setValidUpto(selectedDate);
    }
  };

  const handleSubmit = async () => {
    if (!image || !payout || !validUpto) {
      Toast.show({
        type: "error",
        text1: "Incomplete Form",
        text2: "Please fill all fields and upload an image.",
      });
      return;
    }

    try {
      const fileInfo = await FileSystem.getInfoAsync(image);
      if (!fileInfo.exists) {
        Toast.show({
          type: "error",
          text1: "File Error",
          text2: "Selected image file does not exist.",
        });
        return;
      }
      const filename = image.split("/").pop();

      const formData = new FormData();
      formData.append("payamt", payout);
      formData.append("valid_upto", validUpto.toISOString().split("T")[0]);
      formData.append("type", "saveadd");
      formData.append("reg_id", userData?.reg_id.toString());
      formData.append("image", {
        uri: image,
        name: filename || "ad_image.jpg",
        type: "image/jpeg",
      } as any);

      // Optional: If you need to send user ID or token
      // formData.append("vendor_id", userData?.reg_id);

      const response = await fetch(
        "https://sarvsetu.trinitycrm.in/admin/Api/package_api.php", // 🔁 Replace with your actual endpoint
        {
          method: "POST",
          headers: {
            Accept: "application/json",
          },
          body: formData,
        }
      );
     

      const text = await response.text();
      const result = JSON.parse(text);
     

      if (response.ok && result.status === "success") {
        Toast.show({
          type: "success",
          text1: "Ad Created",
          text2: "Your ad has been submitted successfully.",
        });
        router.replace("/(components)/vendorAdsData");
      } else {
        Toast.show({
          type: "error",
          text1: "Server Error",
          text2: result?.message || "Failed to create ad.",
        });
      }
    } catch (error) {
      console.error("Ad creation error:", error);
      Toast.show({
        type: "error",
        text1: "Network Error",
        text2: "Unable to submit ad. Please try again.",
      });
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView style={styles.container}>
        <Text style={styles.heading}>Create Ads</Text>

        <Text style={styles.label}>Image</Text>
        <TouchableOpacity onPress={pickImage} style={styles.imageButton}>
          <Text style={styles.imageButtonText}>Pick Image</Text>
        </TouchableOpacity>
        {image && <Image source={{ uri: image }} style={styles.mainImage} />}

        <Text style={styles.label}>Payout</Text>
        <TextInput
          value={payout}
          onChangeText={setPayout}
          style={styles.input}
          placeholder="Enter payout amount"
          keyboardType="numeric"
        />

        <Text style={styles.label}>Valid Up To</Text>
        <TouchableOpacity
          onPress={() => setShowDatePicker(true)}
          style={styles.input}
        >
          <Text>{validUpto.toISOString().split("T")[0]}</Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={validUpto}
            mode="date"
            display="default"
            onChange={handleDateChange}
            minimumDate={new Date()}
          />
        )}

        <TouchableOpacity onPress={handleSubmit} style={styles.button}>
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const PRIMARY = "#002B5B";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    color: PRIMARY,
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    marginTop: 12,
    marginBottom: 4,
    color: PRIMARY,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    backgroundColor: "#f9f9f9",
  },
  imageButton: {
    backgroundColor: PRIMARY,
    padding: 10,
    borderRadius: 6,
    alignItems: "center",
    marginBottom: 10,
  },
  imageButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  mainImage: {
    width: "100%",
    height: 180,
    borderRadius: 10,
    marginBottom: 10,
  },
  button: {
    backgroundColor: PRIMARY,
    padding: 15,
    borderRadius: 8,
    marginTop: 25,
    alignItems: "center",
    marginBottom: 100,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default SimpleFormScreen;
