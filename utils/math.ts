/**
 * 浮点数精度处理工具
 * 
 * 解决 JavaScript 浮点数运算精度问题
 * 例如：0.1 + 0.2 = 0.30000000000000004
 */

/**
 * 获取数字的小数位数
 * @param num 数字
 * @returns 小数位数
 */
function getDecimalPlaces(num: number): number {
	const str = num.toString();
	const decimalIndex = str.indexOf('.');
	return decimalIndex === -1 ? 0 : str.length - decimalIndex - 1;
}

/**
 * 安全的浮点数加法
 * @param a 第一个数
 * @param b 第二个数
 * @returns 精确的加法结果
 */
export function safeAdd(a: number, b: number): number {
	const decimalPlacesA = getDecimalPlaces(a);
	const decimalPlacesB = getDecimalPlaces(b);
	const maxDecimalPlaces = Math.max(decimalPlacesA, decimalPlacesB);
	const multiplier = Math.pow(10, maxDecimalPlaces);
	
	return Math.round((a * multiplier + b * multiplier)) / multiplier;
}

/**
 * 安全的浮点数减法
 * @param a 第一个数
 * @param b 第二个数
 * @returns 精确的减法结果
 */
export function safeSubtract(a: number, b: number): number {
	const decimalPlacesA = getDecimalPlaces(a);
	const decimalPlacesB = getDecimalPlaces(b);
	const maxDecimalPlaces = Math.max(decimalPlacesA, decimalPlacesB);
	const multiplier = Math.pow(10, maxDecimalPlaces);
	
	return Math.round((a * multiplier - b * multiplier)) / multiplier;
}

/**
 * 安全的浮点数乘法
 * @param a 第一个数
 * @param b 第二个数
 * @returns 精确的乘法结果
 */
export function safeMultiply(a: number, b: number): number {
	const decimalPlacesA = getDecimalPlaces(a);
	const decimalPlacesB = getDecimalPlaces(b);
	const multiplier = Math.pow(10, decimalPlacesA + decimalPlacesB);
	
	return Math.round(a * multiplier * b) / multiplier;
}

/**
 * 安全的浮点数除法
 * @param a 被除数
 * @param b 除数
 * @returns 精确的除法结果
 */
export function safeDivide(a: number, b: number): number {
	if (b === 0) {
		throw new Error('Division by zero');
	}
	
	const decimalPlacesA = getDecimalPlaces(a);
	const decimalPlacesB = getDecimalPlaces(b);
	const multiplier = Math.pow(10, Math.max(decimalPlacesA, decimalPlacesB));
	
	return Math.round((a * multiplier) / (b * multiplier) * multiplier) / multiplier;
}

/**
 * 格式化数字显示，移除不必要的尾随零
 * @param num 要格式化的数字
 * @param maxDecimalPlaces 最大小数位数
 * @returns 格式化后的字符串
 */
export function formatNumber(num: number, maxDecimalPlaces: number = 10): string {
	// 处理特殊情况
	if (!isFinite(num)) {
		return num.toString();
	}
	
	// 使用 toFixed 然后移除尾随零
	const fixed = num.toFixed(maxDecimalPlaces);
	return parseFloat(fixed).toString();
}

/**
 * 检查是否为整数
 * @param num 数字
 * @returns 是否为整数
 */
export function isInteger(num: number): boolean {
	return Number.isInteger(num);
}

/**
 * 安全的数学运算
 * @param a 第一个数
 * @param b 第二个数
 * @param operation 运算类型
 * @returns 运算结果
 */
export function safeCalculate(a: number, b: number, operation: '+' | '-' | '*' | '/'): number {
	switch (operation) {
		case '+':
			return safeAdd(a, b);
		case '-':
			return safeSubtract(a, b);
		case '*':
			return safeMultiply(a, b);
		case '/':
			return safeDivide(a, b);
		default:
			throw new Error(`Unsupported operation: ${operation}`);
	}
}
