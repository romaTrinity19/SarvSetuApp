import { useColorScheme } from "@/hooks/useColorScheme";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function MainLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={({ route }: { route: { name: string } }) => ({
        headerShown: false,
        tabBarActiveTintColor: "#002B5B",
        tabBarInactiveTintColor: "gray",
        tabBarIcon: ({
          focused,
          color,
          size,
        }: {
          focused: boolean;
          color: string;
          size: number;
        }) => {
          let iconName: keyof typeof Ionicons.glyphMap = "home";

          switch (route.name) {
            case "Home":
              iconName = focused ? "home" : "home-outline";
              break;
            case "Product":
              iconName = focused ? "grid" : "grid-outline";
              break;
            case "Account":
              iconName = focused ? "person" : "person-outline";
              break;
            case "Referral":
              iconName = focused ? "gift" : "gift-outline";
              break;
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tabs.Screen name="Home" />
      <Tabs.Screen name="Product"  options={{ tabBarLabel: "Shop & Services" }}/>
      <Tabs.Screen name="Account" />
      <Tabs.Screen name="Referral" />
      
    </Tabs>
  );
}
