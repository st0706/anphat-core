"use client";

import useNotify, { Action } from "@/hooks/useNotify";
import { api } from "@/server/api";
import { DataGrid, TreeNode } from "@/types";
import { Button, Modal, Title } from "@mantine/core";

interface IProps {
  ShowModalDelete: boolean;
  setShowModalDelete: (value: boolean) => void;
  organization: TreeNode | DataGrid | null;
  setOrganization: (value: TreeNode | DataGrid | null) => void;
}

const DeleteOrganizationModal = (props: IProps) => {
  const { notifyResult } = useNotify();
  const { ShowModalDelete, setShowModalDelete, organization, setOrganization } = props;

  const handleCloseModal = () => {
    setOrganization(null);
    setShowModalDelete(false);
  };

  const context = api.useUtils();
  const deleteOrganization = api.organization.delete.useMutation({
    onSuccess: async () => {
      handleCloseModal();
      await context.organization.getAll.invalidate();
      notifyResult(Action.Delete, "đơn vị trực thuộc", true);
    },
    onError: (e) => {
      notifyResult(Action.Delete, "đơn vị trực thuộc", false, e.message);
    }
  });

  const handleConfirm = async () => {
    const organizationId = props.organization?.id;
    if (organizationId) {
      const objId = {
        id: organizationId
      };
      await deleteOrganization.mutate(objId);
    }
  };
  return (
    <Modal.Root opened={ShowModalDelete} onClose={handleCloseModal}>
      <Modal.Overlay />
      <Modal.Content>
        <Modal.Header>
          <Modal.Title>
            <Title order={3}>Xóa đơn vị trực thuộc</Title>
          </Modal.Title>
          <Modal.CloseButton />
        </Modal.Header>
        <Modal.Body>
          {organization ? (
            <>
              <p style={{ textAlign: "center" }}>{`Bạn có chắc muốn xóa ${organization.name} ?`}</p>
              <p style={{ textAlign: "center" }}>
                {`Chú ý: Xóa đơn vị trực thuộc này thì các đơn vị trực thuộc bên trong nó cũng sẽ bị xóa!`}
              </p>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "5rem"
                }}>
                <Button onClick={() => handleConfirm()} justify="center" my={15} variant="filled" color="red">
                  OK
                </Button>
                <Button size="md" onClick={() => handleCloseModal()} justify="center" my={15} variant="default">
                  Cancel
                </Button>
              </div>
            </>
          ) : (
            <div>Đơn vị trực thuộc này không còn!</div>
          )}
        </Modal.Body>
      </Modal.Content>
    </Modal.Root>
  );
};

export default DeleteOrganizationModal;
