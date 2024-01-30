import { Prisma } from "@prisma/client";
import z from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

interface IData {
  bloodCode: string;
  unitsPreparations: string;
  actualVolume: string;
  note: string | null;
}

export const bloodCodeRouter = createTRPCRouter({
  import: protectedProcedure
    .input(
      z.object({
        dataUpload: z.array(
          z.object({
            bloodCode: z.string(),
            unitsPreparations: z.string(),
            actualVolume: z.string(),
            note: z.string()
          })
        ),
        importMethod: z.string().nullable()
      })
    )
    .mutation(async ({ ctx, input }) => {
      const oldList = await ctx.db.bloodCode.findMany();
      const oldListSet = new Set<string>(
        oldList.reduce((acc: any[], curr: IData) => {
          acc.push(curr.bloodCode);
          return acc;
        }, [])
      );
      let newData: IData[] = [];

      switch (input.importMethod) {
        case "RESET":
          const count = await ctx.db.bloodCode.count();

          if (count > 0) await ctx.db.bloodCode.deleteMany({});
          return ctx.db.bloodCode.createMany({
            data: input.dataUpload
          });

        case "UPDATE":
          const overWrittenRows: IData[] = [];
          const createNewRows: IData[] = [];

          input.dataUpload.forEach((row: IData, idx: number) => {
            if (oldListSet.has(row.bloodCode)) {
              overWrittenRows.push(row);
            } else if (!oldListSet.has(row.bloodCode)) {
              createNewRows.push(row);
            }
          });

          if (createNewRows.length > 0) {
            await ctx.db.bloodCode.createMany({
              data: createNewRows
            });
          }
          if (overWrittenRows.length > 0) {
            await Promise.all(
              overWrittenRows.map(async (row: IData) => {
                await ctx.db.bloodCode.update({
                  where: {
                    bloodCode: row.bloodCode
                  },
                  data: row
                });
              })
            );
          }

          break;

        case "ADD_NEW_ONLY":
          for (const record of input.dataUpload) {
            if (!oldListSet.has(record.bloodCode)) {
              newData.push(record!);
            }
          }

          return ctx.db.bloodCode.createMany({
            data: newData
          });

        default:
          break;
      }
    }),

  get: protectedProcedure
    .input(
      z.object({
        searchKey: z.string(),
        pageIndex: z.number(),
        pageSize: z.number()
      })
    )
    .query(async ({ ctx, input }) => {
      const { searchKey, pageIndex, pageSize } = input;
      const rowCount = await ctx.db.bloodCode.count();

      const queryData = await ctx.db.bloodCode.findMany({
        skip: pageIndex * pageSize,
        take: pageSize,
        where: {
          OR: [
            {
              unitsPreparations: {
                contains: searchKey || "",
                mode: "insensitive"
              }
            },
            {
              bloodCode: {
                contains: searchKey || "",
                mode: "insensitive"
              }
            }
          ]
        },
        orderBy: {
          bloodCode: "asc"
        }
      });

      return { queryData, rowCount };
    }),

  create: protectedProcedure
    .input(
      z.object({
        bloodCode: z.string(),
        unitsPreparations: z.string(),
        actualVolume: z.string(),
        note: z.string()
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { bloodCode, unitsPreparations, actualVolume, note } = input;
      return ctx.db.bloodCode
        .create({
          data: {
            bloodCode,
            unitsPreparations,
            actualVolume,
            note
          }
        })
        .catch((e) => {
          if (e instanceof Prisma.PrismaClientKnownRequestError) {
            // The .code property can be accessed in a type-safe manner
            if (e.code === "P2002") {
              const match = e.message.match(/:\s*\(`(.*)`\)/);
              if (match) {
                e.message = ` ${match[1] === "bloodCode" ? "Mã máu" : ""} đã tồn tại`;
                throw e;
              }
            }
          }
          throw e;
        });
    }),

  update: protectedProcedure
    .input(
      z.object({
        bloodCode: z.string(),
        unitsPreparations: z.string(),
        actualVolume: z.string(),
        note: z.string()
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { bloodCode, unitsPreparations, actualVolume, note } = input;

      return await ctx.db.bloodCode.update({
        where: {
          bloodCode: bloodCode
        },
        data: { bloodCode, unitsPreparations, actualVolume, note }
      });
    }),

  delete: protectedProcedure
    .input(
      z.object({
        id: z.string()
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.bloodCode.delete({
        where: {
          id: input.id
        }
      });
    }),

  deleteAll: protectedProcedure.mutation(async ({ ctx }) => {
    return await ctx.db.bloodCode.deleteMany();
  })
});
