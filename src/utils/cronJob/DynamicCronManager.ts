import cron, { ScheduledTask } from "node-cron";
import { logger } from "../logger";

export class DynamicCronManager {
  private tasks: Map<string, ScheduledTask> = new Map(); // Stores running cron jobs

  scheduleJob(id: string, cronTime: string, job: () => void) {
    if (this.tasks.has(id)) {
      logger.warn(`Job with ID ${id} already exists.`);
      return;
    }

    const task = cron.schedule(cronTime, () => {
      logger.info(`Executing job: ${id}`);
      job(); // Run the job
      this.destroyJob(id); // Remove after execution
    });

    this.tasks.set(id, task);
    logger.info(`Scheduled job with ID: ${id} at ${cronTime}`);
  }

  destroyJob(id: string) {
    if (this.tasks.has(id)) {
      this.tasks.get(id)?.stop();
      this.tasks.delete(id);
      logger.info(`Job ${id} removed.`);
    }
  }
}

// // Example Usage
// const cronManager = new DynamicCronManager();

// // Schedule a job that runs once at a specific time
// const jobId = "unique_job_1";
// const cronExpression = "30 14 * * *"; // Runs at 2:30 PM once
// cronManager.scheduleJob(jobId, cronExpression, () => {
//   console.log("Running scheduled task...");
// });

// // Optional: Manually destroy after some time
// setTimeout(() => cronManager.destroyJob(jobId), 60000); // Removes after 1 minute
