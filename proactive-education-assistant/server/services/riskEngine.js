import Attendance from "../models/Attendance.js";
import Marks from "../models/Marks.js";
import Behaviour from "../models/Behaviour.js";

/**
 * Explainable Risk Engine
 * Computes risk score based on:
 * - Attendance % (last 30 days)
 * - Consecutive absences
 * - Average marks
 * - Behaviour events
 * 
 * Returns: { riskLevel, score, explanation, factors }
 */

const getTodayDate = () => new Date().toISOString().split("T")[0];

const getLast30DaysRange = () => {
  const today = new Date();
  const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
  const startDate = thirtyDaysAgo.toISOString().split("T")[0];
  const endDate = today.toISOString().split("T")[0];
  return { startDate, endDate };
};

const computeAttendanceMetrics = async (studentId, classId) => {
  const { startDate, endDate } = getLast30DaysRange();

  const records = await Attendance.find({
    studentId,
    classId,
    date: { $gte: startDate, $lte: endDate },
  });

  if (records.length === 0) {
    return { attendancePercent: null, consecutiveAbsences: 0, totalRecorded: 0 };
  }

  const present = records.filter((r) => r.status === "PRESENT").length;
  const attendancePercent = (present / records.length) * 100;

  // Detect consecutive absences
  const sortedByDate = records.sort((a, b) => new Date(a.date) - new Date(b.date));
  let maxConsecutive = 0;
  let currentStreak = 0;
  for (const record of sortedByDate) {
    if (record.status === "ABSENT") {
      currentStreak++;
      maxConsecutive = Math.max(maxConsecutive, currentStreak);
    } else {
      currentStreak = 0;
    }
  }

  return { attendancePercent, consecutiveAbsences: maxConsecutive, totalRecorded: records.length };
};

const computeAverageMarks = async (studentId, classId) => {
  const { startDate, endDate } = getLast30DaysRange();

  const records = await Marks.find({
    studentId,
    classId,
    date: { $gte: startDate, $lte: endDate },
  });

  if (records.length === 0) {
    return { averageMarks: null, totalMarksRecorded: 0 };
  }

  const avg = records.reduce((sum, r) => sum + r.score, 0) / records.length;
  return { averageMarks: avg, totalMarksRecorded: records.length };
};

const countBehaviourEvents = async (studentId, classId) => {
  const { startDate, endDate } = getLast30DaysRange();

  const records = await Behaviour.find({
    studentId,
    classId,
    date: { $gte: startDate, $lte: endDate },
  });

  const eventCounts = {
    frequent_absence: 0,
    class_disengagement: 0,
    late_submission: 0,
    home_issues_reported: 0,
    disciplinary_notice: 0,
  };

  for (const record of records) {
    eventCounts[record.type]++;
  }

  const totalEvents = records.length;
  return { eventCounts, totalEvents };
};

export const computeStudentRisk = async (studentId, classId) => {
  // Fetch all metrics
  const attendance = await computeAttendanceMetrics(studentId, classId);
  const marks = await computeAverageMarks(studentId, classId);
  const behaviour = await countBehaviourEvents(studentId, classId);

  // Initialize score and explanation factors
  let score = 0;
  const factors = [];
  const explanations = [];

  // Attendance scoring
  if (attendance.attendancePercent !== null) {
    if (attendance.attendancePercent < 60) {
      score += 40;
      explanations.push(`Very low attendance: ${attendance.attendancePercent.toFixed(1)}%`);
      factors.push({ name: "Very low attendance (<60%)", weight: 40 });
    } else if (attendance.attendancePercent < 75) {
      score += 25;
      explanations.push(`Low attendance: ${attendance.attendancePercent.toFixed(1)}%`);
      factors.push({ name: "Low attendance (60-75%)", weight: 25 });
    } else {
      factors.push({ name: "Good attendance (≥75%)", weight: 0 });
    }
  }

  // Consecutive absences scoring
  if (attendance.consecutiveAbsences >= 3) {
    score += 20;
    explanations.push(`${attendance.consecutiveAbsences} consecutive absences detected`);
    factors.push({ name: `Consecutive absences (${attendance.consecutiveAbsences})`, weight: 20 });
  } else if (attendance.consecutiveAbsences >= 1) {
    factors.push({ name: `Some consecutive absences (${attendance.consecutiveAbsences})`, weight: 5 });
  }

  // Average marks scoring
  if (marks.averageMarks !== null) {
    if (marks.averageMarks < 40) {
      score += 30;
      explanations.push(`Very low average marks: ${marks.averageMarks.toFixed(1)}/100`);
      factors.push({ name: "Very low marks (<40)", weight: 30 });
    } else if (marks.averageMarks < 55) {
      score += 15;
      explanations.push(`Low average marks: ${marks.averageMarks.toFixed(1)}/100`);
      factors.push({ name: "Low marks (40-55)", weight: 15 });
    } else {
      factors.push({ name: "Acceptable marks (≥55)", weight: 0 });
    }
  }

  // Behaviour event scoring
  const behaviourWeights = {
    frequent_absence: 10,
    class_disengagement: 8,
    late_submission: 5,
    home_issues_reported: 12,
    disciplinary_notice: 15,
  };

  for (const [type, count] of Object.entries(behaviour.eventCounts)) {
    if (count > 0) {
      const weight = behaviourWeights[type] * count;
      score += weight;
      explanations.push(`${count} ${type.replace(/_/g, " ")} event(s)`);
      factors.push({ name: type.replace(/_/g, " "), weight, count });
    }
  }

  // Normalize score to 0-100 range (max possible: 40+20+30+70=160)
  const normalizedScore = Math.min(100, Math.round(score));

  // Determine risk level (calibrated thresholds)
  let riskLevel;
  if (normalizedScore >= 80) {
    riskLevel = "HIGH";
  } else if (normalizedScore >= 40) {
    riskLevel = "MEDIUM";
  } else {
    riskLevel = "LOW";
  }

  // Build comprehensive explanation
  const explanation =
    explanations.length > 0
      ? explanations.join(" | ")
      : "No significant risk factors detected. Student is performing well.";

  return {
    riskLevel,
    score: normalizedScore,
    explanation,
    factors,
    metrics: {
      attendance,
      marks,
      behaviour: behaviour.eventCounts,
    },
  };
};
