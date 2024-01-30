import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { Prisma } from "@prisma/client";
import { z } from "zod";

enum Gender {
  MALE = "MALE",
  FEMALE = "FEMALE",
  OTHER = "OTHER"
}

export const staffRouter = createTRPCRouter({
  getByTeamSlug: protectedProcedure
    .input(
      z.object({
        slug: z.string()
      })
    )
    .query(async ({ ctx, input }) => {
      return await ctx.db.team
        .findFirst({
          where: {
            slug: input.slug
          },
          include: {
            organizations: true
          }
        })
        .then((res) =>
          res?.organizations.reduce((acc: any, curr) => {
            if (curr.parentId === "null") acc?.push({ value: curr.id, label: curr.name });
            return acc;
          }, [])
        );
    }),

  getChildren: protectedProcedure
    .input(
      z.object({
        organizationId: z.string()
      })
    )
    .query(async ({ ctx, input }) => {
      return await ctx.db.organization
        .findMany({
          where: {
            parentId: input.organizationId
          }
        })
        .then((res) =>
          res.reduce((acc: any, curr) => {
            acc.push(curr.name);
            return acc;
          }, [])
        );
    }),

  /**
   * Get staff routers
   * get: get all staff in organization
   * flow: teamId -> organizationIdList -> staffId -> list staff
   *
   * getById: get staff in organization by staffID
   */
  get: protectedProcedure
    .input(
      z.object({
        teamId: z.string(),
        searchKey: z.string(),
        pageIndex: z.number(),
        pageSize: z.number()
      })
    )
    .query(async ({ ctx, input }) => {
      const { teamId, searchKey, pageIndex, pageSize } = input;
      const rowCount = await ctx.db.staff.count();

      const organizationsInTeam = await ctx.db.organization.findMany({
        where: {
          teamId: teamId
        }
      });
      const organizationIdList = await ctx.db.organization
        .findMany({
          where: {
            id: {
              in: organizationsInTeam.map((item) => item.id)
            }
          }
        })
        .then((res) => res.map((item) => item.id));

      const queryData = await ctx.db.organizationToStaff
        .findMany({
          where: {
            organizationId: {
              in: organizationIdList
            }
          }
        })
        .then(async (res) => {
          const listStaffId = res.map((item) => item.staffId);
          return await ctx.db.staff.findMany({
            skip: pageIndex * pageSize,
            take: pageSize,
            where: {
              staffID: {
                in: listStaffId
              },
              OR: [
                {
                  familyName: {
                    contains: searchKey || "",
                    mode: "insensitive"
                  }
                },
                {
                  name: {
                    contains: searchKey || "",
                    mode: "insensitive"
                  }
                },
                {
                  staffID: {
                    contains: searchKey || "",
                    mode: "insensitive"
                  }
                }
              ]
            }
          });
        });
      return { queryData, rowCount };
    }),

  getById: protectedProcedure
    .input(
      z.object({
        staffId: z.string()
      })
    )
    .query(async ({ ctx, input }) => {
      return await ctx.db.staff.findFirst({
        where: {
          staffID: input.staffId
        }
      });
    }),

  create: protectedProcedure
    .input(
      z.object({
        staffID: z.string(),
        familyName: z.string(),
        name: z.string(),
        otherName: z.string(),
        engName: z.string(),
        gender: z.nativeEnum(Gender),
        dob: z.coerce.date(),
        cityCountry: z.string(),
        districtCountry: z.string(),
        wardCountry: z.string(),
        cityPermanent: z.string(),
        districtPermanent: z.string(),
        wardPermanent: z.string(),
        addressPermanent: z.string(),
        cityCurrent: z.string(),
        districtCurrent: z.string(),
        wardCurrent: z.string(),
        currentAddress: z.string(),
        CID: z.string(),
        issuedBy: z.string(),
        issuedDay: z.coerce.date(),
        phoneNumber: z.string(),
        email: z.string(),
        organizationId: z.string(),
        organizationName: z.string(),
        ethnicMinority: z.string(),
        nationality: z.string(),
        religion: z.string(),
        culturalLevel: z.string(),
        dojCYU: z.coerce.date(),
        dojCPV: z.coerce.date() || z.null(),
        officalDojCPV: z.coerce.date() || z.null(),
        avatar: z.string(),
        habit: z.string()
      })
    )
    .mutation(async ({ ctx, input }) => {
      const organizationNameById = await ctx.db.organization
        .findFirst({
          where: {
            id: input.organizationId
          }
        })
        .then((res) => {
          return res?.name;
        });
      return await ctx.db
        .$transaction([
          ctx.db.staff.create({
            data: {
              ...input,
              issuedDay: new Date(input.issuedDay).getTime(),
              dob: new Date(input.dob).getTime(),
              dojCYU: new Date(input.dojCYU).getTime(),
              dojCPV: new Date(input.dojCPV).getTime(),
              officalDojCPV: new Date(input.officalDojCPV).getTime(),
              organizationName: organizationNameById!
            }
          }),
          ctx.db.organizationToStaff.create({
            data: {
              staffId: input.staffID,
              organizationId: input.organizationId
            }
          })
        ])
        .catch((err) => {
          if (err instanceof Prisma.PrismaClientKnownRequestError) {
            // The .code property can be accessed in a type-safe manner
            if (err.code === "P2002") {
              const match = err.message.match(/:\s*\(`(.*)`\)/);
              if (match) {
                err.message = ` ${
                  match[1] === "staffID" ? "Nhân sự" : match[1] === "CID" ? "Số CCCD" : "Email"
                } đã tồn tại!`;
                throw err;
              }
            }
          }
          throw err;
        });
    }),
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.staff.findMany({});
  }),
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        staffID: z.string(),
        familyName: z.string(),
        name: z.string(),
        otherName: z.string(),
        engName: z.string(),
        gender: z.nativeEnum(Gender),
        dob: z.coerce.date(),
        cityCountry: z.string(),
        districtCountry: z.string(),
        wardCountry: z.string(),
        cityPermanent: z.string(),
        districtPermanent: z.string(),
        wardPermanent: z.string(),
        cityCurrent: z.string(),
        districtCurrent: z.string(),
        wardCurrent: z.string(),
        currentAddress: z.string(),
        addressPermanent: z.string(),
        CID: z.string(),
        issuedBy: z.string(),
        issuedDay: z.coerce.date(),
        phoneNumber: z.string(),
        email: z.string(),
        organizationId: z.string(),
        organizationName: z.string(),
        ethnicMinority: z.string(),
        nationality: z.string(),
        religion: z.string(),
        culturalLevel: z.string(),
        dojCYU: z.coerce.date(),
        dojCPV: z.coerce.date() || z.null(),
        officalDojCPV: z.coerce.date() || z.null(),
        avatar: z.string(),
        habit: z.string()
      })
    )
    .mutation(async ({ ctx, input }) => {
      const organizationNameById = await ctx.db.organization
        .findFirst({
          where: {
            id: input.organizationId
          }
        })
        .then((res) => {
          return res?.name;
        });
      await ctx.db.staff
        .update({
          where: {
            id: input.id
          },
          data: {
            ...input,
            issuedDay: new Date(input.issuedDay).getTime(),
            dob: new Date(input.dob).getTime(),
            dojCYU: new Date(input.dojCYU).getTime(),
            dojCPV: new Date(input.dojCPV).getTime(),
            officalDojCPV: new Date(input.officalDojCPV).getTime(),
            organizationName: organizationNameById
          }
        })
        .catch((err) => {
          if (err instanceof Prisma.PrismaClientKnownRequestError) {
            // The .code property can be accessed in a type-safe manner
            if (err.code === "P2002") {
              const match = err.message.match(/:\s*\(`(.*)`\)/);
              if (match) {
                err.message = ` ${
                  match[1] === "staffID" ? "Mã nhân sự" : match[1] === "CID" ? "Số CCCD" : "Email"
                } đã tồn tại!`;
                throw err;
              }
            }
          }
          throw err;
        });

      await ctx.db.organizationToStaff.updateMany({
        where: {
          staffId: input.staffID
        },
        data: {
          organizationId: input.organizationId
        }
      });
    }),

  delete: protectedProcedure
    .input(
      z.object({
        staffId: z.string()
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.staff.delete({
        where: {
          id: input.staffId
        }
      });
    })
});
