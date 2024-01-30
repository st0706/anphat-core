import useNotify, { Action } from "@/hooks/useNotify";
import { Button, Group, Modal, TextInput } from "@mantine/core";
import type { Team } from "@prisma/client";
import { useState } from "react";
import { useSWRConfig } from "swr";
import type { ApiResponse } from "types";
import { CopyToClipboardButton } from "../shared";

const NewAPIKey = ({ team, createModalVisible, setCreateModalVisible }: NewAPIKeyProps) => {
  const { mutate } = useSWRConfig();
  const [apiKey, setApiKey] = useState("");

  const onNewAPIKey = (apiKey: string) => {
    setApiKey(apiKey);
    mutate(`/api/teams/${team.slug}/api-keys`);
  };

  const toggleVisible = () => {
    setCreateModalVisible(!createModalVisible);
    setApiKey("");
  };

  return (
    <Modal opened={createModalVisible} className="p-8" onClose={toggleVisible} title="Khóa API mới">
      {apiKey === "" ? <CreateAPIKeyForm team={team} onNewAPIKey={onNewAPIKey} /> : <DisplayAPIKey apiKey={apiKey} />}
    </Modal>
  );
};

const CreateAPIKeyForm = ({ team, onNewAPIKey }: CreateAPIKeyFormProps) => {
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { notifyResult } = useNotify();

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setSubmitting(true);

    const res = await fetch(`/api/teams/${team.slug}/api-keys`, {
      method: "POST",
      body: JSON.stringify({ name })
    });

    const { data, error } = (await res.json()) as ApiResponse<{
      apiKey: string;
    }>;

    setSubmitting(false);

    if (error) {
      notifyResult(Action.Create, "khóa API", false, error.message);
      return;
    }

    if (data.apiKey) {
      onNewAPIKey(data.apiKey);
      notifyResult(Action.Create, "khóa API", true);
    }
  };

  return (
    <form onSubmit={handleSubmit} method="POST">
      <p className="text-sm text-gray-500">Khóa API cho phép ứng dụng khác giao tiếp với API.</p>
      <div className="flex flex-col space-y-3 mt-4">
        <TextInput label="Tên" name="name" required value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <Group justify="flex-end" mt="md">
        <Button type="submit" loading={submitting} disabled={!name}>
          Tạo khóa API
        </Button>
      </Group>
    </form>
  );
};

const DisplayAPIKey = ({ apiKey }: DisplayAPIKeyProps) => {
  return (
    <>
      <p className="text-sm text-gray-500">
        Lưu khóa API này ở nơi an toàn. Bạn sẽ không thể nhìn thấy nó nữa khi đóng hộp thoại này.
      </p>
      <div className="flex flex-col space-y-3 mt-4">
        <TextInput label="Khóa API" value={apiKey} rightSection={<CopyToClipboardButton value={apiKey || ""} />} />
      </div>
    </>
  );
};

interface NewAPIKeyProps {
  team: Team;
  createModalVisible: boolean;
  setCreateModalVisible: (visible: boolean) => void;
}

interface CreateAPIKeyFormProps {
  team: Team;
  onNewAPIKey: (apiKey: string) => void;
}

interface DisplayAPIKeyProps {
  apiKey: string;
}

export default NewAPIKey;
