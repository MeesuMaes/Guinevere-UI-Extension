# Guinevere UI 扩展

Guinevere UI 扩展是 SillyTavern 的一个大型扩展，基本上可以让 SillyTavern 在自定义 CSS 之外实现 *你自己的风格*。Guinevere 支持多个主题包，这些主题可以是简单的 HTML、CSS 或 JavaScript 代码，也可以是对 ST UI 的大规模改造，甚至达到前所未有的程度。这是前端设计师在 AI 领域的梦想画布。

## 为什么选择 Guinevere？

> Guinaifen：那是我的真名！我只是觉得我们这个小项目需要一点活力~。嘿，听起来不错！

## 特性

1. 只需一行代码即可彻底改造 SillyTavern 的原始 UI。
    > 简而言之，SillyTavern 的 UI 对某些人来说已经显得有些过时了，尤其是那些从 C.AI 等 AI 网站或 TavernAI、MikuPad 等工具转过来的用户（相信我，我曾经也处于同样的情况）。现在你可以放心了，通过 Guinevere，你可以完全掌控 UI，无论是布局、图标还是图片，都可以随心所欲地添加，模仿现有 UI 或从头开始设计都行！

    <p align="center">
        <img src=".github/preview1.png" alt="Image Preview 1">
    </p>
2. 兼容现有的 ST 自定义主题
    > 尽管这是一个全面改造，但这并不意味着来自 ST Discord 的旧 CSS 行将全部失效。实际上，你仍然可以像以前一样使用这些主题\*。

    <p align="center">
        <img src=".github/preview2.png" alt="Image Preview 2">
        <br>
        <em>使用 Celestial Macaron 主题的群聊</em>
    </p>

    > \* - 某些 Guinevere 主题可能使用不同的类元素或固定颜色，这可能导致部分主题无法正确应用。

3. 支持多种主题。

4. 支持 ST 的自定义 CSS。
    > 即使 Guinevere 基本上是一个 DIY 平台，并不真正需要 ST 的“自定义 CSS”代码，但你仍然可以使用它 :) 请尽情享受吧。
5. 开放自由，制作任何你想要的内容。
    > 无论你想模仿 OpenAI，还是 miHoYo 游戏中的 UI 设计等等，只要你有 HTML、CSS 和 JS 的支持（Sakana：那就是我！），你可以构建几乎任何你想要的东西。

Guinevere 设置可以在 _Extensions_ > `Guinevere (UI Theme Extension)` 中找到。请注意，`Extensions` 图标可能会因使用的主题而变化，可能不会完全遵循 ST 默认样式。

<p align="center">
    <img src=".github/settings.png" alt="Settings">
    <br>
</p>

## 前置条件

支持扩展的现代版 SillyTavern。

## 安装

#### 通过下载扩展和资源（最简单）

1. 点击 _Extensions_ 然后点击 **Download Extensions & Assets**
2. 点击红色电源插头按钮，然后点击 OK。
3. 向下滚动找到 `Guinevere UI Extension` 并点击 Download 按钮。
4. 刷新 SillyTavern 页面。
5. 再次点击 _Extensions_，然后展开 `Guinevere (UI Theme Extension)` 下拉菜单并启用 _Enable Guinevere_。
6. 将 *Guinevere* 主题安装到你的 SillyTavern 数据文件夹中 (`data/default-user/extensions/Guinevere-UI-Extension/themes`) 或使用附带的 Google Messages 主题 (google-messages)！
    > 确保所有主题文件都在一个文件夹中。
7. 点击复选框保存主题。
8. 点击 Apply Theme 按钮。
9. 完成。

#### 通过安装扩展

1. 点击 _Extensions_ 然后点击 **Install Extension**
2. 将以下链接粘贴到文本框中并点击 Save：`https://github.com/Bronya-Rand/Guinevere-UI-Extension`.
3. 刷新 SillyTavern 页面。
4. 再次点击 _Extensions_，然后展开 `Guinevere (UI Theme Extension)` 下拉菜单并启用 _Enable Guinevere_。
5. 将 *Guinevere* 主题安装到你的 SillyTavern 数据文件夹中 (`data/default-user/extensions/Guinevere-UI-Extension/themes`) 或使用附带的 Google Messages 主题 (google-messages)！
    > 确保所有主题文件都在一个文件夹中。
6. 点击复选框保存主题。
7. 点击 Apply Theme 按钮。
8. 完成。

## 为 Guinevere 创建你自己的主题

查看 Guinevere 主题文件夹中的 `template` 文件夹，作为创建自己主题的起点！只需确保遵守以下几点：

1. 如果你计划分享你的主题，请确保它对移动端用户友好！或者至少说明这是一个主要针对桌面端设计的主题。人们可能会安装你的主题并疑惑为什么在他们的设备上看起来很糟糕。使用不同的显示器、设备等进行测试。
2. 尽量使用 ST 中已有的 CSS！人们可能希望在你的主题之上应用其他 UI 主题！感谢人们会使用你的主题，并允许他们根据自己的喜好进一步调整风格！
3. 除非你 *清楚* 自己在做什么，否则不要更改 Guinevere 的代码行。坦白说，内部代码只需要负责前端执行。所有的代码都应该放在你的主题文件夹中。JS 代码应通过 `code.js` 文件执行。
4. 确保你对主题进行了充分的测试，特别是在重置方面。如果重置不当导致主题破坏其他主题，人们可能会质疑你的主题并拒绝推荐它。
5. 不要犯傻。做这件事是为了乐趣，而不是恶意。

参考网上的现有 HTML/CSS/JS 以及 Google Messages 主题，作为创建你的第一个 Guinevere 主题的参考。

Guinevere UI 扩展，Guinevere UI 扩展代码，版权所有 © 2025 Bronya-Rand。保留所有权利。
