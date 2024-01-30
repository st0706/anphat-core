import { WithLoadingAndError } from "@/components/shared";
import useModal, { DeleteAction } from "@/hooks/useModal";
import useNotify, { Action } from "@/hooks/useNotify";
import { defaultHeaders } from "@/lib/common";
import { Alert, Button } from "@mantine/core";
import { Team } from "@prisma/client";
import { IconInfoCircle } from "@tabler/icons-react";
import useWebhooks from "hooks/useWebhooks";
import { useState } from "react";
import type { EndpointOut } from "svix";
import type { ApiResponse } from "types";
import CreateWebhook from "./CreateWebhook";
import EditWebhook from "./EditWebhook";

const Webhooks = ({ team }: { team: Team }) => {
  const [createWebhookVisible, setCreateWebhookVisible] = useState(false);
  const [updateWebhookVisible, setUpdateWebhookVisible] = useState(false);
  const [endpoint, setEndpoint] = useState<EndpointOut | null>(null);
  const { notifyResult } = useNotify();
  const { confirmDelete } = useModal();
  const { isLoading, isError, webhooks, mutateWebhooks } = useWebhooks(team.slug);

  const deleteWebhook = async (webhook: EndpointOut | null) => {
    if (!webhook) return;

    const sp = new URLSearchParams({ webhookId: webhook.id });

    const response = await fetch(`/api/teams/${team.slug}/webhooks?${sp.toString()}`, {
      method: "DELETE",
      headers: defaultHeaders
    });

    const json = (await response.json()) as ApiResponse;

    if (!response.ok) {
      notifyResult(Action.Delete, "webhook", false, json.error?.message);
      return;
    }

    mutateWebhooks();
    notifyResult(Action.Delete, "webhook", true);
  };

  return (
    <WithLoadingAndError isLoading={isLoading} error={isError}>
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <div className="space-y-3">
            <h2 className="text-xl font-medium leading-none tracking-tight">Webhooks</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Webhooks được sử dụng để gửi thông báo đến các ứng dụng bên ngoài của bạn.
            </p>
          </div>
          <Button variant="outline" onClick={() => setCreateWebhookVisible(!createWebhookVisible)}>
            Thêm webhook
          </Button>
        </div>
        {webhooks?.length === 0 ? (
          <Alert title="Bạn chưa tạo bất kỳ webhook nào" icon={<IconInfoCircle />}></Alert>
        ) : (
          <div className="overflow-x-auto">
            <table className="text-sm table w-full border-b dark:border-base-200">
              <thead className="bg-base-200">
                <tr>
                  <th>Tên</th>
                  <th>Đường dẫn URL</th>
                  <th>Ngày tạo</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {webhooks?.map((webhook) => {
                  return (
                    <tr key={webhook.id}>
                      <td>{webhook.description}</td>
                      <td>{webhook.url}</td>
                      <td>{webhook.createdAt.toLocaleString()}</td>
                      <td>
                        <div className="flex space-x-2">
                          <Button
                            size="xs"
                            variant="outline"
                            onClick={() => {
                              setEndpoint(webhook);
                              setUpdateWebhookVisible(!updateWebhookVisible);
                            }}>
                            Chỉnh sửa
                          </Button>
                          <Button
                            size="xs"
                            color="red"
                            variant="outline"
                            onClick={() =>
                              confirmDelete(
                                "webhook",
                                () => deleteWebhook(webhook),
                                webhook.description,
                                DeleteAction.Delete,
                                "Xóa webhook này sẽ chấm dứt vĩnh viễn chức năng của nó."
                              )
                            }>
                            Xóa
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
        {endpoint && (
          <EditWebhook
            visible={updateWebhookVisible}
            setVisible={setUpdateWebhookVisible}
            team={team}
            endpoint={endpoint}
          />
        )}
      </div>

      <CreateWebhook visible={createWebhookVisible} setVisible={setCreateWebhookVisible} team={team} />
    </WithLoadingAndError>
  );
};

export default Webhooks;
