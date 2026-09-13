"use client";

import React, { useState } from "react";
import {
  Award,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  Save,
  Send,
  Sparkles,
  Users,
} from "lucide-react";

interface FacultyResultsSectionProps {
  courses: any[];
  students: any[];
  results: any[];
  facultyName: string;
  onSaveResult: (data: any) => Promise<any>;
}

export function calculateGradeAndPoints(percentage: number): { grade: string; gradePoints: number } {
  if (percentage >= 85) return { grade: "A", gradePoints: 4.0 };
  if (percentage >= 80) return { grade: "A-", gradePoints: 3.67 };
  if (percentage >= 75) return { grade: "B+", gradePoints: 3.33 };
  if (percentage >= 71) return { grade: "B", gradePoints: 3.0 };
  if (percentage >= 68) return { grade: "B-", gradePoints: 2.67 };
  if (percentage >= 64) return { grade: "C+", gradePoints: 2.33 };
  if (percentage >= 60) return { grade: "C", gradePoints: 2.0 };
  if (percentage >= 50) return { grade: "D", gradePoints: 1.0 };
  return { grade: "F", gradePoints: 0.0 };
}

export const FacultyResultsSection: React.FC<FacultyResultsSectionProps> = ({
  courses,
  students,
  results,
  facultyName,
  onSaveResult,
}) => {
  const [selectedCourseCode, setSelectedCourseCode] = useState(courses[0]?.code || "CSC-311");
  const [selectedStudentId, setSelectedStudentId] = useState<string>("");
  const [assignmentMarks, setAssignmentMarks] = useState<number>(18);
  const [quizMarks, setQuizMarks] = useState<number>(13);
  const [midtermMarks, setMidtermMarks] = useState<number>(22);
  const [finalMarks, setFinalMarks] = useState<number>(26);
  const [attendanceMarks, setAttendanceMarks] = useState<number>(9);
  const [remarks, setRemarks] = useState<string>("Excellent practical work and conceptual depth.");
  const [status, setStatus] = useState<"Draft" | "Submitted" | "Published">("Submitted");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const courseStudents = students.filter(
    (s) => !selectedCourseCode || s.courseCode === selectedCourseCode
  );

  const currentStudent = courseStudents.find((s) => s.studentId === selectedStudentId) || courseStudents[0];

  const total = assignmentMarks + quizMarks + midtermMarks + finalMarks + attendanceMarks;
  const percentage = Math.min(Math.max(total, 0), 100);
  const { grade, gradePoints } = calculateGradeAndPoints(percentage);

  const handleSaveSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentStudent) return;

    try {
      setIsSubmitting(true);
      const targetCourse = courses.find((c) => c.code === selectedCourseCode);

      await onSaveResult({
        studentId: currentStudent.studentId,
        studentName: currentStudent.name,
        enrollmentId: currentStudent.studentId,
        courseId: targetCourse?._id || "course_id",
        courseCode: selectedCourseCode,
        courseTitle: targetCourse?.name || currentStudent.courseTitle || "Algorithms",
        section: currentStudent.section || "A",
        semester: currentStudent.semester || "Fall 2026",
        assignmentMarks: Number(assignmentMarks),
        quizMarks: Number(quizMarks),
        midtermMarks: Number(midtermMarks),
        finalMarks: Number(finalMarks),
        attendanceMarks: Number(attendanceMarks),
        creditHours: targetCourse?.creditHours || 3,
        status,
        remarks,
        facultyName,
      });

      setSuccessMessage(
        `Results saved for ${currentStudent.name} (${selectedCourseCode}): Total ${total}/100, Grade: ${grade} (${gradePoints} GPA).`
      );
    } catch (err: any) {
      alert(err.message || "Failed to save results.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 uppercase flex items-center gap-1">
              <Award className="w-3 h-3" />
              Grading & Evaluation
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs font-semibold text-slate-600">Standard HEC 4.0 Scale</span>
          </div>
          <h2 className="text-2xl font-black font-heading text-slate-900 tracking-tight">
            Academic Results & Grade Book
          </h2>
          <p className="text-xs text-slate-500">
            Enter continuous evaluation marks, compute automated GPA grade points, and submit to the Registrar.
          </p>
        </div>

        <div className="p-3 rounded-2xl bg-amber-50 text-amber-800 font-bold text-xs">
          {results.length} Recorded Semester Result{results.length !== 1 ? "s" : ""}
        </div>
      </div>

      {successMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <p className="text-xs font-semibold leading-relaxed">{successMessage}</p>
        </div>
      )}

      {/* MARKS ENTRY FORM */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-base font-black font-heading text-slate-900">
              Enter Student Semester Evaluation
            </h3>
            <p className="text-xs text-slate-500">Continuous assessment breakdown (Total 100 Marks)</p>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedCourseCode}
              onChange={(e) => setSelectedCourseCode(e.target.value)}
              className="px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-bold focus:outline-none"
            >
              {courses.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.code} - {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {courseStudents.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-slate-50 text-slate-500 text-xs">
            No students enrolled in this course yet.
          </div>
        ) : (
          <form onSubmit={handleSaveSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Select Student */}
              <div className="sm:col-span-2 lg:col-span-3">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Select Student *
                </label>
                <select
                  value={selectedStudentId || currentStudent?.studentId}
                  onChange={(e) => setSelectedStudentId(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:outline-none"
                >
                  {courseStudents.map((st) => (
                    <option key={st.studentId} value={st.studentId}>
                      {st.name} ({st.studentId}) — Section {st.section || "A"}
                    </option>
                  ))}
                </select>
              </div>

              {/* Assignment Marks (Max 20) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Assignments (Max 20)
                </label>
                <input
                  type="number"
                  min={0}
                  max={20}
                  required
                  value={assignmentMarks}
                  onChange={(e) => setAssignmentMarks(Number(e.target.value))}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-bold focus:outline-none"
                />
              </div>

              {/* Quizzes Marks (Max 15) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Quizzes & Labs (Max 15)
                </label>
                <input
                  type="number"
                  min={0}
                  max={15}
                  required
                  value={quizMarks}
                  onChange={(e) => setQuizMarks(Number(e.target.value))}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-bold focus:outline-none"
                />
              </div>

              {/* Midterm Exam (Max 25) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Midterm Examination (Max 25)
                </label>
                <input
                  type="number"
                  min={0}
                  max={25}
                  required
                  value={midtermMarks}
                  onChange={(e) => setMidtermMarks(Number(e.target.value))}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-bold focus:outline-none"
                />
              </div>

              {/* Final Exam (Max 30) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Final Examination (Max 30)
                </label>
                <input
                  type="number"
                  min={0}
                  max={30}
                  required
                  value={finalMarks}
                  onChange={(e) => setFinalMarks(Number(e.target.value))}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-bold focus:outline-none"
                />
              </div>

              {/* Attendance (Max 10) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Attendance Marks (Max 10)
                </label>
                <input
                  type="number"
                  min={0}
                  max={10}
                  required
                  value={attendanceMarks}
                  onChange={(e) => setAttendanceMarks(Number(e.target.value))}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-bold focus:outline-none"
                />
              </div>

              {/* Result Status */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:outline-none"
                >
                  <option value="Draft">Draft (Internal)</option>
                  <option value="Submitted">Submitted (To Registrar)</option>
                  <option value="Published">Published (Live to Student)</option>
                </select>
              </div>
            </div>

            {/* LIVE HEC GRADE SUMMARY BOX */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-blue-700 uppercase tracking-widest">
                  HEC Official Calculation
                </span>
                <div className="text-xs text-slate-600">
                  Total Marks: <strong className="text-slate-900">{total} / 100</strong> • Percentage: <strong className="text-slate-900">{percentage}%</strong>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-center px-4 py-2 rounded-xl bg-white shadow-xs border border-blue-100">
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Grade</div>
                  <div className="text-2xl font-black text-blue-700">{grade}</div>
                </div>

                <div className="text-center px-4 py-2 rounded-xl bg-white shadow-xs border border-blue-100">
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Grade Points</div>
                  <div className="text-2xl font-black text-indigo-700">{gradePoints.toFixed(2)}</div>
                </div>
              </div>
            </div>

            {/* Remarks */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Instructor Remarks
              </label>
              <input
                type="text"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="e.g. Excellent project synthesis and laboratory demonstration."
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none"
              />
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-xl bg-iqra-blue-600 hover:bg-iqra-blue-500 text-white font-bold text-xs shadow-md shadow-blue-600/20 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>{isSubmitting ? "Submitting Marks..." : "Save Student Results"}</span>
              </button>
            </div>
          </form>
        )}
      </div>

      {/* RECORDED RESULTS TABLE */}
      {results.length > 0 && (
        <div className="rounded-3xl bg-white border border-slate-200/90 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-slate-50/60 font-bold text-xs text-slate-800">
            Recorded Grade Sheet Entries
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px]">
                <tr>
                  <th className="px-6 py-3">Student</th>
                  <th className="px-6 py-3">Course</th>
                  <th className="px-6 py-3">Total Marks</th>
                  <th className="px-6 py-3">Percentage</th>
                  <th className="px-6 py-3">Grade</th>
                  <th className="px-6 py-3">GPA</th>
                  <th className="px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {results.map((r, i) => (
                  <tr key={i} className="hover:bg-slate-50/60">
                    <td className="px-6 py-3.5 font-bold text-slate-900">{r.studentName}</td>
                    <td className="px-6 py-3.5 font-mono text-blue-700 font-bold">{r.courseCode}</td>
                    <td className="px-6 py-3.5 font-semibold">{r.totalMarks} / 100</td>
                    <td className="px-6 py-3.5 font-semibold">{r.percentage}%</td>
                    <td className="px-6 py-3.5 font-black text-blue-800">{r.grade}</td>
                    <td className="px-6 py-3.5 font-mono font-bold text-indigo-700">{r.gradePoints}</td>
                    <td className="px-6 py-3.5">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800">
                        {r.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
