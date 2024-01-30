"use client";

import ImportExcelPopup from "@/components/shared/ImportExcelPopup";
import { useCustomTable } from "@/hooks/useCustomTable";
import useImportExcel from "@/hooks/useImportExcel";
import useModal, { DeleteAction } from "@/hooks/useModal";
import useNotify, { Action } from "@/hooks/useNotify";
import { createTitle, updateTitle } from "@/lib/messages";
import { api } from "@/server/api";
import { ActionIcon, Anchor, Button, Flex, Group, Paper, Title } from "@mantine/core";
import { modals } from "@mantine/modals";
import { Patient } from "@prisma/client";
import { IconEdit, IconUserPlus } from "@tabler/icons-react";
import { MRT_PaginationState, MRT_RowSelectionState, MantineReactTable, type MRT_ColumnDef } from "mantine-react-table";
import "mantine-react-table/styles.css";
import { useEffect, useMemo, useRef, useState } from "react";
import PatientsForm from "./PatientsForm";
import Link from "next/link";
const headers = ["patientId", "patientName", "description", "gender", "doB", "Phone", "Email", "address"];

export const GENDER_VI = ["Nam", "Nữ", "Khác"];
const PATIENT = "bệnh nhân";

const PatientList = () => {
  const [globalFilter, setGlobalFilter] = useState("");
  const [importMethod, setImportMethod] = useState<string | null>("UPDATE");
  const resetRef = useRef<() => void>(null);
  const confirmModal = useModal();

  const [showImportPopup, setShowImportPopup] = useState(false);
  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: 10
  });
  const [rowSelection, setRowSelection] = useState<MRT_RowSelectionState>({});
  const { notifyResult } = useNotify();
  const { data, isLoading, isError } = api.patient.get.useQuery({
    search: globalFilter,
    pageIndex: pagination.pageIndex,
    pageSize: pagination.pageSize
  });

  const { mutateAsync: createPatient, isLoading: isCreating } = api.patient.create.useMutation({
    onSuccess: async () => {
      await context.patient.get.invalidate();
      notifyResult(Action.Create, PATIENT, true);
    },
    onError: (e) => {
      notifyResult(Action.Create, PATIENT, false, e.message);
    }
  });

  const handleCreate = () => {
    const modalId = "create-patient";
    modals.open({
      modalId: modalId,
      centered: true,
      title: createTitle(PATIENT),
      closeOnClickOutside: false,
      children: (
        <PatientsForm
          isSubmitting={isCreating}
          onSubmit={async (values) => {
            const res = await createPatient(values);
            if (res.id) modals.close(modalId);
          }}
          onClose={() => modals.close(modalId)}
        />
      )
    });
  };

  const { mutateAsync: update, isLoading: isUpdating } = api.patient.update.useMutation({
    onSuccess: async () => {
      await context.patient.get.invalidate();
      notifyResult(Action.Update, PATIENT, true);
    },
    onError: (e) => {
      notifyResult(Action.Update, PATIENT, false, e.message);
    }
  });

  const handleUpdate = (row: Patient) => {
    const modalId = "update-patient";
    modals.open({
      modalId: modalId,
      title: updateTitle(PATIENT),
      centered: true,
      closeOnClickOutside: false,
      children: (
        <PatientsForm
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
  const { mutateAsync: deletePatients, isLoading: deleteLoading } = api.patient.delete.useMutation({
    onSuccess: async () => {
      await context.patient.get.invalidate();
      notifyResult(Action.DeleteAll, "người dùng", true);
    },
    onError: (e) => {
      notifyResult(Action.DeleteAll, "người dùng", false, e.message);
    }
  });
  const { handleFileChange, dataUpload, setDataUpload } = useImportExcel({
    headers
  });
  const [dataImport, setDataImport] = useState<any>([]);
  useEffect(() => {
    setDataImport(
      dataUpload.map((data) => {
        var date = data.doB;
        var datearray = date.split("/");

        var newdate = datearray[1] + "/" + datearray[0] + "/" + datearray[2];
        return { ...data, doB: new Date(newdate).getTime() };
      })
    );
  }, [dataUpload]);
  const { mutateAsync: importData, isLoading: loadingImport } = api.patient.import.useMutation({
    onSuccess: async () => {
      setDataUpload([]);
      await context.invalidate();
      notifyResult(Action.Import, "bệnh nhân", true);
    },
    onError: (e) => {
      notifyResult(Action.Import, "bệnh nhân", false, e.message);
    }
  });
  const handleImportData = async () => {
    if (dataImport) await importData({ dataUpload: dataImport!, importMethod });
  };
  const columns = useMemo<MRT_ColumnDef<Patient>[]>(
    () => [
      {
        accessorKey: "patientId",
        header: "Mã bệnh nhân"
      },
      {
        accessorFn: (row) => row,
        header: "Tên bệnh nhân",
        Cell: ({ cell }) => (
          <Anchor component={Link} href={`patients/${cell.getValue<Patient>().id}`} fw={500}>
            {cell.getValue<Patient>().patientName}
          </Anchor>
        )
      },
      {
        accessorFn: (row) => row,
        Cell: ({ cell }) => {
          const gender = cell.getValue<Patient>().gender;
          if (gender === "MALE") return <p>Nam</p>;
          else if (gender === "FEMALE") return <p>Nữ</p>;
          else return <p>Khác</p>;
        },
        header: "Giới tính"
      },
      {
        header: "Ngày sinh",
        accessorFn: (row) => row,
        Cell: ({ cell }) => <p>{new Date(Number(cell.getValue<Patient>().doB)).toLocaleDateString()}</p>
      }
    ],
    []
  );

  const context = api.useUtils();
  const table = useCustomTable<Patient>({
    columns: columns || [],
    data: dataImport.length > 0 ? dataImport : data?.data || [],
    rowCount: dataImport.length > 0 ? dataImport.length : data?.count ?? 0,
    enableRowActions: true,
    enableRowSelection: true,
    enableRowNumbers: true,
    getRowId: (originalRow) => originalRow.patientId,
    initialState: {
      showGlobalFilter: true
    },
    state: {
      isLoading,
      globalFilter,
      pagination,
      rowSelection,
      showAlertBanner: isError,
      showProgressBars: isLoading
    },
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    onRowSelectionChange: setRowSelection,
    enableGlobalFilter: true,
    manualPagination: dataUpload.length > 0 ? false : true,
    manualFiltering: dataUpload.length > 0 ? false : true,
    mantineTableProps: {
      striped: true,
      withTableBorder: true,
      withColumnBorders: true,
      withRowBorders: true
    },
    enableFilterMatchHighlighting: true,
    renderRowActions: ({ row }) => (
      <ActionIcon
        color="blue"
        onClick={() => {
          handleUpdate(row.original);
        }}>
        <IconEdit />
      </ActionIcon>
    ),
    renderTopToolbarCustomActions: () => (
      <Flex gap={"md"}>
        <Button
          leftSection={<IconUserPlus />}
          onClick={() => {
            handleCreate();
          }}>
          Thêm mới
        </Button>
        <Button onClick={() => setShowImportPopup(true)}>Nhập dữ liệu</Button>
        {Object.keys(rowSelection).length > 0 && (
          <Button
            color="red"
            loading={deleteLoading}
            onClick={() =>
              confirmModal.confirmDelete(
                "bệnh nhân",
                async () => {
                  const values = Object.keys(rowSelection);
                  await deletePatients(values);
                  await context.patient.invalidate();
                  setRowSelection({});
                },
                undefined,
                DeleteAction.Delete
              )
            }>
            Xoá {Object.keys(rowSelection).length} bệnh nhân đã chọn
          </Button>
        )}
      </Flex>
    )
  });

  return (
    <Paper withBorder radius="md">
      <Title order={3} mt="md" px="md">
        Danh sách bệnh nhân
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
          <Button variant="filled" onClick={() => handleImportData()} loading={loadingImport}>
            Lưu thay đổi
          </Button>
        </Group>
      )}
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
    </Paper>
  );
};

export default PatientList;
