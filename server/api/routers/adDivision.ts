import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { record, z } from "zod";
import _ from "lodash";
import { reportWebVitals } from "next/dist/build/templates/pages";

type Cities = {
  cityCode: string;
  cityName: string;
};

type Districts = {
  districtCode: string;
  districtName: string;
  cityId: string;
  cityName: string;
};

type Wards = {
  wardCode: string;
  wardName: string;
  districtId: string;
  districtName: string;
  cityId: string;
  cityName: string;
};

export const adDivisionRouter = createTRPCRouter({
  getAdDivisions: protectedProcedure
    .input(
      z.object({
        search: z.string().nullish(),
        pageIndex: z.number(),
        pageSize: z.number()
      })
    )
    .query(async ({ ctx, input }) => {
      const { pageIndex, pageSize } = input;
      const search = input.search || "";
      const count = await ctx.db.wards.count({
        where: {
          OR: [
            {
              wardName: {
                contains: search!,
                mode: "insensitive"
              }
            },
            {
              wardCode: {
                contains: search!,
                mode: "insensitive"
              }
            },
            {
              cityName: {
                contains: search!,
                mode: "insensitive"
              }
            },
            {
              districtName: {
                contains: search!,
                mode: "insensitive"
              }
            },
            {
              cityId: {
                contains: search!,
                mode: "insensitive"
              }
            },
            {
              districtId: {
                contains: search!,
                mode: "insensitive"
              }
            }
          ]
        }
      });
      const data = await ctx.db.wards.findMany({
        where: {
          OR: [
            {
              wardName: {
                contains: search!,
                mode: "insensitive"
              }
            },
            {
              wardCode: {
                contains: search!,
                mode: "insensitive"
              }
            },
            {
              cityName: {
                contains: search!,
                mode: "insensitive"
              }
            },
            {
              districtName: {
                contains: search!,
                mode: "insensitive"
              }
            },
            {
              cityId: {
                contains: search!,
                mode: "insensitive"
              }
            },
            {
              districtId: {
                contains: search!,
                mode: "insensitive"
              }
            }
          ]
        },
        skip: pageIndex * pageSize,
        take: pageSize,
        orderBy: {
          cityId: "asc"
        },
        include: {
          city: {
            select: {
              cityCode: true,
              cityName: true
            }
          },
          district: {
            select: {
              districtCode: true,
              districtName: true,
              cityId: true
            }
          }
        }
      });
      return {
        count,
        data
      };
    }),

  import: protectedProcedure
    .input(
      z.object({
        dataUpload: z.array(
          z.object({
            wardCode: z.string(),
            wardName: z.string(),
            districtId: z.string(),
            districtName: z.string(),
            cityId: z.string(),
            cityName: z.string()
          })
        ),
        importMethod: z.string()
      })
    )
    .mutation(async ({ ctx, input }) => {
      /**
       * cities: biến để lưu vào bảng cities
       * districts: biến để lưu vào bảng districts
       * wards: biến để lưu vào bảng wards
       */
      const { dataUpload, importMethod } = input;
      const count = await ctx.db.cities.count();
      const dataUploadSet = new Set(dataUpload);
      // resource
      let cities: Cities[] = [];
      let citiesMap = new Map();
      let districts: Districts[] = [];
      let districtsMap = new Map();
      let districtsIdSet = new Set();
      let wards: Wards[] = [];
      let wardsMap = new Map();
      let wardsIdSet = new Set();
      const setIterator = dataUploadSet.values();
      let next = setIterator.next();

      if (importMethod !== "RESET") {
        await ctx.db.wards.findMany().then((res) => {
          const recordSet = new Set(res);
          recordSet.forEach((row) => {
            citiesMap.set(`${row.cityId}`, row.cityName);
            districtsMap.set(`${row.districtId}`, row.districtName);
            districtsIdSet.add(row.districtId);
            wardsMap.set(`${row.wardCode}`, row.wardName);
            wardsIdSet.add(row.wardCode);
          });
        });
      }

      switch (importMethod) {
        case "RESET":
          for (let i = 0; i < dataUpload.length || 0; i++) {
            const cityName = dataUpload[i].cityName;
            const districtCode = dataUpload[i].districtId;
            const districtName = dataUpload[i].districtName;
            const wardCode = dataUpload[i].wardCode;
            const wardName = dataUpload[i].wardName;

            if (!citiesMap.has(dataUpload[i].cityId)) {
              citiesMap.set(`${dataUpload[i].cityId}`, cityName);
              cities.push({ cityCode: dataUpload[i].cityId, cityName });
            }
            if (!districtsMap.has(districtCode)) {
              districtsMap.set(`${dataUpload[i].districtId}`, districtName);
              districts.push({
                districtCode: dataUpload[i].districtId,
                districtName,
                cityId: dataUpload[i].cityId,
                cityName
              });
            }
            if (!wardsMap.has(wardCode)) {
              wardsMap.set(`${dataUpload[i].wardCode}`, wardName);
              wards.push(dataUpload[i]);
            }
          }

          if (count > 0) await ctx.db.cities.deleteMany({});
          return await ctx.db.$transaction([
            ctx.db.cities.createMany({
              data: cities
            }),
            ctx.db.districts.createMany({
              data: districts
            }),
            ctx.db.wards.createMany({
              data: wards
            })
          ]);

        case "ADD_NEW_ONLY":
          while (!next.done) {
            const row = next.value;

            if (!citiesMap.has(row.cityId)) {
              citiesMap.set(`${row.cityId}`, row.cityName);
              cities.push({ cityCode: row.cityId, cityName: row.cityName });
            }
            if (!districtsMap.has(row.districtId)) {
              districtsMap.set(`${row.districtId}`, row.districtName);
              districts.push({
                districtCode: row.districtId,
                districtName: row.districtName,
                cityId: row.cityId,
                cityName: row.cityName
              });
            }
            if (!wardsMap.has(row.wardCode)) {
              wardsMap.set(`${row.wardCode}`, row.wardName);
              wards.push(row);
            }
            // Get the next element
            next = setIterator.next();
          }

          return await ctx.db.$transaction([
            ctx.db.cities.createMany({
              data: cities
            }),
            ctx.db.districts.createMany({
              data: districts
            }),
            ctx.db.wards.createMany({
              data: wards
            })
          ]);

        case "UPDATE":
          let newData = 0;
          let citiesToUpdate: Cities[] = [];
          let districtsToUpdate: Districts[] = [];
          let wardsToUpdate: Wards[] = [];

          while (!next.done) {
            const row = next.value;

            if (!citiesMap.has(row.cityId)) {
              newData++;
              citiesMap.set(`${row.cityId}`, row.cityName);
              cities.push({ cityCode: row.cityId, cityName: row.cityName });
            } else if (row.cityName !== citiesMap.get(row.cityId)) {
              citiesMap.set(`${row.cityId}`, row.cityName);
              cities.push({ cityCode: row.cityId, cityName: row.cityName });
              citiesToUpdate.push({ cityCode: row.cityId, cityName: row.cityName });
            }
            if (!districtsMap.has(row.districtId)) {
              districtsMap.set(`${row.districtId}`, row.districtName);
              districts.push({
                districtCode: row.districtId,
                districtName: row.districtName,
                cityId: row.cityId,
                cityName: row.cityName
              });
              districtsIdSet.add(row.districtId);
            } else if (row.districtName !== districtsMap.get(row.districtId)) {
              const obj = {
                districtCode: row.districtId,
                districtName: row.districtName,
                cityId: row.cityId,
                cityName: row.cityName
              };
              districtsMap.set(`${row.districtId}`, row.districtName);
              districts.push(obj);
              districtsToUpdate.push(obj);
            }
            if (!wardsMap.has(row.wardCode)) {
              wardsMap.set(`${row.wardCode}`, row.wardName);
              wards.push(row);
              wardsIdSet.add(row.wardCode);
            } else if (row.wardName !== wardsMap.get(row.wardCode)) {
              wardsMap.set(`${row.wardCode}`, row.wardName);
              districtsIdSet.add(row.districtId);
              wardsToUpdate.push(row);
            }
            // Get the next element
            next = setIterator.next();
          }

          if (newData > 0) {
            return await ctx.db.$transaction([
              ctx.db.cities.createMany({
                data: cities
              }),
              ctx.db.districts.createMany({
                data: districts
              }),
              ctx.db.wards.createMany({
                data: wards
              })
            ]);
          }
          if (citiesToUpdate.length > 0)
            await Promise.all(
              citiesToUpdate.map(async (row: Cities) => {
                await ctx.db.cities.update({
                  where: {
                    cityCode: row.cityCode
                  },
                  data: row
                });
              })
            );
          if (districtsToUpdate.length > 0)
            await Promise.all(
              districtsToUpdate.map(async (row: Districts) => {
                await ctx.db.districts.update({
                  where: {
                    districtCode: row.districtCode
                  },
                  data: row
                });
              })
            );
          if (wardsToUpdate.length > 0)
            await Promise.all(
              wardsToUpdate.map(async (row: Wards) => {
                await ctx.db.wards.update({
                  where: {
                    wardCode_districtId: {
                      wardCode: row.wardCode,
                      districtId: row.districtId
                    }
                  },
                  data: row
                });
              })
            );
          break;

        default:
          break;
      }
    }),

  getAllCities: protectedProcedure.query(async ({ ctx, input }) => {
    return await ctx.db.cities
      .findMany({
        select: {
          cityName: true
        }
      })
      .then((res) => res.map((item) => item.cityName));
  }),

  getAllDistricts: protectedProcedure
    .input(
      z.object({
        cityName: z.string()
      })
    )
    .query(async ({ ctx, input }) => {
      return await ctx.db.districts
        .findMany({
          where: {
            cityName: input.cityName
          },
          select: {
            districtName: true
          }
        })
        .then((res) => res.map((item) => item.districtName));
    }),

  getAllWards: protectedProcedure
    .input(
      z.object({
        cityName: z.string(),
        districtName: z.string()
      })
    )
    .query(async ({ ctx, input }) => {
      return await ctx.db.wards
        .findMany({
          where: {
            cityName: input.cityName,
            districtName: input.districtName
          },
          select: {
            wardName: true
          }
        })
        .then((res) => res.map((item) => item.wardName));
    }),

  deleteAll: protectedProcedure.mutation(async ({ ctx }) => {
    const count = await ctx.db.cities.count();

    return count > 0 && (await ctx.db.cities.deleteMany());
  })
});
