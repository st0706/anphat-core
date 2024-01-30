"use client";

import ImportExcelPopup from "@/components/shared/ImportExcelPopup";
import TableRowActions from "@/components/table/TableRowActions";
import TableToolbar from "@/components/table/TableToolbar";
import { useCustomTable } from "@/hooks/useCustomTable";
import useImportExcel from "@/hooks/useImportExcel";
import useModal, { DeleteAction } from "@/hooks/useModal";
import useNotify, { Action } from "@/hooks/useNotify";
import { createTitle, updateTitle } from "@/lib/messages";
import { api } from "@/server/api";
import { Button, Group, LoadingOverlay, Paper, Title } from "@mantine/core";
import { modals } from "@mantine/modals";
import { BloodCode } from "@prisma/client";
import { MRT_ColumnDef, MRT_PaginationState, MantineReactTable } from "mantine-react-table";
import "mantine-react-table/styles.css";
import { useMemo, useRef, useState } from "react";
import BloodCodeForm from "./BloodCodeForm";

const BLOOD_CODE = "mã máu";
const headers = ["ordNum", "bloodCode", "unitsPreparations", "actualVolume", "note"];

const BloodCodePage = () => {
  const [importMethod, setImportMethod] = useState<string | null>("UPDATE");
  const [showImportPopup, setShowImportPopup] = useState(false);
  const [globalFilter, setGlobalFilter] = useState("");
  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: 10
  });
  const { data, isLoading, isError } = api.bloodCode.get.useQuery({
    searchKey: globalFilter || "",
    pageIndex: pagination.pageIndex,
    pageSize: pagination.pageSize
  });
  const { dataUpload, handleFileChange, setDataUpload } = useImportExcel({ headers });
  const resetRef = useRef<() => void>(null);
  const { notifyResult } = useNotify();
  const { confirmDelete } = useModal();
  const trpcContext = api.useUtils();

  const { mutateAsync: createBloodCode, isLoading: isCreating } = api.bloodCode.create.useMutation({
    onSuccess: async () => {
      await trpcContext.invalidate();
      notifyResult(Action.Create, BLOOD_CODE, true);
    },
    onError: (e) => {
      notifyResult(Action.Create, BLOOD_CODE, false, e.message);
    }
  });

  const handleCreate = () => {
    const modalId = "create-blood";
    modals.open({
      modalId: modalId,
      title: createTitle(BLOOD_CODE),
      centered: true,
      closeOnClickOutside: false,
      children: (
        <BloodCodeForm
          isSubmitting={isCreating}
          onSubmit={async (values) => {
            const res = await createBloodCode(values);
            if (res.id) modals.close(modalId);
          }}
          onClose={() => modals.close(modalId)}
        />
      )
    });
  };

  const { mutateAsync: update, isLoading: isUpdating } = api.bloodCode.update.useMutation({
    onSuccess: async () => {
      await trpcContext.invalidate();
      notifyResult(Action.Update, BLOOD_CODE, true);
    },
    onError: (e) => {
      notifyResult(Action.Update, BLOOD_CODE, false, e.message);
    }
  });

  const handleUpdate = (row: BloodCode) => {
    const modalId = "update-blood";
    modals.open({
      modalId: modalId,
      title: updateTitle(BLOOD_CODE),
      centered: true,
      closeOnClickOutside: false,
      children: (
        <BloodCodeForm
          data={row}
          isSubmitting={isUpdating}
          onSubmit={async (values) => {
            await update(values);
            modals.close(modalId);
          }}
          onClose={() => modals.close(modalId)}
        />
      )
    });
  };

  const { mutateAsync: deleteOne, isLoading: isDeleting } = api.bloodCode.delete.useMutation({
    onSuccess: async () => {
      await trpcContext.invalidate();
      notifyResult(Action.Delete, BLOOD_CODE, true);
    },
    onError: (e) => {
      notifyResult(Action.Delete, BLOOD_CODE, false, e.message);
    }
  });

  const handleDelete = (row: BloodCode) =>
    confirmDelete(
      BLOOD_CODE,
      async () => {
        await deleteOne({ id: row.id });
      },
      row.bloodCode
    );

  const { mutateAsync: deleteAll, isLoading: isDeletingAll } = api.bloodCode.deleteAll.useMutation({
    onSuccess: async () => {
      await trpcContext.invalidate();
      notifyResult(Action.DeleteAll, BLOOD_CODE, true);
    },
    onError: (e) => {
      notifyResult(Action.DeleteAll, BLOOD_CODE, false, e.message);
    }
  });

  const handleDeleteAll = () =>
    confirmDelete(
      BLOOD_CODE,
      async () => {
        await deleteAll();
        await trpcContext.bloodCode.invalidate();
      },
      undefined,
      DeleteAction.DeleteAll
    );

  const { mutateAsync: importData, isLoading: isImporting } = api.bloodCode.import.useMutation({
    onSuccess: async () => {
      setDataUpload([]);
      await trpcContext.invalidate();
      notifyResult(Action.Import, BLOOD_CODE, true);
    },
    onError: (e) => {
      notifyResult(Action.Import, BLOOD_CODE, false, e.message);
    }
  });

  const handleImport = async () => {
    if (dataUpload) await importData({ dataUpload: dataUpload!, importMethod });
  };

  const columns = useMemo<MRT_ColumnDef<BloodCode>[]>(
    () => [
      {
        accessorKey: "bloodCode",
        header: "Mã máu",
        minSize: 100,
        size: 50
      },
      {
        accessorKey: "unitsPreparations",
        header: "Điều chế và chế phẩm",
        minSize: 100
      },
      {
        accessorKey: "actualVolume",
        header: "Thể tích thực\n(ml)(+10%)",
        minSize: 100,
        size: 50
      },
      {
        accessorKey: "note",
        header: "Ghi chú",
        minSize: 100
      }
    ],
    []
  );

  const table = useCustomTable<BloodCode>({
    columns,
    data: (dataUpload.length > 0 ? dataUpload : data?.queryData) || [],
    rowCount: dataUpload.length > 0 ? dataUpload.length : data?.rowCount,
    state: {
      isLoading,
      globalFilter,
      pagination,
      showAlertBanner: isError,
      showProgressBars: isLoading || isImporting || isDeleting || isDeletingAll
    },
    manualFiltering: dataUpload.length > 0 ? false : true,
    onGlobalFilterChange: setGlobalFilter,
    manualPagination: dataUpload.length > 0 ? false : true,
    onPaginationChange: setPagination,
    getRowId: (row) => row.id,
    renderRowActions: ({ row }) => (
      <TableRowActions onUpdate={() => handleUpdate(row.original)} onDelete={() => handleDelete(row.original)} />
    ),
    renderTopToolbar: () => (
      <TableToolbar
        table={table}
        onCreate={handleCreate}
        onImport={() => setShowImportPopup(true)}
        onDeleteAll={data?.queryData.length! > 0 ? handleDeleteAll : undefined}
      />
    )
  });

  return (
    <>
      <LoadingOverlay visible={isImporting} />
      <Paper withBorder radius="md">
        <Title order={3} mt="md" px="md">
          Danh mục {BLOOD_CODE}
        </Title>
        <MantineReactTable table={table} />
        {dataUpload?.length !== 0 && (
          <Group justify="flex-end" align="end" m={"xs"}>
            <Button
              color="red"
              variant="filled"
              onClick={() => {
                setDataUpload([]);
                resetRef.current?.();
              }}>
              Hủy bỏ
            </Button>
            <Button loading={isImporting} color="green" variant="filled" onClick={() => handleImport()}>
              Lưu thay đổi
            </Button>
          </Group>
        )}
      </Paper>
      <ImportExcelPopup
        importMethod={importMethod}
        opened={showImportPopup}
        setShowImportPopup={setShowImportPopup}
        headerCols={headers}
        resetRef={resetRef}
        handleFileChange={handleFileChange}
        setDataUpload={setDataUpload}
        dataUpload={dataUpload}
        setImportMethod={setImportMethod}
      />
    </>
  );
};

export default BloodCodePage;
