import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function MyOrdersPage() {
  const router = useRouter();

  const handleBrowse = () => {
    router.push('/(main)/Product'); // adjust route as needed
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back-outline" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Order</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>No Orders Found</Text>
        <Text style={styles.subtitle}>
          You haven't placed any orders yet. Start shopping and come back here to view your orders.
        </Text>
        <TouchableOpacity style={styles.button} onPress={handleBrowse}>
          <Text style={styles.buttonText}>Browse Products</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingTop: 40,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop:10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 10,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 10,
  },
  subtitle: {
    textAlign: 'center',
    fontSize:16,
    color: '#555',
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#001F54',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
  },
});
