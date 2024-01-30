import env from "@/lib/env";
import type { User } from "@prisma/client";
import UpdateEmail from "./UpdateEmail";
import UpdateName from "./UpdateName";
import UpdateTheme from "./UpdateTheme";
import UploadAvatar from "./UploadAvatar";

const UpdateAccount = ({ user }: { user: User }) => {
  return (
    <div className="flex gap-6 flex-col">
      <UpdateName user={user} />
      <UpdateEmail user={user} />
      <UploadAvatar user={user} />
      {env.darkModeEnabled && <UpdateTheme />}
    </div>
  );
};

export default UpdateAccount;
