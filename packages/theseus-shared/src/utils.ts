/**
 * 通用工具函数
 */

/**
 * 创建成功响应
 */
export function ok<T>(data: T) {
  return { success: true as const, data };
}

/**
 * 创建错误响应
 */
export function fail(code: string, message: string) {
  return { success: false as const, error: { code, message } };
}
