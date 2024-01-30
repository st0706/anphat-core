const fetcher = async (url: string) => {
  const response = await fetch(url);
  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.error.message || "Đã xảy ra lỗi khi tìm nạp dữ liệu");
  }

  return json;
};

export default fetcher;
