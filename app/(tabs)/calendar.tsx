import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import React, { useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity } from "react-native";

interface CalendarDay {
	date: number;
	isCurrentMonth: boolean;
	isToday: boolean;
	isSelected: boolean;
}

export default function CalendarScreen() {
	const [selectedDate, setSelectedDate] = useState<Date>(new Date());
	const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

	const getDaysInMonth = (date: Date): number => {
		return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
	};

	const getFirstDayOfMonth = (date: Date): number => {
		return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
	};

	const getLastDayOfPreviousMonth = (date: Date): number => {
		return new Date(date.getFullYear(), date.getMonth(), 0).getDate();
	};

	const generateCalendarDays = (): CalendarDay[] => {
		const daysInMonth = getDaysInMonth(currentMonth);
		const firstDay = getFirstDayOfMonth(currentMonth);
		const lastDayOfPrevMonth = getLastDayOfPreviousMonth(currentMonth);
		const days: CalendarDay[] = [];

		// 添加上个月的末尾几天
		for (let i = firstDay - 1; i >= 0; i--) {
			days.push({
				date: lastDayOfPrevMonth - i,
				isCurrentMonth: false,
				isToday: false,
				isSelected: false
			});
		}

		// 添加当前月的所有天
		for (let day = 1; day <= daysInMonth; day++) {
			const isToday = day === new Date().getDate() && currentMonth.getMonth() === new Date().getMonth() && currentMonth.getFullYear() === new Date().getFullYear();

			const isSelected = day === selectedDate.getDate() && currentMonth.getMonth() === selectedDate.getMonth() && currentMonth.getFullYear() === selectedDate.getFullYear();

			days.push({
				date: day,
				isCurrentMonth: true,
				isToday,
				isSelected
			});
		}

		// 添加下个月的开头几天，填满6行
		const remainingDays = 42 - days.length;
		for (let day = 1; day <= remainingDays; day++) {
			days.push({
				date: day,
				isCurrentMonth: false,
				isToday: false,
				isSelected: false
			});
		}

		return days;
	};

	const formatSelectedDate = (date: Date): string => {
		const month = String(date.getMonth() + 1).padStart(2, "0");
		const day = String(date.getDate()).padStart(2, "0");
		const year = date.getFullYear();
		const weekdays = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
		const weekday = weekdays[date.getDay()];

		return `${month}/${day}/${year} ${weekday}`;
	};

	const navigateMonth = (direction: "prev" | "next") => {
		const newMonth = new Date(currentMonth);
		if (direction === "prev") {
			newMonth.setMonth(newMonth.getMonth() - 1);
		} else {
			newMonth.setMonth(newMonth.getMonth() + 1);
		}
		setCurrentMonth(newMonth);
	};

	const selectDate = (day: number) => {
		const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
		setSelectedDate(newDate);
	};

	const weekdays = ["日", "一", "二", "三", "四", "五", "六"];
	const calendarDays = generateCalendarDays();

	return (
		<ThemedView style={styles.container}>
			<ScrollView contentContainerStyle={styles.scrollContent}>
				{/* 顶部日期显示 */}
				<ThemedView style={styles.dateHeader}>
					<ThemedText type="title" style={styles.selectedDateText}>
						{formatSelectedDate(selectedDate)}
					</ThemedText>
				</ThemedView>

				{/* 月份导航 */}
				<ThemedView style={styles.monthNavigation}>
					<TouchableOpacity style={styles.navButton} onPress={() => navigateMonth("prev")}>
						<ThemedText style={styles.navButtonText}>‹</ThemedText>
					</TouchableOpacity>

					<ThemedText type="subtitle" style={styles.monthYearText}>
						{currentMonth.getFullYear()}年 {currentMonth.getMonth() + 1}月
					</ThemedText>

					<TouchableOpacity style={styles.navButton} onPress={() => navigateMonth("next")}>
						<ThemedText style={styles.navButtonText}>›</ThemedText>
					</TouchableOpacity>
				</ThemedView>

				{/* 星期标题 */}
				<ThemedView style={styles.weekdayHeader}>
					{weekdays.map((day, index) => (
						<ThemedView key={index} style={styles.weekdayCell}>
							<ThemedText style={styles.weekdayText}>{day}</ThemedText>
						</ThemedView>
					))}
				</ThemedView>

				{/* 日历网格 */}
				<ThemedView style={styles.calendarGrid}>
					{calendarDays.map((day, index) => (
						<TouchableOpacity key={index} style={[styles.dayCell, day.isSelected && styles.selectedDay, day.isToday && styles.todayDay]} onPress={() => day.isCurrentMonth && selectDate(day.date)}>
							<ThemedText style={[styles.dayText, !day.isCurrentMonth && styles.otherMonthText, day.isSelected && styles.selectedDayText, day.isToday && styles.todayText]}>{day.date}</ThemedText>
						</TouchableOpacity>
					))}
				</ThemedView>
			</ScrollView>
		</ThemedView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1
	},
	scrollContent: {
		padding: 20
	},
	dateHeader: {
		alignItems: "center",
		marginBottom: 30,
		paddingVertical: 20,
		backgroundColor: "rgba(0,0,0,0.05)",
		borderRadius: 12
	},
	selectedDateText: {
		fontSize: 24,
		fontWeight: "bold"
	},
	monthNavigation: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 20
	},
	navButton: {
		width: 40,
		height: 40,
		borderRadius: 20,
		backgroundColor: "rgba(0,0,0,0.1)",
		justifyContent: "center",
		alignItems: "center"
	},
	navButtonText: {
		fontSize: 24,
		fontWeight: "bold"
	},
	monthYearText: {
		fontSize: 20,
		fontWeight: "600"
	},
	weekdayHeader: {
		flexDirection: "row",
		marginBottom: 10
	},
	weekdayCell: {
		flex: 1,
		alignItems: "center",
		paddingVertical: 8
	},
	weekdayText: {
		fontSize: 16,
		fontWeight: "600",
		opacity: 0.7
	},
	calendarGrid: {
		flexDirection: "row",
		flexWrap: "wrap"
	},
	dayCell: {
		width: "14.28%",
		aspectRatio: 1,
		justifyContent: "center",
		alignItems: "center",
		marginBottom: 2
	},
	dayText: {
		fontSize: 16,
		fontWeight: "500"
	},
	otherMonthText: {
		opacity: 0.3
	},
	selectedDay: {
		backgroundColor: "#0a7ea4",
		borderRadius: 20
	},
	selectedDayText: {
		color: "#fff",
		fontWeight: "bold"
	},
	todayDay: {
		backgroundColor: "rgba(10, 126, 164, 0.2)",
		borderRadius: 20
	},
	todayText: {
		color: "#0a7ea4",
		fontWeight: "bold"
	}
});
