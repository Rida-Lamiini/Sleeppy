import { Stack, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient"; // Adjust the path as needed
import services from "../utils/services";

const checkAlarmTime = (wakeUpTime) => {
  if (!wakeUpTime) return false;

  const now = new Date();
  const [hours, minutes] = wakeUpTime.split(":").map(Number);
  const alarmTime = new Date();
  alarmTime.setHours(hours, minutes, 0, 0);

  console.log("Current time:", now);
  console.log("Alarm time:", alarmTime);

  return (
    now.getHours() === alarmTime.getHours() &&
    now.getMinutes() === alarmTime.getMinutes()
  );
};

const fetchActiveSleepPlan = async () => {
  try {
    const userId = await services.getData("userId"); // Replace with your actual user ID fetching logic
    const { data, error } = await supabase
      .from("sleep_plans")
      .select("*")
      .eq("user_id", userId)
      .eq("is_active", true)
      .single();

    if (error) {
      console.error("Error fetching active sleep plan:", error.message);
      setActivePlan(null);
      return;
    }

    if (data) {
      console.log("Fetched sleep plan:", data); // Debug fetched data
      setActivePlan({
        wakeUpTime: data.wake_up_time, // Ensure this value exists in the table
        sleepTime: data.sleep_time,
        selectedDays: data.selected_days,
      });
    } else {
      console.warn("No active sleep plan found.");
      setActivePlan(null);
    }
  } catch (error) {
    console.error("Error fetching active sleep plan:", error.message);
    setActivePlan(null);
  }
};
export default function RootLayout() {
  const router = useRouter();
  const [activePlan, setActivePlan] = useState(null);



  useEffect(() => {
    // Fetch active sleep plan and check user authentication
    fetchActiveSleepPlan();
    checkUserAuth();
  }, []);

  useEffect(() => {
    if (!activePlan || !activePlan.wakeUpTime) return;

    const interval = setInterval(() => {
      if (checkAlarmTime(activePlan.wakeUpTime)) {
        router.push("/AlarmRingScreen");
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [activePlan, router]);

  const checkUserAuth = async () => {
    try {
      const reset = await services.storeData("login", "false");
      const result = await services.getData("login");
      console.log("User authenticated status:", result);
      if (result !== "true") {
        console.log("User not authenticated, redirecting to login");
        router.replace("/FirstScreen");
      }
    } catch (error) {
      console.error("Error checking user authentication:", error.message);
    }
  };

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="FirstScreen" />
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
      <Stack.Screen name="onboardingScreen" />
      <Stack.Screen name="SetupScreen" />
      <Stack.Screen name="AlarmRingScreen" />
    </Stack>
  );
}
