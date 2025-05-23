import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Button,
  FlatList,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type CartItem = {
  id: number;
  title: string;
  price: number;
  quantity: number;
  image: any; // use 'ImageSourcePropType' for stricter typing
};
const initialCart = [
  {
    id: 1,
    title: "Adbiz 24-in-1 Mini Precision Screwdriver Set",
    price: 449,
    quantity: 1,
    image: require("../../assets/images/image.jpeg"),
  },
  {
    id: 2,
    title: "Multifunctional Tool Kit Set",
    price: 799,
    quantity: 2,
    image: require("../../assets/images/image.jpeg"),
  },
];

const CartScreen = () => {
const [cartItems, setCartItems] = useState<CartItem[]>(initialCart);
const [itemToRemove, setItemToRemove] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  

  const handleDecrease = (itemId: number) => {
    const updatedCart = cartItems
      .map((item) => {
        if (item.id === itemId) {
          if (item.quantity === 1) {
            setItemToRemove(itemId);
            setShowModal(true);
          } else {
            return { ...item, quantity: item.quantity - 1 };
          }
        }
        return item;
      })
      .filter(Boolean);
    setCartItems(updatedCart);
  };

  const handleIncrease = (itemId: number) => {
    const updatedCart = cartItems.map((item) =>
      item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item
    );
    setCartItems(updatedCart);
  };

  const handleRemoveItem = () => {
    const updatedCart = cartItems.filter((item) => item.id !== itemToRemove);
    setCartItems(updatedCart);
    setItemToRemove(null);
    setShowModal(false);
  };

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  if (cartItems.length === 0) {
    return (
      <View style={styles.centered}>
        <Text style={styles.emptyText}>Cart Is Empty</Text>
        <Text style={styles.subText}>There is no items currently in cart.</Text>
        <TouchableOpacity style={styles.browseButton} onPress={()=>router.push('/(main)/Product')}>
          <Text style={styles.browseText}>Browse Products</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const renderItem = ({ item }: { item: CartItem }) => (
    <View style={styles.cartItem}>
      <Image source={item.image} style={styles.image} />
      <View style={styles.details}>
        <Text style={styles.title}>{item.title}</Text>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text style={styles.price}>
            ₹ {(item.price * item.quantity).toFixed(2)}
          </Text>
          <View style={styles.quantityContainer}>
            <TouchableOpacity
              onPress={() => handleDecrease(item.id)}
              style={styles.quantityButton}
            >
              <Text style={styles.quantityText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.quantityNumber}>{item.quantity}</Text>
            <TouchableOpacity
              onPress={() => handleIncrease(item.id)}
              style={styles.quantityButton}
            >
              <Text style={styles.quantityText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: 5,
          paddingLeft: 10,
          paddingVertical: 20,
          marginBottom: 16,
        }}
      >
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.header}>Cart</Text>
      </View>
      <FlatList
        data={cartItems}
        showsVerticalScrollIndicator={false}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
      />
      <View
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexDirection: "row",
        }}
      >
        <Text style={styles.totalPrice}>Total: </Text>
        <Text style={styles.totalPrice}> ₹ {totalPrice.toFixed(2)}</Text>
      </View>
      <TouchableOpacity style={styles.checkoutButton} onPress={()=>router.push('/(components)/checkout')}>
        <Text style={styles.checkoutText}>Proceed To Checkout</Text>
      </TouchableOpacity>

      <Modal
        transparent={true}
        visible={showModal}
        animationType="fade"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Remove Item</Text>
            <Text style={styles.modalText}>
              Are you sure you want to delete this Item?
            </Text>
            <View style={styles.modalButtons}>
              <Button title="No" onPress={() => setShowModal(false)} />
              <Button title="Yes" onPress={handleRemoveItem} color="#002B5B" />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
  },
  cartItem: {
    flexDirection: "row",
    marginBottom: 20,
  },
  image: {
    width: 100,
    height: 100,
    resizeMode: "contain",
    borderRadius:16,
  },
  details: {
    flex: 1,
    marginLeft: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
  },
  price: {
    marginTop: 5,
    fontSize: 16,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 16,
  },
  quantityButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  quantityText: {
    fontSize: 16,
  },
  quantityNumber: {
    marginHorizontal: 10,
    fontSize: 16,
  },
  checkoutButton: {
    backgroundColor: "#002B5B",
    padding: 15,
    borderRadius: 14,
    alignItems: "center",
    marginVertical: 20,
  },
  checkoutText: {
    color: "white",
    fontSize: 16,
    fontWeight:'bold'
  },
  totalPrice: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "right",
    marginVertical: 10,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 24,
    fontWeight: "bold",
  },
  subText: {
    marginTop: 10,
    marginBottom: 20,
    fontSize: 14,
  },
  browseButton: {
    backgroundColor: "#002B5B",
    padding: 12,
    borderRadius: 5,
  },
  browseText: {
    color: "white",
    fontSize: 16,
  },
  modalBackground: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    backgroundColor: "white",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  modalText: {
    marginVertical: 10,
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

export default CartScreen;
