import cron, { ScheduledTask } from "node-cron";
import { logger } from "../logger";

export class CronScheduler {
  private task: ScheduledTask | null = null;

  constructor(private schedule: string, private job: () => void) {}

  start() {
    if (!this.task) {
      this.task = cron.schedule(this.schedule, this.job, { scheduled: true });
      logger.info(`Cron job started with schedule: ${this.schedule}`);
    }
  }

  stop() {
    if (this.task) {
      this.task.stop();
      logger.info("Cron job stopped");
    }
  }

  destroy() {
    if (this.task) {
      this.task.stop();
      this.task = null;
      console.log(`Cron task instance: ${this.task}`, this.task);
      logger.info("Cron job destroyed");
    }
  }

  restart() {
    this.stop();
    this.start();
    logger.info("Cron job restarted");
  }
}

// // Example Usage
// const job = () => console.log("Running scheduled task...");
// const cronJob = new CronScheduler("*/5 * * * * *", job); // Runs every 5 seconds

// cronJob.start();

// // Stop the cron job after 20 seconds
// setTimeout(() => cronJob.stop(), 20000);
