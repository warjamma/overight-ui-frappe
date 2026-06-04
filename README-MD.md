**Dev Guide**

**1. Cài app vào Frappe**

Từ bench folder:

```bash
bench get-app /path/to/infintrix_theme
bench --site your-site install-app infintrix_theme
bench --site your-site migrate
bench build
bench restart
```

Sau đó vào Frappe Desk `/app`, theme sẽ dùng bundle đã build sẵn:

```text
/assets/infintrix_theme/js/sidebar_menu/build/sidebar.js
/assets/infintrix_theme/js/sidebar_menu/build/sidebar.css
```

Không cần config thêm cho production/server.

**2. Dev realtime React sidebar**

Bật developer mode cho site:

```bash
bench --site your-site set-config developer_mode 1
bench --site your-site clear-cache
```

Start Frappe:

```bash
bench start
```

Mở terminal khác, start Vite:

```bash
cd apps/infintrix_theme/infintrix_theme/public/js/sidebar_menu
yarn install
yarn dev
```

Mặc định Vite chạy ở:

```text
http://localhost:5173
```

Khi `developer_mode = 1`, Frappe tự load React sidebar từ Vite dev server, nên sửa file `.tsx/.css` sẽ hot reload ngay trong `/app`.

**3. Nếu Vite chạy port khác**

Ví dụ Vite chạy `5174`:

```bash
bench --site your-site set-config infintrix_sidebar_dev_server http://localhost:5174
bench --site your-site clear-cache
```

Muốn quay lại auto mặc định:

```bash
bench --site your-site set-config infintrix_sidebar_dev_server ""
bench --site your-site clear-cache
```

**4. Build lại cho production**

Sau khi dev xong:

```bash
cd apps/infintrix_theme/infintrix_theme/public/js/sidebar_menu
yarn build
```

Commit các file build:

```text
infintrix_theme/public/js/sidebar_menu/build/sidebar.js
infintrix_theme/public/js/sidebar_menu/build/sidebar.css
```

Khi cài lên Frappe không bật developer mode, nó sẽ dùng chính các file build này.

**Flow chuẩn**

Dev:

```text
developer_mode = 1
bench start
yarn dev
Frappe load Vite realtime
```

Production/server:

```text
developer_mode = 0
bench build / install app
Frappe load sidebar.js + sidebar.css build sẵn
```