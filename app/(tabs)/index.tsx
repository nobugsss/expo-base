import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { StyleSheet } from "react-native";

export default function HomeScreen() {
	return (
		<ThemedView style={styles.container}>
			<ThemedView style={styles.content}>
				<ThemedText type="title" style={styles.title}>
					Hello World!
				</ThemedText>
				<ThemedText style={styles.subtitle}>欢迎使用 Expo Base 应用</ThemedText>
				<ThemedText style={styles.description}>这是一个使用 Expo、TypeScript 和 React Native 开发的示例应用。 请使用底部标签页浏览不同的功能页面。</ThemedText>
			</ThemedView>
		</ThemedView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		padding: 20
	},
	content: {
		alignItems: "center",
		maxWidth: 300
	},
	title: {
		fontSize: 32,
		fontWeight: "bold",
		marginBottom: 16,
		textAlign: "center"
	},
	subtitle: {
		fontSize: 18,
		marginBottom: 24,
		textAlign: "center",
		opacity: 0.8
	},
	description: {
		fontSize: 16,
		textAlign: "center",
		lineHeight: 24,
		opacity: 0.7
	}
});
