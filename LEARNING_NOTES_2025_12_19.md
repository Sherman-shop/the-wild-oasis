# 📝 学习笔记：React Query 数据流与组件通信

**日期**：2025年12月19日
**项目**：The Wild Oasis
**核心主题**：React Query 数据获取、组件层级与 Props 传递

## 1. 核心理解：谁是关键角色？

在今天的学习中，我们理清了 React 应用的数据脉络。

*   **关键角色**：`CabinTable.jsx`
    *   它是**数据管家**。
    *   它负责使用 `useQuery` 调用 API (`getCabins`)。
    *   它持有数据状态（`isLoading`, `data`, `error`）。
    *   它负责将数据**分发**给子组件。

*   **其他角色**：
    *   `App.jsx` / `Cabins.jsx`：主要是**结构容器**，负责路由匹配和页面布局，不直接处理小屋的数据逻辑。
    *   `CabinRow.jsx`：纯粹的**展示组件**（UI），只负责接收数据并渲染，不关心数据从哪来。

## 2. 技术实现原理 (React Query)

我们使用了 React Query 来替代传统的 `useEffect` + `useState` 模式。

### A. 配置 (App.jsx)
```jsx
// 1. 创建客户端
const queryClient = new QueryClient({...});

// 2. 注入全局
<QueryClientProvider client={queryClient}>
  <App />
</QueryClientProvider>
```
这相当于给全屋通了水管，任何房间都能用水。

### B. 获取数据 (CabinTable.jsx)
```jsx
const { isLoading, data: cabins } = useQuery({
  queryKey: ["cabins"], // 数据的唯一身份证
  queryFn: getCabins    // 去哪里取水（调用 API）
});
```
*   **声明式**：我们不需要告诉 React "怎么一步步去取数据"，只需要告诉它 "我想要 'cabins' 这份数据"。
*   **自动化**：React Query 自动处理了加载中、缓存、过期重试等复杂逻辑。

## 3. 组件通信与层级梳理 (The Component Tree)

我们像剥洋葱一样梳理了从底向上的层级关系：

1.  **`CabinRow` (最底层)**
    *   **任务**：渲染一行数据。
    *   **机制**：通过 `props` 接收 `{ cabin }` 对象。
    *   **代码**：`function CabinRow({ cabin }) { ... }`

2.  **`CabinTable` (核心层)**
    *   **任务**：获取数据 + 循环渲染。
    *   **机制**：
        *   调用 `useQuery` 拿到 `cabins` 数组。
        *   使用 `cabins.map(cabin => <CabinRow cabin={cabin} />)` 将数据分发下去。

3.  **`Cabins` (页面层)**
    *   **任务**：页面布局（标题 + 表格）。
    *   **机制**：引入并放置 `<CabinTable />`。

4.  **`App` (路由层)**
    *   **任务**：URL 匹配。
    *   **机制**：`<Route path="cabins" element={<Cabins />} />`。

## 4. 总结

**"数据在 `CabinTable` 被获取，通过 Props 流向 `CabinRow`。"**

这就是 React 单向数据流（One-way Data Flow）的典型应用。`CabinTable` 是智能组件（Smart Component），`CabinRow` 是展示组件（Dumb/Presentational Component）。

## 5. 数据修改与自动刷新 (Mutations)

我们实现了删除功能，这涉及到了 React Query 的另一大核心：**Mutations（变更）**。

### A. 流程梳理
1.  **触发**：用户点击 `CabinRow` 里的删除按钮。
2.  **执行**：`useMutation` 调用 `deleteCabin` API 函数，向 Supabase 发送删除指令。
3.  **反馈**：
    *   **Loading**：`isDeleting` 变为 true，按钮变灰禁用，防止重复点击。
    *   **Success**：删除成功后，执行 `onSuccess` 回调。
4.  **自动刷新 (关键步骤)**：
    ```javascript
    queryClient.invalidateQueries({ queryKey: ["cabins"] });
    ```
    *   这行代码告诉 React Query："名为 `['cabins']` 的缓存数据已经脏了（过期了）"。
    *   React Query 听到后，会**立即自动**重新运行 `CabinTable` 里的 `useQuery`。
    *   表格重新获取最新数据，被删除的那一行自动消失。

### B. 代码模式
```jsx
const queryClient = useQueryClient(); // 1. 拿到管家

const { isLoading: isDeleting, mutate } = useMutation({
  mutationFn: deleteCabin, // 2. 定义干活的人
  onSuccess: () => {
    // 3. 干完活后，通知管家刷新数据
    queryClient.invalidateQueries({ queryKey: ["cabins"] });
  }
});
```
这种 **"修改 -> 失效缓存 -> 自动重取"** 的模式，是 React Query 管理服务器状态最强大的地方，它让我们完全不需要手动去操作 DOM 或者手动修改本地 state 数组。
