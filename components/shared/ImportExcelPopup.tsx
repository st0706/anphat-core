"use client";

import { Button, FileButton, Flex, Modal, Radio, Stack } from "@mantine/core";
import React, { Dispatch, FC, SetStateAction, useEffect } from "react";

interface Props {
  opened: boolean;
  setShowImportPopup: Dispatch<SetStateAction<boolean>>;
  headerCols: string[];
  resetRef: React.RefObject<() => void>;
  handleFileChange: any;
  setDataUpload: Dispatch<SetStateAction<any[]>>;
  dataUpload: any[];
  importMethod: string | null;
  setImportMethod: Dispatch<SetStateAction<string | null>>;
}

const ImportExcelPopup: FC<Props> = ({
  opened,
  setShowImportPopup,
  resetRef,
  handleFileChange,
  dataUpload,
  setImportMethod,
  importMethod
}) => {
  useEffect(() => {
    if (dataUpload.length > 0) setShowImportPopup(false);
  }, [dataUpload]);

  return (
    <Modal opened={opened} onClose={() => setShowImportPopup(false)} title="Nhập dữ liệu">
      <Flex gap={"sm"} direction={"column"}>
        <Radio.Group
          defaultValue={importMethod || ""}
          onChange={(e) => setImportMethod(e)}
          name="importMethod"
          label="Cách xử lý dữ liệu"
          description="Vui lòng chọn cách xử lý dữ liệu trùng lặp"
          withAsterisk>
          <Stack mt="xs">
            <Radio
              value="ADD_NEW_ONLY"
              label="Chỉ bổ sung dữ liệu mới"
              description="Giữ nguyên dữ liệu hiện có. Bỏ qua không nhập dữ liệu đã tồn tại."
              color="green"
            />
            <Radio
              value="UPDATE"
              label="Cập nhật dữ liệu đã có"
              description="Thêm dữ liệu mới. Cập nhật dữ liệu đã tồn tại. Giữ nguyên dữ liệu không trùng lặp."
              color="orange"
            />
            <Radio
              value="RESET"
              label="Nhập lại dữ liệu"
              description="Xóa toàn bộ dữ liệu cũ và nhập lại dữ liệu từ đầu"
              color="red"
            />
          </Stack>
        </Radio.Group>
        <FileButton
          resetRef={resetRef}
          onChange={(e) => {
            handleFileChange(e);
            resetRef.current?.();
          }}
          accept=".xlsx,.xls">
          {(props) => <Button {...props}>Nhập dữ liệu</Button>}
        </FileButton>
      </Flex>
    </Modal>
  );
};

export default ImportExcelPopup;
