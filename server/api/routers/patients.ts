import { Gender, Prisma } from "@prisma/client";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
interface IData {
  patientId: string;
  patientName: string;
  description?: string | null;
  gender: Gender;
  doB: number;
  Phone: string;
  Email: string | null;
  address: string | null;
}
export const patientsRouter = createTRPCRouter({
  search: protectedProcedure
    .input(
      z.object({
        search: z.string().nullish()
      })
    )
    .query(async ({ ctx, input }) => {
      const data = await ctx.db.patient.findMany({
        where: {
          OR: [
            {
              patientName: {
                contains: input.search || "",
                mode: "insensitive"
              }
            },
            {
              Phone: {
                contains: input.search || "",
                mode: "insensitive"
              }
            },
            {
              Email: {
                contains: input.search || "",
                mode: "insensitive"
              }
            }
          ]
        }
      });
      return data;
    }),
  get: protectedProcedure
    .input(
      z.object({
        search: z.string().nullish(),
        pageIndex: z.number(),
        pageSize: z.number()
      })
    )
    .query(async ({ ctx, input }) => {
      const count = await ctx.db.patient.count({
        where: {
          OR: [
            {
              patientName: {
                contains: input.search || "",
                mode: "insensitive"
              }
            },
            {
              patientId: {
                contains: input.search || "",
                mode: "insensitive"
              }
            }
          ]
        }
      });
      const data = await ctx.db.patient.findMany({
        where: {
          OR: [
            {
              patientName: {
                contains: input.search || "",
                mode: "insensitive"
              }
            },
            {
              patientId: {
                contains: input.search || "",
                mode: "insensitive"
              }
            }
          ]
        },
        take: input.pageSize,
        skip: input.pageIndex * input.pageSize
      });
      return { data, count };
    }),
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const dataed = await ctx.db.patient.findMany();
    const data = dataed.map((patient) => ({
      ...patient,
      id: patient.id.toString()
    }));
    return data;
  }),
  create: protectedProcedure
    .input(
      z.object({
        patientId: z.string(),
        patientName: z.string(),
        description: z.string().nullish(),
        Phone: z.string(),
        Email: z.string().nullish(),
        address: z.string().nullish(),
        gender: z.nativeEnum(Gender),
        doB: z.coerce.date()
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.patient
        .create({
          data: {
            patientId: input.patientId,
            patientName: input.patientName,
            doB: new Date(input.doB).getTime(),
            gender: input.gender,
            description: input.description,
            Phone: input.Phone,
            Email: input.Email,
            address: input.address
          }
        })
        .catch((e) => {
          if (e instanceof Prisma.PrismaClientKnownRequestError) {
            if (e.code === "P2002") {
              const match = e.message.match(/:\s*\(`(.*)`\)/);
              if (match) {
                e.message = ` ${match[1] === "patientId" ? "Mã bệnh nhân" : ""} đã tồn tại`;
                throw e;
              }
            }
          }
          throw e;
        });
    }),
  delete: protectedProcedure.input(z.array(z.string())).mutation(async ({ ctx, input }) => {
    console.log(input);
    return ctx.db.patient.deleteMany({
      where: {
        patientId: { in: input }
      }
    });
  }),
  import: protectedProcedure
    .input(
      z.object({
        dataUpload: z.array(
          z.object({
            patientId: z.string(),
            patientName: z.string(),
            description: z.string().nullish(),
            gender: z.nativeEnum(Gender),
            doB: z.coerce.date(),
            Phone: z.string(),
            Email: z.string().nullable(),
            address: z.string().nullable()
          })
        ),
        importMethod: z.string().nullable()
      })
    )
    .mutation(async ({ ctx, input }) => {
      const oldList = await ctx.db.patient.findMany();
      const oldListSet = new Set<string>(
        oldList.reduce((acc: any[], curr) => {
          acc.push(curr.patientId);
          return acc;
        }, [])
      );
      let newData: IData[] = [];
      const data = input.dataUpload.map((data) => {
        return { ...data, doB: new Date(data.doB).getTime() };
      });
      switch (input.importMethod) {
        case "RESET":
          const count = await ctx.db.patient.count();

          if (count > 0) await ctx.db.patient.deleteMany({});

          return ctx.db.patient.createMany({
            data: data
          });

        case "UPDATE":
          const overWrittenRows: IData[] = [];
          const createNewRows: IData[] = [];

          data.forEach((row: IData) => {
            if (oldListSet.has(row.patientId)) {
              overWrittenRows.push(row);
            } else if (!oldListSet.has(row.patientId)) {
              createNewRows.push(row);
            }
          });

          if (createNewRows.length > 0) {
            await ctx.db.patient.createMany({
              data: createNewRows
            });
          }
          if (overWrittenRows.length > 0) {
            await Promise.all(
              overWrittenRows.map(async (row: IData) => {
                await ctx.db.patient.update({
                  where: {
                    patientId: row.patientId
                  },
                  data: row
                });
              })
            );
          }

          break;

        case "ADD_NEW_ONLY":
          for (const record of data) {
            if (!oldListSet.has(record.patientId)) {
              newData.push(record!);
            }
          }

          return await ctx.db.patient.createMany({
            data: newData
          });

        default:
          break;
      }
    }),
  getById: protectedProcedure.input(z.string()).query(async ({ ctx, input }) => {
    return await ctx.db.patient.findFirst({
      where: {
        id: Number(input)
      }
    });
  }),
  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        patientId: z.string(),
        patientName: z.string(),
        description: z.string().nullable(),
        gender: z.nativeEnum(Gender),
        doB: z.coerce.date(),
        Phone: z.string(),
        Email: z.string().nullable(),
        address: z.string().nullable()
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.patient.update({
        where: {
          id: +input.id
        },
        data: {
          patientId: input.patientId,
          patientName: input.patientName,
          description: input.description,
          doB: new Date(input.doB).getTime(),
          gender: input.gender,
          Email: input.Email,
          Phone: input.Phone,
          address: input.address
        }
      });
    })
});
