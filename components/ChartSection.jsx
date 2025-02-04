import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const ChartSection = ({ title, data, barColor }) => {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <Ionicons name="chevron-forward" size={18} color="#fff" />
      </View>
      <View
        style={{
          backgroundColor: "#292A2D",
          height: 160,
          borderRadius: 10,
          paddingTop: 10,
        }}
      >
        <View style={styles.chart}>
          {data.map((item, index) => (
            <View key={index} style={styles.chartBarContainer}>
              <View
                style={[
                  styles.chartBar,
                  { height: `${item.value}%`, backgroundColor: barColor },
                ]}
              />
              <Text style={styles.chartLabel}>{item.day}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  chart: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    height: "100%",
    padding: 23,
  },
  chartBarContainer: {
    alignItems: "center",
  },
  chartBar: {
    width: 20,
    borderRadius: 5,
  },
  chartLabel: {
    color: "#fff",
    fontSize: 12,
    marginTop: 5,
  },
});

export default ChartSection;
