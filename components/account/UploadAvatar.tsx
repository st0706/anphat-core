"use client";

import useNotify, { Action } from "@/hooks/useNotify";
import { defaultHeaders } from "@/lib/common";
import { UploadButton } from "@/lib/uploadthing";
import { Button, Card, Flex, Group, Text } from "@mantine/core";
import type { User } from "@prisma/client";
import "@uploadthing/react/styles.css";
import React, { useEffect, useState } from "react";
import type { ApiResponse } from "types";
import { LetterAvatar } from "../shared";

const UploadAvatar = ({ user }: { user: User }) => {
  const [image, setImage] = useState<string | null>();
  const [loading, setLoading] = useState(false);
  const { notifyResult } = useNotify();

  useEffect(() => {
    setImage(user.image);
  }, [user]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const response = await fetch("/api/users", {
      method: "PUT",
      headers: defaultHeaders,
      body: JSON.stringify({ image })
    });

    const json = (await response.json()) as ApiResponse<User>;
    setLoading(false);

    if (!response.ok) {
      notifyResult(Action.Update, "ảnh đại diện", false, json.error.message);
      return;
    }
    if (image) user.image = image;
    notifyResult(Action.Update, "ảnh đại diện", true);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card radius="md" withBorder>
        <Text fw={500} size="lg">
          Ảnh đại diện
        </Text>
        <Text mt="xs" c="dimmed" size="sm">
          Nhấp vào nút tải lên để tải lên ảnh đại diện tùy chỉnh từ tệp ảnh. <br />
          Các loại tệp được chấp nhận: .PNG, .JPG. Kích thước tệp tối đa: 2 MB.
        </Text>
        <Flex justify="center" align="center" direction="column" wrap="wrap" mt="xs">
          <LetterAvatar url={image} name={user.name} size={96} />
          <UploadButton
            content={{
              button({ ready }) {
                if (ready) return <div>Tải lên</div>;
              },
              allowedContent() {
                return "Hình ảnh dưới 2MB.";
              }
            }}
            className="float-left mt-4 ut-button:bg-red-500 ut-button:ut-readying:bg-red-500/50"
            endpoint="imageUploader"
            onClientUploadComplete={(res) => {
              // Do something with the response
              if (res) setImage(res[0].url);
            }}
            onUploadError={(error: Error) => {
              // Do something with the error.
              notifyResult(Action.Upload, "ảnh đại diện", false, error.message);
            }}
          />
        </Flex>
        <Group justify="flex-end" mt="md">
          <Button type="submit" disabled={!image || image === user.image} loading={loading}>
            Lưu thay đổi
          </Button>
        </Group>
      </Card>
    </form>
  );
};

export default UploadAvatar;
