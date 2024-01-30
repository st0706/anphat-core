import { Button, Group } from "@mantine/core";
import { IconCirclePlus, IconFileImport, IconFileX } from "@tabler/icons-react";
import {
  MRT_GlobalFilterTextInput,
  MRT_ShowHideColumnsButton,
  MRT_ToggleDensePaddingButton,
  MRT_ToggleFiltersButton,
  MRT_ToggleFullScreenButton
} from "mantine-react-table";
import { FC } from "react";

interface Props {
  table: any;
  onCreate?: () => void;
  onImport?: () => void;
  onDeleteAll?: () => void;
  showSearch?: boolean;
  showFilters?: boolean;
  showColumns?: boolean;
  showDensity?: boolean;
  showFullScreen?: boolean;
}

const TableToolbar: FC<Props> = ({
  table,
  onCreate,
  onImport,
  onDeleteAll,
  showSearch = true,
  showFilters,
  showColumns,
  showDensity,
  showFullScreen = true
}) => {
  return (
    <Group justify="space-between" wrap="wrap" mb="xs">
      {showSearch && <MRT_GlobalFilterTextInput table={table} />}
      <Group gap="xs">
        {onCreate && (
          <Button color="teal" leftSection={<IconCirclePlus size={18} />} onClick={onCreate}>
            Thêm mới
          </Button>
        )}
        {onImport && (
          <Button color="teal" variant="light" leftSection={<IconFileImport size={18} />} onClick={onImport}>
            Nhập dữ liệu
          </Button>
        )}
        {onDeleteAll && (
          <Button variant="light" color="red" leftSection={<IconFileX size={18} />} onClick={onDeleteAll}>
            Xoá tất cả
          </Button>
        )}
        {showFilters && <MRT_ToggleFiltersButton table={table} />}
        {showColumns && <MRT_ShowHideColumnsButton table={table} />}
        {showDensity && <MRT_ToggleDensePaddingButton table={table} />}
        {showFullScreen && <MRT_ToggleFullScreenButton table={table} />}
      </Group>
    </Group>
  );
};

export default TableToolbar;
