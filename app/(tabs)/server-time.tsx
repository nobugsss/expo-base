import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { API_CONFIG, API_ENDPOINTS } from "@/constants/api";
import { apiGet } from "@/utils/api";
import React, { useCallback, useEffect, useState } from "react";
import { Alert, StyleSheet, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface ServerTimeData {
	timestamp: number;
	datetime: string;
	timezone: string;
}

export default function ServerTimeScreen() {
	const insets = useSafeAreaInsets();
	const [serverTime, setServerTime] = useState<string>("");
	const [serverTimezone, setServerTimezone] = useState<string>("");
	const [isLoading, setIsLoading] = useState(false);
	const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
	const [isAutoRefresh, setIsAutoRefresh] = useState(false);
	const [error, setError] = useState<string>("");

	const API_URL = API_ENDPOINTS.TIME;

	const fetchServerTime = useCallback(async () => {
		setIsLoading(true);
		setError("");

		try {
			const data = await apiGet<ServerTimeData>(API_URL);

			// 解析服务器时间
			const serverDate = new Date(data.data.datetime);
			const formattedTime = serverDate.toLocaleString("zh-CN", {
				year: "numeric",
				month: "2-digit",
				day: "2-digit",
				hour: "2-digit",
				minute: "2-digit",
				second: "2-digit",
				hour12: false,
				timeZone: data.data.timezone
			});

			setServerTime(formattedTime);
			setServerTimezone(data.data.timezone);
			setLastUpdated(new Date());
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : "获取服务器时间失败";
			setError(errorMessage);
			setServerTime("");
			setServerTimezone("");

			// 显示错误提示
			Alert.alert("连接错误", `无法连接到服务器：${errorMessage}\n\n请确保服务器正在运行在 ${API_URL}`, [{ text: "确定" }]);
		} finally {
			setIsLoading(false);
		}
	}, [API_URL]);

	const toggleAutoRefresh = () => {
		setIsAutoRefresh(!isAutoRefresh);
	};

	const formatLastUpdated = (date: Date): string => {
		return date.toLocaleString("zh-CN", {
			hour: "2-digit",
			minute: "2-digit",
			second: "2-digit"
		});
	};

	// 自动刷新效果
	useEffect(() => {
		let interval: ReturnType<typeof setInterval>;

		if (isAutoRefresh) {
			// 立即获取一次
			fetchServerTime();

			// 每5秒刷新一次
			interval = setInterval(() => {
				fetchServerTime();
			}, 5000);
		}

		return () => {
			if (interval) {
				clearInterval(interval);
			}
		};
	}, [isAutoRefresh, fetchServerTime]);

	// 组件挂载时获取一次时间
	useEffect(() => {
		fetchServerTime();
	}, [fetchServerTime]);

	return (
		<ThemedView style={styles.container}>
			<ThemedView style={[styles.content, { paddingTop: insets.top + 20 }]}>
				{/* 标题 */}
				<ThemedText type="title" style={styles.title}>
					服务器时间
				</ThemedText>

				{/* 服务器时间显示 */}
				<ThemedView style={styles.timeContainer}>
					{isLoading ? (
						<ThemedText style={styles.loadingText}>正在获取时间...</ThemedText>
					) : error ? (
						<ThemedView style={styles.errorContainer}>
							<ThemedText style={styles.errorText}>❌ 连接失败</ThemedText>
							<ThemedText style={styles.errorDetail}>{error}</ThemedText>
						</ThemedView>
					) : (
						<ThemedView style={styles.timeDisplay}>
							<ThemedText style={styles.timeText}>{serverTime}</ThemedText>
							{serverTimezone && <ThemedText style={styles.timezoneText}>时区: {serverTimezone}</ThemedText>}
							{lastUpdated && <ThemedText style={styles.lastUpdatedText}>最后更新: {formatLastUpdated(lastUpdated)}</ThemedText>}
						</ThemedView>
					)}
				</ThemedView>

				{/* 控制按钮 */}
				<ThemedView style={styles.buttonContainer}>
					<TouchableOpacity style={[styles.button, styles.refreshButton, isLoading && styles.disabledButton]} onPress={fetchServerTime} disabled={isLoading}>
						<ThemedText style={styles.buttonText}>{isLoading ? "获取中..." : "🔄 手动刷新"}</ThemedText>
					</TouchableOpacity>

					<TouchableOpacity style={[styles.button, isAutoRefresh ? styles.autoRefreshActiveButton : styles.autoRefreshButton]} onPress={toggleAutoRefresh}>
						<ThemedText style={[styles.buttonText, isAutoRefresh && styles.activeButtonText]}>{isAutoRefresh ? "⏸️ 停止自动刷新" : "▶️ 开始自动刷新"}</ThemedText>
					</TouchableOpacity>
				</ThemedView>

				{/* 说明文字 */}
				<ThemedView style={styles.infoContainer}>
					<ThemedText style={styles.infoText}>📡 API 地址: {API_URL}</ThemedText>
					<ThemedText style={styles.infoText}>🔄 自动刷新间隔: 5秒</ThemedText>
					<ThemedText style={styles.infoText}>⏱️ 请求超时: {API_CONFIG.TIMEOUT / 1000}秒</ThemedText>
					<ThemedText style={styles.infoText}>💡 提示: 请确保服务器正在运行</ThemedText>
				</ThemedView>
			</ThemedView>
		</ThemedView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1
	},
	content: {
		flex: 1,
		paddingHorizontal: 20,
		paddingBottom: 20,
		justifyContent: "center"
	},
	title: {
		fontSize: 28,
		fontWeight: "bold",
		textAlign: "center",
		marginBottom: 40
	},
	timeContainer: {
		alignItems: "center",
		marginBottom: 40,
		paddingVertical: 40,
		paddingHorizontal: 20,
		backgroundColor: "rgba(0,0,0,0.05)",
		borderRadius: 16
	},
	timeDisplay: {
		alignItems: "center"
	},
	timeText: {
		fontSize: 28,
		fontWeight: "bold",
		textAlign: "center",
		marginBottom: 10,
		color: "#0a7ea4",
		paddingVertical: 10,
		lineHeight: 36
	},
	timezoneText: {
		fontSize: 16,
		fontWeight: "500",
		textAlign: "center",
		marginBottom: 8,
		color: "#0a7ea4",
		opacity: 0.8
	},
	lastUpdatedText: {
		fontSize: 14,
		opacity: 0.7,
		textAlign: "center"
	},
	loadingText: {
		fontSize: 18,
		opacity: 0.7,
		textAlign: "center"
	},
	errorContainer: {
		alignItems: "center"
	},
	errorText: {
		fontSize: 20,
		fontWeight: "bold",
		color: "#ff4444",
		marginBottom: 8
	},
	errorDetail: {
		fontSize: 14,
		opacity: 0.7,
		textAlign: "center",
		paddingHorizontal: 20
	},
	buttonContainer: {
		gap: 15,
		marginBottom: 40
	},
	button: {
		paddingVertical: 15,
		paddingHorizontal: 30,
		borderRadius: 12,
		alignItems: "center"
	},
	refreshButton: {
		backgroundColor: "#0a7ea4"
	},
	autoRefreshButton: {
		backgroundColor: "rgba(0,0,0,0.1)",
		borderWidth: 2,
		borderColor: "#0a7ea4"
	},
	autoRefreshActiveButton: {
		backgroundColor: "#0a7ea4"
	},
	disabledButton: {
		opacity: 0.6
	},
	buttonText: {
		fontSize: 16,
		fontWeight: "600",
		color: "#fff"
	},
	activeButtonText: {
		color: "#fff"
	},
	infoContainer: {
		backgroundColor: "rgba(0,0,0,0.05)",
		padding: 20,
		borderRadius: 12,
		gap: 8
	},
	infoText: {
		fontSize: 14,
		opacity: 0.7,
		textAlign: "center"
	}
});
