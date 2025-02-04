import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ChartSection from "../../components/ChartSection";

export default function Statistics() {
  const [activeTab, setActiveTab] = useState("DAY");

  const tabs = ["DAY", "WEEK", "MON", "ALL"];
  const demoData = [
    { day: "Mon", value: 95 },
    { day: "Tur", value: 99 },
    { day: "Wed", value: 95 },
    { day: "Thu", value: 76 },
    { day: "Fri", value: 72 },
    { day: "Sat", value: 60 },
    { day: "Sun", value: 60 },
  ];

  return (
    <ScrollView style={styles.container}>
      {/* Title */}
      <Text style={styles.title}>Sleep Statistics</Text>

      {/* Tabs */}
      <View style={styles.tabs}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab)}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab && styles.activeTabText,
              ]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Chart Sections */}
      <ChartSection
        title="Sleep Quality (Demo Data)"
        data={demoData}
        barColor="#FF6B6B"
      />
      <ChartSection
        title="Regularity (Demo Data)"
        data={demoData}
        barColor="#F2D8A7"
      />
      <ChartSection
        title="Woke Up (Demo Data)"
        data={demoData}
        barColor="#7C77B9"
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1E213A",
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  title: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 10,
  },
  tabs: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: "#292A2D",
  },
  activeTab: {
    backgroundColor: "#FF6B6B",
  },
  tabText: {
    color: "#fff",
    fontSize: 14,
  },
  activeTabText: {
    fontWeight: "600",
  },
});
