# ⭐ AnPhat Core

## Giới thiệu

AnPhat Smart Medical là giải pháp quản lý bệnh viện thông minh trên nền tảng điện toán đám mây.

AnPhat Core là thành phần cơ sở của AnPhat Smart Medical bao gồm các tính năng

- Quản lý nhiều khách hàng (multi-tenant)
- Quản lý tổ chức (organization)
- Quản lý ứng dụng: PACS, RIS, Nhân sự, Thiết bị, HIS
- Quản lý người dùng và tài khoản
- Xác thực bằng email & mật khẩu, magic link, hoặc tài khoản bên thứ 3 như Google, Facebook, Apple.
- Phân quyền người dùng (roles, permissions)
- Webhooks và events
- Nhật ký hoạt động

## Công nghệ

- Cơ sở dữ liệu: [Postgres](https://www.postgresql.org)
- ORM: [Prisma](https://www.prisma.io)
- Ngôn ngữ lập trình: [TypeScript](https://www.typescriptlang.org)
- Web framework: [React](https://reactjs.org) 18, [Next.js](https://nextjs.org) 14 app route
- API: [tRPC](https://trpc.io)
- Xác thực người dùng và phân quyền: [NextAuth.js](https://next-auth.js.org/)
- Thư viện giao diện: [Mantine](https://mantine.dev/) 7, [Mantine React Table](https://v2.mantine-react-table.com/)
- IDE: [VS Code](https://code.visualstudio.com/)
- Webhook: [Svix](https://www.svix.com/)
- Audit Logs: [Retraced](https://github.com/retracedhq/)
- Linter: [ESLint](https://eslint.org/)
- Code Formatter: [Prettier](https://prettier.io/)

### Các bước chạy dự án

- Cài đặt các gói thư viện: `yarn`
- Tạo docker chạy postgres bằng lệnh `docker-compose up -d` hoặc cài đặt Postgres trên máy tính
- Sao chép file .env thành file .env.local và sửa cấu hình
- Tạo cơ sở dữ liệu và lược đồ: `yarn db:push`
- Thêm dữ liệu test ban đầu: `yarn db:seed`
- Khởi chạy website ở môi trường dev: `yarn dev`
- Chạy Prisma Studio để quản lý dữ liệu: `yarn prisma studio`
