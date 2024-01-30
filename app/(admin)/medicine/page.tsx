"use client";

import ImportExcelPopup from "@/components/shared/ImportExcelPopup";
import TableRowActions from "@/components/table/TableRowActions";
import TableToolbar from "@/components/table/TableToolbar";
import { useCustomTable } from "@/hooks/useCustomTable";
import useImportExcel from "@/hooks/useImportExcel";
import useModal, { DeleteAction } from "@/hooks/useModal";
import useNotify, { Action } from "@/hooks/useNotify";
import { MEDICINE } from "@/lib/messages";
import { api } from "@/server/api";
import { Button, Group, Paper, Title } from "@mantine/core";
import { Medicine } from "@prisma/client";
import { MRT_PaginationState, MantineReactTable, type MRT_ColumnDef } from "mantine-react-table";
import "mantine-react-table/styles.css";
import { useRouter } from "next/navigation";
import { useMemo, useRef, useState } from "react";

const headers = [
  "id",
  "registrationNumber",
  "name",
  "ingredientCode",
  "ingredient",
  "ingredientRegistration",
  "sugarCode",
  "sugar",
  "content",
  "pack",
  "manufacture",
  "country"
];

const MedicinePage = () => {
  const router = useRouter();
  const { notifyResult } = useNotify();
  const { confirmDelete } = useModal();

  const [importMethod, setImportMethod] = useState<string | null>("UPDATE");
  const [showImportPopup, setShowImportPopup] = useState(false);
  const [globalFilter, setGlobalFilter] = useState("");
  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: 10
  });

  const { data, isLoading, isError } = api.medicine.get.useQuery({
    search: globalFilter,
    pageIndex: pagination.pageIndex,
    pageSize: pagination.pageSize
  });
  const resetRef = useRef<() => void>(null);

  const { handleFileChange, dataUpload, setDataUpload } = useImportExcel({ headers });

  const columns = useMemo<MRT_ColumnDef<Medicine>[]>(
    () => [
      {
        accessorKey: "registrationNumber",
        header: "Số đăng ký",
        mantineTableHeadCellProps: {
          c: "red"
        },
        mantineTableBodyCellProps: {
          c: "red"
        },
        size: 150
      },
      {
        accessorKey: "name",
        header: "Tên thuốc",
        size: 250
      },
      {
        accessorKey: "ingredientCode",
        header: "Mã hoạt chất",
        mantineTableHeadCellProps: {
          c: "red"
        },
        mantineTableBodyCellProps: {
          c: "red"
        },
        size: 50
      },
      {
        accessorKey: "ingredient",
        header: "Hoạt chất",
        size: 250
      },
      {
        accessorKey: "ingredientRegistration",
        header: "Hoạt chất (Theo số đăng ký)",
        size: 250
      },
      {
        accessorKey: "sugarCode",
        header: "Mã đường dùng",
        mantineTableHeadCellProps: {
          c: "red"
        },
        mantineTableBodyCellProps: {
          c: "red"
        },
        size: 50
      },
      {
        accessorKey: "sugar",
        header: "Đường dùng",
        size: 50
      },
      {
        accessorKey: "content",
        header: "Hàm lượng",
        size: 50
      },
      {
        accessorKey: "pack",
        header: "Đóng gói",
        size: 250
      },
      {
        accessorKey: "manufacture",
        header: "Hãng sản xuất",
        size: 300
      },
      {
        accessorKey: "country",
        header: "Nước sản xuất",
        size: 150
      }
    ],
    []
  );

  const context = api.useUtils();

  const { mutateAsync: deleteOne, isLoading: isDeleting } = api.medicine.delete.useMutation({
    onSuccess: async () => {
      await context.medicine.get.invalidate();
      notifyResult(Action.Delete, MEDICINE, true);
    },
    onError: (e) => {
      notifyResult(Action.Delete, MEDICINE, false, e.message);
    }
  });

  const handleDelete = async (row: Medicine) => {
    confirmDelete(
      MEDICINE,
      async () => {
        await deleteOne({ id: row.id });
      },
      row.name
    );
  };

  const { mutateAsync: deleteAll, isLoading: isDeletingAll } = api.medicine.deleteAll.useMutation({
    onSuccess: async () => {
      await context.medicine.get.invalidate();
      notifyResult(Action.DeleteAll, MEDICINE, true);
    },
    onError: (e) => {
      notifyResult(Action.DeleteAll, MEDICINE, false, e.message);
    }
  });

  const handleDeleteAll = () =>
    confirmDelete(
      MEDICINE,
      async () => {
        await deleteAll();
      },
      undefined,
      DeleteAction.DeleteAll
    );

  const { mutateAsync: importData, isLoading: isImporting } = api.medicine.import.useMutation({
    onSuccess: async () => {
      setDataUpload([]);
      await context.medicine.get.invalidate();
      notifyResult(Action.Import, MEDICINE, true);
    },
    onError: (e) => {
      notifyResult(Action.Import, MEDICINE, false, e.message);
    }
  });

  const handleImportData = async () => {
    if (dataUpload)
      await importData({
        dataUpload: dataUpload!,
        importMethod
      });
  };

  const table = useCustomTable<Medicine>({
    columns,
    data: dataUpload.length > 0 ? dataUpload : data?.data ?? [],
    rowCount: dataUpload.length > 0 ? dataUpload.length : data?.count ?? 0,
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
      <TableRowActions
        onUpdate={() => router.push(`medicine/update/${row.id}`)}
        onDelete={() => handleDelete(row.original)}
      />
    ),
    renderTopToolbar: () => (
      <TableToolbar
        table={table}
        onCreate={() => router.push("/medicine/create")}
        onImport={() => setShowImportPopup(true)}
        onDeleteAll={data?.data.length! > 0 ? handleDeleteAll : undefined}
      />
    )
  });

  return (
    <>
      <Paper withBorder radius="md">
        <Title order={3} mt="md" px="md">
          Danh mục {MEDICINE}
        </Title>
        <MantineReactTable table={table} />
        {dataUpload && dataUpload.length !== 0 && (
          <Group justify="flex-end" m={"xs"}>
            <Button
              color="red"
              variant="filled"
              onClick={() => {
                setDataUpload([]);
                resetRef.current?.();
              }}>
              Hủy bỏ
            </Button>
            <Button loading={isImporting} color="green" variant="filled" onClick={handleImportData}>
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

export default MedicinePage;
