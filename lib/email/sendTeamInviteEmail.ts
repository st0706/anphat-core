import { Invitation, Team } from "@prisma/client";
import { sendEmail } from "./sendEmail";
import { TeamInviteEmail } from "@/components/email";
import { render } from "@react-email/components";
import env from "../env";

export const sendTeamInviteEmail = async (team: Team, invitation: Invitation) => {
  const invitationLink = `${env.appUrl}/auth/invitations/${invitation.token}`;
  const html = render(TeamInviteEmail({ invitationLink, team }));

  await sendEmail({
    to: invitation.email,
    subject: "Lời mời sử dụng ứng dụng",
    html
  });
};
