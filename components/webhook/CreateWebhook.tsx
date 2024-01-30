import useNotify, { Action } from "@/hooks/useNotify";
import { defaultHeaders } from "@/lib/common";
import type { Team } from "@prisma/client";
import useWebhooks from "hooks/useWebhooks";
import { useState } from "react";
import type { ApiResponse, WebookFormSchema } from "types";
import ModalForm from "./Form";

const CreateWebhook = ({
  visible,
  setVisible,
  team
}: {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  team: Team;
}) => {
  const { mutateWebhooks } = useWebhooks(team.slug);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { notifyResult } = useNotify();

  const onSubmit = async (values: WebookFormSchema, form: any) => {
    setIsSubmitting(true);

    const response = await fetch(`/api/teams/${team.slug}/webhooks`, {
      method: "POST",
      headers: defaultHeaders,
      body: JSON.stringify(values)
    });

    const json = (await response.json()) as ApiResponse<Team>;

    setIsSubmitting(false);

    if (!response.ok) {
      notifyResult(Action.Create, "webhook", false, json.error?.message);
      return;
    }

    notifyResult(Action.Create, "webhook", true);
    mutateWebhooks();
    setVisible(false);
    form.reset();
  };

  return (
    <ModalForm
      visible={visible}
      setVisible={setVisible}
      initialValues={{
        name: "",
        url: "",
        eventTypes: []
      }}
      handleSubmit={onSubmit}
      isSubmitting={isSubmitting}
      title="Tạo webhook"
    />
  );
};

export default CreateWebhook;
