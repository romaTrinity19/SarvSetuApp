import { fetchCMSData } from "@/components/utils/api";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import RenderHtml from "react-native-render-html";

const AboutUsScreen = ({}) => {
  const [loading, setLoading] = useState(false);
  const [aboutUSData, setAboutUSData] = useState<any>(null);

  const { width } = useWindowDimensions();

  useEffect(() => {
    const loadContent = async () => {
      setLoading(true); // Start loading

      const result = await fetchCMSData("about_us");

      if (result.success) {
        const cleanHTML = result.data.replace(/ data-[a-zA-Z-]+="[^"]*"/g, "");
        setAboutUSData(cleanHTML);
      } else {
        Toast.show({ type: "error", text1: result.error });
      }

      setLoading(false); 
    };

    loadContent();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.container}>
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
          }}
        >
          <TouchableOpacity onPress={() => router.back()}>
            <Feather name="arrow-left" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.header}>About Us</Text>
        </View>

        <ScrollView
          style={styles.container2}
          contentContainerStyle={{ paddingBottom: 40 }}
        >
          {aboutUSData ? (
            <RenderHtml
              contentWidth={width}
              source={{ html: aboutUSData }}
              tagsStyles={{
                h2: { fontSize: 20, fontWeight: "bold", marginBottom: 10  },
                h3: { fontSize: 18, fontWeight: "600", marginBottom: 6 },
                p: { fontSize: 14, lineHeight: 22, marginBottom: 8 , textAlign: "justify",},
                li: { marginBottom: 6, textAlign: "justify", },
              }}
            />
          ) : (
           <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
              <ActivityIndicator size="large" color="#007AFF" />
            </View>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    paddingTop: 10,
    paddingBottom: 50,
  },
  container2: {
    backgroundColor: "#fff",
    padding: 18,
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
  },
});

export default AboutUsScreen;
