import { ScheduleStatus } from "@prisma/client";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const scheduleRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        scheduleDateTime: z.coerce.date(),
        atTime: z.coerce.date(),
        patientId: z.number(),
        description: z.string().nullish(),
        createdBy: z.string(),
        status: z.nativeEnum(ScheduleStatus),
        practitioners: z.string()
      })
    )
    .mutation(async ({ ctx, input }) => {
      let createdSchedule = await ctx.db.schedule.create({
        data: {
          scheduleDateTime: new Date(input.scheduleDateTime).getTime(),
          atTime: new Date(input.atTime).getTime(),
          patientId: input.patientId,
          description: input?.description,
          createdBy: input.createdBy,
          status: input.status
        }
      });
      const scheduleId = createdSchedule.id;
      const createdPractitioner = await ctx.db.schedulePractitioner.create({
        data: {
          practitionerId: input.practitioners,
          scheduleId: scheduleId
        }
      });

      return {
        schedule: createdSchedule,
        practitioner: createdPractitioner
      };
    }),

  get: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.schedule.findMany({
      include: {
        patient: true,
        practitioners: {
          include: {
            practitioners: true
          }
        }
      }
    });
  }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        scheduleDateTime: z.coerce.date(),
        atTime: z.coerce.date(),
        patientId: z.number(),
        description: z.string().nullish(),
        createdBy: z.string(),
        status: z.nativeEnum(ScheduleStatus),
        practitioners: z.string()
      })
    )
    .mutation(async ({ ctx, input }) => {
      const updatedSchedule = await ctx.db.schedule.update({
        where: {
          id: input.id
        },
        data: {
          scheduleDateTime: new Date(input.scheduleDateTime).getTime(),
          atTime: new Date(input.atTime).getTime(),
          patientId: Number(input.patientId),
          description: input.description,
          createdBy: input.createdBy,
          status: input.status
        }
      });
      await ctx.db.schedulePractitioner.deleteMany({
        where: {
          scheduleId: input.id
        }
      });
      await ctx.db.schedulePractitioner.create({
        data: {
          practitionerId: input.practitioners,
          scheduleId: input.id
        }
      });
      return updatedSchedule;
    }),

  getAllPractitioner: protectedProcedure.query(async ({ ctx }) => {
    const data = await ctx.db.staff.findMany();
    return data;
  }),

  delete: protectedProcedure.input(z.object({ id: z.string() })).mutation(async ({ ctx, input }) => {
    return ctx.db.schedule.delete({
      where: {
        id: input.id
      }
    });
  }),
  deleteAll: protectedProcedure.mutation(async ({ ctx, input }) => {
    return await ctx.db.schedule.deleteMany();
  })
});
