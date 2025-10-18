import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { formatNumber, safeCalculate } from "@/utils/math";
import React, { useState } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Operation = "+" | "-" | "*" | "/" | "=" | "C" | "CE";

interface CalculatorButton {
	label: string;
	value: Operation | string;
	type: "number" | "operation" | "function";
	span?: number;
}

export default function CalculatorScreen() {
	const insets = useSafeAreaInsets();
	const [display, setDisplay] = useState("0");
	const [previousValue, setPreviousValue] = useState<number | null>(null);
	const [operation, setOperation] = useState<Operation | null>(null);
	const [waitingForOperand, setWaitingForOperand] = useState(false);
	const [error, setError] = useState<string>("");

	const buttons: CalculatorButton[][] = [
		[
			{ label: "C", value: "C", type: "function" },
			{ label: "CE", value: "CE", type: "function" },
			{ label: "⌫", value: "backspace", type: "function" },
			{ label: "÷", value: "/", type: "operation" }
		],
		[
			{ label: "7", value: "7", type: "number" },
			{ label: "8", value: "8", type: "number" },
			{ label: "9", value: "9", type: "number" },
			{ label: "×", value: "*", type: "operation" }
		],
		[
			{ label: "4", value: "4", type: "number" },
			{ label: "5", value: "5", type: "number" },
			{ label: "6", value: "6", type: "number" },
			{ label: "-", value: "-", type: "operation" }
		],
		[
			{ label: "1", value: "1", type: "number" },
			{ label: "2", value: "2", type: "number" },
			{ label: "3", value: "3", type: "number" },
			{ label: "+", value: "+", type: "operation" }
		],
		[
			{ label: "0", value: "0", type: "number", span: 2 },
			{ label: ".", value: ".", type: "number" },
			{ label: "=", value: "=", type: "operation" }
		]
	];

	const performCalculation = (firstValue: number, secondValue: number, operation: Operation): number => {
		try {
			setError(""); // 清除之前的错误
			
			switch (operation) {
				case "+":
					return safeCalculate(firstValue, secondValue, '+');
				case "-":
					return safeCalculate(firstValue, secondValue, '-');
				case "*":
					return safeCalculate(firstValue, secondValue, '*');
				case "/":
					if (secondValue === 0) {
						throw new Error('不能除以零');
					}
					return safeCalculate(firstValue, secondValue, '/');
				default:
					return secondValue;
			}
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : '计算错误';
			setError(errorMessage);
			console.error('Calculation error:', error);
			return 0;
		}
	};

	const handleButtonPress = (value: string | Operation) => {
		if (typeof value === "string" && value === "backspace") {
			handleBackspace();
			return;
		}

		if (typeof value === "string" && value === "C") {
			handleClear();
			return;
		}

		if (typeof value === "string" && value === "CE") {
			handleClearEntry();
			return;
		}

		if (typeof value === "string" && value === ".") {
			handleDecimal();
			return;
		}

		if (typeof value === "string" && !isNaN(Number(value))) {
			handleNumber(value);
			return;
		}

		if (typeof value === "string" && ["+", "-", "*", "/", "="].includes(value)) {
			handleOperation(value as Operation);
			return;
		}
	};

	const handleNumber = (num: string) => {
		if (waitingForOperand) {
			setDisplay(num);
			setWaitingForOperand(false);
		} else {
			setDisplay(display === "0" ? num : display + num);
		}
	};

	const handleOperation = (nextOperation: Operation) => {
		const inputValue = parseFloat(display);

		if (previousValue === null) {
			setPreviousValue(inputValue);
		} else if (operation) {
			const currentValue = previousValue || 0;
			const newValue = performCalculation(currentValue, inputValue, operation);

			// 使用格式化函数处理显示
			const formattedValue = formatNumber(newValue);
			setDisplay(formattedValue);
			setPreviousValue(newValue);
		}

		setWaitingForOperand(true);
		setOperation(nextOperation);
	};

	const handleDecimal = () => {
		if (waitingForOperand) {
			setDisplay("0.");
			setWaitingForOperand(false);
		} else if (display.indexOf(".") === -1) {
			setDisplay(display + ".");
		}
	};

	const handleClear = () => {
		setDisplay("0");
		setPreviousValue(null);
		setOperation(null);
		setWaitingForOperand(false);
		setError("");
	};

	const handleClearEntry = () => {
		setDisplay("0");
		setError("");
	};

	const handleBackspace = () => {
		if (display.length > 1) {
			setDisplay(display.slice(0, -1));
		} else {
			setDisplay("0");
		}
	};

	const getButtonStyle = (button: CalculatorButton) => {
		const baseStyle: any[] = [styles.button];

		if (button.type === "number") {
			baseStyle.push(styles.numberButton);
		} else if (button.type === "operation") {
			baseStyle.push(styles.operationButton);
		} else {
			baseStyle.push(styles.functionButton);
		}

		if (button.span === 2) {
			baseStyle.push(styles.spanTwo);
		}

		return baseStyle;
	};

	const getButtonTextStyle = (button: CalculatorButton) => {
		const baseStyle: any[] = [styles.buttonText];

		if (button.type === "operation") {
			baseStyle.push(styles.operationButtonText);
		} else if (button.type === "function") {
			baseStyle.push(styles.functionButtonText);
		}

		return baseStyle;
	};

	return (
		<ThemedView style={styles.container}>
			{/* 显示屏 */}
			<ThemedView style={[styles.displayContainer, { paddingTop: insets.top + 40 }]}>
				{error ? (
					<ThemedText style={styles.errorText} numberOfLines={1}>
						{error}
					</ThemedText>
				) : (
					<ThemedText style={styles.displayText} numberOfLines={1}>
						{display}
					</ThemedText>
				)}
			</ThemedView>

			{/* 按钮网格 */}
			<ThemedView style={[styles.buttonContainer, { paddingBottom: insets.bottom + 20 }]}>
				{buttons.map((row, rowIndex) => (
					<ThemedView key={rowIndex} style={styles.buttonRow}>
						{row.map((button, buttonIndex) => (
							<TouchableOpacity key={buttonIndex} style={getButtonStyle(button)} onPress={() => handleButtonPress(button.value)} activeOpacity={0.7}>
								<ThemedText style={getButtonTextStyle(button)}>{button.label}</ThemedText>
							</TouchableOpacity>
						))}
					</ThemedView>
				))}
			</ThemedView>
		</ThemedView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#000"
	},
	displayContainer: {
		flex: 1,
		justifyContent: "flex-end",
		alignItems: "flex-end",
		paddingHorizontal: 20,
		paddingBottom: 20,
		backgroundColor: "#000"
	},
	displayText: {
		paddingBottom: 15,
		paddingTop: 15,
		fontSize: 42,
		fontWeight: "300",
		color: "#fff",
		textAlign: "right",
		lineHeight: 50
	},
	errorText: {
		paddingBottom: 15,
		paddingTop: 15,
		fontSize: 24,
		fontWeight: "400",
		color: "#ff6b6b",
		textAlign: "right",
		lineHeight: 30
	},
	buttonContainer: {
		paddingHorizontal: 10,
		paddingTop: 10
	},
	buttonRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginBottom: 10
	},
	button: {
		width: 70,
		height: 70,
		borderRadius: 35,
		justifyContent: "center",
		alignItems: "center",
		marginHorizontal: 5
	},
	spanTwo: {
		width: 150
	},
	numberButton: {
		backgroundColor: "#333"
	},
	operationButton: {
		backgroundColor: "#ff9500"
	},
	functionButton: {
		backgroundColor: "#a6a6a6"
	},
	buttonText: {
		fontSize: 24,
		fontWeight: "400",
		color: "#fff"
	},
	operationButtonText: {
		fontSize: 28,
		fontWeight: "500"
	},
	functionButtonText: {
		fontSize: 20,
		fontWeight: "500"
	}
});
