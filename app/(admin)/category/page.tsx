"use client";

import ImportExcelPopup from "@/components/shared/ImportExcelPopup";
import TableToolbar from "@/components/table/TableToolbar";
import { useCustomTable } from "@/hooks/useCustomTable";
import useImportExcel from "@/hooks/useImportExcel";
import useModal, { DeleteAction } from "@/hooks/useModal";
import useNotify, { Action } from "@/hooks/useNotify";
import { api } from "@/server/api";
import { Button, Group, LoadingOverlay, Paper, Title } from "@mantine/core";
import { Wards } from "@prisma/client";
import { MRT_ColumnDef, MRT_PaginationState, MantineReactTable } from "mantine-react-table";
import "mantine-react-table/styles.css";
import { useMemo, useRef, useState } from "react";

const headers = ["wardCode", "wardName", "englishName", "level", "districtId", "districtName", "cityId", "cityName"];
const ADMIN_DIVISION = "đơn vị hành chính";

const AdminDivisionPage = () => {
  const context = api.useUtils();
  const [globalFilter, setGlobalFilter] = useState("");
  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: 10
  });
  const [showImportPopup, setShowImportPopup] = useState(false);
  const { dataUpload, handleFileChange, setDataUpload } = useImportExcel({ headers });
  const { data, isLoading, isError } = api.adDivision.getAdDivisions.useQuery({
    search: globalFilter || "",
    pageIndex: pagination.pageIndex,
    pageSize: pagination.pageSize
  });
  const { confirmDelete } = useModal();
  const { notifyResult } = useNotify();
  const [importMethod, setImportMethod] = useState<string | null>("UPDATE");
  const resetRef = useRef<() => void>(null);

  const { mutateAsync: deleteAll, isLoading: isDeletingAll } = api.adDivision.deleteAll.useMutation({
    onSuccess: async () => {
      await context.invalidate();
      notifyResult(Action.DeleteAll, ADMIN_DIVISION, true);
    },
    onError: (e) => {
      notifyResult(Action.DeleteAll, ADMIN_DIVISION, false, e.message);
    }
  });

  const handleDeleteAll = () =>
    confirmDelete(
      ADMIN_DIVISION,
      async () => {
        await deleteAll();
        await context.adDivision.invalidate();
      },
      undefined,
      DeleteAction.DeleteAll
    );

  const handleImportData = async () => {
    if (dataUpload) await importData({ dataUpload, importMethod: importMethod! });
  };

  const { mutateAsync: importData, isLoading: isImporting } = api.adDivision.import.useMutation({
    onSuccess: async () => {
      setDataUpload([]);
      await context.adDivision.getAdDivisions.invalidate();
      notifyResult(Action.Import, ADMIN_DIVISION, true);
    },
    onError: (e) => {
      notifyResult(Action.Import, ADMIN_DIVISION, false, e.message);
    }
  });

  const columns = useMemo<MRT_ColumnDef<Wards>[]>(
    () => [
      {
        accessorKey: "wardCode",
        header: "Mã phường/Xã"
      },
      {
        accessorKey: "wardName",
        header: "Phường/Xã"
      },
      {
        accessorFn: (row) => row.districtId,
        header: "Mã quận/Huyện"
      },
      {
        accessorFn: (row) => row.districtName,
        header: "Quận/Huyện"
      },
      {
        accessorFn: (row) => row.cityId,
        header: "Mã tỉnh/TP"
      },
      {
        accessorFn: (row) => row.cityName,
        header: "Tỉnh/TP"
      }
    ],
    []
  );

  const table = useCustomTable<Wards>({
    columns,
    data: dataUpload.length > 0 ? dataUpload : data?.data ?? [],
    rowCount: dataUpload.length > 0 ? dataUpload.length : data?.count ?? 0,
    state: {
      isLoading,
      globalFilter,
      pagination,
      showAlertBanner: isError,
      showProgressBars: isLoading || isImporting || isDeletingAll
    },
    manualFiltering: dataUpload.length > 0 ? false : true,
    onGlobalFilterChange: setGlobalFilter,
    manualPagination: dataUpload.length > 0 ? false : true,
    onPaginationChange: setPagination,
    enableEditing: false,
    renderTopToolbar: () => (
      <TableToolbar
        table={table}
        onImport={() => setShowImportPopup(true)}
        onDeleteAll={data?.data.length! > 0 ? handleDeleteAll : undefined}
      />
    )
  });

  return (
    <>
      <LoadingOverlay visible={isImporting || isDeletingAll} />
      <Paper withBorder radius="md">
        <Title order={3} mt="md" px="md">
          Đơn vị hành chính
        </Title>

        <MantineReactTable table={table} />
        {dataUpload && dataUpload.length !== 0 && (
          <>
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
          </>
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

export default AdminDivisionPage;
