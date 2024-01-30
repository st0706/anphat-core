import { api } from "@/server/api";
import { DataGrid, TreeNode } from "@/types";
import { Box, Modal, Title } from "@mantine/core";
import { Team } from "@prisma/client";
import "@uploadthing/react/styles.css";
import OrganizationForm from "./OrganizationForm";
import useNotify, { Action } from "@/hooks/useNotify";

interface IProps {
  ShowModalUpdate: boolean;
  setShowModalUpdate: (value: boolean) => void;
  organization: TreeNode | DataGrid | null;
  setOrganization: (value: TreeNode | DataGrid | null) => void;
  team: Team;
}

let UpdateOrganizationModal = (props: IProps) => {
  const { notifyResult } = useNotify();
  const { ShowModalUpdate, setShowModalUpdate, organization, setOrganization, team } = props;

  const handleCloseModal = () => {
    setOrganization(null);
    setShowModalUpdate(false);
  };

  const context = api.useContext();
  const updateOrganization = api.organization.update.useMutation({
    onSuccess: async () => {
      await context.organization.getAll.invalidate();
      handleCloseModal();
      notifyResult(Action.Update, "đơn vị trực thuộc", true);
    },
    onError: (e) => {
      notifyResult(Action.Update, "đơn vị trực thuộc", false, e.message);
    }
  });

  const handleSubmit = async (values: any) => {
    await updateOrganization.mutate(values);
  };

  return (
    <Modal.Root size={"xl"} opened={ShowModalUpdate} onClose={handleCloseModal}>
      <Modal.Overlay />
      <Modal.Content>
        <Modal.Header>
          <Modal.Title style={{ margin: "auto" }}>
            <Title order={3}>Cập nhật đơn vị trực thuộc</Title>
          </Modal.Title>
          <Modal.CloseButton style={{ margin: "0" }} />
        </Modal.Header>
        <Modal.Body>
          <Box mx="auto">
            <OrganizationForm team={team} organization={organization} handleSubmit={handleSubmit} />
          </Box>
        </Modal.Body>
      </Modal.Content>
    </Modal.Root>
  );
};

export default UpdateOrganizationModal;
