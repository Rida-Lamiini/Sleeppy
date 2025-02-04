import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { supabase } from "../../utils/supabaseClient";
import { useRouter } from "expo-router";

export default function Activity() {
  const router = useRouter();
  const [userName, setUserName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [activePlan, setActivePlan] = useState(null);
  const [days, setDays] = useState([
    { day: "L", active: true },
    { day: "M", active: true },
    { day: "M", active: true },
    { day: "J", active: true },
    { day: "V", active: true },
    { day: "S", active: false },
    { day: "D", active: false },
  ]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError || !session) {
          throw new Error("No active session. Please log in again.");
        }

        const userId = session.user.id;
        const { data: userData, error: userError } = await supabase
          .from("user_profiles")
          .select("name")
          .eq("user_id", userId)
          .single();

        if (userError || !userData) {
          throw new Error("Unable to fetch user name. Please try again.");
        }

        setUserName(userData.name);
        await fetchActiveSleepPlan(userId);
      } catch (error) {
        console.error("Error fetching user data:", error.message);
        Alert.alert("Error", error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const fetchActiveSleepPlan = async (userId) => {
    try {
      const { data, error } = await supabase
        .from("sleep_plans")
        .select("wake_up_time, sleep_time, selected_days")
        .eq("user_id", userId)
        .eq("is_active", true)
        .single();

      if (error) throw new Error("Could not fetch active sleep plan.");
      if (data) {
        setActivePlan(data);
        // Update days based on selected_days from the active plan
        const updatedDays = days.map((day, index) => ({
          ...day,
          active: data.selected_days.includes(day.day),
        }));
        setDays(updatedDays);
      }
    } catch (error) {
      console.error("Error fetching active sleep plan:", error.message);
      Alert.alert("Error", error.message);
    }
  };

  useEffect(() => {
    if (activePlan?.wake_up_time) {
      const checkWakeupTime = setInterval(() => {
        const currentTime = new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        });

        if (currentTime === activePlan.wake_up_time) {
          router.push("/AlarmRingScreen");
        }
      }, 10000); // Check every 10 seconds
      return () => clearInterval(checkWakeupTime);
    }
  }, [activePlan]);

  const toggleDay = (index) => {
    setDays((prevDays) =>
      prevDays.map((day, i) =>
        i === index ? { ...day, active: !day.active } : day
      )
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#ff6b6b" />
      </SafeAreaView>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Greeting Section */}
      <View style={styles.greetingContainer}>
        <Text style={styles.greetingText}>
          Good Evening, {userName || "User"}!
        </Text>
        <View style={styles.progressContainer}>
          <View style={styles.circularProgress}>
            <Text style={styles.progressText}>70%</Text>
            <Text style={styles.progressLabel}>Sleep Quality</Text>
          </View>
          <View style={styles.startSection}>
            <Text style={styles.startInstruction}>
              Wake-up:{" "}
              <Text style={styles.timeText}>
                {activePlan?.wake_up_time || "N/A"}
              </Text>
            </Text>
            <Text style={styles.startInstruction}>
              Bedtime:{" "}
              <Text style={styles.timeText}>
                {activePlan?.sleep_time || "N/A"}
              </Text>
            </Text>
            <TouchableOpacity
              style={styles.startButton}
              onPress={() => router.push("/SetupScreen")}
            >
              <Text style={styles.startText}>START</Text>
              <Ionicons name="alarm-outline" size={18} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.scheduleContainer}>
          <Text style={styles.scheduleText}>My timetable</Text>
          <Text style={styles.daysText}>
            {days.filter((day) => day.active).length} days active
          </Text>
        </View>
        <View style={styles.daysRow}>
          {days.map((day, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.dayButton, day.active && styles.activeDay]}
              onPress={() => toggleDay(index)}
            >
              <Text style={styles.dayText}>{day.day}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Recently Listened Section */}
      <View style={styles.cardContainer}>
        <View style={styles.card}>
          <Image
            source={require("../../assets/images/home1.png")}
            style={styles.cardImage}
          />
          <View style={styles.cardContent}>
            <Text style={[styles.cardTitle, { color: "#F2D8A7" }]}>
              Guided sleep meditation
            </Text>
            <TouchableOpacity style={styles.listenButton}>
              <Text style={styles.listenButtonText}>LISTEN</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Reading Section */}
        <View style={styles.card}>
          <Image
            source={require("../../assets/images/home2.png")}
            style={styles.cardImage}
          />
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>The Fundamentals Of Good Sleep</Text>
            <TouchableOpacity style={styles.readButton}>
              <Text style={styles.readButtonText}>READ</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1e213a",
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  greetingContainer: {
    marginBottom: 20,
  },
  greetingText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 10,
  },
  progressContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  circularProgress: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 6,
    borderColor: "#F2D8A7",
    alignItems: "center",
    justifyContent: "center",
  },
  progressText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  progressLabel: {
    color: "#fff",
    fontSize: 12,
    marginTop: 5,
  },
  timeText: {
    color: "#F2D8A7",
    fontWeight: "700",
  },
  startSection: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    marginHorizontal: 10,
  },
  startInstruction: {
    color: "#fff",
    fontSize: 14,
    marginBottom: 8,
    textAlign: "center",
    lineHeight: 20,
  },
  startButton: {
    backgroundColor: "#ff6b6b",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  startText: {
    color: "#fff",
    fontSize: 14,
    marginRight: 8,
  },
  scheduleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  scheduleText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
  daysText: {
    color: "#fff",
    fontSize: 12,
  },
  daysRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  dayButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#292a2d",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 4,
  },
  activeDay: {
    backgroundColor: "#ff6b6b",
    borderWidth: 2,
    borderColor: "#F2D8A7",
  },
  dayText: {
    color: "#fff",
    fontSize: 14,
  },
  cardContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  card: {
    width: "48%",
    backgroundColor: "#292a2d",
    borderRadius: 10,
    overflow: "hidden",
    marginVertical: 20,
  },
  cardImage: {
    width: "100%",
    height: 300,
    resizeMode: "cover",
  },
  cardContent: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 10,
  },
  cardTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
  },
  listenButton: {
    backgroundColor: "#ff6b6b",
    paddingVertical: 8,
    alignItems: "center",
    borderRadius: 5,
    marginVertical: 10,
  },
  listenButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "500",
    padding: 3,
  },
  readButton: {
    backgroundColor: "transparent",
    paddingVertical: 8,
    alignItems: "center",
    borderRadius: 5,
    borderWidth: 2,
    borderColor: "#fff",
    marginVertical: 10,
  },
  readButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "500",
    padding: 3,
  },
});