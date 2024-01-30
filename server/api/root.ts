import { staffRouter } from "./routers/staff";
import { initTRPC } from "@trpc/server";
import superjson from "superjson";
import { organizationRouter } from "./routers/organization";
import { adDivisionRouter } from "./routers/adDivision";
import { medicineRouter } from "./routers/medicine";
import { diseaseRouter } from "./routers/disease";
import { bloodCodeRouter } from "./routers/bloodCode";
import { patientsRouter } from "./routers/patients";
import { scheduleRouter } from "./routers/schedule";

const t = initTRPC.create({
  transformer: superjson
});

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = t.router({
  organization: organizationRouter,
  staff: staffRouter,
  adDivision: adDivisionRouter,
  medicine: medicineRouter,
  disease: diseaseRouter,
  bloodCode: bloodCodeRouter,
  schedule: scheduleRouter,
  patient: patientsRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
