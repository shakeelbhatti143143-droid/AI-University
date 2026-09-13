"use client";

import React, { useState } from "react";
import {
  CheckSquare,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Users,
  Search,
  BookOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface FacultyAttendanceSectionProps {
  courses: any[];
  sections: any[];
  students: any[];
  attendanceRecords: any[];
  facultyName: string;
  onRecordAttendance: (data: any) => Promise<any>;
}

export const FacultyAttendanceSection: React.FC<FacultyAttendanceSectionProps> = ({
  courses,
  sections,
  students,
  attendanceRecords,
  facultyName,
  onRecordAttendance,
}) => {
  const [selectedCourseCode, setSelectedCourseCode] = useState(
    courses[0]?.code || "CSC-311"
  );
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [lectureTime, setLectureTime] = useState("10:00 AM - 11:30 AM");
  const [topic, setTopic] = useState("Lecture: Module Introduction & Architecture Analysis");
  const [attendanceMap, setAttendanceMap] = useState<Record<string, "Present" | "Absent" | "Late">>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const courseStudents = students.filter(
    (s) => !selectedCourseCode || s.courseCode === selectedCourseCode
  );

  const handleSetAll = (status: "Present" | "Absent" | "Late") => {
    const updated: Record<string, "Present" | "Absent" | "Late"> = {};
    for (const st of courseStudents) {
      updated[st.studentId] = status;
    }
    setAttendanceMap(updated);
  };

  const handleStudentStatusChange = (
    studentId: string,
    status: "Present" | "Absent" | "Late"
  ) => {
    setAttendanceMap((prev) => ({ ...prev, [studentId]: status }));
  };

  const handleSubmitAttendance = async (e: React.FormEvent) => {
    e.preventDefault();
    if (courseStudents.length === 0) return;

    try {
      setIsSubmitting(true);
      setSuccessMessage(null);

      const targetCourse = courses.find((c) => c.code === selectedCourseCode);

      // Record for each student
      for (const st of courseStudents) {
        const status = attendanceMap[st.studentId] || "Present";
        await onRecordAttendance({
          studentId: st.studentId,
          studentName: st.name,
          enrollmentId: st.studentId,
          courseId: targetCourse?._id || "course_id",
          courseCode: selectedCourseCode,
          section: st.section || "A",
          date: selectedDate,
          time: lectureTime,
          status,
          topic,
          facultyName,
        });
      }

      setSuccessMessage(
        `Attendance recorded successfully for ${courseStudents.length} students in ${selectedCourseCode} on ${selectedDate}.`
      );
    } catch (err: any) {
      alert(err.message || "Failed to record attendance.");
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
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-100 text-cyan-800 uppercase flex items-center gap-1">
              <CheckSquare className="w-3 h-3" />
              Class Attendance Register
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs font-semibold text-slate-600">Institutional SIS Tracking</span>
          </div>
          <h2 className="text-2xl font-black font-heading text-slate-900 tracking-tight">
            Mark & Record Student Attendance
          </h2>
          <p className="text-xs text-slate-500">
            Submit daily roll calls, track lecture hours, and record topic coverage for HEC compliance.
          </p>
        </div>

        <div className="p-3 rounded-2xl bg-cyan-50 text-cyan-800 font-bold text-xs">
          {attendanceRecords.length} Recorded Log{attendanceRecords.length !== 1 ? "s" : ""}
        </div>
      </div>

      {successMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <p className="text-xs font-semibold leading-relaxed">{successMessage}</p>
        </div>
      )}

      {/* ATTENDANCE CONFIGURATION BAR */}
      <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-4">
        <h3 className="text-sm font-black uppercase tracking-wider text-slate-900">
          Lecture Configuration
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Select Course</label>
            <select
              value={selectedCourseCode}
              onChange={(e) => setSelectedCourseCode(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:outline-none"
            >
              {courses.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.code} - {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Lecture Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Class Timing</label>
            <input
              type="text"
              value={lectureTime}
              onChange={(e) => setLectureTime(e.target.value)}
              placeholder="e.g. 10:00 AM - 11:30 AM"
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Topic Delivered</label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Data Structures & Graph Traversal"
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none"
            />
          </div>
        </div>

        {/* Quick Set All buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500 font-medium">Quick Mark:</span>
            <button
              type="button"
              onClick={() => handleSetAll("Present")}
              className="px-3 py-1 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold text-xs"
            >
              All Present
            </button>
            <button
              type="button"
              onClick={() => handleSetAll("Absent")}
              className="px-3 py-1 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 font-bold text-xs"
            >
              All Absent
            </button>
            <button
              type="button"
              onClick={() => handleSetAll("Late")}
              className="px-3 py-1 rounded-lg bg-amber-50 text-amber-700 hover:bg-amber-100 font-bold text-xs"
            >
              All Late
            </button>
          </div>

          <button
            onClick={handleSubmitAttendance}
            disabled={isSubmitting || courseStudents.length === 0}
            className="px-6 py-2 rounded-xl bg-iqra-blue-600 hover:bg-iqra-blue-500 text-white font-bold text-xs shadow-md shadow-blue-600/20 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{isSubmitting ? "Saving Attendance..." : "Submit Class Attendance"}</span>
          </button>
        </div>
      </div>

      {/* STUDENT ATTENDANCE ROSTER */}
      {courseStudents.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white border border-dashed border-slate-200 space-y-3">
          <Users className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No students registered in this course</h3>
          <p className="text-xs text-slate-500">
            Please choose another course from the dropdown.
          </p>
        </div>
      ) : (
        <div className="rounded-3xl bg-white border border-slate-200/90 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="px-6 py-3.5">Student</th>
                  <th className="px-6 py-3.5">Registration ID</th>
                  <th className="px-6 py-3.5">Section</th>
                  <th className="px-6 py-3.5 text-center">Status Selection</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {courseStudents.map((st) => {
                  const currentStatus = attendanceMap[st.studentId] || "Present";

                  return (
                    <tr key={st.studentId} className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-6 py-3.5 font-bold text-slate-900">
                        {st.name}
                      </td>
                      <td className="px-6 py-3.5 font-mono font-bold text-slate-700">
                        {st.studentId}
                      </td>
                      <td className="px-6 py-3.5 font-semibold text-slate-600">
                        Section {st.section || "A"}
                      </td>
                      <td className="px-6 py-3.5">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleStudentStatusChange(st.studentId, "Present")}
                            className={cn(
                              "px-3 py-1 rounded-xl text-xs font-bold transition-all",
                              currentStatus === "Present"
                                ? "bg-emerald-600 text-white shadow-xs"
                                : "bg-slate-100 text-slate-600 hover:bg-emerald-50 hover:text-emerald-700"
                            )}
                          >
                            Present
                          </button>

                          <button
                            type="button"
                            onClick={() => handleStudentStatusChange(st.studentId, "Late")}
                            className={cn(
                              "px-3 py-1 rounded-xl text-xs font-bold transition-all",
                              currentStatus === "Late"
                                ? "bg-amber-500 text-white shadow-xs"
                                : "bg-slate-100 text-slate-600 hover:bg-amber-50 hover:text-amber-700"
                            )}
                          >
                            Late
                          </button>

                          <button
                            type="button"
                            onClick={() => handleStudentStatusChange(st.studentId, "Absent")}
                            className={cn(
                              "px-3 py-1 rounded-xl text-xs font-bold transition-all",
                              currentStatus === "Absent"
                                ? "bg-rose-600 text-white shadow-xs"
                                : "bg-slate-100 text-slate-600 hover:bg-rose-50 hover:text-rose-700"
                            )}
                          >
                            Absent
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
