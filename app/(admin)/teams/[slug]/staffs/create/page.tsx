"use client";

import React from "react";
import StaffForm from "../StaffForm";
import { api } from "@/server/api";
import useNotify, { Action } from "@/hooks/useNotify";
import ScrollToTop from "@/components/shared/ScrollToTop";

const CreateStaff = () => {
  const { notifyResult } = useNotify();
  const context = api.useUtils();
  const { mutateAsync: create, isLoading: createStaffLoading } = api.staff.create.useMutation({
    onSuccess: async () => {
      notifyResult(Action.Create, "nhân sự", true);
      await context.invalidate();
    },
    onError: async (err: any) => {
      notifyResult(Action.Create, "nhân sự", false, `\n${err.message}`);
    }
  });

  const handleSubmit = async (values: any) => {
    await create(values);
  };

  return (
    <>
      <StaffForm handleSubmit={handleSubmit} isLoading={createStaffLoading} />
      <ScrollToTop message="Lên đầu trang" />
    </>
  );
};

export default CreateStaff;
