/**
 * 统一的 API 请求工具
 * 
 * 提供统一的网络请求方法，包括超时控制、错误处理等功能
 * 使用环境变量中的配置，避免在每个接口中重复配置
 */

import { API_CONFIG } from '@/constants/api';

export interface ApiResponse<T = any> {
	success: boolean;
	message: string;
	data: T;
}

export interface ApiRequestOptions extends RequestInit {
	timeout?: number; // 可选的自定义超时时间，会覆盖环境变量配置
}

/**
 * 统一的 API 请求函数
 * @param url 请求URL
 * @param options 请求选项
 * @returns Promise<ApiResponse<T>>
 */
export async function apiRequest<T = any>(
	url: string, 
	options: ApiRequestOptions = {}
): Promise<ApiResponse<T>> {
	const { timeout = API_CONFIG.TIMEOUT, ...fetchOptions } = options;
	
	// 创建AbortController用于超时控制
	const controller = new AbortController();
	const timeoutId = setTimeout(() => controller.abort(), timeout);

	try {
		const response = await fetch(url, {
			headers: {
				'Content-Type': 'application/json',
				...fetchOptions.headers,
			},
			signal: controller.signal,
			...fetchOptions,
		});

		clearTimeout(timeoutId);

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		const data: ApiResponse<T> = await response.json();
		
		// 检查响应是否成功
		if (!data.success) {
			throw new Error(data.message || '服务器返回错误');
		}

		return data;
	} catch (error) {
		clearTimeout(timeoutId);
		
		if (error instanceof Error) {
			if (error.name === 'AbortError') {
				throw new Error(`请求超时 (${timeout}ms)，请检查网络连接`);
			}
			throw error;
		}
		
		throw new Error('网络请求失败');
	}
}

/**
 * GET 请求
 * @param url 请求URL
 * @param options 请求选项
 * @returns Promise<ApiResponse<T>>
 */
export async function apiGet<T = any>(
	url: string, 
	options: Omit<ApiRequestOptions, 'method' | 'body'> = {}
): Promise<ApiResponse<T>> {
	return apiRequest<T>(url, { ...options, method: 'GET' });
}

/**
 * POST 请求
 * @param url 请求URL
 * @param body 请求体
 * @param options 请求选项
 * @returns Promise<ApiResponse<T>>
 */
export async function apiPost<T = any>(
	url: string, 
	body?: any, 
	options: Omit<ApiRequestOptions, 'method'> = {}
): Promise<ApiResponse<T>> {
	return apiRequest<T>(url, {
		...options,
		method: 'POST',
		body: body ? JSON.stringify(body) : undefined,
	});
}

/**
 * PUT 请求
 * @param url 请求URL
 * @param body 请求体
 * @param options 请求选项
 * @returns Promise<ApiResponse<T>>
 */
export async function apiPut<T = any>(
	url: string, 
	body?: any, 
	options: Omit<ApiRequestOptions, 'method'> = {}
): Promise<ApiResponse<T>> {
	return apiRequest<T>(url, {
		...options,
		method: 'PUT',
		body: body ? JSON.stringify(body) : undefined,
	});
}

/**
 * DELETE 请求
 * @param url 请求URL
 * @param options 请求选项
 * @returns Promise<ApiResponse<T>>
 */
export async function apiDelete<T = any>(
	url: string, 
	options: Omit<ApiRequestOptions, 'method' | 'body'> = {}
): Promise<ApiResponse<T>> {
	return apiRequest<T>(url, { ...options, method: 'DELETE' });
}
