# 2025-12-22 学习笔记

## 1. React Query 自定义 Hook 封装与重构

今天主要进行了代码重构，将数据获取和修改的逻辑从 UI 组件中抽离到了自定义 Hooks 中，实现了**关注点分离 (Separation of Concerns)**。

### 1.1 为什么要封装？
- **UI 纯粹性**：组件只负责展示和交互，不处理复杂的数据逻辑。
- **复用性**：同一个数据逻辑（如“删除小屋”）可以在多个地方复用（如列表行、详情页）。
- **可维护性**：修改数据逻辑时，只需改 Hook 文件，不用去翻组件代码。

### 1.2 封装模式
我们创建了以下 Hook：
- `useCabins`: 封装 `useQuery` 获取数据。
- `useDeleteCabin`: 封装 `useMutation` 删除数据。
- `useCreateCabin`: 封装 `useMutation` 创建数据。
- `useEditCabin`: 封装 `useMutation` 编辑数据。
- `useSettings`: 获取设置数据。
- `useUpdateSetting`: 更新设置数据。

**核心结构示例 (`useUpdateSetting.js`)**:
```javascript
export function useUpdateSetting() {
  const queryClient = useQueryClient();

  const { mutate: updateSetting, isLoading: isUpdating } = useMutation({
    mutationFn: updateSettingApi,
    onSuccess: () => {
      toast.success("Settings edited successfully");
      queryClient.invalidateQueries({ queryKey: ["settings"] });
    },
    onError: (error) => toast.error(error.message),
  });

  return { isUpdating, updateSetting };
}
```

### 1.3 关键知识点
- **解构重命名**: `const { mutate: createCabin } = useMutation(...)`。将通用的 `mutate` 重命名为语义化的 `createCabin`。
- **参数传递**: `useMutation` 的 `mutationFn` 只能接收**一个变量**。如果 API 需要多个参数（如编辑时的 `id` 和 `data`），需要包装成对象传递：`mutationFn: ({ newData, id }) => api(newData, id)`。
- **Hook 纯净性**: 自定义 Hook 中不应包含组件特有的逻辑（如 `reset()` 表单）。`reset` 应该在组件调用 `mutate` 时通过 `{ onSuccess: () => reset() }` 传入。

---

## 2. 实现“复制”功能 (Duplicate Feature)

实现了点击按钮一键复制小屋的功能。

### 实现思路
1.  **复用 Hook**: 直接使用 `useCreateCabin`。
2.  **构造数据**: 创建一个 `handleDuplicate` 函数，复制当前小屋的所有字段，但修改 `name` 为 `"Copy of ..."`。
3.  **图片处理**: 直接复用原图片的 URL 字符串。

### 遇到的坑与修复
- **问题**: 复制时传入的是图片 URL 字符串，而非 File 对象，导致上传逻辑报错。
- **修复**: 在 `apiCabins.js` 中添加判断。如果 `image` 路径包含 Supabase URL（说明是旧图片），则**跳过上传步骤**，直接将 URL 存入数据库。

```javascript
// apiCabins.js
const hasImagePath = newCabin.image?.startsWith?.(supabaseUrl);
// ...
if (hasImagePath) return data; // 如果是旧图片，直接返回，不执行 upload
```

---

## 3. 设置页面 (Settings) 的实时更新

实现了“失焦即保存” (Auto-save on Blur) 的功能。

### 3.1 数据流向
1.  **Read**: `useSettings` 获取数据 -> 填入 `<Input defaultValue={...} />`。
2.  **Update**: 用户修改 -> 触发 `onBlur` 事件 -> 调用 `handleUpdate`。
3.  **Write**: `useUpdateSetting` 调用 API -> 更新数据库 -> `invalidateQueries` 刷新缓存 -> 界面更新。

### 3.2 进阶写法解析
在 `UpdateSettingsForm.jsx` 中使用了**计算属性名**来实现通用处理函数：

```javascript
function handleUpdate(e, field) {
  const { value } = e.target;
  if (!value) return;
  // [field] 动态将变量值作为对象的 Key
  updateSetting({ [field]: value });
}
```
- **调用**: `onBlur={(e) => handleUpdate(e, "minBookingLength")}`
- **效果**: 相当于动态生成了 `{ minBookingLength: "..." }` 对象。

---

## 4. 调试经验 (Debugging)

- **Silent Failure (静默失败)**: 拼写错误（如 `isLodading` vs `isLoading`）在解构赋值中不会报错，只会得到 `undefined`，导致逻辑失效（如 Spinner 不显示）。
- **API 返回值**: Supabase 的 `.single()` 返回对象，不带 `.single()` 返回数组。前端处理返回值时要对应（`data` vs `data[0]`）。
