import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";

import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

export default function TabLayout() {
	const colorScheme = useColorScheme();

	return (
		<Tabs
			screenOptions={{
				tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
				headerShown: false,
				tabBarButton: HapticTab,
				tabBarStyle: {
					paddingBottom: Platform.OS === "ios" ? 20 : 10,
					paddingTop: 10,
					height: Platform.OS === "ios" ? 90 : 70
				},
				tabBarLabelStyle: {
					fontSize: 10,
					marginTop: 0
				}
			}}>
			<Tabs.Screen
				name="index"
				options={{
					title: "首页",
					tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />
				}}
			/>
			<Tabs.Screen
				name="calendar"
				options={{
					title: "日历",
					tabBarIcon: ({ color }) => <IconSymbol size={28} name="calendar" color={color} />
				}}
			/>
			<Tabs.Screen
				name="calculator"
				options={{
					title: "计算器",
					tabBarIcon: ({ color }) => <IconSymbol size={28} name="plus.forwardslash.minus" color={color} />
				}}
			/>
			<Tabs.Screen
				name="server-time"
				options={{
					title: "服务器时间",
					tabBarIcon: ({ color }) => <IconSymbol size={28} name="clock.fill" color={color} />
				}}
			/>
		</Tabs>
	);
}
