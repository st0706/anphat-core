import UpdateAccount from "@/components/account/UpdateAccount";
import { Error } from "@/components/shared";
import { getServerAuthSession } from "@/server/auth";
import { getUserBySession } from "@/models/user";

const Account = async () => {
  const session = await getServerAuthSession();
  const user = await getUserBySession(session);

  if (!user) {
    return <Error message="Không tìm thấy thông tin người dùng" />;
  }

  return <UpdateAccount user={user} />;
};

export default Account;
