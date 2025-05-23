import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function OrderDetailsScreen() {
  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Ionicons name="arrow-back" size={22} onPress={()=>router.back()}/>
        <Text style={styles.orderId}>#100001071</Text>
      </View>

      {/* Order Status Progress */}
      <View style={styles.progressContainer}>
        {['Ordered', 'Packed', 'In Transit', 'Delivered'].map((step, index) => (
          <View key={index} style={styles.step}>
            <FontAwesome5
              name={
                step === 'Ordered'
                  ? 'clipboard-list'
                  : step === 'Packed'
                  ? 'box'
                  : step === 'In Transit'
                  ? 'truck'
                  : 'home'
              }
              size={20}
              color={step === 'Ordered' ? '#007bff' : '#ccc'}
            />
            <Text style={[styles.stepLabel, step === 'Ordered' && styles.stepLabelActive]}>{step}</Text>
          </View>
        ))}
      </View>

      {/* Order Summary */}
      <Text style={styles.sectionTitle}>Order Summary</Text>

      {/* Item 1 */}
      <View style={styles.itemContainer}>
        <Image
          source={require('../../assets/images/image.jpeg')}
          style={styles.itemImage}
        />
        <View style={styles.itemInfo}>
          <Text style={styles.itemTitle}>Adbiz Unisex Facial Hair Remover – 30-Min</Text>
          <Text style={styles.priceRow}>₹ 499.00 <Text style={styles.oldPrice}>₹ 799.00</Text></Text>
          <Text style={styles.qty}>Qty: 1</Text>
        </View>
      </View>

      {/* Item 2 */}
      <View style={styles.itemContainer}>
        <Image
            source={require('../../assets/images/image.jpeg')}
          style={styles.itemImage}
        />
        <View style={styles.itemInfo}>
          <Text style={styles.itemTitle}>Adbiz 24-in-1 Mini Precision Screwdriver</Text>
          <Text style={styles.priceRow}>₹ 449.00 <Text style={styles.oldPrice}>₹ 599.00</Text></Text>
          <Text style={styles.qty}>Qty: 2</Text>
        </View>
      </View>

      {/* Shipping Address */}
      <Text style={styles.sectionTitle}>Shipping Address</Text>
      <View style={styles.infoBox}>
        <Text style={styles.bold}>roma Chakradhari</Text>
        <Text>vtv, rfr, Devbhog, Gariaband, Chhattisgarh, India - 493992</Text>
        <Text>+91 7999559862</Text>
      </View>

      {/* Payment Summary */}
      <Text style={styles.sectionTitle}>Payment Summary</Text>
      <View style={styles.infoBox}>
        <Text style={styles.row}><Text style={styles.label}>Transaction ID</Text> 86000223</Text>
        <Text style={styles.row}><Text style={styles.label}>Reference Id</Text> 86237741</Text>
        <Text style={styles.row}><Text style={styles.label}>Payment Method</Text> Cash on Delivery</Text>
        <Text style={styles.row}><Text style={styles.label}>Shipping Cost</Text> Free</Text>
        <Text style={styles.row}><Text style={[styles.label, styles.totalLabel]}>Total</Text> ₹ 1397.00</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    paddingVertical:40
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  orderId: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 24,
    marginTop: 10,
  },
  step: {
    alignItems: 'center',
  },
  stepLabel: {
    fontSize: 12,
    color: '#ccc',
    marginTop: 4,
  },
  stepLabelActive: {
    color: '#007bff',
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  itemContainer: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  itemInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  priceRow: {
    fontSize: 14,
    marginTop: 4,
  },
  oldPrice: {
    textDecorationLine: 'line-through',
    color: '#999',
    fontSize: 12,
    marginLeft: 4,
  },
  qty: {
    fontSize: 13,
    marginTop: 2,
    color: '#555',
  },
  infoBox: {
    backgroundColor: '#f9f9f9',
    borderRadius: 6,
    padding: 12,
    marginBottom: 16,
  },
  bold: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  row: {
    marginTop: 4,
    fontSize: 14,
  },
  label: {
    fontWeight: '600',
    marginRight: 4,
  },
  totalLabel: {
    fontSize: 15,
  },
});
