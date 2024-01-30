"use client";

import PageLayout from "@/components/layout/PageLayout";
import useNotify, { Action } from "@/hooks/useNotify";
import { DISEASE, createTitle } from "@/lib/messages";
import { api } from "@/server/api";
import DiseaseForm from "../DiseaseForm";

const CreateDisease = () => {
  const trpcContext = api.useUtils();
  const { notifyResult } = useNotify();

  const { mutateAsync: createDisease, isLoading } = api.disease.create.useMutation({
    onSuccess: async () => {
      await trpcContext.invalidate();
      notifyResult(Action.Create, DISEASE, true);
      setTimeout(() => (window.location.href = "/disease"), 300);
    },
    onError: (e) => {
      notifyResult(Action.Create, DISEASE, false, e.message);
    }
  });

  const handleSubmit = async (values: any) => {
    await createDisease(values);
  };

  return (
    <PageLayout padding title={createTitle(DISEASE)}>
      <DiseaseForm onSubmit={handleSubmit} isSubmitting={isLoading} />
    </PageLayout>
  );
};

export default CreateDisease;
