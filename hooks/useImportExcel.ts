"use client";

import { useState } from "react";
import * as XLSX from "xlsx/xlsx";

interface IUseImportExcelProps {
  headers: string[];
}

export default function useImportExcel(props: IUseImportExcelProps) {
  const { headers } = props;
  const [dataUpload, setDataUpload] = useState<any[]>([]);

  const convertToJson = async (header: string[], data: any) => {
    const rows: any[] = [];
    data.forEach(async (row) => {
      let rowData = {};
      row.forEach(async (element, index) => {
        rowData[headers[index]] = element.toString();
      });
      headers.forEach((col) => {
        if (!rowData[col]) rowData[col] = "";
      });
      rows.push({
        ...rowData
      });
    });
    setDataUpload(rows);
    return rows;
  };

  const handleFileChange = (event: any) => {
    const file = event;
    const reader = new FileReader();
    reader.onload = (event: any) => {
      const bstr = event.target?.result;
      const workBook = XLSX.read(bstr, { type: "binary" });
      const workSheetName = workBook.SheetNames[0];
      const workSheet = workBook.Sheets[workSheetName];
      const fileData = XLSX.utils.sheet_to_json(workSheet, { header: 1 });
      fileData.splice(0, 1);
      convertToJson(headers, fileData);
    };
    reader.readAsBinaryString(file);
  };

  return { dataUpload, handleFileChange, convertToJson, setDataUpload };
}
