import { Stack, Tabs } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from "react-native";

// Custom Header Component
const AppHeader = () => {
  return (
    <SafeAreaView style={{ backgroundColor: "#282a36" }}>
      <View style={styles.header}>
        {/* Left Icon */}
        <View style={styles.iconContainer}>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="star-outline" size={24} color="#f8f8f2" />
          </TouchableOpacity>
          <Text style={styles.countText}>0</Text>
        </View>

        {/* Title with Emoji */}
        <View style={styles.titleContainer}>
          <Text style={styles.headerTitle}>Happy</Text>
          <Text style={styles.emoji}>☺️</Text>
        </View>

        {/* Right Icon */}
        <View style={styles.iconContainer}>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="moon-outline" size={24} color="#f8f8f2" />
          </TouchableOpacity>
          <Text style={styles.countText}>0</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: "#282a36",
          borderTopWidth: 0,
          height: 70,
          paddingBottom: 10,
          paddingTop: 8,
        },
        tabBarActiveTintColor: "#fff",
        tabBarInactiveTintColor: "#6272a4",
        header: () => <AppHeader />, // Use custom header
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "500",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Activity",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
            name={focused ? "flash" : "flash-outline"}
            color={color}
            size={24}
          />
        ),
      }}
    />
    <Tabs.Screen
      name="statistics"
      options={{
        title: "Statistics",
        tabBarIcon: ({ color, focused }) => (
          <Ionicons
            name={focused ? "stats-chart" : "stats-chart-outline"}
            color={color}
            size={24}
          />
        ),
      }}
    />
    <Tabs.Screen
      name="explore"
      options={{
        title: "Explore",
        tabBarIcon: ({ color, focused }) => (
          <Ionicons
            name={focused ? "add-circle" : "add-circle-outline"}
            color={color}
            size={24}
          />
        ),
      }}
    />
    <Tabs.Screen
      name="profile"
      options={{
        title: "Profile",
        tabBarIcon: ({ color, focused }) => (
          <Ionicons
            name={focused ? "person" : "person-outline"}
            color={color}
            size={24}
          />
        ),
      }}
    />
  </Tabs>
);
}

const styles = StyleSheet.create({
header: {
  height: 70,
  backgroundColor: "#282a36",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  paddingHorizontal: 16,
  borderBottomWidth: 1,
  borderBottomColor: "#44475a",
},
iconContainer: {
  flexDirection: "row",
  alignItems: "center",
},
headerTitle: {
  color: "#f8f8f2",
  fontSize: 18,
  fontWeight: "600",
},
titleContainer: {
  flexDirection: "row",
  alignItems: "center",
  gap: 4,
},
emoji: {
  fontSize: 18,
  color: "#f8f8f2",
},
iconButton: {
  padding: 8,
},
countText: {
  color: "#f8f8f2",
  fontSize: 14,
  marginLeft: 4,
},
});
