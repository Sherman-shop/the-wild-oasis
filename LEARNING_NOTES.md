# 📝 学习笔记：React 路由与组件化样式实战

**日期**：2025年12月16日
**项目**：The Wild Oasis (后台管理系统)
**技术栈**：React, React Router v6, Styled Components, React Icons

## 1. 核心工作总结

今天我们主要完成了应用**基础骨架（App Shell）**的搭建，实现了页面导航和布局系统。

*   **路由配置**：使用 React Router v6 搭建了多页面的路由结构。
*   **布局系统**：创建了 `AppLayout`，实现了“侧边栏 + 顶部栏 + 内容区”的经典后台布局。
*   **导航菜单**：开发了 `MainNav` 组件，实现了点击跳转和当前页高亮。
*   **图标集成**：引入 `react-icons` 库，为菜单添加了精美的图标。
*   **样式组件化**：深入理解了 Styled Components 的 `props` 传参机制。

## 2. 关键技术点解析

### A. 路由重定向与默认页 (`<Navigate>`)
我们遇到了一个需求：用户访问根路径 `/` 时，自动跳转到 `/dashboard`。
```jsx
<Route index element={<Navigate replace to="dashboard" />} />
```
*   **`index`**：表示这是父路由的默认子路由。
*   **`<Navigate>`**：执行重定向操作。
*   **`replace`**：关键属性！它替换当前历史记录而不是新增，防止用户点击“后退”按钮时陷入死循环。

### B. 布局嵌套原理 (`<Outlet>`)
我们实现了一个包含 Sidebar 和 Header 的公共布局，让它在切换页面时保持不变。
**原理**：
1.  在 `App.jsx` 中，将 `AppLayout` 作为父路由的 `element`。
2.  在 `AppLayout.jsx` 中，使用 `<Outlet />` 组件。
3.  **流程**：当路由匹配到子路径（如 `/bookings`）时，React Router 会把 `Bookings` 组件塞到 `AppLayout` 的 `<Outlet />` 位置进行渲染。

### C. 智能导航链接 (`<NavLink>`)
我们区分了 `Link` 和 `NavLink`：
*   **`Link`**：普通的跳转链接。
*   **`NavLink`**：**导航专用**。它会自动检测当前 URL，如果匹配，就给自己加上 `active` 类名。
*   **结合 Styled Components**：
    ```javascript
    const StyledNavLink = styled(NavLink)`
      /* 默认样式 */
      color: grey;

      /* 高亮样式 */
      &.active:link {
        color: blue;
        background: lightgrey;
      }
    `;
    ```
    这样我们就不需要手动写逻辑去判断“当前是哪个页面”了，Router 帮我们全自动搞定。

### D. Styled Components 的 Props 魔法
我们复习了如何通过 props 动态改变样式（如 Button 组件）：
```javascript
${(props) => sizes[props.size]}
```
*   **原理**：利用 JavaScript 的对象查找能力。
*   **流程**：组件接收 `size="large"` -> 查找 `sizes` 对象里的 `large` 属性 -> 返回对应的 CSS 代码块 -> 注入到组件样式中。

## 3. 工作流程回顾 (Workflow)

1.  **安装依赖**：`npm i react-router-dom react-icons`。
2.  **定义页面**：在 `pages/` 目录下创建各个业务页面的空壳组件。
3.  **配置路由**：在 `App.jsx` 中使用 `<Routes>` 和 `<Route>` 定义路径与组件的映射。
4.  **构建布局**：
    *   创建 `AppLayout` (Grid 布局)。
    *   创建 `Sidebar` 和 `Header`。
    *   使用 `<Outlet />` 预留内容位置。
5.  **开发导航**：
    *   创建 `MainNav`。
    *   使用 `react-icons` 引入图标。
    *   使用 `styled(NavLink)` 创建带高亮状态的链接组件。
6.  **调试修正**：解决了路由重定向残留（Account页）、CSS 拼写错误（justify-content: column）以及 `href` 导致页面刷新的问题。

## 4. 常见误区警示 ⚠️

*   **不要用 `href`**：在 React Router 中，永远使用 `to` 属性。`href` 会导致页面刷新，状态丢失。
*   **布局遮挡**：Grid 布局中要注意组件顺序。如果 Sidebar 没设置好 Grid 区域且放在了 Header 后面，可能会被挤到错误的位置遮挡内容。
*   **路由残留**：如果浏览器地址栏手动输入了错误的 URL（如 `/account`），即使代码改对了，页面可能还是显示旧的组件。记得手动改回 `/dashboard` 测试。
