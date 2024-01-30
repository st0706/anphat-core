import { Error, Loading } from "@/components/shared";
import useNotify, { Action } from "@/hooks/useNotify";
import { defaultHeaders } from "@/lib/common";
import type { Team } from "@prisma/client";
import useWebhook from "hooks/useWebhook";
import useWebhooks from "hooks/useWebhooks";
import { useState } from "react";
import type { EndpointOut } from "svix";
import type { ApiResponse, WebookFormSchema } from "types";
import ModalForm from "./Form";

const EditWebhook = ({
  visible,
  setVisible,
  team,
  endpoint
}: {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  team: Team;
  endpoint: EndpointOut;
}) => {
  const { isLoading, isError, webhook } = useWebhook(team.slug, endpoint.id);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { mutateWebhooks } = useWebhooks(team.slug);
  const { notifyResult } = useNotify();

  if (isLoading || !webhook) {
    return <Loading />;
  }

  if (isError) {
    return <Error message={isError.message} />;
  }

  const onSubmit = async (values: WebookFormSchema, form: any) => {
    setIsSubmitting(true);

    const response = await fetch(`/api/teams/${team.slug}/webhooks/${endpoint.id}`, {
      method: "PUT",
      headers: defaultHeaders,
      body: JSON.stringify(values)
    });

    const json = (await response.json()) as ApiResponse;

    setIsSubmitting(false);

    if (!response.ok) {
      notifyResult(Action.Update, "webhook", false, json.error?.message);
      return;
    }

    notifyResult(Action.Update, "webhook", true);
    mutateWebhooks();
    setVisible(false);
    form.reset();
  };

  return (
    <ModalForm
      visible={visible}
      setVisible={setVisible}
      initialValues={{
        name: webhook.description as string,
        url: webhook.url,
        eventTypes: webhook.filterTypes as string[]
      }}
      handleSubmit={onSubmit}
      isSubmitting={isSubmitting}
      title="Chỉnh sửa địa chỉ Webhook"
    />
  );
};

export default EditWebhook;
