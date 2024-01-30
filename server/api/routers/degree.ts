import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { z } from "zod";

interface IData {
  name: string;
  description: string;
}

export const deegreeRouter = createTRPCRouter({
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
      const rowCount = await ctx.db.degree.count();

      const queryData = await ctx.db.degree.findMany({
        skip: pageIndex * pageSize,
        take: pageSize,
        where: {
          OR: [
            {
              name: {
                contains: searchKey || "",
                mode: "insensitive"
              }
            }
          ]
        },
        orderBy: {
          id: "asc"
        }
      });

      return { queryData, rowCount };
    }),

  getById: protectedProcedure
    .input(
      z.object({
        id: z.string()
      })
    )
    .query(async ({ ctx, input }) => {
      return await ctx.db.degree.findUnique({
        where: { id: input.id }
      });
    }),

  delete: protectedProcedure
    .input(
      z.object({
        id: z.string()
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.degree.delete({
        where: { id: input.id }
      });
    }),

  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        description: z.string()
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.degree.create({
        data: {
          name: input.name,
          description: input.description
        }
      });
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
        description: z.string()
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.degree.update({
        where: {
          id: input.id
        },
        data: {
          name: input.name,
          description: input.description
        }
      });
    }),

  deleteAll: protectedProcedure.mutation(async ({ ctx }) => {
    return await ctx.db.degree.deleteMany();
  }),

  import: protectedProcedure
    .input(
      z.object({
        dataUpload: z.array(
          z.object({
            name: z.string(),
            description: z.string()
          })
        ),
        importMethod: z.string().nullable()
      })
    )
    .mutation(async ({ ctx, input }) => {
      const oldList = await ctx.db.degree.findMany();
      const oldListSet = new Set<string>(
        oldList.reduce((acc: any[], curr: IData) => {
          acc.push(curr.name);
          return acc;
        }, [])
      );
      let newData: IData[] = [];

      switch (input.importMethod) {
        case "RESET":
          const count = await ctx.db.degree.count();

          if (count > 0) await ctx.db.degree.deleteMany({});
          return ctx.db.degree.createMany({
            data: input.dataUpload
          });

        case "UPDATE":
          const overWrittenRows: IData[] = [];
          const createNewRows: IData[] = [];

          input.dataUpload.forEach((row: IData, idx: number) => {
            if (oldListSet.has(row.name)) {
              overWrittenRows.push(row);
            } else if (!oldListSet.has(row.name)) {
              createNewRows.push(row);
            }
          });

          if (createNewRows.length > 0) {
            await ctx.db.degree.createMany({
              data: createNewRows
            });
          }
          if (overWrittenRows.length > 0) {
            await Promise.all(
              overWrittenRows.map(async (row: IData) => {
                await ctx.db.degree.update({
                  where: {
                    name: row.name
                  },
                  data: row
                });
              })
            );
          }

          break;

        case "ADD_NEW_ONLY":
          for (const record of input.dataUpload) {
            if (!oldListSet.has(record.name)) {
              newData.push(record!);
            }
          }

          return ctx.db.degree.createMany({
            data: newData
          });

        default:
          break;
      }
    })
});
