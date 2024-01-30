export function required(fieldName: string, action: string = "nhập") {
  return `Vui lòng ${action} ${fieldName}.`;
}

export function invalid(fieldName: string, extraMessage?: string) {
  return `${fieldName} không hợp lệ.${extraMessage ? " " + extraMessage : null}`;
}

export function createTitle(object: string) {
  return `Thêm mới ${object}`;
}

export function updateTitle(object: string) {
  return `Chỉnh sửa ${object}`;
}

export function showTitle(object: string) {
  return `Chi tiết ${object}`;
}

export const HOSPITAL = "bệnh viện";
export const DISEASE = "bệnh";
export const MEDICINE = "thuốc tân dược";
export const POSITION = "chức danh";
export const SCHEDULE = "lịch khám bệnh";
