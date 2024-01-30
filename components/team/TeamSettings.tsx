"use client";

import useNotify, { Action } from "@/hooks/useNotify";
import { defaultHeaders, validateDomain, validateEmail } from "@/lib/common";
import { invalid, required } from "@/lib/messages";
import { UploadButton } from "@/lib/uploadthing";
import { api } from "@/server/api";
import {
  Autocomplete,
  Button,
  Card,
  Divider,
  Flex,
  Grid,
  Group,
  LoadingOverlay,
  NumberInput,
  Text,
  TextInput
} from "@mantine/core";
import { isNotEmpty, useForm } from "@mantine/form";
import { Team } from "@prisma/client";
import "@uploadthing/react/styles.css";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSWRConfig } from "swr";
import { AccessControl } from "../shared/AccessControl";
import LetterAvatar from "../shared/LetterAvatar";
import classes from "./TeamSettings.module.css";

const TeamSettings = ({ team }: { team: Team }) => {
  const { notifyResult } = useNotify();
  const router = useRouter();
  const { mutate } = useSWRConfig();

  const [image, setImage] = useState<string | null>(team.logo);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [addressCitySelected, setAddressCitySelected] = useState<string>("");
  const [addressDistrictSelected, setAddressDistrictSelected] = useState<string>("");
  const [VATBillCitySelected, setVATBillCitySelected] = useState<string>("");
  const [VATBillDistrictSelected, setVATBillDistrictSelected] = useState<string>("");

  const { data: allCities, isLoading: isLoadingCities } = api.adDivision.getAllCities.useQuery();
  const { data: allAddressDistricts } = api.adDivision.getAllDistricts.useQuery({
    cityName: addressCitySelected
  });
  const { data: allAddressWards } = api.adDivision.getAllWards.useQuery({
    cityName: addressCitySelected,
    districtName: addressDistrictSelected
  });
  const { data: allVATBillDistricts } = api.adDivision.getAllDistricts.useQuery({
    cityName: VATBillCitySelected
  });
  const { data: allVATBillWards } = api.adDivision.getAllWards.useQuery({
    cityName: VATBillCitySelected,
    districtName: VATBillDistrictSelected
  });

  const form = useForm({
    initialValues: {
      name: team.name,
      slug: team.slug,
      domain: team.domain || "",
      logo: team.logo,
      abbreviation: team.abbreviation || "",
      bussinessCode: team.bussinessCode || "",
      provinceAddress: team.provinceAddress || "",
      districtAddress: team.districtAddress || "",
      wardAddress: team.wardAddress || "",
      detailAddress: team.detailAddress || "",
      provinceVATBill: team.provinceVATBill || "",
      districtVATBill: team.districtVATBill || "",
      wardVATBill: team.wardVATBill || "",
      detailVATBill: team.detailVATBill || "",
      phoneNumber: team.phoneNumber || "",
      email: team.email || "",
      zalo: team.zalo || "",
      facebook: team.facebook || "",
      code: team.code || "",
      localCode: team.localCode || null
    },
    validateInputOnBlur: true,
    validate: {
      name: isNotEmpty(required("tên")),
      slug: isNotEmpty(required("đường dẫn")),
      domain: (value) => {
        if (value === "" || value === null) return null;
        else return validateDomain(value) ? null : invalid("Tên miền", "Tên miền có dạng: example.com");
      },
      email: (value) => {
        if (value === "" || value === null) {
          return null;
        } else {
          return validateEmail(value) ? null : invalid("Email");
        }
      },
      phoneNumber: (value) => {
        if (value === "" || value === null) {
          return null;
        } else {
          return /(84|0[3|5|7|8|9])+([0-9]{8})\b/.test(value) ? null : invalid("Số điện thoại");
        }
      },
      bussinessCode: (value) => {
        if (value === "" || value === null) {
          return null;
        } else {
          return /^[0-9]*-?[0-9]+$/.test(value) ? null : invalid("Mã số đăng ký kinh doanh");
        }
      },
      localCode: (value) => {
        if (value === null) {
          return null;
        } else {
          return value < 2147483647 && value >= 0 ? null : invalid("Mã số địa phương");
        }
      }
    }
  });

  useEffect(() => {
    form.setFieldValue("logo", image);
  }, [image]);
  useEffect(() => {
    setAddressCitySelected(form.values.provinceAddress);
    setAddressDistrictSelected(form.values.districtAddress);
    setVATBillCitySelected(form.values.provinceVATBill);
    setVATBillDistrictSelected(form.values.districtVATBill);
  }, [
    form.values.provinceAddress,
    form.values.districtAddress,
    form.values.provinceVATBill,
    form.values.districtVATBill
  ]);

  async function handleSubmit(values) {
    const data = {
      ...values,
      domain: values.domain === "" ? null : values.domain,
      localCode: +values.localCode
    };
    setIsSubmitting(true);
    const response = await fetch(`/api/teams/${team.slug}`, {
      method: "PUT",
      headers: defaultHeaders,
      body: JSON.stringify(data)
    });
    const json = await response.json();

    setIsSubmitting(false);

    if (!response.ok) {
      notifyResult(Action.Update, "thiết lập", false, json.message);
      return;
    }

    notifyResult(Action.Update, "thiết lập", true);
    mutate(`/api/teams/${json.data.slug}`);
    form.resetDirty();
    router.push(`/teams/${json.data.slug}/settings`);
  }

  return (
    <>
      <LoadingOverlay visible={isLoadingCities} />
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Card radius="md" withBorder>
          <Text fw={500} size="lg">
            Thiết lập bệnh viện
          </Text>
          <Text mt="xs" c="dimmed" size="sm">
            Thiết lập và cấu hình riêng cho bệnh viện này.
          </Text>
          <Grid>
            <Grid.Col span={{ base: 12, md: 3, lg: 3 }}>
              <TextInput mt="md" name="code" label="Mã bệnh viện" {...form.getInputProps("code")} />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 9, lg: 9 }}>
              <TextInput mt="md" name="name" label="Tên bệnh viện" {...form.getInputProps("name")} />
            </Grid.Col>
          </Grid>
          <Grid>
            <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
              <TextInput mt="md" name="slug" label="Đường dẫn" {...form.getInputProps("slug")} />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
              <TextInput mt="md" name="domain" label="Tên miền" {...form.getInputProps("domain")} />
            </Grid.Col>
          </Grid>
          <Grid>
            <Grid.Col span={{ base: 12, md: 4, lg: 4 }}>
              <TextInput mt="md" name="abbreviation" label="Tên viết tắt" {...form.getInputProps("abbreviation")} />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 4, lg: 4 }}>
              <TextInput
                mt="md"
                name="bussinessCode"
                label="Mã số Đăng ký kinh doanh"
                {...form.getInputProps("bussinessCode")}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 4, lg: 4 }}>
              <NumberInput mt="md" name="localCode" label="Mã số địa phương" {...form.getInputProps("localCode")} />
            </Grid.Col>
          </Grid>
          {/* Địa chỉ liên hệ*/}
          <Divider mt="md" label="Địa chỉ liên hệ" labelPosition="left" fw={700} className={classes.divider} />
          <Grid>
            <Grid.Col span={{ base: 12, md: 4, lg: 4 }}>
              <Autocomplete
                data={allCities}
                label="Tỉnh"
                placeholder="Vd: Thành phố Hà Nội"
                {...form.getInputProps("provinceAddress")}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 4, lg: 4 }}>
              <Autocomplete
                data={allAddressDistricts}
                label="Quận/huyện"
                placeholder="Vd: Quận Hà Đông"
                {...form.getInputProps("districtAddress")}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 4, lg: 4 }}>
              <Autocomplete
                data={allAddressWards}
                label="Phường/xã"
                placeholder="Vd: Phường Yên Nghĩa"
                {...form.getInputProps("wardAddress")}
              />
            </Grid.Col>
          </Grid>
          <Grid>
            <Grid.Col span={{ base: 12, md: 8, lg: 8 }}>
              <TextInput mt="md" label="Địa chỉ" {...form.getInputProps("detailAddress")} />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 4, lg: 4 }}>
              <TextInput mt="md" name="phoneNumber" label="Số điện thoại" {...form.getInputProps("phoneNumber")} />
            </Grid.Col>
          </Grid>
          <Grid>
            <Grid.Col span={{ base: 12, md: 4, lg: 4 }}>
              <TextInput mt="md" name="email" type="email" label="Email" {...form.getInputProps("email")} />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 4, lg: 4 }}>
              <TextInput mt="md" name="zalo" label="Zalo" {...form.getInputProps("zalo")} />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 4, lg: 4 }}>
              <TextInput mt="md" name="facebook" label="Facebook" {...form.getInputProps("facebook")} />
            </Grid.Col>
          </Grid>

          {/* Địa chỉ hóa đơn*/}
          <Divider mt="md" label="Địa chỉ hóa đơn" labelPosition="left" fw={700} className={classes.divider} />
          <Grid>
            <Grid.Col span={{ base: 12, md: 4, lg: 4 }}>
              <Autocomplete
                data={allCities}
                label="Tỉnh"
                placeholder="Vd: Thành phố Hà Nội"
                {...form.getInputProps("provinceVATBill")}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 4, lg: 4 }}>
              <Autocomplete
                data={allVATBillDistricts}
                label="Quận/huyện"
                placeholder="Vd: Quận Hà Đông"
                {...form.getInputProps("districtVATBill")}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 4, lg: 4 }}>
              <Autocomplete
                data={allVATBillWards}
                label="Phường/xã"
                placeholder="Vd: Phường Yên Nghĩa"
                {...form.getInputProps("wardVATBill")}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 12, lg: 12 }}>
              <TextInput className={classes.input} label="Địa chỉ" {...form.getInputProps("detailVATBill")} />
            </Grid.Col>
          </Grid>

          <Text fw={500} size="md" mt="md">
            Logo
          </Text>
          <Text mt="xs" c="dimmed" size="sm">
            Nhấp vào nút tải lên để tải lên logo tùy chỉnh từ tệp ảnh. <br />
            Các loại tệp được chấp nhận: .PNG, .JPG. Kích thước tệp tối đa: 2 MB.
          </Text>
          <Flex justify="center" align="center" direction="column" wrap="wrap" mt="xs">
            <LetterAvatar url={image} name={team.name} size={96} />
            <UploadButton
              content={{
                button({ ready }) {
                  if (ready) return <div>Tải lên</div>;
                },
                allowedContent() {
                  return "Hình ảnh dưới 2MB.";
                }
              }}
              className="float-left mt-4 ut-button:bg-red-500 ut-button:ut-readying:bg-red-500/50"
              endpoint="imageUploader"
              onClientUploadComplete={(res) => {
                // Do something with the response
                if (res) {
                  setImage(res[0].url);
                }

                notifyResult(Action.Upload, "logo", true);
              }}
              onUploadError={(error: Error) => {
                notifyResult(Action.Upload, "logo", false, error.message);
              }}
            />
          </Flex>
          <AccessControl resource="team" actions={["update"]}>
            <Group justify="flex-end" mt="md">
              <Button type="submit" loading={isSubmitting} disabled={!form.isDirty()}>
                Lưu thay đổi
              </Button>
            </Group>
          </AccessControl>
        </Card>
      </form>
    </>
  );
};

export default TeamSettings;
