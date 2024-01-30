"use client";

import PageLayout from "@/components/layout/PageLayout";
import useNotify, { Action } from "@/hooks/useNotify";
import { DISEASE, updateTitle } from "@/lib/messages";
import { api } from "@/server/api";
import DiseaseForm from "../DiseaseForm";

const UpdateDisease = ({ params }: { params: { diseaseId: string } }) => {
  const { notifyResult } = useNotify();
  const trpcContext = api.useUtils();

  const { data, isLoading } = api.disease.getById.useQuery({ id: params.diseaseId });

  const { mutateAsync: update, isLoading: updateLoading } = api.disease.update.useMutation({
    onSuccess: async () => {
      await trpcContext.invalidate();
      notifyResult(Action.Update, DISEASE, true);
      setTimeout(() => (window.location.href = "/disease"), 300);
    },
    onError: (e) => {
      notifyResult(Action.Update, DISEASE, false, e.message);
    }
  });

  const handleSubmit = async (values: any) => {
    await update(values);
  };

  return (
    <PageLayout padding title={updateTitle(DISEASE)}>
      {data && <DiseaseForm data={data} onSubmit={handleSubmit} isSubmitting={isLoading || updateLoading} />}
    </PageLayout>
  );
};

export default UpdateDisease;
