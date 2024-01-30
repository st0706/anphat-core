-- AddForeignKey
ALTER TABLE "Organization" ADD CONSTRAINT "Organization_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;
