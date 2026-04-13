import { Router } from "express";
import { z } from "zod";
import { sendError } from "../http.js";
import { generateDailyReportPdf, isValidDateOnly } from "../services/reports/daily.js";
import { generateMonthlyReport } from "../services/reports/monthly.js";

type ReportsRouterDeps = {
  generateMonthlyReport: typeof generateMonthlyReport;
  generateDailyReportPdf: typeof generateDailyReportPdf;
};

const dailyReportSchema = z
  .object({
    date: z.string().refine(isValidDateOnly, {
      message: "Expected YYYY-MM-DD"
    }),
    ooo_cash: z.number().nonnegative(),
    ooo_cashless: z.number().nonnegative(),
    ip_cash: z.number().nonnegative(),
    ip_cashless: z.number().nonnegative()
  })
  .strict();

export function createReportsRouter(deps: Partial<ReportsRouterDeps> = {}) {
  const router = Router();
  const monthlyReportGenerator = deps.generateMonthlyReport ?? generateMonthlyReport;
  const dailyReportGenerator = deps.generateDailyReportPdf ?? generateDailyReportPdf;

  router.get("/monthly", async (req, res, next) => {
    const month = typeof req.query.month === "string" ? req.query.month : "";
    const startDate = typeof req.query.start === "string" ? req.query.start : undefined;
    const endDate = typeof req.query.end === "string" ? req.query.end : undefined;

    if (!/^\d{4}-\d{2}$/.test(month)) {
      return res.status(400).json({ error: "Invalid month. Expected YYYY-MM" });
    }

    if ((startDate && !endDate) || (!startDate && endDate)) {
      return res.status(400).json({ error: "Both start and end are required" });
    }

    if (startDate && !/^\d{4}-\d{2}-\d{2}$/.test(startDate)) {
      return res.status(400).json({ error: "Invalid start date. Expected YYYY-MM-DD" });
    }

    if (endDate && !/^\d{4}-\d{2}-\d{2}$/.test(endDate)) {
      return res.status(400).json({ error: "Invalid end date. Expected YYYY-MM-DD" });
    }

    try {
      const buffer = await monthlyReportGenerator({ monthKey: month, startDate, endDate });
      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.setHeader("Content-Disposition", `attachment; filename=\"OTCHET_${month}.xlsx\"`);
      res.send(Buffer.from(buffer));
    } catch (err) {
      next(err);
    }
  });

  router.post("/daily/pdf", async (req, res, next) => {
    const parsed = dailyReportSchema.safeParse(req.body);

    if (!parsed.success) {
      return sendError(res, 422, "Invalid payload", parsed.error.flatten());
    }

    try {
      const buffer = await dailyReportGenerator(parsed.data);
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", `attachment; filename=\"OTCHET_${parsed.data.date}.pdf\"`);
      return res.send(Buffer.from(buffer));
    } catch (error) {
      return next(error);
    }
  });

  return router;
}

export const reportsRouter = createReportsRouter();
