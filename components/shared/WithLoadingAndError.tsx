import { Loading } from "@/components/shared";
import { Alert } from "@mantine/core";
import { FC } from "react";

interface Props {
  isLoading: boolean;
  error: any;
  children: React.ReactNode;
}

const WithLoadingAndError: FC<Props> = ({ isLoading, error, children }) => {
  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <Alert color="red">{error.message}</Alert>;
  }

  return <>{children}</>;
};

export default WithLoadingAndError;
