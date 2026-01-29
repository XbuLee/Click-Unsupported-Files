# Obsidian Click Control

这是一个为 Obsidian 设计的增强插件，旨在防止在文件列表中意外触发不支持或大型文件（如 `.exe`, `.zip`, `.dll` 等）的系统打开动作，同时提供更便捷的管理方式。（代码完全由 Antigravity 生成。）

## 🌟 核心功能

- **拦截误触**：对于指定的文件后缀或 Obsidian 不原生支持的文件，单击时将不再直接调用系统程序打开，而是显示操作提示。
- **阶梯式交互**：
    - **单纯单击**：拦截打开动作，并弹出气泡提示（包含操作说明）。
    - **Shift + 单击**：快速触发“在文件夹中显示”，在 Windows 资源管理器或 macOS Finder 中定位该文件。
    - **Ctrl/Cmd + 单击**：强制使用系统默认程序打开文件。
- **智能识别**：支持自动拦截所有 Obsidian 无法预览的“未知”文件类型。
- **连击保护**：防止双击时重复触发操作，确保交互流程平滑。

## 🚀 使用方法

### 基础交互
如果您点击了一个受限文件（例如 `setup.exe`）：
1. **直接点击**：Obsidian 不会做出任何打开动作，右上角会提示您：
   > 💡 该文件受限: EXE
   > • Shift + 单击: 定位文件夹
   > • Ctrl + 单击: 强制打开
2. **需要查看文件位置**：按住 `Shift` 键并点击文件名。
3. **确实需要运行/打开文件**：按住 `Ctrl` (Windows) 或 `Cmd` (Mac) 键并点击文件名。

### 配置选项
在插件设置页面中，您可以：
- **Unsupported Extensions**: 输入以逗号分隔的后缀列表（如 `exe,zip,7z,rar`）。
- **Intercept All Unrecognized Files**: 开启后，任何 Obsidian 无法原生通过视图打开的文件都将自动应用上述拦截逻辑。

## 🛠️ 安装方法

### 手动安装
1. 下载或编译生成的 `main.js`, `manifest.json`, `styles.css`。
2. 在您的 Obsidian 库目录中，进入 `.obsidian/plugins/`。
3. 创建文件夹 `click-control`。
4. 将上述三个文件放入该文件夹。
5. 在 Obsidian 的 `设置` -> `第三方插件` 中启用 **Click Control**。

### 开发与编译
如果您是从源码安装：
1. `npm install` 安装依赖。
2. `npm run build` 进行编译。

## 📝 许可证
本项目采用 [MIT License](LICENSE) 许可。
