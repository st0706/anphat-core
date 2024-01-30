"use client";

import useNotify, { Action } from "@/hooks/useNotify";
import { invalid, required } from "@/lib/messages";
import { UploadButton } from "@/lib/uploadthing";
import { api } from "@/server/api";
import { ethnicMinority } from "@/types";
import {
  Autocomplete,
  Avatar,
  Button,
  Divider,
  Group,
  LoadingOverlay,
  Select,
  Stack,
  Text,
  TextInput
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { isEmail, isNotEmpty, useForm } from "@mantine/form";
import { Staff } from "@prisma/client";
import "@uploadthing/react/styles.css";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import classes from "./StaffForm.module.css";

interface IStaffFormProps {
  staffData?: Staff | null;
  handleSubmit: (values: any) => void;
  isLoading?: boolean;
}

const religions = ["Không", "Tin lành", "Đạo Phật", "Đạo hồi", "Thiên chúa"];

type StaffModel = Omit<Staff, "dob" | "issuedDay" | "dojCYU" | "dojCPV" | "officalDojCPV"> & {
  dob: Date | null;
  issuedDay: Date | null;
  dojCYU: Date | null;
  dojCPV: Date | null;
  officalDojCPV: Date | null;
};

export default function StaffForm(props: IStaffFormProps) {
  const { staffData, handleSubmit, isLoading } = props;
  const params = useParams();
  const teamSlug = params.slug;
  const { notifyResult } = useNotify();

  const { data: organizationList } = api.staff.getByTeamSlug.useQuery({
    slug: teamSlug.toString()
  });

  const form = useForm<StaffModel>({
    initialValues: {
      otherName: "",
      engName: "",
      organizationName: "",
      habit: "",
      dojCPV: new Date(),
      officalDojCPV: new Date(),
      addressPermanent: "",
      currentAddress: ""
    } as StaffModel,
    validate: {
      staffID: isNotEmpty(required("mã nhân sự")),
      familyName: (value: string) =>
        value.length === 0 ? required("họ, tên đệm") : /^[\p{L}\s]+$/u.test(value) ? null : invalid("Họ và tên đệm"),
      name: (value: string) =>
        value.length === 0 ? required("tên") : /^[\p{L}\s]+$/u.test(value) ? null : invalid("Tên"),
      otherName: (value) => {
        if (value !== "") {
          return /^[\p{L}\s]+$/u.test(value!) ? null : invalid("Tên khác");
        }
      },
      engName: (value) => {
        if (value !== "") {
          return /^[\p{L}\s]+$/u.test(value!) ? null : invalid("Tên tiếng Anh");
        }
      },
      cityCountry: (value) => (/^[\p{L}\s]+$/u.test(value!) ? null : invalid("Tỉnh")),
      districtCountry: (value) => (/^[\p{L}\s]+$/u.test(value!) ? null : invalid("Quận/huyện")),
      wardCountry: (value) => (/^[\p{L}\s]+$/u.test(value!) ? null : invalid("Phường/xã")),
      cityPermanent: (value) => (/^[\p{L}\s]+$/u.test(value!) ? null : invalid("Tỉnh")),
      districtPermanent: (value) => (/^[\p{L}\s]+$/u.test(value!) ? null : invalid("Quận/huyện")),
      wardPermanent: (value) => (/^[\p{L}\s]+$/u.test(value!) ? null : invalid("Phường/xã")),
      addressPermanent: (value) => (/^[^\W_]+$/.test(value!) ? null : "Địa chỉ không phù hợp"),
      cityCurrent: (value) => (/^[\p{L}\s]+$/u.test(value!) ? null : invalid("Tỉnh")),
      districtCurrent: (value) => (/^[\p{L}\s]+$/u.test(value!) ? null : invalid("Quận/huyện")),
      wardCurrent: (value) => (/^[\p{L}\s]+$/u.test(value!) ? null : invalid("Phường/xã")),
      currentAddress: (value) => (/^[^\W_]+$/.test(value!) ? null : "Địa chỉ không phù hợp"),
      gender: isNotEmpty(required("giới tính", "chọn")),
      CID: (value: string) =>
        value?.length === 0
          ? required("số CCCD")
          : value?.length < 12 || value?.length > 12
            ? invalid("Số CCCD")
            : /^\d+$/.test(value)
              ? null
              : required("số CCCD"),
      issuedBy: (value: string) =>
        value?.length <= 5 ? invalid("Nơi cấp CCCD") : value === undefined ? required("nơi cấp CCCD") : null,
      phoneNumber: (value: string) =>
        value?.length < 9
          ? invalid("Số điện thoại")
          : /(84|0[3|5|7|8|9])+([0-9]{8})\b/.test(value)
            ? null
            : required("số điện thoại"),
      email: isEmail(invalid("Email")),
      dob: isNotEmpty(required("ngày sinh")),
      issuedDay: isNotEmpty(required("ngày cấp CCCD")),
      religion: isNotEmpty(required("tôn giáo", "chọn")),
      organizationId: isNotEmpty(required("tổ chức", "chọn")),
      dojCYU: isNotEmpty(required("ngày vào Đoàn", "chọn")),
      ethnicMinority: isNotEmpty(required("dân tộc", "chọn")),
      nationality: (value: string) =>
        value?.length <= 2 ? invalid("Quốc tịch") : value === undefined ? required("quốc tịch") : null,
      culturalLevel: isNotEmpty(required("trình độ văn hóa"))
    }
  });
  const [cityCountry, setCityCountry] = useState<string>(staffData?.cityCountry!);
  const [districtCountry, setDistrictCountry] = useState<string>(staffData?.districtCountry!);
  const [wardCountry, setWardCountry] = useState<string>(staffData?.wardCountry!);
  const [cityPermanent, setCityPermanent] = useState<string>(staffData?.cityPermanent!);
  const [districtPermanent, setDistrictPermanent] = useState<string>(staffData?.districtPermanent!);
  const [wardPermanent, setWardPermanent] = useState<string>(staffData?.wardPermanent!);
  const [cityCurrent, setCityCurrent] = useState<string>(staffData?.cityCurrent!);
  const [districtCurrent, setDistrictCurrent] = useState<string>(staffData?.districtCurrent!);
  const [wardCurrent, setWardCurrent] = useState<string>(staffData?.wardCurrent!);
  const [avatar, setAvatar] = useState(staffData?.avatar || "");

  const { data: allCities, isLoading: getAllCitiesLoading } = api.adDivision.getAllCities.useQuery();
  const { data: allDistrictsCountry } = api.adDivision.getAllDistricts.useQuery({
    cityName: cityCountry
  });
  const { data: allWardsCountry } = api.adDivision.getAllWards.useQuery({
    cityName: cityCountry,
    districtName: districtCountry
  });
  const { data: allDistrictsPermanent } = api.adDivision.getAllDistricts.useQuery({
    cityName: cityPermanent
  });
  const { data: allWardsPermanent } = api.adDivision.getAllWards.useQuery({
    cityName: cityPermanent,
    districtName: districtPermanent
  });
  const { data: allDistrictsCurrent } = api.adDivision.getAllDistricts.useQuery({
    cityName: cityCurrent
  });
  const { data: allWardsCurrent } = api.adDivision.getAllWards.useQuery({
    cityName: cityCurrent,
    districtName: districtCurrent
  });

  useEffect(() => {
    form.resetTouched();

    if (staffData?.avatar !== "") setAvatar(staffData?.avatar!);

    setCityCountry(staffData?.cityCountry || "");
    setDistrictCountry(staffData?.districtCountry || "");
    setWardCountry(staffData?.wardCountry || "");

    setCityPermanent(staffData?.cityPermanent || "");
    setDistrictPermanent(staffData?.districtPermanent || "");
    setWardPermanent(staffData?.wardPermanent || "");

    setCityCurrent(staffData?.cityCurrent || "");
    setDistrictCurrent(staffData?.districtCurrent || "");
    setWardCurrent(staffData?.wardCurrent || "");

    form.setValues({
      ...staffData,
      religion: staffData?.religion !== undefined ? staffData.religion : "",
      avatar: staffData?.avatar! !== undefined ? staffData?.avatar : "",
      engName: staffData?.engName !== undefined ? staffData?.engName : "",
      otherName: staffData?.otherName !== undefined ? staffData?.otherName : "",
      habit: staffData?.habit !== undefined ? staffData?.habit : "",
      dob: staffData !== undefined ? new Date(Number(staffData?.dob)) : undefined,
      issuedDay: staffData !== undefined ? new Date(Number(staffData?.issuedDay!)) : undefined,
      dojCYU: staffData !== undefined ? new Date(Number(staffData?.dojCYU!)) : undefined,
      dojCPV: staffData !== undefined ? new Date(Number(staffData?.dojCPV)) : new Date(),
      officalDojCPV: staffData !== undefined ? new Date(Number(staffData?.officalDojCPV)) : new Date()
    });
  }, [isLoading, staffData]);

  useEffect(() => {
    if (form.isTouched("cityCountry")) {
      form.setValues({
        ...form.values,
        cityCountry: form.values.cityCountry,
        districtCountry: "",
        wardCountry: ""
      });
      form.setTouched({
        cityCountry: true
      });
      setCityCountry(form.values.cityCountry);
      setDistrictCountry("");
      setWardCountry("");
    }
    if (form.isTouched("districtCountry")) {
      form.setValues({
        ...form.values,
        districtCountry: form.values.districtCountry,
        wardCountry: ""
      });
      setDistrictCountry(form.values.districtCountry);
      setWardCountry("");
    }
    if (form.isTouched("wardCountry")) {
      form.setValues({ ...form.values, wardCountry: form.values.wardCountry });
      setWardCountry(form.values.wardCountry);
    }

    if (form.isTouched("cityPermanent")) {
      form.setValues({
        ...form.values,
        cityPermanent: form.values.cityPermanent,
        districtPermanent: "",
        wardPermanent: ""
      });
      form.setTouched({
        cityPermanent: true
      });
      setCityPermanent(form.values.cityPermanent);
      setDistrictPermanent("");
      setWardPermanent("");
    }
    if (form.isTouched("districtPermanent")) {
      form.setValues({ ...form.values, districtPermanent: form.values.districtPermanent, wardPermanent: "" });
      setDistrictPermanent(form.values.districtPermanent);
      setWardPermanent("");
    }
    if (form.isTouched("wardPermanent")) {
      form.setValues({ ...form.values, wardPermanent: form.values.wardPermanent });
      setWardPermanent(form.values.wardPermanent);
    }

    if (form.isTouched("cityCurrent")) {
      form.setValues({ ...form.values, cityCurrent: form.values.cityCurrent });
      setCityCurrent(form.values.cityCurrent);
      setDistrictCurrent("");
      setWardCurrent("");
      form.setTouched({
        cityCurrent: true
      });
    }
    if (form.isTouched("districtCurrent")) {
      form.setValues({ ...form.values, districtCurrent: form.values.districtCurrent, wardCurrent: "" });
      setDistrictCurrent(form.values.districtCurrent);
      setWardCurrent("");
    }
    if (form.isTouched("wardCurrent")) {
      form.setValues({ ...form.values, wardCurrent: form.values.wardCurrent });
      setWardCurrent(form.values.wardCurrent);
    }
  }, [
    form.values.cityCountry,
    form.values.districtCountry,
    form.values.wardCountry,
    form.values.cityPermanent,
    form.values.districtPermanent,
    form.values.wardPermanent,
    form.values.cityCurrent,
    form.values.districtCurrent,
    form.values.wardCurrent
  ]);

  return (
    <>
      <LoadingOverlay visible={isLoading || getAllCitiesLoading} overlayProps={{ blur: 5 }} />
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Group py={"6px"} justify="flex-end" style={{ zIndex: "100" }}>
          <Button my={0} type="submit">
            {!staffData ? "Thêm mới" : "Cập nhật"}
          </Button>
        </Group>
        <Stack gap={0}>
          <Group gap={"xs"}>
            <Stack style={{ alignSelf: "flex-start" }} className={classes.avatar}>
              <Text fw={500} size="md" mt="md">
                Avatar
              </Text>
              <Stack align="center">
                <Avatar variant="filled" radius="xs" size={"xl"} src={avatar} color="blue" />
                <UploadButton
                  content={{
                    button({ ready }) {
                      if (ready) return <div>Tải lên</div>;
                    },
                    allowedContent() {
                      return "Hình ảnh dưới 2MB.";
                    }
                  }}
                  endpoint="imageUploader"
                  onClientUploadComplete={(res) => {
                    // Do something with the response
                    if (res) {
                      setAvatar(res[0].url);
                      form.setFieldValue("avatar", res[0].url);
                    } else {
                      form.setFieldValue("avatar", "");
                    }
                    notifyResult(Action.Upload, "ảnh đại diện", true);
                  }}
                  onUploadError={(e: Error) => {
                    notifyResult(Action.Upload, "ảnh đại diện", false, e.message);
                  }}
                />
              </Stack>
              <Text mt="xs" c="dimmed" size="sm">
                Nhấp vào nút tải lên để tải lên logo tùy chỉnh từ tệp ảnh. <br />
                Các loại tệp được chấp nhận: .PNG, .JPG. Kích thước tệp tối đa: 2 MB.
              </Text>
            </Stack>
            <Group wrap="wrap" className={classes.inputsRight} gap={0}>
              <Divider label="Thông tin chung" labelPosition="left" fw={700} className={classes.divider} w="100%" />
              <Stack w="100%" gap={"0"} ml={{ sm: "lg" }}>
                <Group w="100%" gap={"sm"}>
                  <TextInput
                    w={{ sm: "100%", md: "30%" }}
                    withAsterisk
                    className={classes.input}
                    name="staffID"
                    label="Mã nhân sự"
                    {...form.getInputProps("staffID")}
                    readOnly={staffData ? false : !staffData ? false : true}
                    fw={staffData ? "700" : ""}
                  />
                  <TextInput
                    w={{ sm: "100%", md: "30%" }}
                    withAsterisk
                    className={classes.input}
                    name="familyName"
                    label="Họ, tên đệm"
                    {...form.getInputProps("familyName")}
                    readOnly={staffData ? false : !staffData ? false : true}
                    fw={staffData ? "700" : ""}
                  />
                  <TextInput
                    w={{ sm: "100%", md: "30%" }}
                    withAsterisk
                    className={classes.input}
                    name="name"
                    label="Tên"
                    {...form.getInputProps("name")}
                    readOnly={staffData ? false : !staffData ? false : true}
                    fw={staffData ? "700" : ""}
                  />
                  <TextInput
                    w={{ sm: "100%", md: "30%" }}
                    className={classes.input}
                    label="Tên gọi khác"
                    name="otherName"
                    defaultValue={""}
                    {...form.getInputProps("otherName")}
                    readOnly={staffData ? false : !staffData ? false : true}
                    fw={staffData ? "700" : ""}
                  />
                  <TextInput
                    w={{ sm: "100%", md: "30%" }}
                    className={classes.input}
                    label="Tên tiếng anh"
                    name="engName"
                    defaultValue={""}
                    {...form.getInputProps("engName")}
                    readOnly={staffData ? false : !staffData ? false : true}
                    fw={staffData ? "700" : ""}
                  />
                  <Select
                    w={{ sm: "100%", md: "30%" }}
                    className={classes.input}
                    withAsterisk
                    label="Giới tính"
                    name="gender"
                    data={[
                      { label: "Nam", value: "MALE" },
                      { label: "Nữ", value: "FEMALE" },
                      { label: "Khác", value: "OTHER" }
                    ]}
                    {...form.getInputProps("gender")}
                    readOnly={staffData ? false : !staffData ? false : true}
                    fw={staffData ? "700" : ""}
                  />
                </Group>
                <Group w="100%" gap={"xs"}>
                  <TextInput
                    w={{ sm: "100%", md: "30%" }}
                    withAsterisk
                    className={classes.input}
                    label="Số CCCD"
                    name="CID"
                    {...form.getInputProps("CID")}
                    readOnly={staffData ? false : !staffData ? false : true}
                    fw={staffData ? "700" : ""}
                  />
                  <TextInput
                    w={{ sm: "100%", md: "30%" }}
                    withAsterisk
                    className={classes.input}
                    label="Cấp bởi"
                    name="issuedBy"
                    {...form.getInputProps("issuedBy")}
                    readOnly={staffData ? false : !staffData ? false : true}
                    fw={staffData ? "700" : ""}
                  />
                  <DatePickerInput
                    w={{ sm: "100%", md: "30%" }}
                    withAsterisk
                    clearable
                    className={classes.input}
                    label="Ngày cấp"
                    name="issuedDay"
                    valueFormat="DD/MM/YYYY"
                    readOnly={staffData ? false : !staffData ? false : true}
                    fw={staffData ? "700" : ""}
                    {...form.getInputProps("issuedDay")}
                  />
                </Group>
                <Group w="100%" gap={"xs"}>
                  <Select
                    className={classes.input}
                    w={{ sm: "100%", md: "30%" }}
                    withAsterisk
                    label="Dân tộc"
                    name="ethnicMinority"
                    data={ethnicMinority}
                    readOnly={staffData ? false : !staffData ? false : true}
                    fw={staffData ? "700" : ""}
                    {...form.getInputProps("ethnicMinority")}
                  />
                  <TextInput
                    w={{ sm: "100%", md: "30%" }}
                    withAsterisk
                    label="Quốc tịch"
                    name="nationality"
                    className={classes.input}
                    readOnly={staffData ? false : !staffData ? false : true}
                    fw={staffData ? "700" : ""}
                    {...form.getInputProps("nationality")}
                  />
                  <Select
                    w={{ sm: "100%", md: "30%" }}
                    withAsterisk
                    className={classes.input}
                    label="Tôn giáo"
                    name="religion"
                    data={religions}
                    readOnly={staffData ? false : !staffData ? false : true}
                    fw={staffData ? "700" : ""}
                    {...form.getInputProps("religion")}
                  />
                </Group>
              </Stack>
              <Group w="100%" gap={"xs"} ml={{ lg: "lg" }}>
                <TextInput
                  w={{ sm: "100%", md: "30%" }}
                  withAsterisk
                  label="Số điện thoại"
                  name="phoneNumber"
                  className={classes.input}
                  readOnly={staffData ? false : !staffData ? false : true}
                  fw={staffData ? "700" : ""}
                  {...form.getInputProps("phoneNumber")}
                />
                <TextInput
                  w={{ sm: "100%", md: "30%" }}
                  withAsterisk
                  label="Email"
                  name="email"
                  className={classes.input}
                  readOnly={staffData ? false : !staffData ? false : true}
                  fw={staffData ? "700" : ""}
                  {...form.getInputProps("email")}
                />
                <Select
                  w={{ sm: "100%", md: "30%" }}
                  withAsterisk
                  className={classes.input}
                  label="Tên tổ chức"
                  name="organizationId"
                  data={organizationList}
                  readOnly={staffData ? false : !staffData ? false : true}
                  fw={staffData ? "700" : ""}
                  {...form.getInputProps("organizationId")}
                />
              </Group>
            </Group>
            {/* Phía dưới avatar */}
            <Stack gap={"0"} w="100%">
              {/* Địa chỉ nguyên quán */}
              <Divider label="Nguyên quán" labelPosition="left" fw={700} className={classes.divider} />
              <Group w="100%" gap={"xs"}>
                <Autocomplete
                  withAsterisk
                  data={allCities}
                  label="Tỉnh"
                  placeholder="Vd: Thành phố Hà Nội"
                  {...form.getInputProps("cityCountry")}
                  className={classes.inputAddress}
                  readOnly={staffData ? false : !staffData ? false : true}
                  fw={staffData ? "700" : ""}
                  required
                />
                <Autocomplete
                  withAsterisk
                  data={allDistrictsCountry}
                  label="Quận/huyện"
                  placeholder="Vd: Quận Hà Đông"
                  {...form.getInputProps("districtCountry")}
                  className={classes.inputAddress}
                  readOnly={staffData ? false : !staffData ? false : true}
                  fw={staffData ? "700" : ""}
                  required
                />
                <Autocomplete
                  withAsterisk
                  data={allWardsCountry}
                  label="Phường/xã"
                  placeholder="Vd: Phường Yên Nghĩa"
                  {...form.getInputProps("wardCountry")}
                  className={classes.inputAddress}
                  readOnly={staffData ? false : !staffData ? false : true}
                  fw={staffData ? "700" : ""}
                  required
                />
              </Group>
              {/* Địa chỉ đăng ký HKTT */}
              <Divider mt={"xs"} label="Hộ khẩu thường trú" labelPosition="left" fw={700} className={classes.divider} />
              <Group w="100%" gap={"xs"}>
                <Autocomplete
                  withAsterisk
                  data={allCities}
                  label="Tỉnh"
                  placeholder="Vd: Thành phố Hà Nội"
                  {...form.getInputProps("cityPermanent")}
                  className={classes.inputAddress}
                  readOnly={staffData ? false : !staffData ? false : true}
                  fw={staffData ? "700" : ""}
                  required
                />
                <Autocomplete
                  withAsterisk
                  data={allDistrictsPermanent}
                  label="Quận/huyện"
                  placeholder="Vd: Quận Hà Đông"
                  {...form.getInputProps("districtPermanent")}
                  className={classes.inputAddress}
                  readOnly={staffData ? false : !staffData ? false : true}
                  fw={staffData ? "700" : ""}
                  required
                />
                <Autocomplete
                  withAsterisk
                  data={allWardsPermanent}
                  label="Phường/xã"
                  placeholder="Vd: Phường Yên Nghĩa"
                  {...form.getInputProps("wardPermanent")}
                  className={classes.inputAddress}
                  readOnly={staffData ? false : !staffData ? false : true}
                  fw={staffData ? "700" : ""}
                  required
                />
                <TextInput
                  withAsterisk
                  w={"98.5%"}
                  className={classes.input}
                  label="Địa chỉ"
                  name="permanentAddress"
                  {...form.getInputProps("addressPermanent")}
                  readOnly={staffData ? false : !staffData ? false : true}
                  fw={staffData ? "700" : ""}
                  required
                />
              </Group>
              {/* Địa chỉ hiện tại */}
              <Divider mt={"xs"} label="Nơi ở hiện tại" labelPosition="left" fw={700} className={classes.divider} />
              <Group w="100%" gap={"xs"}>
                <Autocomplete
                  withAsterisk
                  data={allCities}
                  label="Tỉnh"
                  placeholder="Vd: Thành phố Hà Nội"
                  {...form.getInputProps("cityCurrent")}
                  className={classes.inputAddress}
                  readOnly={staffData ? false : !staffData ? false : true}
                  fw={staffData ? "700" : ""}
                  required
                />
                <Autocomplete
                  withAsterisk
                  label="Quận/huyện"
                  placeholder="Vd: Quận Hà Đông"
                  {...form.getInputProps("districtCurrent")}
                  className={classes.inputAddress}
                  data={allDistrictsCurrent}
                  readOnly={staffData ? false : !staffData ? false : true}
                  fw={staffData ? "700" : ""}
                  required
                />
                <Autocomplete
                  withAsterisk
                  label="Phường/xã"
                  placeholder="Vd: Phường Yên Nghĩa"
                  {...form.getInputProps("wardCurrent")}
                  className={classes.inputAddress}
                  data={allWardsCurrent}
                  readOnly={staffData ? false : !staffData ? false : true}
                  fw={staffData ? "700" : ""}
                  required
                />
                <TextInput
                  w={"98.5%"}
                  withAsterisk
                  className={classes.input}
                  label="Địa chỉ"
                  name="currentAddress"
                  {...form.getInputProps("currentAddress")}
                  readOnly={staffData ? false : !staffData ? false : true}
                  fw={staffData ? "700" : ""}
                  required
                />
              </Group>
              <Divider my={"sm"} className={classes.dividerBlock} />
              {/* Trình độ văn hoá, ngày sinh, Ngày vào đoàn, Ngày vào Đảng, Ngày chính thức vào Đảng */}
              <Group w="100%" gap={"lg"}>
                <DatePickerInput
                  w={{ sm: "100%", md: "22%" }}
                  withAsterisk
                  clearable
                  className={classes.input}
                  label="Ngày sinh"
                  name="dob"
                  valueFormat="DD/MM/YYYY"
                  {...form.getInputProps("dob")}
                  readOnly={staffData ? false : !staffData ? false : true}
                  fw={staffData ? "700" : ""}
                />
                <DatePickerInput
                  w={{ sm: "100%", md: "22%" }}
                  withAsterisk
                  clearable
                  label="Ngày vào Đoàn"
                  name="dojCYU"
                  className={classes.input}
                  valueFormat="DD/MM/YYYY"
                  {...form.getInputProps("dojCYU")}
                  readOnly={staffData ? false : !staffData ? false : true}
                  fw={staffData ? "700" : ""}
                />
                <DatePickerInput
                  w={{ sm: "100%", md: "22%" }}
                  clearable
                  label="Ngày vào Đảng"
                  name="dojCPV"
                  className={classes.input}
                  valueFormat="DD/MM/YYYY"
                  {...form.getInputProps("dojCPV")}
                  readOnly={staffData ? false : !staffData ? false : true}
                  fw={staffData ? "700" : ""}
                />
                <DatePickerInput
                  w={{ sm: "100%", md: "22%" }}
                  clearable
                  label="Ngày chính thức"
                  name="officalDojCPV"
                  className={classes.input}
                  valueFormat="DD/MM/YYYY"
                  {...form.getInputProps("officalDojCPV")}
                  readOnly={staffData ? false : !staffData ? false : true}
                  fw={staffData ? "700" : ""}
                />
              </Group>
              {/* Sở trường */}
              <Group w="100%">
                <TextInput
                  w={{ sm: "100%", xl: "22%" }}
                  withAsterisk
                  label="Trình độ văn hoá"
                  name="culturalLevel"
                  className={classes.input}
                  readOnly={staffData ? false : !staffData ? false : true}
                  fw={!staffData ? "700" : ""}
                  {...form.getInputProps("culturalLevel")}
                />
                <TextInput
                  w={{ sm: "100%", lg: "75%" }}
                  label="Sở trường"
                  name="habit"
                  className={classes.input}
                  defaultValue={""}
                  {...form.getInputProps("habit")}
                  readOnly={staffData ? false : !staffData ? false : true}
                  fw={staffData ? "700" : ""}
                />
              </Group>
            </Stack>
          </Group>
        </Stack>
      </form>
    </>
  );
}
