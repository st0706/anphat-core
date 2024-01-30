import useNotify, { Action } from "@/hooks/useNotify";
import { api } from "@/server/api";
import { DataGrid, TreeNode } from "@/types";
import { Box, Modal, Title } from "@mantine/core";
import { Team } from "@prisma/client";
import "@uploadthing/react/styles.css";
import OrganizationForm from "./OrganizationForm";

interface IProps {
  ShowModalCreate: boolean;
  setShowModalCreate: (value: boolean) => void;
  organization: TreeNode | DataGrid | null;
  setOrganization: (value: TreeNode | DataGrid | null) => void;
  team: Team;
}

const CreateStaffModal = (props: IProps) => {
  const { notifyResult } = useNotify();
  const { ShowModalCreate, setShowModalCreate, organization, setOrganization, team } = props;

  const handleCloseModal = () => {
    setOrganization(null);
    setShowModalCreate(false);
  };

  const context = api.useUtils();
  const createOrganization = api.organization.create.useMutation({
    onSuccess: async () => {
      await context.organization.getAll.invalidate();
      handleCloseModal();
      notifyResult(Action.Create, "đơn vị trực thuộc", true);
    },
    onError: (e) => {
      notifyResult(Action.Create, "đơn vị trực thuộc", false, e.message);
    }
  });

  const handleSubmit = async (values: any) => {
    await createOrganization.mutate(values);
  };

  return (
    <Modal.Root size={"xl"} opened={ShowModalCreate} onClose={handleCloseModal}>
      <Modal.Overlay />
      <Modal.Content>
        <Modal.Header>
          <Modal.Title style={{ margin: "auto" }}>
            <Title order={3}>Thêm mới đơn vị trực thuộc</Title>
          </Modal.Title>
          <Modal.CloseButton style={{ margin: "0" }} />
        </Modal.Header>
        <Modal.Body>
          <Box mx="auto">
            <OrganizationForm team={team} parentId={organization?.id} handleSubmit={handleSubmit} />
          </Box>
        </Modal.Body>
      </Modal.Content>
    </Modal.Root>
  );
};

export default CreateStaffModal;
