/**
 * API 配置文件
 *
 * 此文件优先从环境变量读取配置，如果环境变量不存在则使用默认值
 * 建议在项目根目录创建 .env 文件并配置相应的环境变量
 *
 * 可选的 .env 配置：
 * EXPO_PUBLIC_BASE_URL=your-api-base-url (默认: http://localhost:3001)
 * EXPO_PUBLIC_API_BASE_URL=your-api-base-url/api (默认: http://localhost:3001/api)
 * EXPO_PUBLIC_NODE_ENV=development|test|production (默认: development)
 * EXPO_PUBLIC_API_TIMEOUT=10000 (默认: 10000)
 */

// 从环境变量读取配置，如果不存在则使用默认值
const getConfig = () => {
	const env = process.env.NODE_ENV || "development";

	// 使用环境变量，如果不存在则使用默认值
	const config = {
		BASE_URL: process.env.EXPO_PUBLIC_BASE_URL || "http://localhost:3001",
		API_BASE_URL: process.env.EXPO_PUBLIC_API_BASE_URL || "http://localhost:3001/api",
		TIMEOUT: parseInt(process.env.EXPO_PUBLIC_API_TIMEOUT || "10000"),
		ENV: env
	};

	return config;
};

export const API_CONFIG = getConfig();

// 导出常用的 API 端点
export const API_ENDPOINTS = {
	TIME: `${API_CONFIG.API_BASE_URL}/time/time`
	// 可以在这里添加更多端点
} as const;

// 导出配置对象
export default API_CONFIG;
