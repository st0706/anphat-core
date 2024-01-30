"use client";

import PageLayout from "@/components/layout/PageLayout";
import useNotify, { Action } from "@/hooks/useNotify";
import { MEDICINE, createTitle } from "@/lib/messages";
import { api } from "@/server/api";
import { useRouter } from "next/navigation";
import MedicineForm from "../MedicineForm";

const Create = () => {
  const router = useRouter();
  const { notifyResult } = useNotify();

  const context = api.useUtils();
  const { mutateAsync: createMedicine, isLoading } = api.medicine.create.useMutation({
    onSuccess: async () => {
      await context.medicine.get.invalidate();
      notifyResult(Action.Create, MEDICINE, true);
      router.push("/medicine");
    },
    onError: (e) => {
      notifyResult(Action.Create, MEDICINE, false, e.message);
    }
  });

  const handleSubmitForm = async (values: any) => {
    await createMedicine(values);
  };

  return (
    <PageLayout padding title={createTitle(MEDICINE)}>
      <MedicineForm onSubmit={handleSubmitForm} isSubmitting={isLoading} />
    </PageLayout>
  );
};

export default Create;
