# Expo Base 应用 👋

这是一个使用 [Expo](https://expo.dev) 开发的示例应用，包含多个功能页面：Hello World、日历、计算器和服务器时间。

## 功能特性

- 🏠 **首页**: 欢迎页面
- 📅 **日历**: 完整的日历功能，支持日期选择和月份导航
- 🧮 **计算器**: 功能完整的计算器，支持基本四则运算
- ⏰ **服务器时间**: 通过 REST API 获取服务器时间，支持自动刷新

## 技术栈

- **Expo**: React Native 开发框架
- **TypeScript**: 类型安全的 JavaScript
- **Expo Router**: 基于文件的路由系统
- **React Native**: 跨平台移动应用开发
- **pnpm**: 快速、节省磁盘空间的包管理器（推荐）

## 快速开始

### 1. 安装依赖

推荐使用 `pnpm`（更快、更节省磁盘空间）：

```bash
# 使用 pnpm（推荐）
pnpm install

# 或者使用 npm
npm install
```

### 2. 启动应用

```bash
# 使用 pnpm
pnpm start

# 或者使用 npm
npx expo start
```

在输出中，您可以选择在以下环境中打开应用：

- [开发构建](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android 模拟器](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS 模拟器](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go)，用于尝试 Expo 应用开发的有限沙盒

## API 配置

### 配置文件位置

API 配置位于 `constants/api.ts` 文件中。

### 如何修改 API 域名

#### 方法 1: 使用环境变量（推荐）

1. 复制 `env.template` 文件为 `.env`：

```bash
cp env.template .env
```

2. 编辑 `.env` 文件，修改相应的配置：

```
EXPO_PUBLIC_BASE_URL=http://your-new-domain.com
EXPO_PUBLIC_API_BASE_URL=http://your-new-domain.com/api
EXPO_PUBLIC_NODE_ENV=development
```

3. 重启应用使配置生效

**注意**: `.env` 文件是可选的，如果不存在会使用默认配置。建议使用 `.env` 文件来管理不同环境的配置。

#### 方法 2: 直接修改配置文件（不推荐）

如果不想使用环境变量，可以直接修改 `constants/api.ts` 文件中的配置。

### 环境切换

当前支持三种环境：

- `development` - 开发环境
- `test` - 测试环境
- `production` - 生产环境

通过修改 `NODE_ENV` 环境变量来切换环境。

### 当前 API 端点

- 时间 API: `/api/time/time`

### 添加新的 API 端点

在 `API_ENDPOINTS` 对象中添加新的端点：

```typescript
export const API_ENDPOINTS = {
	TIME: `${API_CONFIG.API_BASE_URL}/time/time`,
	USER: `${API_CONFIG.API_BASE_URL}/user/profile`, // 新增端点
	DATA: `${API_CONFIG.API_BASE_URL}/data/list` // 新增端点
} as const;
```

## 项目结构

```
expo-base/
├── app/                    # 应用页面
│   ├── (tabs)/            # 标签页路由
│   │   ├── index.tsx      # 首页
│   │   ├── calendar.tsx   # 日历页面
│   │   ├── calculator.tsx # 计算器页面
│   │   ├── server-time.tsx # 服务器时间页面
│   │   └── _layout.tsx    # 标签页布局
│   └── _layout.tsx        # 根布局
├── components/            # 可复用组件
├── constants/             # 常量配置
│   ├── api.ts           # API 配置
│   └── theme.ts         # 主题配置
├── hooks/               # 自定义 Hooks
├── assets/             # 静态资源
├── env.template        # 环境变量配置模板
└── .env               # 环境变量配置（需要手动创建）
```

## 开发说明

- 使用 [文件路由](https://docs.expo.dev/router/introduction) 进行页面导航
- 支持明暗主题切换
- 使用 TypeScript 确保类型安全
- 响应式设计，适配不同屏幕尺寸

## 包管理器推荐

本项目推荐使用 **pnpm** 作为包管理器，原因如下：

- ⚡ **更快的安装速度**: 比 npm 快 2-3 倍
- 💾 **节省磁盘空间**: 使用硬链接和符号链接，避免重复存储
- 🔒 **更严格的依赖管理**: 防止幽灵依赖问题
- 📦 **更好的 monorepo 支持**: 适合大型项目

### 安装 pnpm

```bash
# 使用 npm 安装 pnpm
npm install -g pnpm

# 或使用其他方式
curl -fsSL https://get.pnpm.io/install.sh | sh -
```

### 常用命令对比

| 操作     | pnpm                 | npm                     |
| -------- | -------------------- | ----------------------- |
| 安装依赖 | `pnpm install`       | `npm install`           |
| 启动项目 | `pnpm start`         | `npm start`             |
| 添加依赖 | `pnpm add <package>` | `npm install <package>` |
| 运行脚本 | `pnpm run <script>`  | `npm run <script>`      |

## 重置项目

当您准备开始新项目时，可以运行：

```bash
# 使用 pnpm
pnpm run reset-project

# 或者使用 npm
npm run reset-project
```

此命令会将启动代码移动到 **app-example** 目录，并创建一个空白的 **app** 目录供您开始开发。

## 了解更多

要了解更多关于使用 Expo 开发项目的信息，请查看以下资源：

- [Expo 文档](https://docs.expo.dev/): 学习基础知识，或通过我们的[指南](https://docs.expo.dev/guides)深入了解高级主题
- [Learn Expo 教程](https://docs.expo.dev/tutorial/introduction/): 跟随分步教程，创建一个在 Android、iOS 和 Web 上运行的项目

## 社区

加入我们创建通用应用的开发者社区：

- [Expo on GitHub](https://github.com/expo/expo): 查看我们的开源平台并贡献代码
- [Discord 社区](https://chat.expo.dev): 与 Expo 用户聊天并提问
