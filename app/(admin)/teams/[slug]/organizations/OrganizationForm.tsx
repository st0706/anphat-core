import { LetterAvatar } from "@/components/shared";
import useNotify, { Action } from "@/hooks/useNotify";
import { validateDomain, validateEmail } from "@/lib/common";
import { invalid } from "@/lib/messages";
import { UploadButton } from "@/lib/uploadthing";
import { api } from "@/server/api";
import { DataGrid, TreeNode } from "@/types";
import { Autocomplete, Button, Divider, Grid, Group, LoadingOverlay, Text, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { Team } from "@prisma/client";
import "@uploadthing/react/styles.css";
import { useEffect, useState } from "react";
import classes from "./OrganizationForm.module.css";

interface IProps {
  organization?: TreeNode | DataGrid | null;
  team: Team;
  handleSubmit?: (values: any) => void;
  parentId?: string | null;
}

let OrganizationForm = (props: IProps) => {
  const { organization, team, handleSubmit, parentId } = props;
  const { notifyResult } = useNotify();
  const [image, setImage] = useState<string | null>();

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
  const { data: getOrganization } = api.organization.get.useQuery({
    id: parentId || organization?.parentId
  });

  const form = useForm({
    initialValues: {
      id: "",
      name: "",
      organizationId: "",
      abbreviation: "",
      parentId: "",
      teamName: team.name,
      teamId: team.id,
      logo: "",
      phoneNumber: "",
      email: "",
      provinceAddress: team.provinceAddress,
      districtAddress: team.districtAddress,
      wardAddress: team.wardAddress,
      detailAddress: team.detailAddress,
      provinceVATBill: team.provinceVATBill,
      districtVATBill: team.districtVATBill,
      wardVATBill: team.wardVATBill,
      detailVATBill: team.detailVATBill,
      website: ""
    },
    validateInputOnBlur: true,
    validate: {
      email: (value) => {
        if (value === "" || value === null) {
          return null;
        } else {
          return validateEmail(value) ? null : invalid("Email");
        }
      },
      website: (value) => {
        if (value === "" || value === null) return null;
        else return validateDomain(value) ? null : invalid("Website");
      },
      phoneNumber: (value) => {
        if (value === "" || value === null) {
          return null;
        } else {
          return /(84|0[3|5|7|8|9])+([0-9]{8})\b/.test(value) ? null : invalid("Số điện thoại");
        }
      }
    }
  });

  useEffect(() => {
    if (image) form.setValues({ logo: image });
  }, [image]);
  useEffect(() => {
    if (organization && organization.id) {
      form.setValues({
        id: organization.id,
        name: organization.name,
        logo: organization.logo || "",
        abbreviation: organization.abbreviation || "",
        organizationId: organization.organizationId,
        phoneNumber: organization.phoneNumber || "",
        email: organization.email || "",
        provinceAddress: organization.provinceAddress || "",
        districtAddress: organization.districtAddress || "",
        wardAddress: organization.wardAddress || "",
        detailAddress: organization.detailAddress || "",
        provinceVATBill: organization.provinceVATBill || "",
        districtVATBill: organization.districtVATBill || "",
        wardVATBill: organization.wardVATBill || "",
        detailVATBill: organization.detailVATBill || "",
        website: organization.website || ""
      });
    } else {
      form.reset();
    }
  }, [organization]);
  useEffect(() => {
    setAddressCitySelected(form.values.provinceAddress || "");
    setAddressDistrictSelected(form.values.districtAddress || "");
    setVATBillCitySelected(form.values.provinceVATBill || "");
    setVATBillDistrictSelected(form.values.districtVATBill || "");
  }, [
    form.values.provinceAddress,
    form.values.districtAddress,
    form.values.provinceVATBill,
    form.values.districtVATBill
  ]);

  const handleSubmitForm = async () => {
    const formObj = {
      id: form.values.id,
      name: form.values.name,
      parentId: parentId || "null",
      teamId: team.id,
      logo: form.values.logo || "",
      organizationId: form.values.organizationId,
      abbreviation: form.values.abbreviation || "",
      phoneNumber: form.values.phoneNumber || "",
      email: form.values.email || "",
      provinceAddress: form.values.provinceAddress || "",
      districtAddress: form.values.districtAddress || "",
      wardAddress: form.values.wardAddress || "",
      detailAddress: form.values.detailAddress || "",
      provinceVATBill: form.values.provinceVATBill || "",
      districtVATBill: form.values.districtVATBill || "",
      wardVATBill: form.values.wardVATBill || "",
      detailVATBill: form.values.detailVATBill || "",
      website: form.values.website || ""
    };
    handleSubmit?.(formObj);
  };
  console.log();
  return (
    <>
      <LoadingOverlay visible={isLoadingCities} />
      <form onSubmit={form.onSubmit(() => handleSubmitForm())}>
        <Grid mt={"md"}>
          <Grid.Col span={12}>
            <Group wrap="nowrap">
              <Text inline fw={500} size="md">
                Thuộc bệnh viện:
              </Text>
              <Text inline fw={600} size="md">
                {form.values.teamName}
              </Text>
            </Group>
            <Group>
              <Text inline fw={500} size="md">
                Đơn vị cấp trên:
              </Text>
              <Text inline fw={600} size="md">
                {getOrganization?.name ? getOrganization?.name : "Không có"}
              </Text>
            </Group>
            <TextInput style={{ display: "none" }} disabled {...form.getInputProps("teamName")} />
          </Grid.Col>
        </Grid>
        <Grid mt={"md"}>
          <Grid.Col span={{ base: 12, md: 2, lg: 2 }}>
            <TextInput
              required
              withAsterisk
              label="ID"
              {...form.getInputProps("organizationId")}
              // disabled={organization?.id ? true : false}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 5, lg: 5 }}>
            <TextInput required withAsterisk label="Tên" {...form.getInputProps("name")} />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 5, lg: 5 }}>
            <TextInput label="Tên viết tắt" {...form.getInputProps("abbreviation")} />
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
          <Grid.Col span={12}>
            <TextInput mt="md" label="Địa chỉ" {...form.getInputProps("detailAddress")} />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 4, lg: 4 }}>
            <TextInput label="Số điện thoại" {...form.getInputProps("phoneNumber")} />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 4, lg: 4 }}>
            <TextInput label="Email" {...form.getInputProps("email")} />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 4, lg: 4 }}>
            <TextInput label="Website" {...form.getInputProps("website")} />
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
          <Grid.Col span={12}>
            <TextInput className={classes.input} label="Địa chỉ" {...form.getInputProps("detailVATBill")} />
          </Grid.Col>
        </Grid>
        <div className="flex flex-row align-middle justify-center gap-10 py-3">
          <UploadButton
            content={{
              button({ ready }) {
                if (ready) return <div>Tải lên logo</div>;
              },
              allowedContent() {
                return "Hình ảnh dưới 2MB.";
              }
            }}
            className="float-left mt-4 ut-button:bg-red-500 ut-button:ut-readying:bg-red-500/50"
            endpoint="imageUploader"
            onClientUploadComplete={(res) => {
              // Do something with the response
              if (res) setImage(res[0].url);
              notifyResult(Action.Upload, "logo", true);
            }}
            onUploadError={(e: Error) => {
              // Do something with the error.
              notifyResult(Action.Upload, "logo", false, e.message);
            }}
          />
          <LetterAvatar url={form.values.logo} name={form.values.name} size={96} />
        </div>

        <div className="flex justify-center align-middle">
          <Button size="md" justify="center" my={15} variant="primary" type="submit">
            Lưu
          </Button>
        </div>
      </form>
    </>
  );
};

export default OrganizationForm;
