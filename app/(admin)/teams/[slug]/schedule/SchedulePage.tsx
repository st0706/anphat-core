"use client";

import { Button, Group, Paper, Select, TextInput, Title } from "@mantine/core";
import { IconCirclePlus, IconFileX, IconSearch } from "@tabler/icons-react";
import { Calendar, EventClickArg } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import resourceTimeGridPlugin from "@fullcalendar/resource-timegrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import React, { useEffect, useState } from "react";
import { modals } from "@mantine/modals";
import { createTitle, showTitle, updateTitle } from "@/lib/messages";
import ScheduleForm from "./ScheduleForm";
import { api } from "@/server/api";
import useNotify, { Action } from "@/hooks/useNotify";
import bootstrap5Plugin from "@fullcalendar/bootstrap5";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { Schedule } from "@prisma/client";
import moment from "moment";
import "moment/locale/vi";
import listPlugin from "@fullcalendar/list";
import useModal, { DeleteAction } from "@/hooks/useModal";
import { useSession } from "next-auth/react";
import { TrpcProvider } from "@/app/(admin)/TrpcProvider";
import useTeam from "@/hooks/useTeam";
import { Error, Loading } from "@/components/shared";
import { TeamTab } from "@/components/team";

export const SCHEDULE = "lịch khám";

export interface Events {
  title: string;
  start: string;
  end: string;
  schedule: Schedule;
}

const SchedulePage = ({ slug, teamFeatures }) => {
  let events: Events[] = [];

  const { isLoading: isLoadingTeam, isError: isErrorTeam, team } = useTeam(slug);
  const trpcContext = api.useUtils();
  const { notifyResult } = useNotify();
  const { confirmDelete } = useModal();
  const [selectedPractitioner, setSelectedPractitioner] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const { data: session, status } = useSession();

  useEffect(() => {
    const calendarEl = document.querySelector(".calendar") as HTMLElement;
    if (calendarEl) {
      const calendar = new Calendar(calendarEl, {
        locale: "vi",
        dayHeaderFormat: { weekday: "long", month: "numeric", day: "numeric", year: "numeric" },
        plugins: [
          interactionPlugin,
          dayGridPlugin,
          timeGridPlugin,
          resourceTimeGridPlugin,
          bootstrap5Plugin,
          listPlugin
        ],
        themeSystem: "bootstrap5",
        headerToolbar: {
          left: "",
          center: "title",
          right: "customWeek,customDay,listDay, prev,next"
        },
        initialView: "customWeek",
        views: {
          customWeek: {
            type: "timeGridWeek",
            buttonText: "Tuần"
          },
          customDay: {
            type: "timeGridDay",
            buttonText: "Ngày"
          },
          listDay: { buttonText: "Danh mục ngày" }
        },
        editable: true,
        droppable: false,
        navLinks: true,
        events: { events },

        eventContent: (arg) => {
          const modalityList = arg.event._def.extendedProps.schedule.modalitys || [];
          const modalityHtml = modalityList.map((item) => `<li>${item.modality.name}</li>`).join("");
          const practitioners = arg.event._def.extendedProps.schedule.practitioners || [];
          const practitionerHtml = practitioners.map((item) => `<li>${item.practitioners.name}</li>`).join("");

          return {
            html: `
              <div>
                <strong>${arg.event._def.title}</strong>
                <ul>${modalityHtml}</ul>
                <strong>Danh sách bác sĩ:</strong>
                <ul>${practitionerHtml}</ul>
              </div>
            `
          };
        },

        eventClick: function (arg) {
          handleUpdate(arg.event._def.extendedProps.schedule as Schedule);
        }
      });

      calendar.render();

      return () => {
        calendar.destroy();
      };
    }
  }, [events]);

  const { data } = api.schedule.get.useQuery();
  const {
    data: dataPractitioner,
    isLoading: isLoadingPractitioner,
    isError: isErrorPractitioner
  } = api.schedule.getAllPractitioner.useQuery();

  const { mutateAsync: createSchedule, isLoading: isCreating } = api.schedule.create.useMutation({
    onSuccess: async () => {
      await trpcContext.invalidate();
      notifyResult(Action.Create, SCHEDULE, true);
    },
    onError: (e) => {
      notifyResult(Action.Create, SCHEDULE, false, e.message);
    }
  });

  const { mutateAsync: update, isLoading: isUpdating } = api.schedule.update.useMutation({
    onSuccess: async () => {
      await trpcContext.invalidate();
      notifyResult(Action.Update, SCHEDULE, true);
    },
    onError: (e) => {
      notifyResult(Action.Update, SCHEDULE, false, e.message);
    }
  });

  const { mutateAsync: deleteAll, isLoading: isDeletingAll } = api.schedule.deleteAll.useMutation({
    onSuccess: async () => {
      await trpcContext.invalidate();
      notifyResult(Action.DeleteAll, SCHEDULE, true);
    },
    onError: (e) => {
      notifyResult(Action.DeleteAll, SCHEDULE, false, e.message);
    }
  });

  if (isLoadingTeam) {
    return <Loading />;
  }

  if (isErrorTeam) {
    return <Error message={isErrorTeam.message} />;
  }

  if (!team) {
    return <Error message="Không tìm thấy bệnh viện" />;
  }

  const formatBigIntToDateString = (bigintValue: bigint) => {
    const dateValue = Number(bigintValue);
    const dateObject = new Date(dateValue);
    const dateString = dateObject.toISOString();

    return dateString;
  };

  if (data) {
    events = data
      .filter(
        (item) =>
          (!selectedPractitioner || item.practitioners[0].practitionerId == selectedPractitioner) &&
          (searchTerm === "" || item.patient?.patientName.toLowerCase().includes(searchTerm.toLowerCase()))
      )
      .map((item) => ({
        title: item.patient?.patientName || "Untitled",
        start: formatBigIntToDateString(item.atTime),
        end: formatBigIntToDateString(item.scheduleDateTime),
        schedule: item
      }));
  }

  const handleCreate = () => {
    const modalId = "create-schedule";
    modals.open({
      modalId: modalId,
      title: createTitle(SCHEDULE),
      centered: true,
      children: (
        <TrpcProvider>
          <ScheduleForm
            isSubmiting={isCreating}
            onSubmit={async (values) => {
              const patientIdAsNumber = Number(values.patientId);
              if (!isNaN(patientIdAsNumber)) {
                values.patientId = patientIdAsNumber;
                values.createdBy = session?.user.id;
                try {
                  const res = await createSchedule(values);
                  if (res.schedule.id) {
                    modals.close(modalId);
                  }
                } catch (error) {
                  console.error("Error creating schedule:", error);
                }
              }
            }}
            onClose={() => modals.close(modalId)}
          />
        </TrpcProvider>
      )
    });
  };

  const handleUpdate = (data?: Schedule) => {
    const modalId = "update-schedule";
    modals.open({
      modalId: modalId,
      title: showTitle(SCHEDULE),
      centered: true,
      children: (
        <TrpcProvider>
          <ScheduleForm
            data={data}
            isSubmiting={isUpdating}
            onSubmit={async (values) => {
              const patientIdAsNumber = Number(values.patientId);
              if (!isNaN(patientIdAsNumber)) {
                values.patientId = patientIdAsNumber;
                await update(values);
              }
              modals.close(modalId);
            }}
            onClose={() => modals.close(modalId)}
          />
        </TrpcProvider>
      )
    });
  };

  const handleDeleteAll = () =>
    confirmDelete(
      SCHEDULE,
      async () => {
        await deleteAll();
        await trpcContext.invalidate();
      },
      undefined,
      DeleteAction.DeleteAll
    );

  return (
    <>
      <TeamTab activeTab="schedule" team={team} teamFeatures={teamFeatures} />
      <Paper withBorder radius="md">
        <Title order={3} mt="md" px="md">
          Danh mục {SCHEDULE}
        </Title>
        <Group gap="xs" m="xs">
          <Button leftSection={<IconCirclePlus />} onClick={() => handleCreate()}>
            Thêm mới
          </Button>
          {data?.length! > 0 && (
            <Button color="red" leftSection={<IconFileX />} onClick={() => handleDeleteAll()}>
              Xoá tất cả
            </Button>
          )}
          <TextInput
            leftSection={<IconSearch />}
            placeholder="Tìm kiếm"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}></TextInput>
          <Select
            withAsterisk
            searchable
            data={dataPractitioner?.map((practitioner) => {
              return { value: practitioner.id, label: practitioner.name };
            })}
            value={selectedPractitioner}
            onChange={(value) => setSelectedPractitioner(value)}
            fw={500}
            size="sm"
            placeholder="Chọn bác sĩ"
          />
        </Group>

        <div className="calendar" style={{ margin: "10px" }} />
      </Paper>
    </>
  );
};
export default SchedulePage;
