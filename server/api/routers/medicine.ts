import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

interface IData {
  registrationNumber: string;
  name: string;
  ingredientCode: string;
  ingredient: string;
  ingredientRegistration: string;
  sugarCode: string;
  sugar: string;
  content: string | null;
  pack: string;
  manufacture: string;
  country: string;
}

export const medicineRouter = createTRPCRouter({
  import: protectedProcedure
    .input(
      z.object({
        dataUpload: z.array(
          z.object({
            registrationNumber: z.string(),
            name: z.string(),
            ingredientCode: z.string(),
            ingredient: z.string(),
            ingredientRegistration: z.string(),
            sugarCode: z.string(),
            sugar: z.string(),
            content: z.string(),
            pack: z.string(),
            manufacture: z.string(),
            country: z.string()
          })
        ),
        importMethod: z.string().nullable()
      })
    )
    .mutation(async ({ ctx, input }) => {
      switch (input.importMethod) {
        case "RESET":
          const count = await ctx.db.medicine.count();

          if (count > 0) await ctx.db.medicine.deleteMany({});
          return ctx.db.medicine.createMany({
            data: input.dataUpload,
            skipDuplicates: true
          });

        case "UPDATE":
          return input.dataUpload.forEach(async (row: IData) => {
            await ctx.db.medicine.upsert({
              where: {
                name_registrationNumber: {
                  name: row.name,
                  registrationNumber: row.registrationNumber
                }
              },
              update: {
                registrationNumber: row.registrationNumber,
                ingredientCode: row.ingredientCode,
                ingredient: row.ingredient,
                ingredientRegistration: row.ingredientRegistration,
                sugarCode: row.sugarCode,
                sugar: row.sugar,
                content: row.content,
                pack: row.pack,
                manufacture: row.manufacture,
                country: row.country
              },
              create: {
                registrationNumber: row.registrationNumber,
                name: row.name,
                ingredientCode: row.ingredientCode,
                ingredient: row.ingredient,
                ingredientRegistration: row.ingredientRegistration,
                sugarCode: row.sugarCode,
                sugar: row.sugar,
                content: row.content,
                pack: row.pack,
                manufacture: row.manufacture,
                country: row.country
              }
            });
          });

        case "ADD_NEW_ONLY":
          return input.dataUpload.forEach(async (row: IData) => {
            await ctx.db.medicine.upsert({
              where: {
                name_registrationNumber: {
                  name: row.name,
                  registrationNumber: row.registrationNumber
                }
              },
              update: {},
              create: {
                registrationNumber: row.registrationNumber,
                name: row.name,
                ingredientCode: row.ingredientCode,
                ingredient: row.ingredient,
                ingredientRegistration: row.ingredientRegistration,
                sugarCode: row.sugarCode,
                sugar: row.sugar,
                content: row.content,
                pack: row.pack,
                manufacture: row.manufacture,
                country: row.country
              }
            });
          });
      }
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
      const { search, pageIndex, pageSize } = input;
      const count = await ctx.db.medicine.count({
        where: {
          OR: [
            {
              registrationNumber: {
                contains: search || "",
                mode: "insensitive"
              }
            },
            {
              name: {
                contains: search || "",
                mode: "insensitive"
              }
            },
            {
              ingredientCode: {
                contains: search || "",
                mode: "insensitive"
              }
            },
            {
              ingredient: {
                contains: search || "",
                mode: "insensitive"
              }
            },
            {
              ingredientRegistration: {
                contains: search || "",
                mode: "insensitive"
              }
            },
            {
              sugarCode: {
                contains: search || "",
                mode: "insensitive"
              }
            },
            {
              sugar: {
                contains: search || "",
                mode: "insensitive"
              }
            },
            {
              content: {
                contains: search || "",
                mode: "insensitive"
              }
            },
            {
              pack: {
                contains: search || "",
                mode: "insensitive"
              }
            },
            {
              manufacture: {
                contains: search || "",
                mode: "insensitive"
              }
            },
            {
              country: {
                contains: search || "",
                mode: "insensitive"
              }
            }
          ]
        }
      });
      const data = await ctx.db.medicine.findMany({
        where: {
          OR: [
            {
              registrationNumber: {
                contains: search || "",
                mode: "insensitive"
              }
            },
            {
              name: {
                contains: search || "",
                mode: "insensitive"
              }
            },
            {
              ingredientCode: {
                contains: search || "",
                mode: "insensitive"
              }
            },
            {
              ingredient: {
                contains: search || "",
                mode: "insensitive"
              }
            },
            {
              ingredientRegistration: {
                contains: search || "",
                mode: "insensitive"
              }
            },
            {
              sugarCode: {
                contains: search || "",
                mode: "insensitive"
              }
            },
            {
              sugar: {
                contains: search || "",
                mode: "insensitive"
              }
            },
            {
              content: {
                contains: search || "",
                mode: "insensitive"
              }
            },
            {
              pack: {
                contains: search || "",
                mode: "insensitive"
              }
            },
            {
              manufacture: {
                contains: search || "",
                mode: "insensitive"
              }
            },
            {
              country: {
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
      return await ctx.db.medicine.findFirst({
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
      let medicineDb = await ctx.db.medicine.findUnique({
        where: { id: input.id }
      });
      if (!medicineDb) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Không thể xóa nếu chưa lưu dữ liệu!"
        });
      } else {
        return await ctx.db.medicine.delete({
          where: { id: input.id }
        });
      }
    }),

  deleteAll: protectedProcedure.mutation(async ({ ctx }) => {
    return await ctx.db.medicine.deleteMany();
  }),

  create: protectedProcedure
    .input(
      z.object({
        registrationNumber: z.string(),
        name: z.string(),
        ingredientCode: z.string(),
        ingredient: z.string(),
        ingredientRegistration: z.string(),
        sugarCode: z.string(),
        sugar: z.string(),
        content: z.string(),
        pack: z.string(),
        manufacture: z.string(),
        country: z.string()
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.medicine.create({
        data: {
          registrationNumber: input.registrationNumber,
          name: input.name,
          ingredientCode: input.ingredientCode,
          ingredient: input.ingredient,
          ingredientRegistration: input.ingredientRegistration,
          sugarCode: input.sugarCode,
          sugar: input.sugar,
          content: input.content,
          pack: input.pack,
          manufacture: input.manufacture,
          country: input.country
        }
      });
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        registrationNumber: z.string(),
        name: z.string(),
        ingredientCode: z.string(),
        ingredient: z.string(),
        ingredientRegistration: z.string(),
        sugarCode: z.string(),
        sugar: z.string(),
        content: z.string(),
        pack: z.string(),
        manufacture: z.string(),
        country: z.string()
      })
    )
    .mutation(async ({ ctx, input }) => {
      let medicineDb = await ctx.db.medicine.findUnique({
        where: { id: input.id }
      });
      if (!medicineDb) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Không thể sửa nếu chưa lưu dữ liệu!"
        });
      } else {
        return await ctx.db.medicine.update({
          where: {
            id: input.id
          },
          data: {
            id: input.id,
            registrationNumber: input.registrationNumber,
            name: input.name,
            ingredientCode: input.ingredientCode,
            ingredient: input.ingredient,
            ingredientRegistration: input.ingredientRegistration,
            sugarCode: input.sugarCode,
            sugar: input.sugar,
            content: input.content,
            pack: input.pack,
            manufacture: input.manufacture,
            country: input.country
          }
        });
      }
    })
});
