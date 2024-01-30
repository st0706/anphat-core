import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const organizationRouter = createTRPCRouter({
  getAll: protectedProcedure.input(z.object({ teamId: z.string() })).query(async ({ ctx, input }) => {
    return await ctx.db.organization.findMany({
      where: { teamId: input.teamId }
    });
  }),

  get: protectedProcedure.input(z.object({ id: z.string().nullish() })).query(async ({ ctx, input }) => {
    return await ctx.db.organization.findFirst({
      where: { id: input.id ?? "" }
    });
  }),

  create: protectedProcedure
    .input(
      z.object({
        parentId: z.string(),
        teamId: z.string(),
        name: z.string(),
        logo: z.string(),
        organizationId: z.string(),
        abbreviation: z.string(),
        phoneNumber: z.string(),
        email: z.string(),
        provinceAddress: z.string(),
        districtAddress: z.string(),
        wardAddress: z.string(),
        detailAddress: z.string(),
        provinceVATBill: z.string(),
        districtVATBill: z.string(),
        wardVATBill: z.string(),
        detailVATBill: z.string(),
        website: z.string()
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.db.organization.create({
          data: {
            parentId: input.parentId,
            teamId: input.teamId,
            name: input.name,
            logo: input.logo,
            organizationId: input.organizationId,
            abbreviation: input.abbreviation,
            phoneNumber: input.phoneNumber,
            email: input.email,
            provinceAddress: input.provinceAddress,
            districtAddress: input.districtAddress,
            wardAddress: input.wardAddress,
            detailAddress: input.detailAddress,
            provinceVATBill: input.provinceVATBill,
            districtVATBill: input.districtVATBill,
            wardVATBill: input.wardVATBill,
            detailVATBill: input.detailVATBill,
            website: input.website
          }
        });
      } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
          // The .code property can be accessed in a type-safe manner
          if (e.code === "P2002") {
            const match = e.message.match(/:\s*\(`(.*)`\)/);
            if (match) {
              e.message = ` ${match[1] === "organizationId" ? "ID" : "Tên"} đã tồn tại!`;
              throw e;
            }
          }
        }
        throw e;
      }
    }),

  delete: protectedProcedure
    .input(
      z.object({
        id: z.string()
      })
    )
    .mutation(async ({ ctx, input }) => {
      async function deleteOrganization(organizationId) {
        let organizationDb = await ctx.db.organization.findUnique({
          where: { id: organizationId }
        });

        if (!organizationDb) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Đơn vị trực thuộc không tồn tại!"
          });
        }

        const childOrganizations = await ctx.db.organization.findMany({
          where: { parentId: organizationId }
        });

        // Đệ quy để xóa các tổ chức con của các tổ chức con
        for (const child of childOrganizations) {
          await deleteOrganization(child.id);
        }

        // Xóa tổ chức cha
        await ctx.db.organization.delete({
          where: { id: organizationId }
        });
      }

      // Gọi hàm đệ quy để xóa tổ chức và tất cả các tổ chức con
      await deleteOrganization(input.id);
      return "Xóa thành công đơn vị trực thuộc!";
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
        logo: z.string() || null,
        abbreviation: z.string() || null,
        phoneNumber: z.string() || null,
        email: z.string() || null,
        provinceAddress: z.string() || null,
        districtAddress: z.string() || null,
        wardAddress: z.string() || null,
        detailAddress: z.string() || null,
        provinceVATBill: z.string() || null,
        districtVATBill: z.string() || null,
        wardVATBill: z.string() || null,
        detailVATBill: z.string() || null,
        website: z.string() || null,
        organizationId: z.string()
      })
    )
    .mutation(async ({ ctx, input }) => {
      let organizationDb = await ctx.db.organization.findUnique({
        where: {
          id: input.id
        }
      });
      if (organizationDb) {
        return ctx.db.organization
          .update({
            where: {
              id: input.id
            },
            data: {
              name: input.name,
              logo: input.logo,
              abbreviation: input.abbreviation,
              phoneNumber: input.phoneNumber,
              email: input.email,
              provinceAddress: input.provinceAddress,
              districtAddress: input.districtAddress,
              wardAddress: input.wardAddress,
              detailAddress: input.detailAddress,
              provinceVATBill: input.provinceVATBill,
              districtVATBill: input.districtVATBill,
              wardVATBill: input.wardVATBill,
              detailVATBill: input.detailVATBill,
              website: input.website,
              organizationId: input.organizationId
            }
          })
          .catch((e) => {
            if (e instanceof Prisma.PrismaClientKnownRequestError) {
              // The .code property can be accessed in a type-safe manner
              if (e.code === "P2002") {
                const match = e.message.match(/:\s*\(`(.*)`\)/);
                if (match) {
                  e.message = ` ${match[1] === "organizationId" ? "ID" : "Tên"} đã tồn tại!`;
                  throw e;
                }
              }
            }
            throw e;
          });
      } else {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Đơn vị trực thuộc không tồn tại!"
        });
      }
    })
});
