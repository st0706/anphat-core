import { MRT_Localization, MRT_TableOptions, useMantineReactTable } from "mantine-react-table";

export type CustomTableOptions<TData extends Record<string, any> = {}> = Omit<
  MRT_TableOptions<TData>,
  | "enablePagination"
  | "mantinePaginationProps"
  | "paginationDisplayMode"
  | "mantineTableProps.align"
  | "mantinePaperProps"
  | "initialState.density"
>;

export const MRT_Localization_VI: Partial<MRT_Localization> = {
  actions: "Thao tác",
  and: "và",
  cancel: "Huỷ bỏ",
  changeFilterMode: "Thay đổi chế độ lọc",
  changeSearchMode: "Thay đổi chế độ tìm kiếm",
  clearFilter: "Xoá bộ lọc",
  clearSearch: "Xoá ô tìm kiếm",
  clearSort: "Huỷ sắp xếp",
  clickToCopy: "Nhấn vào để sao chép",
  columnActions: "Lựa chọn",
  copiedToClipboard: "Sao chép vào bảng tạm",
  collapse: "Thu gọn",
  collapseAll: "Thu gọn tất cả",
  dropToGroupBy: "Gộp dữ liệu theo {column}",
  edit: "Chỉnh sửa",
  expand: "Mở rộng",
  expandAll: "Mở rộng tất cả",
  filterArrIncludes: "Bao gồm",
  filterArrIncludesAll: "Bao gồm tất cả",
  filterArrIncludesSome: "Bao gồm",
  filterBetween: "Trong khoảng",
  filterBetweenInclusive: "Trong khoảng và bao gồm",
  filterByColumn: "Lọc theo {column}",
  filterContains: "Bao gồm",
  filterEmpty: "Trống",
  filterEndsWith: "Kết thúc với",
  filterEquals: "Bằng",
  filterEqualsString: "Bẳng",
  filterFuzzy: "Xấp xỉ",
  filterGreaterThan: "Lớn hơn",
  filterGreaterThanOrEqualTo: "Lớn hơn hoặc bằng",
  filterInNumberRange: "Trong khoảng",
  filterIncludesString: "Bao gồm",
  filterIncludesStringSensitive: "Bao gồm",
  filterLessThan: "Bé hớn",
  filterLessThanOrEqualTo: "Bé hơn hoặc bằng",
  filterMode: "Chế độ lọc: {filterType}",
  filterNotEmpty: "Có giá trị",
  filterNotEquals: "Khác",
  filterStartsWith: "Bắt đầu bằng",
  filterWeakEquals: "Bằng",
  filteringByColumn: "Lọc các kết quả có {column} - {filterType} {filterValue}",
  goToFirstPage: "Tới trang đầu",
  goToLastPage: "Tới trang cuối",
  goToNextPage: "Tới trang tiếp theo",
  goToPreviousPage: "Tới trang trước",
  grab: "Grab",
  groupByColumn: "Nhóm dữ liệu theo {column}",
  groupedBy: "Nhóm dữ liệu theo ",
  hideAll: "Ẩn tất cả",
  hideColumn: "Ẩn cột {column}",
  max: "Đến",
  min: "Từ",
  move: "Di chuyển",
  noRecordsToDisplay: "Không có dữ liệu",
  noResultsFound: "Không có kết quả nào được tìm thấy",
  of: "trên",
  or: "hoặc",
  pin: "Ghim",
  pinToLeft: "Ghim sang trái",
  pinToRight: "Ghim sang phải",
  resetColumnSize: "Đặt lại kích thước cột",
  resetOrder: "Đặt lại thứ tự cột",
  rowActions: "Thao tác",
  rowNumber: "#",
  rowNumbers: "Số hàng",
  rowsPerPage: "Cỡ trang",
  save: "Lưu",
  search: "Tìm kiếm",
  selectedCountOfRowCountRowsSelected: "{selectedCount}/{rowCount} dòng đang được chọn",
  select: "Chọn",
  showAll: "Hiển thị tất cả",
  showAllColumns: "Hiện tất cả các cột",
  showHideColumns: "Ẩn/hiện cột",
  showHideFilters: "Ẩn/hiện bộ lọc",
  showHideSearch: "Ẩn/hiện thanh tìm kiếm",
  sortByColumnAsc: "Sắp xếp theo {column} (tăng dần)",
  sortByColumnDesc: "Sắp xếp theo {column} (giảm dần)",
  sortedByColumnAsc: "Dữ liệu đang được sắp xếp theo {column} (tăng dần)",
  sortedByColumnDesc: "Dữ liệu đang được sắp xếp theo {column} (giảm dần)",
  thenBy: ", sau đó ",
  toggleDensity: "Thay đổi độ cao mỗi hàng",
  toggleFullScreen: "Hiển thị toàn màn hình",
  toggleSelectAll: "Chọn tất cả",
  toggleSelectRow: "Chọn hàng này",
  toggleVisibility: "Ẩn/hiện cột này",
  ungroupByColumn: "Bỏ nhóm dữ liệu theo {column}",
  unpin: "Bỏ ghim",
  unpinAll: "Bỏ ghim tất cả"
};

export const useCustomTable = <TData extends Record<string, any> = {}>(tableOptions: CustomTableOptions<TData>) => {
  return useMantineReactTable({
    ...{
      localization: MRT_Localization_VI,
      // paging
      manualPagination: true,
      paginationDisplayMode: "pages",
      // filters
      manualFiltering: true,
      // styles
      mantineTableProps: {
        align: "center",
        striped: true
      },
      positionActionsColumn: "last",
      mantinePaperProps: {
        shadow: "0",
        radius: "md",
        p: "md",
        withBorder: false
      },
      displayColumnDefOptions: {
        "mrt-row-actions": {
          size: 100 //make actions column wider
        }
      },
      mantineFilterTextInputProps: {
        style: { borderBottom: "unset", marginTop: "8px" },
        variant: "filled"
      },
      mantineFilterSelectProps: {
        style: { borderBottom: "unset", marginTop: "8px" },
        variant: "filled"
      },
      // features
      enableSorting: false,
      enableColumnActions: false,
      enableDensityToggle: false,
      enableFullScreenToggle: true,
      enableHiding: false,
      enablePinning: false,
      enableEditing: true,
      enableGlobalFilter: true,
      enableFilterMatchHighlighting: true,
      enableRowNumbers: true,
      rowNumberMode: "original",
      // states
      initialState: {
        density: "xs",
        showGlobalFilter: true
      }
    },
    ...tableOptions
  });
};
