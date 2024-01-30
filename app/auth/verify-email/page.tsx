import { Text, Title } from "@mantine/core";

const VerifyEmail = () => {
  return (
    <>
      <Title order={2} ta="center">
        Xác nhận địa chỉ email của bạn
      </Title>
      <Text ta="center" mt="xs">
        Vui lòng nhấp vào liên kết xác minh được gửi tới email của bạn để kích hoạt tài khoản của bạn.
      </Text>
    </>
  );
};

export default VerifyEmail;
