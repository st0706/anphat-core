"use client";

import useNotify, { Action } from "@/hooks/useNotify";
import { api } from "@/server/api";
import StaffForm from "../StaffForm";
import ScrollToTop from "@/components/shared/ScrollToTop";

const UpdateStaff = ({ params }: { params: { staffId: string } }) => {
  const { notifyResult } = useNotify();
  const context = api.useUtils();
  const { data: staffData, isLoading: getStaffDataLoading } = api.staff.getById.useQuery({ staffId: params.staffId });
  const { mutateAsync: update, isLoading: updateStaffLoading } = api.staff.update.useMutation({
    onSuccess: async () => {
      await context.invalidate();
      notifyResult(Action.Update, "thông tin nhân sự", true);
    },
    onError: async (err: any) => {
      notifyResult(Action.Update, "thông tin nhân sự", false, err.message);
    }
  });

  const handleSubmit = async (values: any) => {
    await update(values);
  };

  return (
    <>
      <StaffForm
        staffData={staffData}
        handleSubmit={handleSubmit}
        isLoading={getStaffDataLoading || updateStaffLoading}
      />
      <ScrollToTop message="Lên đầu trang" />
    </>
  );
};

export default UpdateStaff;
