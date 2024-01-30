import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

interface IData {
  chapternumber: string;
  chaptercode: string;
  chaptername1: string;
  chaptername2: string;
  maingroupcode: string;
  maingroupname1: string;
  maingroupname2: string;
  subgroupcode1: string;
  subgroupname1: string;
  subgroupname11: string;
  subgroupcode2: string;
  subgroupname2: string;
  subgroupname22: string;
  typecode: string;
  typename1: string;
  typename2: string;
  diseasecode: string;
  name1: string;
  name2: string;
  teamcode: string;
  detailcode: string;
  description1: string;
  description2: string;
}

export const diseaseRouter = createTRPCRouter({
  get: protectedProcedure
    .input(
      z.object({
        search: z.string().nullish(),
        pageIndex: z.number(),
        pageSize: z.number()
      })
    )
    .query(async ({ ctx, input }) => {
      const { search, pageIndex, pageSize } = input;
      const count = await ctx.db.disease.count({
        where: {
          OR: [
            {
              typecode: {
                contains: search || "",
                mode: "insensitive"
              },
              typename1: {
                contains: search || "",
                mode: "insensitive"
              },
              typename2: {
                contains: search || "",
                mode: "insensitive"
              },
              diseasecode: {
                contains: search || "",
                mode: "insensitive"
              },
              name1: {
                contains: search || "",
                mode: "insensitive"
              },
              name2: {
                contains: search || "",
                mode: "insensitive"
              }
            }
          ]
        }
      });
      const data = await ctx.db.disease.findMany({
        where: {
          OR: [
            {
              typecode: {
                contains: search || "",
                mode: "insensitive"
              }
            },
            {
              typename1: {
                contains: search || "",
                mode: "insensitive"
              }
            },
            {
              typename2: {
                contains: search || "",
                mode: "insensitive"
              }
            },
            {
              diseasecode: {
                contains: search || "",
                mode: "insensitive"
              }
            },
            {
              name1: {
                contains: search || "",
                mode: "insensitive"
              }
            },
            {
              name2: {
                contains: search || "",
                mode: "insensitive"
              }
            }
          ]
        },
        skip: pageIndex * pageSize,
        take: pageSize
      });
      return {
        count,
        data
      };
    }),

  getById: protectedProcedure
    .input(
      z.object({
        id: z.string()
      })
    )
    .query(async ({ ctx, input }) => {
      return await ctx.db.disease.findFirst({
        where: { id: input.id }
      });
    }),

  import: protectedProcedure
    .input(
      z.object({
        dataUpload: z.array(
          z.object({
            chapternumber: z.string(),
            chaptercode: z.string(),
            chaptername1: z.string(),
            chaptername2: z.string(),
            maingroupcode: z.string(),
            maingroupname1: z.string(),
            maingroupname2: z.string(),
            subgroupcode1: z.string(),
            subgroupname1: z.string(),
            subgroupname11: z.string(),
            subgroupcode2: z.string(),
            subgroupname2: z.string(),
            subgroupname22: z.string(),
            typecode: z.string(),
            typename1: z.string(),
            typename2: z.string(),
            diseasecode: z.string(),
            name1: z.string(),
            name2: z.string(),
            teamcode: z.string(),
            detailcode: z.string(),
            description1: z.string(),
            description2: z.string()
          })
        ),
        importMethod: z.string().nullable()
      })
    )
    .mutation(async ({ ctx, input }) => {
      const oldList = await ctx.db.disease.findMany();
      const oldListSet = new Set<string>(
        oldList.reduce((acc: any[], curr: IData) => {
          acc.push(curr.diseasecode);
          return acc;
        }, [])
      );
      let newData: IData[] = [];

      switch (input.importMethod) {
        case "RESET":
          const count = await ctx.db.disease.count();

          if (count > 0) await ctx.db.disease.deleteMany({});
          return ctx.db.disease.createMany({
            data: input.dataUpload
          });

        case "UPDATE":
          const overWrittenRows: IData[] = [];
          const createNewRows: IData[] = [];

          input.dataUpload.forEach((row: IData, idx: number) => {
            if (oldListSet.has(row.diseasecode)) {
              overWrittenRows.push(row);
            } else if (!oldListSet.has(row.diseasecode)) {
              createNewRows.push(row);
            }
          });

          if (createNewRows.length > 0) {
            await ctx.db.disease.createMany({
              data: createNewRows
            });
          }
          if (overWrittenRows.length > 0) {
            await Promise.all(
              overWrittenRows.map(async (row: IData) => {
                await ctx.db.disease.update({
                  where: {
                    diseasecode: row.diseasecode
                  },
                  data: row
                });
              })
            );
          }

          break;

        case "ADD_NEW_ONLY":
          for (const record of input.dataUpload) {
            if (!oldListSet.has(record.diseasecode)) {
              newData.push(record!);
            }
          }

          return ctx.db.disease.createMany({
            data: newData
          });

        default:
          break;
      }
    }),

  delete: protectedProcedure
    .input(
      z.object({
        id: z.string()
      })
    )
    .mutation(async ({ ctx, input }) => {
      let diseaseDb = await ctx.db.disease.findUnique({
        where: { id: input.id }
      });
      if (!diseaseDb) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Không thể xóa, hãy hoàn thành các thao tác còn thiếu!"
        });
      } else {
        return await ctx.db.disease.delete({
          where: { id: input.id }
        });
      }
    }),

  create: protectedProcedure
    .input(
      z.object({
        chapternumber: z.string(),
        chaptercode: z.string(),
        chaptername1: z.string(),
        chaptername2: z.string(),
        maingroupcode: z.string(),
        maingroupname1: z.string(),
        maingroupname2: z.string(),
        subgroupcode1: z.string(),
        subgroupname1: z.string(),
        subgroupname11: z.string(),
        subgroupcode2: z.string(),
        subgroupname2: z.string(),
        subgroupname22: z.string(),
        typecode: z.string(),
        typename1: z.string(),
        typename2: z.string(),
        diseasecode: z.string(),
        name1: z.string(),
        name2: z.string(),
        teamcode: z.string(),
        detailcode: z.string(),
        description1: z.string(),
        description2: z.string()
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.disease.create({
        data: {
          chapternumber: input.chapternumber,
          chaptercode: input.chaptercode,
          chaptername1: input.chaptername1,
          chaptername2: input.chaptername2,
          maingroupcode: input.maingroupcode,
          maingroupname1: input.maingroupname1,
          maingroupname2: input.maingroupname2,
          subgroupcode1: input.subgroupcode1,
          subgroupname1: input.subgroupname1,
          subgroupname11: input.subgroupname11,
          subgroupcode2: input.subgroupcode2,
          subgroupname2: input.subgroupname2,
          subgroupname22: input.subgroupname22,
          typecode: input.typecode,
          typename1: input.typename1,
          typename2: input.typename2,
          diseasecode: input.diseasecode,
          name1: input.name1,
          name2: input.name2,
          teamcode: input.teamcode,
          detailcode: input.detailcode,
          description1: input.description1,
          description2: input.description2
        }
      });
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        chapternumber: z.string(),
        chaptercode: z.string(),
        chaptername1: z.string(),
        chaptername2: z.string(),
        maingroupcode: z.string(),
        maingroupname1: z.string(),
        maingroupname2: z.string(),
        subgroupcode1: z.string(),
        subgroupname1: z.string(),
        subgroupname11: z.string(),
        subgroupcode2: z.string(),
        subgroupname2: z.string(),
        subgroupname22: z.string(),
        typecode: z.string(),
        typename1: z.string(),
        typename2: z.string(),
        diseasecode: z.string(),
        name1: z.string(),
        name2: z.string(),
        teamcode: z.string(),
        detailcode: z.string(),
        description1: z.string(),
        description2: z.string()
      })
    )
    .mutation(async ({ ctx, input }) => {
      let diseaseDb = await ctx.db.disease.findUnique({
        where: { id: input.id }
      });
      if (!diseaseDb) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Không thể sửa, hãy hoàn thành các thao tác còn thiếu!"
        });
      } else {
        return await ctx.db.disease.update({
          where: {
            id: input.id
          },
          data: {
            chapternumber: input.chapternumber,
            chaptercode: input.chaptercode,
            chaptername1: input.chaptername1,
            chaptername2: input.chaptername2,
            maingroupcode: input.maingroupcode,
            maingroupname1: input.maingroupname1,
            maingroupname2: input.maingroupname2,
            subgroupcode1: input.subgroupcode1,
            subgroupname1: input.subgroupname1,
            subgroupname11: input.subgroupname11,
            subgroupcode2: input.subgroupcode2,
            subgroupname2: input.subgroupname2,
            subgroupname22: input.subgroupname22,
            typecode: input.typecode,
            typename1: input.typename1,
            typename2: input.typename2,
            diseasecode: input.diseasecode,
            name1: input.name1,
            name2: input.name2,
            teamcode: input.teamcode,
            detailcode: input.detailcode,
            description1: input.description1,
            description2: input.description2
          }
        });
      }
    }),

  deleteAll: protectedProcedure.mutation(async ({ ctx }) => {
    return await ctx.db.disease.deleteMany();
  })
});
