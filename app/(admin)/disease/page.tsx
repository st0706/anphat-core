"use client";

import ImportExcelPopup from "@/components/shared/ImportExcelPopup";
import TableRowActions from "@/components/table/TableRowActions";
import TableToolbar from "@/components/table/TableToolbar";
import { useCustomTable } from "@/hooks/useCustomTable";
import useImportExcel from "@/hooks/useImportExcel";
import useModal, { DeleteAction } from "@/hooks/useModal";
import useNotify, { Action } from "@/hooks/useNotify";
import { DISEASE } from "@/lib/messages";
import { api } from "@/server/api";
import { Button, Group, Paper, Title } from "@mantine/core";
import { Disease } from "@prisma/client";
import { MRT_ColumnDef, MRT_PaginationState, MantineReactTable } from "mantine-react-table";
import "mantine-react-table/styles.css";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

const headers = [
  "chapternumber",
  "chaptercode",
  "chaptername1",
  "chaptername2",
  "maingroupcode",
  "maingroupname1",
  "maingroupname2",
  "subgroupcode1",
  "subgroupname1",
  "subgroupname11",
  "subgroupcode2",
  "subgroupname2",
  "subgroupname22",
  "typecode",
  "typename1",
  "typename2",
  "diseasecode",
  "name1",
  "name2",
  "teamcode",
  "detailcode",
  "description1",
  "description2"
];

const DiseasePage = () => {
  const { notifyResult } = useNotify();
  const [importMethod, setImportMethod] = useState<string | null>("UPDATE");
  const [showImportPopup, setShowImportPopup] = useState(false);
  const resetRef = useRef<() => void>(null);
  const { confirmDelete } = useModal();
  const router = useRouter();
  const [globalFilter, setGlobalFilter] = useState("");
  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: 10
  });
  const [dataSource, setDataSource] = useState<Disease[]>([]);
  const context = api.useUtils();

  const { handleFileChange, dataUpload, setDataUpload } = useImportExcel({
    headers
  });

  const { data, isLoading, isError } = api.disease.get.useQuery({
    search: globalFilter,
    pageIndex: pagination.pageIndex,
    pageSize: pagination.pageSize
  });

  useEffect(() => {
    if (data) setDataSource(data?.data);
  }, [data]);

  useEffect(() => {
    if (dataUpload) setDataSource(dataUpload);
  }, [dataUpload]);

  const { mutateAsync: deleteOne, isLoading: isDeleting } = api.disease.delete.useMutation({
    onSuccess: async () => {
      await context.disease.get.invalidate();
      notifyResult(Action.Delete, DISEASE, true);
    },
    onError: (e) => {
      notifyResult(Action.Delete, DISEASE, false, e.message);
    }
  });

  const handleDelete = async (row: Disease) => {
    confirmDelete(
      DISEASE,
      async () => {
        await deleteOne({ id: row.id });
      },
      row.name1 || row.name2 || row.diseasecode
    );
  };

  const { mutateAsync: deleteAll, isLoading: isDeletingAll } = api.disease.deleteAll.useMutation({
    onSuccess: async () => {
      await context.invalidate();
      notifyResult(Action.DeleteAll, DISEASE, true);
    },
    onError: (e) => {
      notifyResult(Action.DeleteAll, DISEASE, false, e.message);
    }
  });

  const handleDeleteAll = () =>
    confirmDelete(
      DISEASE,
      async () => {
        await deleteAll();
        await context.disease.invalidate();
      },
      undefined,
      DeleteAction.DeleteAll
    );

  const { mutateAsync: importData, isLoading: isImporting } = api.disease.import.useMutation({
    onSuccess: async () => {
      setDataUpload([]);
      await context.disease.get.invalidate();
    }
  });

  const handleImportData = async () => {
    if (dataUpload) await importData({ dataUpload, importMethod });
  };

  const columns = useMemo<MRT_ColumnDef<Disease>[]>(
    () => [
      {
        accessorKey: "chapternumber",
        header: "STT chương"
      },
      {
        accessorKey: "chaptercode",
        header: "Mã chương"
      },
      {
        accessorKey: "chaptername1",
        header: "CHAPTER NAME"
      },
      {
        accessorKey: "chaptername2",
        header: "Tên chương"
      },
      {
        accessorKey: "maingroupcode",
        header: "Mã nhóm chính"
      },
      {
        accessorKey: "maingroupname1",
        header: "MAIN GROUP NAME I"
      },
      {
        accessorKey: "maingroupname2",
        header: "Tên nhóm chính"
      },
      {
        accessorKey: "subgroupcode1",
        header: "Mã nhóm phụ I"
      },
      {
        accessorKey: "subgroupname1",
        header: "SUB GROUP NAME I"
      },
      {
        accessorKey: "subgroupname11",
        header: "Tên nhóm phụ I"
      },
      {
        accessorKey: "subgroupcode2",
        header: "Mã nhóm phụ II"
      },
      {
        accessorKey: "subgroupname2",
        header: "SUB GROUP NAME II"
      },
      {
        accessorKey: "subgroupname22",
        header: "Tên nhóm phụ II"
      },
      {
        accessorKey: "typecode",
        header: "Mã loại"
      },
      {
        accessorKey: "typename1",
        header: "TYPE NAME"
      },
      {
        accessorKey: "typename2",
        header: "Tên loại"
      },
      {
        accessorKey: "diseasecode",
        header: "Mã bệnh"
      },
      {
        accessorKey: "name1",
        header: "DISEASE NAME"
      },
      {
        accessorKey: "name2",
        header: "Tên bệnh"
      },
      {
        accessorKey: "teamcode",
        header: "Mã nhóm b/c bộ y tế"
      },
      {
        accessorKey: "detailcode",
        header: "Mã nhóm cần chi tiết hơn"
      },
      {
        accessorKey: "description1",
        header: "Ghi chú 1"
      },
      {
        accessorKey: "description2",
        header: "Ghi chú 2"
      }
    ],
    []
  );

  const table = useCustomTable({
    columns,
    data: dataSource || [],
    rowCount: dataUpload.length > 0 ? dataUpload.length : data?.count,
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
        onUpdate={() => router.push(`disease/${row.original.id}`)}
        onDelete={() => handleDelete(row.original)}
      />
    ),
    renderTopToolbar: () => (
      <TableToolbar
        table={table}
        onCreate={() => router.push(`disease/create`)}
        onImport={() => setShowImportPopup(true)}
        onDeleteAll={data?.data.length! > 0 ? handleDeleteAll : undefined}
      />
    )
  });

  return (
    <>
      <Paper withBorder radius="md">
        <Title order={3} mt="md" px="md">
          Các loại bệnh
        </Title>
        <MantineReactTable table={table} />
        {dataUpload && dataUpload.length !== 0 && (
          <Group justify="flex-end" m={"xs"}>
            <Button
              color="red"
              variant="filled"
              onClick={() => {
                setDataUpload([]);
                window.location.reload();
              }}>
              Hủy bỏ
            </Button>
            <Button color="green" variant="filled" onClick={handleImportData}>
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

export default DiseasePage;
