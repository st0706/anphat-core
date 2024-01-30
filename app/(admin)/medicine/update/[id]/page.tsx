"use client";

import PageLayout from "@/components/layout/PageLayout";
import useNotify, { Action } from "@/hooks/useNotify";
import { MEDICINE, updateTitle } from "@/lib/messages";
import { api } from "@/server/api";
import { useRouter } from "next/navigation";
import MedicineForm from "../../MedicineForm";

const Update = ({ params }) => {
  const router = useRouter();
  const { notifyResult } = useNotify();

  const context = api.useUtils();
  const { mutateAsync: updateMedicine } = api.medicine.update.useMutation({
    onSuccess: async () => {
      await context.medicine.get.invalidate();
      notifyResult(Action.Update, MEDICINE, true);
      router.push("/medicine");
    },
    onError: (e) => {
      notifyResult(Action.Update, MEDICINE, false, e.message);
    }
  });

  const { data, isLoading: getLoading } = api.medicine.getById.useQuery({
    id: params.id
  });

  return (
    <PageLayout padding title={updateTitle(MEDICINE)}>
      {data && <MedicineForm onSubmit={updateMedicine} isSubmitting={getLoading} data={data} />}
    </PageLayout>
  );
};

export default Update;
