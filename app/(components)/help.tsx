// app/(components)/UniversalVideoPlayer.tsx

import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  Text,
  ActivityIndicator,
  useWindowDimensions,
} from "react-native";
import { WebView } from "react-native-webview";
import { StatusBar } from "react-native";
import { fetchCMSData } from "@/components/utils/api";
import Toast from "react-native-toast-message";
import { Video, ResizeMode } from 'expo-av';
const UniversalVideoPlayer = () => {
  const [loading, setLoading] = useState(false);
  const [Data, setData] = useState<any>(null);

  const url =Data;

  const isYouTubeUrl = (urlString: string) =>
    urlString.includes("youtube.com") || urlString.includes("youtu.be");

  const getEmbedUrl = (urlString: string): string | null => {
    try {
      const videoId = urlString.includes("youtu.be")
        ? urlString.split("youtu.be/")[1]
        : new URL(urlString).searchParams.get("v");

      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}?autoplay=1&controls=1&modestbranding=1&rel=0&playsinline=1`;
      }
    } catch (e) {
      return null;
    }
    return null;
  };

  const parsedUrl = typeof url === "string" ? url : "";

  const youTubeEmbedUrl = getEmbedUrl(parsedUrl);

  const { width } = useWindowDimensions();

  useEffect(() => {
    const loadContent = async () => {
      const result = await fetchCMSData("help");

      if (result.success) {
        // Remove data-* attributes like data-start, data-end etc.
        const cleanHTML = result.data.replace(/ data-[a-zA-Z-]+="[^"]*"/g, "");
        setData(cleanHTML);
      } else {
        Toast.show({ type: "error", text1: result.error });
      }
    };

    loadContent();
  }, []);

 

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />

        {parsedUrl ? (
          isYouTubeUrl(parsedUrl) && youTubeEmbedUrl ? (
            <WebView
              source={{ uri: youTubeEmbedUrl }}
              style={styles.video}
              allowsFullscreenVideo
              javaScriptEnabled
              domStorageEnabled
              startInLoadingState
              renderLoading={() => (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color="#002B5B" />
                </View>
              )}
            />
          ) : (
            <Video
              source={{ uri: parsedUrl }}
              rate={1.0}
              volume={1.0}
              isMuted={false}
              resizeMode={ResizeMode.CONTAIN}
              shouldPlay
              useNativeControls
              style={styles.video}
            />
          )
        ) : (
          <Text style={styles.errorText}>Invalid or missing video URL.</Text>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 30,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#002B5B",
  },
  headerTitle: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "600",
    marginLeft: 10,
  },
  video: {
    flex: 1,
    width: Dimensions.get("window").width,
  },
  errorText: {
    padding: 20,
    color: "red",
    textAlign: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default UniversalVideoPlayer;
