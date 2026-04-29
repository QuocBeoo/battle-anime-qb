# Battle Anime QB

Game 2D dạng side-view: nhân vật sprite, nền map, hành động theo trạng thái (`idle`, `run`, `atk1`, `atk2`, …).

## Demo

![Gameplay demo](public/screenshot/my_page.png)

*(Ảnh nguồn: `public/screenshot/my_page.png` — dùng cùng file này cho preview; bản build có thể đặt bản sao tại `dist/screenshot/` nếu cần.)*

## Chạy dự án

```bash
yarn install
yarn dev
```

Build production:

```bash
yarn build
yarn preview
```

## Triển khai (Vercel)

Repo có [`vercel.json`](vercel.json): Vercel dùng **Yarn**, chạy **`yarn build`** (`tsc && vite build`), output thư mục **`dist`**.

1. Đẩy source lên GitHub (hoặc GitLab / Bitbucket).
2. Vào [Vercel](https://vercel.com) → **Add New… → Project** → import repo.
3. Giữ mặc định (Vite được nhận; khớp `vercel.json`) → **Deploy**.
4. Mỗi lần push lên nhánh production đã nối sẽ tự build lại.

Hoặc dùng [Vercel CLI](https://vercel.com/docs/cli): cài CLI, trong thư mục project chạy `vercel` và link project một lần.

## Điều khiển (bàn phím)

| Phím | Hành vi |
|------|--------|
| **←** / **→** | Di chuyển; giữ phím tăng tốc dần; thả về `idle`. Mũi trái lật sprite để quay mặt sang trái. |
| **O** | `atk1` (không lặp khi giữ `keydown.repeat`) |
| **P** | `atk2` (tương tự) |
| **Q** | `atk1` |
| **Q** + **↓** (combo) | `atk2` |

## Stack & công cụ

- **React 18** + **TypeScript**
- **Vite 5** (dev server, build), **@vitejs/plugin-react-swc** (Fast Refresh qua SWC)
- **Tailwind CSS 3** + PostCSS / Autoprefixer (entry `index.css`)
- **ESLint** (`typescript-eslint`, `react-hooks`, `react-refresh`)

## Kỹ thuật áp dụng trong source

### Hành động & animation

- **`IListValueAction`** (`src/constants/interface.ts`): enum trạng thái hành động (`idle`, `run`, `atk1`, `atk2`, …).
- **`STEP_ACTION`**: số frame / bước animation theo nhân vật và từng action → class `steps-*` trên `Player`.
- **`ACTION_DETAIL`**: thời lượng (và metadata khác) mỗi action; sau hết thời gian, action tấn công tự về `idle` (trừ `run`, xử lý riêng khi thả phím).
- Sprite sheet: ảnh `public/imgs/figure/<character>/<action>.png`; đổi **CSS variables** trên `document.documentElement` (`--img1`, `--img2`, `--second`) để đồng bộ background animation toàn cục (`root.css`, `stepAction.css`).

### Di chuyển & biên màn hình

- **`requestAnimationFrame`**: tốc độ theo thời gian giữ phím (gia tốc có trần px/s).
- **Clamp vị trí**: theo `offsetParent` (`.container-main`) và `offsetWidth` nhân vật; **`CHARACTER_SPRITE_INSET`** (`src/constants/characterVisualBounds.ts`) bù padding trong suốt hai bên khung 375×375 để mép “thân” nhân vật sát viền hơn thay vì mép khung div.
- **`overflow-x: hidden`** trên `html`, `body`, `#root`, `.container-main` + `width: 100%` / `max-width: 100%` để tránh thanh cuộn ngang khi offset cho phép hơi tràn layout.

### Hướng nhìn (flip)

- State **`facingLeft`** kết hợp prop **`flipPlayer`** (nhân vật 2): `scaleX(-1)` khi `flipPlayer !== facingLeft` để đảo sprite đúng hướng di chuyển / spawn.

### Cấu trúc chính

- `src/components/Player.tsx`: state action, input bàn phím, RAF di chuyển, transform `translateX` + scale.
- `src/App.tsx`: scene `container-main`, khởi tạo `Player` theo `IListCharacter`.

---

Phần mở rộng ESLint type-aware (parserOptions `project`, …) vẫn có thể áp dụng theo [hướng dẫn template Vite + TS](https://vitejs.dev/) nếu bạn muốn siết rule theo kiểu type-checked.
