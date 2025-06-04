const Admin = require('../models/admin');
const Teacher = require('../models/teacher');
const Student = require('../models/student');
const Competition = require('../models/competition');
const Feedback = require('../models/feedback');
const bcrypt = require('bcrypt');

// Current date and time for logging
const CURRENT_DATE_TIME = "2025-05-30 11:11:50";
const CURRENT_USER = "VanshSharmaSDENow";

// Helper function to format time remaining
function formatTimeRemaining(milliseconds) {
  if (milliseconds <= 0) return 'Ended';

  const seconds = Math.floor((milliseconds / 1000) % 60);
  const minutes = Math.floor((milliseconds / (1000 * 60)) % 60);
  const hours = Math.floor((milliseconds / (1000 * 60 * 60)) % 24);
  const days = Math.floor(milliseconds / (1000 * 60 * 60 * 24));

  if (days > 0) {
    return `${days}d ${hours}h`;
  } else if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else {
    return `${minutes}m ${seconds}s`;
  }
}

// Helper function to validate email format
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const adminDashboardController = {
  // Get all teachers
  getAllTeachers: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;

      // Prepare filter based on query parameters
      const filter = {};

      if (req.query.search) {
        filter.$or = [
          { teacherFirstName: { $regex: req.query.search, $options: 'i' } },
          { teacherLastName: { $regex: req.query.search, $options: 'i' } },
          { teacherEmail: { $regex: req.query.search, $options: 'i' } }
        ];
      }

      // Count total teachers matching filter
      const totalTeachers = await Teacher.countDocuments(filter);

      // Get teachers with pagination
      const teachers = await Teacher.find(filter)
        .select('-teacherPassword') // Exclude password
        .sort({ _id: -1 }) // Sort by newest first
        .skip(skip)
        .limit(limit);

      res.status(200).json({
        success: true,
        data: {
          teachers,
          pagination: {
            total: totalTeachers,
            page,
            pages: Math.ceil(totalTeachers / limit),
            limit
          }
        }
      });
    } catch (error) {
      console.error("Error in getAllTeachers:", error);
      res.status(500).json({
        success: false,
        message: "Failed to retrieve teachers",
        error: error.message
      });
    }
  },

  // Get single teacher by ID
  getTeacherById: async (req, res) => {
    try {
      const { id } = req.params;

      const teacher = await Teacher.findById(id).select('-teacherPassword');

      if (!teacher) {
        return res.status(404).json({
          success: false,
          message: "Teacher not found"
        });
      }

      res.status(200).json({
        success: true,
        data: { teacher }
      });
    } catch (error) {
      console.error("Error in getTeacherById:", error);
      res.status(500).json({
        success: false,
        message: "Failed to retrieve teacher details",
        error: error.message
      });
    }
  },

  // Create new teacher
  createTeacher: async (req, res) => {
    try {
      const { teacherFirstName, teacherLastName, teacherEmail, teacherPassword, teacherImage, role } = req.body;

      // Validate required fields
      if (!teacherFirstName || !teacherLastName || !teacherEmail || !teacherPassword) {
        return res.status(400).json({
          success: false,
          message: "Missing required fields"
        });
      }

      // Validate email format
      if (!validateEmail(teacherEmail)) {
        return res.status(400).json({
          success: false,
          message: "Invalid email format"
        });
      }

      // Check if teacher with this email already exists
      const existingTeacher = await Teacher.findOne({ teacherEmail });
      if (existingTeacher) {
        return res.status(409).json({
          success: false,
          message: "Teacher with this email already exists"
        });
      }

      // Set default role if not provided
      const teacherRole = role || "teacher";

      // Create new teacher
      const newTeacher = new Teacher({
        teacherFirstName,
        teacherLastName,
        teacherEmail,
        teacherPassword,
        teacherImage: teacherImage || undefined, // Use default if not provided
        role: teacherRole,
        registerTime: new Date(),
      });

      await newTeacher.save();

      // Return teacher data without password
      const teacherResponse = { ...newTeacher._doc };
      delete teacherResponse.teacherPassword;

      res.status(201).json({
        success: true,
        message: "Teacher created successfully",
        data: { teacher: teacherResponse }
      });
    } catch (error) {
      console.error("Error in createTeacher:", error);
      res.status(500).json({
        success: false,
        message: "Failed to create teacher",
        error: error.message
      });
    }
  },

  // Update teacher
  updateTeacher: async (req, res) => {
    try {
      const { id } = req.params;
      const { teacherFirstName, teacherLastName, teacherEmail, teacherPassword, teacherImage, role } = req.body;

      // Find teacher
      const teacher = await Teacher.findById(id);
      if (!teacher) {
        return res.status(404).json({
          success: false,
          message: "Teacher not found"
        });
      }

      // If email is being updated, check if it's already in use
      if (teacherEmail && teacherEmail !== teacher.teacherEmail) {
        if (!validateEmail(teacherEmail)) {
          return res.status(400).json({
            success: false,
            message: "Invalid email format"
          });
        }

        const emailExists = await Teacher.findOne({ teacherEmail });
        if (emailExists) {
          return res.status(409).json({
            success: false,
            message: "Email already in use by another teacher"
          });
        }
      }

      // Update fields if provided
      if (teacherFirstName) teacher.teacherFirstName = teacherFirstName;
      if (teacherLastName) teacher.teacherLastName = teacherLastName;
      if (teacherEmail) teacher.teacherEmail = teacherEmail;
      if (teacherImage) teacher.teacherImage = teacherImage;
      if (role) teacher.role = role;

      // Special handling for password
      if (teacherPassword) {
        teacher.teacherPassword = await bcrypt.hash(teacherPassword, 10);
      }

      // Save updated teacher
      await teacher.save();

      // Return updated teacher data without password
      const teacherResponse = { ...teacher._doc };
      delete teacherResponse.teacherPassword;

      res.status(200).json({
        success: true,
        message: "Teacher updated successfully",
        data: { teacher: teacherResponse }
      });
    } catch (error) {
      console.error("Error in updateTeacher:", error);
      res.status(500).json({
        success: false,
        message: "Failed to update teacher",
        error: error.message
      });
    }
  },

  // Delete teacher
  deleteTeacher: async (req, res) => {
    try {
      const { id } = req.params;

      // Find teacher
      const teacher = await Teacher.findById(id);
      if (!teacher) {
        return res.status(404).json({
          success: false,
          message: "Teacher not found"
        });
      }

      // Delete teacher
      await Teacher.findByIdAndDelete(id);

      res.status(200).json({
        success: true,
        message: "Teacher deleted successfully",
      });
    } catch (error) {
      console.error("Error in deleteTeacher:", error);
      res.status(500).json({
        success: false,
        message: "Failed to delete teacher",
        error: error.message
      });
    }
  },

  // Get all students
  getAllStudents: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;

      // Prepare filter based on query parameters
      const filter = {};

      if (req.query.search) {
        filter.$or = [
          { studentFirstName: { $regex: req.query.search, $options: 'i' } },
          { studentLastName: { $regex: req.query.search, $options: 'i' } },
          { studentEmail: { $regex: req.query.search, $options: 'i' } }
        ];
      }

      if (req.query.grade) {
        filter.grade = req.query.grade;
      }

      if (req.query.school) {
        filter.school = { $regex: req.query.school, $options: 'i' };
      }

      if (req.query.verified === 'true') {
        filter.allowance = true;
      } else if (req.query.verified === 'false') {
        filter.allowance = false;
      }

      // Count total students matching filter
      const totalStudents = await Student.countDocuments(filter);

      // Get students with pagination
      const students = await Student.find(filter)
        .select('-studentPassword') // Exclude password
        .sort({ _id: -1 }) // Sort by newest first
        .skip(skip)
        .limit(limit);

      res.status(200).json({
        success: true,
        data: {
          students,
          pagination: {
            total: totalStudents,
            page,
            pages: Math.ceil(totalStudents / limit),
            limit
          }
        }
      });
    } catch (error) {
      console.error("Error in getAllStudents:", error);
      res.status(500).json({
        success: false,
        message: "Failed to retrieve students",
        error: error.message
      });
    }
  },

  // Get single student by ID
  getStudentById: async (req, res) => {
    try {
      const { id } = req.params;

      const student = await Student.findById(id)
        .select('-studentPassword')
        .populate('competitions.competitionId', 'title description startDateTime endDateTime');

      if (!student) {
        return res.status(404).json({
          success: false,
          message: "Student not found"
        });
      }

      res.status(200).json({
        success: true,
        data: { student }
      });
    } catch (error) {
      console.error("Error in getStudentById:", error);
      res.status(500).json({
        success: false,
        message: "Failed to retrieve student details",
        error: error.message
      });
    }
  },

  // Create new student
  createStudent: async (req, res) => {
    try {
      const {
        studentFirstName,
        studentLastName,
        studentEmail,
        studentPassword,
        studentImage,
        grade,
        school,
        allowance
      } = req.body;

      // Validate required fields
      if (!studentFirstName || !studentLastName || !studentEmail || !studentPassword) {
        return res.status(400).json({
          success: false,
          message: "Missing required fields"
        });
      }

      // Validate email format
      if (!validateEmail(studentEmail)) {
        return res.status(400).json({
          success: false,
          message: "Invalid email format"
        });
      }

      // Check if student with this email already exists
      const existingStudent = await Student.findOne({ studentEmail });
      if (existingStudent) {
        return res.status(409).json({
          success: false,
          message: "Student with this email already exists"
        });
      }

      // Create new student
      const newStudent = new Student({
        studentFirstName,
        studentLastName,
        studentEmail,
        studentPassword, // Will be hashed by pre-save hook
        studentImage: studentImage || undefined, // Use default if not provided
        grade: grade || undefined,
        school: school || undefined,
        allowance: allowance !== undefined ? allowance : true,
        role: 'student',
        verificationCode: Math.floor(100000 + Math.random() * 900000).toString(), // 6-digit code
        competitions: [],
        badges: [],
        registrationDate: new Date(),
      });

      await newStudent.save();

      // Return student data without password
      const studentResponse = { ...newStudent._doc };
      delete studentResponse.studentPassword;
      delete studentResponse.verificationCode;

      // Log admin action
      console.log(`[${CURRENT_DATE_TIME}] Admin ${CURRENT_USER} created student account for ${studentEmail}`);

      res.status(201).json({
        success: true,
        message: "Student created successfully",
        data: { student: studentResponse }
      });
    } catch (error) {
      console.error("Error in createStudent:", error);
      res.status(500).json({
        success: false,
        message: "Failed to create student",
        error: error.message
      });
    }
  },

  // Update student
  updateStudent: async (req, res) => {
    try {
      const { id } = req.params;
      const {
        studentFirstName,
        studentLastName,
        studentEmail,
        studentPassword,
        studentImage,
        grade,
        school,
        allowance
      } = req.body;

      // Find student
      const student = await Student.findById(id);
      if (!student) {
        return res.status(404).json({
          success: false,
          message: "Student not found"
        });
      }

      // If email is being updated, check if it's already in use
      if (studentEmail && studentEmail !== student.studentEmail) {
        if (!validateEmail(studentEmail)) {
          return res.status(400).json({
            success: false,
            message: "Invalid email format"
          });
        }

        const emailExists = await Student.findOne({ studentEmail });
        if (emailExists) {
          return res.status(409).json({
            success: false,
            message: "Email already in use by another student"
          });
        }
      }

      // Update fields if provided
      if (studentFirstName) student.studentFirstName = studentFirstName;
      if (studentLastName) student.studentLastName = studentLastName;
      if (studentEmail) student.studentEmail = studentEmail;
      if (studentImage) student.studentImage = studentImage;
      if (grade !== undefined) student.grade = grade;
      if (school !== undefined) student.school = school;
      if (allowance !== undefined) student.allowance = allowance;

      // Special handling for password
      if (studentPassword) {
        student.studentPassword = await bcrypt.hash(studentPassword, 10);
      }

      // Save updated student
      await student.save();

      // Return updated student data without password
      const studentResponse = { ...student._doc };
      delete studentResponse.studentPassword;
      delete studentResponse.verificationCode;

      // Log admin action
      console.log(`[${CURRENT_DATE_TIME}] Admin ${CURRENT_USER} updated student account for ${student.studentEmail}`);

      res.status(200).json({
        success: true,
        message: "Student updated successfully",
        data: { student: studentResponse }
      });
    } catch (error) {
      console.error("Error in updateStudent:", error);
      res.status(500).json({
        success: false,
        message: "Failed to update student",
        error: error.message
      });
    }
  },

  // Delete student
  deleteStudent: async (req, res) => {
    try {
      const { id } = req.params;

      // Find student
      const student = await Student.findById(id);
      if (!student) {
        return res.status(404).json({
          success: false,
          message: "Student not found"
        });
      }

      // Store student email for logging
      const studentEmail = student.studentEmail;

      // Delete student
      await Student.findByIdAndDelete(id);

      // Log admin action
      console.log(`[${CURRENT_DATE_TIME}] Admin ${CURRENT_USER} deleted student account for ${studentEmail}`);

      res.status(200).json({
        success: true,
        message: "Student deleted successfully",
      });
    } catch (error) {
      console.error("Error in deleteStudent:", error);
      res.status(500).json({
        success: false,
        message: "Failed to delete student",
        error: error.message
      });
    }
  },

  // Verify student account (toggle allowance)
  verifyStudent: async (req, res) => {
    try {
      const { id } = req.params;

      const student = await Student.findById(id);
      if (!student) {
        return res.status(404).json({
          success: false,
          message: "Student not found"
        });
      }

      // Toggle allowance status
      student.allowance = !student.allowance;

      // Save changes
      await student.save();

      // Log admin action
      const action = student.allowance ? "verified" : "unverified";
      console.log(`[${CURRENT_DATE_TIME}] Admin ${CURRENT_USER} ${action} student account for ${student.studentEmail}`);

      res.status(200).json({
        success: true,
        message: `Student account ${action} successfully`,
        data: {
          studentId: student._id,
          allowance: student.allowance
        }
      });
    } catch (error) {
      console.error("Error in verifyStudent:", error);
      res.status(500).json({
        success: false,
        message: "Failed to update student verification status",
        error: error.message
      });
    }
  },

  // Get student performance statistics
  getStudentStatistics: async (req, res) => {
    try {
      const { id } = req.params;

      const student = await Student.findById(id)
        .select('-studentPassword -verificationCode')
        .populate('competitions.competitionId', 'title description startDateTime endDateTime');

      if (!student) {
        return res.status(404).json({
          success: false,
          message: "Student not found"
        });
      }

      // Calculate statistics
      const totalCompetitions = student.competitions.length;
      const completedCompetitions = student.competitions.filter(comp => comp.completed).length;
      const averageScore = totalCompetitions > 0
        ? student.competitions.reduce((acc, curr) => acc + (curr.score || 0), 0) / totalCompetitions
        : 0;

      // Get badges count
      const badgesCount = student.badges?.length || 0;

      res.status(200).json({
        success: true,
        data: {
          student: {
            _id: student._id,
            name: `${student.studentFirstName} ${student.studentLastName}`,
            email: student.studentEmail,
            grade: student.grade,
            school: student.school,
            allowance: student.allowance,
          },
          statistics: {
            totalCompetitions,
            completedCompetitions,
            averageScore,
            badgesCount
          }
        }
      });
    } catch (error) {
      console.error("Error in getStudentStatistics:", error);
      res.status(500).json({
        success: false,
        message: "Failed to retrieve student statistics",
        error: error.message
      });
    }
  },

  // Bulk actions on students
  bulkActionStudents: async (req, res) => {
    try {
      const { action, studentIds } = req.body;

      if (!action || !studentIds || !Array.isArray(studentIds) || studentIds.length === 0) {
        return res.status(400).json({
          success: false,
          message: "Invalid request parameters"
        });
      }

      let result;

      switch (action) {
        case 'verify':
          result = await Student.updateMany(
            { _id: { $in: studentIds } },
            { $set: { allowance: true } }
          );
          break;
        case 'unverify':
          result = await Student.updateMany(
            { _id: { $in: studentIds } },
            { $set: { allowance: false } }
          );
          break;
        case 'delete':
          result = await Student.deleteMany({ _id: { $in: studentIds } });
          break;
        default:
          return res.status(400).json({
            success: false,
            message: "Invalid action specified"
          });
      }

      // Log admin action
      console.log(`[${CURRENT_DATE_TIME}] Admin ${CURRENT_USER} performed bulk ${action} on ${studentIds.length} students`);

      res.status(200).json({
        success: true,
        message: `Bulk action '${action}' completed successfully`,
        data: {
          affectedCount: action === 'delete' ? result.deletedCount : result.modifiedCount,
          totalIds: studentIds.length
        }
      });
    } catch (error) {
      console.error("Error in bulkActionStudents:", error);
      res.status(500).json({
        success: false,
        message: `Failed to perform bulk action`,
        error: error.message
      });
    }
  },

  // Get admin profile
  getProfile: async (req, res) => {
    try {
      // Admin object is already attached to req by the protectAdmin middleware
      const admin = req.admin;

      if (!admin) {
        return res.status(404).json({
          success: false,
          message: "Admin profile not found"
        });
      }

      // Return the admin profile without sensitive information
      res.status(200).json({
        success: true,
        data: {
          admin: {
            _id: admin._id,
            name: admin.adminName,
            email: admin.adminEmail,
            profileImage: admin.adminImage,
            role: admin.role,
            permissions: admin.permissions || [],
            lastLogin: admin.lastLogin
          }
        }
      });
    } catch (error) {
      console.error("Error in getProfile:", error);
      res.status(500).json({
        success: false,
        message: "Failed to retrieve admin profile",
        error: error.message
      });
    }
  },

  // Update admin profile
  updateProfile: async (req, res) => {
    try {
      // Admin object is already attached to req by the protectAdmin middleware
      const admin = req.admin;
      const { name, email, profileImage } = req.body;

      if (!admin) {
        return res.status(404).json({
          success: false,
          message: "Admin profile not found"
        });
      }

      // Update fields if provided
      if (name) admin.name = name;

      // If email is being updated, check if it's already in use
      if (email && email !== admin.email) {
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          return res.status(400).json({
            success: false,
            message: "Invalid email format"
          });
        }

        const emailExists = await Admin.findOne({ email });
        if (emailExists) {
          return res.status(409).json({
            success: false,
            message: "Email already in use by another admin"
          });
        }

        admin.email = email;
      }

      if (profileImage) admin.profileImage = profileImage;

      // Save updated admin
      await admin.save();

      // Log admin action
      console.log(`[${CURRENT_DATE_TIME}] Admin ${admin.name} updated their profile`);

      // Return the updated admin profile without password
      res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        data: {
          admin: {
            _id: admin._id,
            name: admin.name,
            email: admin.email,
            profileImage: admin.profileImage,
            role: admin.role,
            permissions: admin.permissions || [],
            lastLogin: admin.lastLogin
          }
        }
      });
    } catch (error) {
      console.error("Error in updateProfile:", error);
      res.status(500).json({
        success: false,
        message: "Failed to update profile",
        error: error.message
      });
    }
  },

  // Update admin password
  updatePassword: async (req, res) => {
    try {
      // Admin object is already attached to req by the protectAdmin middleware
      const admin = req.admin;
      const { currentPassword, newPassword } = req.body;

      if (!admin) {
        return res.status(404).json({
          success: false,
          message: "Admin profile not found"
        });
      }

      // Check if required fields are provided
      if (!currentPassword || !newPassword) {
        return res.status(400).json({
          success: false,
          message: "Current password and new password are required"
        });
      }

      // Get admin with password
      const adminWithPassword = await Admin.findById(admin._id);

      // Check if current password is correct
      const isMatch = await bcrypt.compare(currentPassword, adminWithPassword.adminPassword);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: "Current password is incorrect"
        });
      }

      // Validate new password
      if (newPassword.length < 6) {
        return res.status(400).json({
          success: false,
          message: "New password must be at least 6 characters long"
        });
      }

      // Hash new password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      // Update password
      adminWithPassword.adminPassword = hashedPassword;
      await adminWithPassword.save();

      // Log admin action (without showing the password)
      console.log(`[${CURRENT_DATE_TIME}] Admin ${admin.name} updated their password`);

      res.status(200).json({
        success: true,
        message: "Password updated successfully"
      });
    } catch (error) {
      console.error("Error in updatePassword:", error);
      res.status(500).json({
        success: false,
        message: "Failed to update password",
        error: error.message
      });
    }
  },

  // Get all competitions with filtering and pagination
  getAllCompetitions: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;

      // Build filter based on query parameters
      const filter = {};

      // Filter by competition name
      if (req.query.name) {
        filter.competitionName = { $regex: req.query.name, $options: 'i' };
      }

      // Filter by description
      if (req.query.description) {
        filter.competitionDescription = { $regex: req.query.description, $options: 'i' };
      }

      // Filter by creator
      if (req.query.creatorId) {
        filter.creatorId = req.query.creatorId;
      }

      // Filter by type
      if (req.query.type) {
        filter.competitionType = req.query.type; // TEXT, MCQ, or CODE
      }

      // Filter by status
      if (req.query.status === 'live') {
        filter.isLive = true;
      } else if (req.query.status === 'draft') {
        filter.isLive = false;
      }

      // Filter by competition status (upcoming/active/ended)
      if (req.query.competitionStatus) {
        filter.status = req.query.competitionStatus;
      }

      // Filter by previous/current competitions
      if (req.query.isPrevious === 'true') {
        filter.previousCompetition = true;
      } else if (req.query.isPrevious === 'false') {
        filter.previousCompetition = false;
      }

      // Filter by availability timing
      const now = new Date().toISOString();
      if (req.query.availability === 'active') {
        filter.startTiming = { $lte: now };
        filter.endTiming = { $gte: now };
      } else if (req.query.availability === 'upcoming') {
        filter.startTiming = { $gt: now };
      } else if (req.query.availability === 'ended') {
        filter.endTiming = { $lt: now };
      }

      // Count total competitions matching the filter
      const total = await Competition.countDocuments(filter);

      // Get competitions with pagination and sorting
      let query = Competition.find(filter);

      // Apply sorting
      const sortField = req.query.sortBy || 'lastSaved';
      const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;
      query = query.sort({ [sortField]: sortOrder });

      // Apply pagination
      query = query.skip(skip).limit(limit);

      // Execute query
      const competitions = await query;

      // Format response
      const formattedCompetitions = await Promise.all(competitions.map(async (comp) => {
        // Get creator information from both Teacher and Admin schemas
        let creatorName = 'Unknown';
        let creatorType = 'unknown';

        try {
          // First check if creator is a teacher
          const teacher = await Teacher.findById(comp.creatorId)
            .select('teacherFirstName teacherLastName');

          if (teacher) {
            creatorName = `${teacher.teacherFirstName} ${teacher.teacherLastName}`;
            creatorType = 'teacher';
          } else {
            // If not a teacher, check if creator is an admin
            const admin = await Admin.findById(comp.creatorId)
              .select('adminName');

            if (admin) {
              creatorName = admin.adminName;
              creatorType = 'admin';
            }
          }
        } catch (err) {
          console.error('Error fetching creator info:', err);
        }

        // Calculate competition status if not already set in the database
        let competitionStatus = comp.status || 'upcoming';

        // Double-check status is accurate by calculating based on current time
        const now = new Date();
        const availableFrom = new Date(comp.startTiming || comp.lastSaved);
        const endTime = comp.endTiming ? new Date(comp.endTiming) :
          (availableFrom && comp.duration ? new Date(availableFrom.getTime() + (comp.duration * 60000)) : null);

        if (availableFrom && endTime) {
          if (now < availableFrom) {
            competitionStatus = 'upcoming';
          } else if (now >= availableFrom && now <= endTime) {
            competitionStatus = 'active';
          } else {
            competitionStatus = 'ended';
          }
        }

        // Calculate time remaining or time until start
        let timeInfo = {};
        if (competitionStatus === 'upcoming' && availableFrom) {
          const timeToStart = availableFrom - now;
          timeInfo = {
            startsIn: timeToStart,
            formattedStartsIn: formatTimeRemaining(timeToStart)
          };
        } else if (competitionStatus === 'active' && endTime) {
          const timeRemaining = endTime - now;
          timeInfo = {
            endsIn: timeRemaining,
            formattedEndsIn: formatTimeRemaining(timeRemaining)
          };
        }

        return {
          _id: comp._id,
          id: comp.id,
          competitionName: comp.competitionName,
          competitionDescription: comp.competitionDescription || '',
          competitionType: comp.competitionType,
          creatorId: comp.creatorId,
          creatorName,
          creatorType, // Added information about the type of creator
          isLive: comp.isLive,
          previousCompetition: comp.previousCompetition,
          startTiming: comp.startTiming,
          endTiming: comp.endTiming || (endTime ? endTime.toISOString() : null),
          status: competitionStatus, // Include the status field
          lastSaved: comp.lastSaved,
          duration: comp.duration,
          questionsCount: comp.questions?.length || 0,
          hasWinner: !!comp.winner,
          timeInfo
        };
      }));

      // Log the action
      console.log(`[${CURRENT_DATE_TIME}] Admin ${CURRENT_USER} retrieved competitions list`);

      res.status(200).json({
        success: true,
        data: {
          competitions: formattedCompetitions,
          pagination: {
            total,
            page,
            pages: Math.ceil(total / limit),
            limit
          }
        }
      });
    } catch (error) {
      console.error('Error in getAllCompetitions:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve competitions',
        error: error.message
      });
    }
  },

  // Get competition by ID with detailed information
  getCompetitionById: async (req, res) => {
    try {
      const { id } = req.params;

      const competition = await Competition.findById(id);

      if (!competition) {
        return res.status(404).json({
          success: false,
          message: 'Competition not found'
        });
      }

      // Get creator information from both Teacher and Admin schemas
      let creator = { name: 'Unknown', type: 'unknown' };
      try {
        // First check if creator is a teacher
        const teacher = await Teacher.findById(competition.creatorId)
          .select('teacherFirstName teacherLastName teacherEmail');

        if (teacher) {
          creator = {
            id: teacher._id,
            name: `${teacher.teacherFirstName} ${teacher.teacherLastName}`,
            email: teacher.teacherEmail,
            type: 'teacher'
          };
        } else {
          // If not a teacher, check if creator is an admin
          const admin = await Admin.findById(competition.creatorId)
            .select('adminName adminEmail');

          if (admin) {
            creator = {
              id: admin._id,
              name: admin.adminName,
              email: admin.adminEmail,
              type: 'admin'
            };
          }
        }
      } catch (err) {
        console.error('Error fetching creator info:', err);
      }

      // If competition has winners, get their info
      let winnerInfo = null;
      let runnerUpInfo = null;
      let secondRunnerUpInfo = null;

      if (competition.winner) {
        try {
          const winner = await Student.findById(competition.winner)
            .select('studentFirstName studentLastName studentEmail');

          if (winner) {
            winnerInfo = {
              id: winner._id,
              name: `${winner.studentFirstName} ${winner.studentLastName}`,
              email: winner.studentEmail
            };
          }
        } catch (err) {
          console.error('Error fetching winner info:', err);
        }
      }

      if (competition.runnerUp) {
        try {
          const runnerUp = await Student.findById(competition.runnerUp)
            .select('studentFirstName studentLastName studentEmail');

          if (runnerUp) {
            runnerUpInfo = {
              id: runnerUp._id,
              name: `${runnerUp.studentFirstName} ${runnerUp.studentLastName}`,
              email: runnerUp.studentEmail
            };
          }
        } catch (err) {
          console.error('Error fetching runner-up info:', err);
        }
      }

      if (competition.secondRunnerUp) {
        try {
          const secondRunnerUp = await Student.findById(competition.secondRunnerUp)
            .select('studentFirstName studentLastName studentEmail');

          if (secondRunnerUp) {
            secondRunnerUpInfo = {
              id: secondRunnerUp._id,
              name: `${secondRunnerUp.studentFirstName} ${secondRunnerUp.studentLastName}`,
              email: secondRunnerUp.studentEmail
            };
          }
        } catch (err) {
          console.error('Error fetching second runner-up info:', err);
        }
      }

      // Determine competition availability status
      let availabilityStatus = 'upcoming';
      const availableFrom = new Date(competition.startTiming || competition.lastSaved);
      const currentTime = new Date();

      if (availableFrom <= currentTime) {
        availabilityStatus = 'active';
      }

      // Format the response
      const formattedCompetition = {
        ...competition.toObject(),
        creator,
        availabilityStatus,
        winners: {
          winner: winnerInfo,
          runnerUp: runnerUpInfo,
          secondRunnerUp: secondRunnerUpInfo
        }
      };

      // Log the action
      console.log(`[${CURRENT_DATE_TIME}] Admin ${CURRENT_USER} viewed competition: ${competition.competitionName} (ID: ${competition._id})`);

      res.status(200).json({
        success: true,
        data: { competition: formattedCompetition }
      });
    } catch (error) {
      console.error('Error in getCompetitionById:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve competition details',
        error: error.message
      });
    }
  },

  // Create a new competition
  createCompetition: async (req, res) => {
    try {
      const {
        competitionName,
        competitionDescription,
        competitionType,
        questions,
        duration,
        startTiming,
        endTiming,
        isLive = false
      } = req.body;

      // Validate required fields
      if (!competitionName) {
        return res.status(400).json({
          success: false,
          message: 'Competition name is required'
        });
      }

      if (!competitionType || !['TEXT', 'MCQ', 'CODE'].includes(competitionType)) {
        return res.status(400).json({
          success: false,
          message: 'Valid competition type (TEXT, MCQ, or CODE) is required'
        });
      }

      // Create a new competition
      const newCompetition = new Competition({
        competitionName,
        competitionDescription, // Add description field
        competitionType,
        creatorId: req.admin._id, // Set creator as current admin
        questions: questions || [],
        duration: duration || 60, // Default to 60 minutes if not provided
        isLive,
        startTiming: startTiming || new Date().toISOString(),
        endTiming: endTiming || (startTiming && duration ? new Date(new Date(startTiming).getTime() + duration * 60000).toISOString() : ''),
        lastSaved: new Date().toISOString(),
        previousCompetition: false
      });

      // Generate a unique ID for the competition
      // Find the highest existing ID and increment by 1
      const highestIdCompetition = await Competition.findOne().sort('-id');
      newCompetition.id = highestIdCompetition ? highestIdCompetition.id + 1 : 1;

      await newCompetition.save();

      // Log the action
      console.log(`[${CURRENT_DATE_TIME}] Admin ${CURRENT_USER} created new competition: ${competitionName} (ID: ${newCompetition._id})`);

      res.status(201).json({
        success: true,
        message: 'Competition created successfully',
        data: { competition: newCompetition }
      });
    } catch (error) {
      console.error('Error in createCompetition:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create competition',
        error: error.message
      });
    }
  },

  // Update an existing competition
  updateCompetition: async (req, res) => {
    try {
      const { id } = req.params;
      const {
        competitionName,
        competitionDescription,
        competitionType,
        questions,
        duration,
        isLive,
        startTiming,
        endTiming,
        previousCompetition,
        winner,
        runnerUp,
        secondRunnerUp
      } = req.body;

      // Find the competition
      const competition = await Competition.findById(id);

      if (!competition) {
        return res.status(404).json({
          success: false,
          message: 'Competition not found'
        });
      }

      // Update fields if provided
      if (competitionName !== undefined) competition.competitionName = competitionName;
      if (competitionDescription !== undefined) competition.competitionDescription = competitionDescription;
      if (competitionType !== undefined && ['TEXT', 'MCQ', 'CODE'].includes(competitionType)) {
        competition.competitionType = competitionType;
      }
      if (questions !== undefined) competition.questions = questions;
      if (duration !== undefined) competition.duration = duration;
      if (isLive !== undefined) competition.isLive = isLive;
      if (startTiming !== undefined) competition.startTiming = startTiming;
      if (endTiming !== undefined) competition.endTiming = endTiming;
      if (previousCompetition !== undefined) competition.previousCompetition = previousCompetition;
      if (winner !== undefined) competition.winner = winner;
      if (runnerUp !== undefined) competition.runnerUp = runnerUp;
      if (secondRunnerUp !== undefined) competition.secondRunnerUp = secondRunnerUp;

      // Update lastSaved timestamp
      competition.lastSaved = new Date().toISOString();

      await competition.save();

      // Log the action
      console.log(`[${CURRENT_DATE_TIME}] Admin ${CURRENT_USER} updated competition: ${competition.competitionName} (ID: ${competition._id})`);

      res.status(200).json({
        success: true,
        message: 'Competition updated successfully',
        data: { competition }
      });
    } catch (error) {
      console.error('Error in updateCompetition:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update competition',
        error: error.message
      });
    }
  },

  // Delete a competition
  deleteCompetition: async (req, res) => {
    try {
      const { id } = req.params;

      // Find the competition
      const competition = await Competition.findById(id);

      if (!competition) {
        return res.status(404).json({
          success: false,
          message: 'Competition not found'
        });
      }

      // Store competition info for logging
      const competitionName = competition.competitionName;
      const competitionId = competition._id;

      // Delete the competition
      await Competition.findByIdAndDelete(id);

      // Log the action
      console.log(`[${CURRENT_DATE_TIME}] Admin ${CURRENT_USER} deleted competition: ${competitionName} (ID: ${competitionId})`);

      res.status(200).json({
        success: true,
        message: 'Competition deleted successfully'
      });
    } catch (error) {
      console.error('Error in deleteCompetition:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete competition',
        error: error.message
      });
    }
  },

  // Toggle competition status (live/draft)
  toggleCompetitionStatus: async (req, res) => {
    try {
      const { id } = req.params;

      const competition = await Competition.findById(id);

      if (!competition) {
        return res.status(404).json({
          success: false,
          message: 'Competition not found'
        });
      }

      // Toggle isLive status
      competition.isLive = !competition.isLive;

      // If setting to live, ensure startTiming is set
      if (competition.isLive) {
        const now = new Date().toISOString();

        if (!competition.startTiming) {
          competition.startTiming = now;
        }

        // Set endTiming if not already set
        if (!competition.endTiming && competition.duration) {
          competition.endTiming = new Date(new Date(competition.startTiming).getTime() + competition.duration * 60000).toISOString();
        }
      }

      // Update lastSaved timestamp
      competition.lastSaved = new Date().toISOString();

      await competition.save();

      // Log the action
      const statusText = competition.isLive ? 'live' : 'draft';
      console.log(`[${CURRENT_DATE_TIME}] Admin ${CURRENT_USER} set competition ${competition.competitionName} (ID: ${competition._id}) to ${statusText} mode`);

      res.status(200).json({
        success: true,
        message: `Competition set to ${statusText} mode successfully`,
        data: {
          competitionId: competition._id,
          isLive: competition.isLive,
          startTiming: competition.startTiming,
          endTiming: competition.endTiming
        }
      });
    } catch (error) {
      console.error('Error in toggleCompetitionStatus:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update competition status',
        error: error.message
      });
    }
  },

  // Get competition statistics and participation data
  getCompetitionStats: async (req, res) => {
    try {
      const { id } = req.params;

      const competition = await Competition.findById(id);

      if (!competition) {
        return res.status(404).json({
          success: false,
          message: 'Competition not found'
        });
      }

      // Get participating students
      const participatingStudents = await Student.find({
        'competitions.competitionId': competition._id
      }).select('studentFirstName studentLastName studentEmail grade school');

      // Calculate participation statistics
      const stats = {
        totalParticipants: participatingStudents.length,
        completedCount: 0,
        inProgressCount: 0,
        type: competition.competitionType,
        averageScore: 0,
        highestScore: 0,
        totalQuestions: competition.questions.length,
        availableFrom: competition.startTiming || competition.lastSaved,
        duration: competition.duration
      };

      // Update statistics based on student participation
      participatingStudents.forEach(student => {
        const competitionEntry = student.competitions.find(
          comp => comp.competitionId.toString() === competition._id.toString()
        );

        if (competitionEntry) {
          if (competitionEntry.completed) {
            stats.completedCount++;
          } else {
            stats.inProgressCount++;
          }
        }
      });

      // Check if competition is available now
      const now = new Date();
      const availableFrom = new Date(competition.startTiming || competition.lastSaved);
      stats.isAvailableNow = availableFrom <= now && competition.isLive;

      // Log the action
      console.log(`[${CURRENT_DATE_TIME}] Admin ${CURRENT_USER} viewed statistics for competition: ${competition.competitionName} (ID: ${competition._id})`);

      res.status(200).json({
        success: true,
        data: {
          competitionName: competition.competitionName,
          competitionType: competition.competitionType,
          isLive: competition.isLive,
          previousCompetition: competition.previousCompetition,
          startTiming: competition.startTiming,
          endTiming: competition.endTiming,
          duration: competition.duration,
          stats,
          participants: participatingStudents.map(student => ({
            _id: student._id,
            name: `${student.studentFirstName} ${student.studentLastName}`,
            email: student.studentEmail,
            grade: student.grade || 'N/A',
            school: student.school || 'N/A'
          }))
        }
      });
    } catch (error) {
      console.error('Error in getCompetitionStats:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve competition statistics',
        error: error.message
      });
    }
  },

  // Mark a competition as previous (archived)
  archiveCompetition: async (req, res) => {
    try {
      const { id } = req.params;

      const competition = await Competition.findById(id);

      if (!competition) {
        return res.status(404).json({
          success: false,
          message: 'Competition not found'
        });
      }

      // Toggle previousCompetition status (archive/unarchive)
      competition.previousCompetition = !competition.previousCompetition;

      // If archiving and it's still live, set it to not live
      if (competition.previousCompetition && competition.isLive) {
        competition.isLive = false;
      }

      // Update lastSaved timestamp
      competition.lastSaved = new Date().toISOString();

      await competition.save();

      // Log the action
      const actionText = competition.previousCompetition ? 'archived' : 'unarchived';
      console.log(`[${CURRENT_DATE_TIME}] Admin ${CURRENT_USER} ${actionText} competition: ${competition.competitionName} (ID: ${competition._id})`);

      res.status(200).json({
        success: true,
        message: `Competition ${actionText} successfully`,
        data: {
          competitionId: competition._id,
          previousCompetition: competition.previousCompetition
        }
      });
    } catch (error) {
      console.error('Error in archiveCompetition:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to change competition archive status',
        error: error.message
      });
    }
  },

  // Clone an existing competition
  cloneCompetition: async (req, res) => {
    try {
      const { id } = req.params;

      const competition = await Competition.findById(id);

      if (!competition) {
        return res.status(404).json({
          success: false,
          message: 'Competition not found'
        });
      }

      // Create a new competition based on the existing one
      const clonedCompetition = new Competition({
        competitionName: `${competition.competitionName} (Copy)`,
        competitionDescription: competition.competitionDescription,
        competitionType: competition.competitionType,
        creatorId: req.admin._id, // Set creator as current admin
        questions: competition.questions,
        duration: competition.duration,
        isLive: false, // Always start as draft
        startTiming: '',
        endTiming: '',
        lastSaved: new Date().toISOString(),
        previousCompetition: false
      });

      // Generate a unique ID for the competition
      const highestIdCompetition = await Competition.findOne().sort('-id');
      clonedCompetition.id = highestIdCompetition ? highestIdCompetition.id + 1 : 1;

      await clonedCompetition.save();

      // Log the action
      console.log(`[${CURRENT_DATE_TIME}] Admin ${CURRENT_USER} cloned competition: ${competition.competitionName} to create ${clonedCompetition.competitionName} (ID: ${clonedCompetition._id})`);

      res.status(201).json({
        success: true,
        message: 'Competition cloned successfully',
        data: { competition: clonedCompetition }
      });
    } catch (error) {
      console.error('Error in cloneCompetition:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to clone competition',
        error: error.message
      });
    }
  },

  // Get dashboard statistics
  getDashboardStats: async (req, res) => {
    try {
      // Get counts
      const totalTeachers = await Teacher.countDocuments();
      const totalStudents = await Student.countDocuments();
      const totalCompetitions = await Competition.countDocuments();
      const feedbackCount = await Feedback.countDocuments();

      // Calculate user distribution
      const totalUsers = totalTeachers + totalStudents;
      const userDistribution = {
        teachers: {
          count: totalTeachers,
          percentage: totalUsers > 0 ? Math.round((totalTeachers / totalUsers) * 100) : 0
        },
        students: {
          count: totalStudents,
          percentage: totalUsers > 0 ? Math.round((totalStudents / totalUsers) * 100) : 0
        }
      };

      // Get active competitions count
      const activeCompetitions = await Competition.countDocuments({
        status: "active",
        isLive: true
      });

      // Get upcoming competitions with name and startDate
      const upcomingCompetitions = await Competition.find({
        status: "upcoming",
        isLive: true
      }).select("competitionName startTiming");

      // Get recent activities
      const recentActivities = [];

      // Get recent teacher registrations (last 5)
      const recentTeachers = await Teacher.find()
        .select("teacherFirstName teacherLastName teacherEmail registerTime loginTime")
        .sort({ createdAt: -1 })
        .limit(5);

      recentTeachers.forEach(teacher => {
        recentActivities.push({
          type: "teacher_registration",
          user: `${teacher.teacherFirstName} ${teacher.teacherLastName}`,
          email: teacher.teacherEmail,
          timestamp: teacher.createdAt,
          formattedTime: teacher.registerTime
        });
      });

      // Get recent student registrations (last 5)
      const recentStudents = await Student.find()
        .select("studentFirstName studentLastName studentEmail registerTime loginTime")
        .sort({ registrationDate: -1 })
        .limit(5);

      recentStudents.forEach(student => {
        recentActivities.push({
          type: "student_registration",
          user: `${student.studentFirstName} ${student.studentLastName}`,
          email: student.studentEmail,
          timestamp: student.registrationDate,
          formattedTime: student.registerTime
        });
      });

      // Sort all activities by timestamp (descending)
      recentActivities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

      // Get top 10 activities
      const top10Activities = recentActivities.slice(0, 10);

      // Prepare response
      const dashboardStats = {
        counts: {
          totalTeachers,
          totalStudents,
          totalCompetitions,
          feedbackCount,
          activeCompetitions
        },
        upcomingCompetitions,
        userDistribution,
        recentActivity: top10Activities
      };

      // Log the action
      console.log(`[${new Date().toISOString()}] Admin accessed dashboard statistics`);

      res.status(200).json({
        success: true,
        data: dashboardStats
      });
    } catch (error) {
      console.error("Error in getDashboardStats:", error);
      res.status(500).json({
        success: false,
        message: "Failed to retrieve dashboard statistics",
        error: error.message
      });
    }
  },

  // Toggle student block status
  getToggleBlockedStatus: async (req, res) => {
    try {
      const { id } = req.params;

      // Find student
      const student = await Student.findById(id);
      if (!student) {
        return res.status(404).json({
          success: false,
          message: "Student not found"
        });
      }

      // Toggle blockStatus
      student.blockedStatus = !student.blockedStatus;

      // Save updated student
      await student.save();

      // Log admin action
      const action = student.blockedStatus ? "blocked" : "unblocked";
      console.log(`[${CURRENT_DATE_TIME}] Admin ${CURRENT_USER} ${action} student account for ${student.studentEmail}`);

      res.status(200).json({
        success: true,
        message: `Student account ${action} successfully`,
        data: {
          studentId: student._id,
          blockStatus: student.blockedStatus
        }
      });
    } catch (error) {
      console.error("Error in getToggleBlockedStatus:", error);
      res.status(500).json({
        success: false,
        message: "Failed to update student block status",
        error: error.message
      });
    }
  },

  // Get all submissions for a specific competition
  getCompetitionSubmissions: async (req, res) => {
    try {
      const { id } = req.params; // Competition ID

      // Verify competition exists
      const competition = await Competition.findById(id);
      if (!competition) {
        return res.status(404).json({
          success: false,
          message: 'Competition not found'
        });
      }

      // Find all submissions for this competition
      const Submission = require('../models/submission');
      const submissions = await Submission.find({ competitionId: id });

      // Get detailed information for each submission
      const detailedSubmissions = await Promise.all(
        submissions.map(async (submission) => {
          // Get student information
          const student = await Student.findById(submission.studentId)
            .select('studentFirstName studentLastName studentEmail');


          return {
            submissionId: submission._id,
            submissionTime: submission.submissionTime,
            student: student ? {
              id: student._id,
              name: `${student.studentFirstName} ${student.studentLastName}`,
              email: student.studentEmail,
            } : { name: 'Unknown Student' },
            questions: submission.questions?.length || 0,
            answers: submission.answers?.length || 0,
            answeredAll: submission.questions?.length === submission.answers?.length,
          };
        })
      );

      // Log the action
      console.log(`[${CURRENT_DATE_TIME}] Admin ${CURRENT_USER} viewed submissions for competition: ${competition.competitionName} (ID: ${competition._id})`);

      res.status(200).json({
        success: true,
        data: {
          competition: {
            id: competition._id,
            name: competition.competitionName,
            type: competition.competitionType,
            totalQuestions: competition.questions?.length || 0
          },
          submissions: detailedSubmissions,
          stats: {
            totalSubmissions: submissions.length,
            completedSubmissions: detailedSubmissions.filter(sub => sub.answeredAll).length
          }
        }
      });
    } catch (error) {
      console.error('Error in getCompetitionSubmissions:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve competition submissions',
        error: error.message
      });
    }
  },

  // Get detailed information for a specific submission
  getSubmissionDetails: async (req, res) => {
    try {
      const { id } = req.params; // Submission ID

      // Find the submission
      const Submission = require('../models/submission');
      const submission = await Submission.findById(id);

      if (!submission) {
        return res.status(404).json({
          success: false,
          message: 'Submission not found'
        });
      }

      // Get the competition details
      const competition = await Competition.findById(submission.competitionId);
      if (!competition) {
        return res.status(404).json({
          success: false,
          message: 'Associated competition not found'
        });
      }

      // Get student information
      const student = await Student.findById(submission.studentId)
        .select('studentFirstName studentLastName studentEmail grade school studentImage');

      // Get student competition data
      let studentCompetitionData = null;
      if (student && student.competitions) {
        studentCompetitionData = student.competitions.find(
          comp => comp.competitionId.toString() === competition._id.toString()
        );
      }

      // Format the questions and answers together with full question details
      const questionAnswers = [];
      for (let i = 0; i < submission.questions.length; i++) {
        const questionId = submission.questions[i];

        // Find the original question from the competition
        const originalQuestion = competition.questions.find(q => q._id.toString() === questionId);

        // Include the entire question object along with student's answer
        questionAnswers.push({
          question: originalQuestion || {
            questionText: 'Question not found',
            options: []
          },
          studentAnswer: submission.answers[i] || 'Not answered',
          isCorrect: originalQuestion && submission.answers[i] ?
            submission.answers[i] === originalQuestion.answer : false,
          questionNumber: i + 1
        });
      }

      // Log the action
      console.log(`[${CURRENT_DATE_TIME}] Admin ${CURRENT_USER} viewed submission details (ID: ${submission._id}) for student: ${student ? student.studentEmail : 'Unknown'}`);

      res.status(200).json({
        success: true,
        data: {
          submission: {
            _id: submission._id,
            submissionTime: submission.submissionTime,
            lastUpdated: submission.updatedAt || submission.submissionTime,
            totalQuestions: submission.questions.length,
            answeredQuestions: submission.answers.filter(a => a).length,
            completionStatus: submission.questions.length === submission.answers.filter(a => a).length ? 'Completed' : 'Incomplete'
          },
          competition: {
            _id: competition._id,
            name: competition.competitionName,
            description: competition.competitionDescription,
            type: competition.competitionType,
            startTime: competition.startTiming,
            endTime: competition.endTiming,
            duration: competition.duration
          },
          student: student ? {
            _id: student._id,
            name: `${student.studentFirstName} ${student.studentLastName}`,
            email: student.studentEmail,
            grade: student.grade || 'N/A',
            school: student.school || 'N/A',
            profileImage: student.studentImage || null
          } : { name: 'Unknown Student' },
          performance: {
            score: studentCompetitionData ? studentCompetitionData.score : 'N/A',
            timeSpent: studentCompetitionData ? studentCompetitionData.timeSpent : 'N/A',
            completedAt: studentCompetitionData && studentCompetitionData.completed ?
              studentCompetitionData.completedAt : null
          },
          questionAnswers
        }
      });
    } catch (error) {
      console.error('Error in getSubmissionDetails:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve submission details',
        error: error.message
      });
    }
  },

  // Calculate and assign results for a submission
  assignSubmissionResults: async (req, res) => {
    try {
      const { id } = req.params; // Submission ID

      // Find the submission
      const Submission = require('../models/submission');
      const Result = require('../models/result');

      const submission = await Submission.findById(id);

      if (!submission) {
        return res.status(404).json({
          success: false,
          message: 'Submission not found'
        });
      }

      // Get the competition details
      const competition = await Competition.findById(submission.competitionId);
      if (!competition) {
        return res.status(404).json({
          success: false,
          message: 'Associated competition not found'
        });
      }

      // Check if result already exists
      const existingResult = await Result.findOne({
        studentId: submission.studentId,
        competitionId: submission.competitionId
      });

      if (existingResult) {
        // Return existing result instead of error
        return res.status(200).json({
          success: true,
          message: 'Results already exist for this submission',
          data: {
            submissionId: id,
            resultId: existingResult._id,
            totalScore: existingResult.totalScore,
            percentageScore: existingResult.percentageScore,
            isExisting: true
          }
        });
      }

      // Calculate results
      const results = [];
      let totalCorrect = 0;
      let gradableQuestions = 0;

      for (let i = 0; i < submission.questions.length; i++) {
        const questionId = submission.questions[i];
        const studentAnswer = submission.answers[i] || '';

        // Find the original question from the competition
        const originalQuestion = competition.questions.find(q => q._id.toString() === questionId);

        if (!originalQuestion) continue;

        // Determine correctness based on competition type
        let isCorrect = false;

        if (competition.competitionType === 'MCQ') {
          // For MCQ, we can automatically check answer
          isCorrect = originalQuestion.answer === studentAnswer;
          if (isCorrect) totalCorrect++;
          gradableQuestions++;
        } else {
          // For TEXT or CODE, set as false initially (requires manual grading)
          isCorrect = false;
          // Only count as gradable if student provided an answer
          if (studentAnswer.trim().length > 0) {
            gradableQuestions++;
          }
        }

        results.push({
          questionId: questionId,
          questionType: competition.competitionType,
          studentAnswer: studentAnswer,
          correctAnswer: competition.competitionType === 'MCQ' ? originalQuestion.answer : undefined,
          isCorrect: isCorrect
        });
      }

      const totalQuestions = results.length;
      const percentageScore = gradableQuestions > 0 ? (totalCorrect / gradableQuestions) * 100 : 0;

      // Create and save the result
      const newResult = new Result({
        studentId: submission.studentId,
        competitionId: submission.competitionId,
        results: results,
        totalScore: totalCorrect,
        percentageScore: percentageScore,
        scoreAssignedTime: new Date(),
        submissionId: id,
      });

      await newResult.save();

      // Update student's competition record with the score
      await Student.updateOne(
        {
          _id: submission.studentId,
          'competitions.competitionId': submission.competitionId
        },
        {
          $set: {
            'competitions.$.score': totalCorrect,
            'competitions.$.completed': true,
            'competitions.$.completedAt': new Date()
          }
        }
      );

      // Get student information for response
      const student = await Student.findById(submission.studentId)
        .select('studentFirstName studentLastName studentEmail');

      // Log the action
      console.log(`[${CURRENT_DATE_TIME}] Admin ${CURRENT_USER} assigned results for submission (ID: ${submission._id}), student: ${student ? student.studentEmail : submission.studentId}, score: ${totalCorrect}/${totalQuestions}`);

      // Return appropriate data based on competition type
      const responseData = {
        submissionId: submission._id, // Added submission ID
        resultId: newResult._id,
        studentId: submission.studentId,
        studentInfo: student ? {
          name: `${student.studentFirstName} ${student.studentLastName}`,
          email: student.studentEmail
        } : { name: 'Unknown Student' },
        competitionId: submission.competitionId,
        competitionInfo: {
          name: competition.competitionName,
          type: competition.competitionType
        },
        totalScore: totalCorrect,
        totalQuestions: totalQuestions,
        percentageScore: percentageScore,
        requiresManualGrading: competition.competitionType !== 'MCQ'
      };

      // Add question details for MCQ type
      if (competition.competitionType === 'MCQ') {
        responseData.questions = results.map(r => {
          const question = competition.questions.find(q => q._id.toString() === r.questionId.toString());
          return {
            questionId: r.questionId,
            questionText: question ? question.questionText : 'Question not found',
            studentAnswer: r.studentAnswer,
            correctAnswer: r.correctAnswer,
            isCorrect: r.isCorrect,
            options: question ? question.options : []
          };
        });
      }

      res.status(201).json({
        success: true,
        message: 'Results assigned successfully',
        data: responseData
      });
    } catch (error) {
      console.error('Error in assignSubmissionResults:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to assign results',
        error: error.message
      });
    }
  },

  // Manually grade a TEXT or CODE submission
  gradeTextOrCodeSubmission: async (req, res) => {
    try {
      const { submissionId } = req.params;
      const { questionScores } = req.body;

      // Validate input
      if (!questionScores || !Array.isArray(questionScores)) {
        return res.status(400).json({
          success: false,
          message: 'Question scores must be provided as an array'
        });
      }

      // Validate that each question score has the required properties
      for (const score of questionScores) {
        if (score.questionId === undefined || score.isCorrect === undefined) {
          return res.status(400).json({
            success: false,
            message: 'Each question score must include questionId and isCorrect'
          });
        }
      }

      // Find the submission
      const Submission = require('../models/submission');
      const Result = require('../models/result');

      const submission = await Submission.findById(submissionId);
      if (!submission) {
        return res.status(404).json({
          success: false,
          message: 'Submission not found'
        });
      }

      // Get the competition details
      const competition = await Competition.findById(submission.competitionId);
      if (!competition) {
        return res.status(404).json({
          success: false,
          message: 'Associated competition not found'
        });
      }

      // Only allow manual grading for TEXT or CODE competitions
      if (competition.competitionType === 'MCQ') {
        return res.status(400).json({
          success: false,
          message: 'MCQ submissions should be auto-graded, not manually graded'
        });
      }

      // Find existing result or prepare to create new one
      let result = await Result.findOne({
        studentId: submission.studentId,
        competitionId: submission.competitionId
      });

      // Create new result if one doesn't exist
      if (!result) {
        // Initialize results array based on submission data
        const initialResults = submission.questions.map((questionId, index) => {
          const studentAnswer = submission.answers[index] || '';
          // Find original question
          const originalQuestion = competition.questions.find(q => q._id.toString() === questionId.toString());

          return {
            questionId,
            questionType: competition.competitionType,
            studentAnswer,
            isCorrect: false // Default to false, will be updated below
          };
        });

        result = new Result({
          studentId: submission.studentId,
          competitionId: submission.competitionId,
          results: initialResults,
          totalScore: 0,
          percentageScore: 0,
          scoreAssignedTime: new Date(),
          submissionId: submissionId,
        });
      }

      // Update each question's correctness based on provided scores
      let totalCorrect = 0;

      // Map to track which questions were updated
      const updatedQuestionIds = new Set();

      for (const score of questionScores) {
        // Find the question in results array
        const resultQuestion = result.results.find(r => r.questionId.toString() === score.questionId.toString());

        if (resultQuestion) {
          // Set the correctness based on the score input
          resultQuestion.isCorrect = Boolean(score.isCorrect);
          updatedQuestionIds.add(score.questionId.toString());

          if (resultQuestion.isCorrect) {
            totalCorrect++;
          }
        }
      }

      // Count correct answers from non-updated questions too
      for (const item of result.results) {
        if (!updatedQuestionIds.has(item.questionId.toString()) && item.isCorrect) {
          totalCorrect++;
        }
      }

      // Update total score and percentage
      result.totalScore = totalCorrect;
      result.percentageScore = (result.results.length > 0) ?
        (totalCorrect / result.results.length) * 100 : 0;
      result.scoreAssignedTime = new Date();

      // Save the result in one operation
      await result.save();

      // Update student's competition record with the score
      try {
        await Student.findOneAndUpdate(
          {
            _id: submission.studentId,
            'competitions.competitionId': submission.competitionId
          },
          {
            $set: {
              'competitions.$.score': totalCorrect,
              'competitions.$.completed': true,
              'competitions.$.completedAt': new Date()
            }
          }
        );
      } catch (updateError) {
        // If student doesn't have this competition in their array yet, add it
        await Student.findByIdAndUpdate(
          submission.studentId,
          {
            $push: {
              competitions: {
                competitionId: submission.competitionId,
                score: totalCorrect,
                completed: true,
                completedAt: new Date()
              }
            }
          }
        );
      }

      // Get student information for better logging and response
      const student = await Student.findById(submission.studentId)
        .select('studentFirstName studentLastName studentEmail');

      // Log the action
      console.log(`[${CURRENT_DATE_TIME}] Admin ${CURRENT_USER} graded submission (ID: ${submissionId}) for competition: ${competition.competitionName}, student: ${student ? student.studentEmail : submission.studentId}, score: ${totalCorrect}/${result.results.length}`);

      res.status(200).json({
        success: true,
        message: 'Submission graded successfully',
        data: {
          submissionId: submission._id, // Added submission ID
          resultId: result._id,
          studentInfo: student ? {
            id: student._id,
            name: `${student.studentFirstName} ${student.studentLastName}`,
            email: student.studentEmail
          } : { id: submission.studentId },
          competitionInfo: {
            id: competition._id,
            name: competition.competitionName,
            type: competition.competitionType
          },
          totalScore: totalCorrect,
          totalQuestions: result.results.length,
          percentageScore: result.percentageScore.toFixed(2),
          gradedAt: result.scoreAssignedTime,
          gradedQuestions: questionScores.length
        }
      });
    } catch (error) {
      console.error('Error in gradeTextOrCodeSubmission:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to grade submission',
        error: error.message
      });
    }
  },

  // Get result details for a specific submission
  getResultDetails: async (req, res) => {
    try {
      const { resultId } = req.params;
      const { submissionId } = req.params; // Get submissionId from query parameters

      const Result = require('../models/result');

      // Find result by resultId or by submissionId
      let result;
      if (submissionId) {
        // If submissionId is provided, search by submissionId field
        result = await Result.findOne({ submissionId: submissionId });
        if (!result) {
          // Try to find by resultId as fallback
          result = await Result.findById(resultId);
        }
      } else {
        // If no submissionId, use standard resultId search
        result = await Result.findById(resultId);
      }

      if (!result) {
        return res.status(404).json({
          success: false,
          message: 'Result not found'
        });
      }

      // Get competition and student details
      const competition = await Competition.findById(result.competitionId);
      const student = await Student.findById(result.studentId)
        .select('studentFirstName studentLastName studentEmail grade school');

      if (!competition || !student) {
        return res.status(404).json({
          success: false,
          message: 'Associated competition or student not found'
        });
      }

      // Format detailed question and answer data
      const questionDetails = await Promise.all(result.results.map(async (item) => {
        // Find the original question
        const originalQuestion = competition.questions.find(
          q => q._id.toString() === item.questionId.toString()
        );

        return {
          questionId: item.questionId,
          questionType: item.questionType,
          questionText: originalQuestion ? originalQuestion.questionText : 'Question not found',
          studentAnswer: item.studentAnswer,
          correctAnswer: item.correctAnswer,
          isCorrect: item.isCorrect,
          options: originalQuestion && originalQuestion.options ? originalQuestion.options : [],
        };
      }));

      // Log the action
      console.log(`[${CURRENT_DATE_TIME}] Admin ${CURRENT_USER} viewed result details (ID: ${result._id}) for student: ${student.studentEmail}`);

      res.status(200).json({
        success: true,
        data: {
          result: {
            _id: result._id,
            submissionId: result.submissionId,
            totalScore: result.totalScore,
            percentageScore: result.percentageScore,
            scoreAssignedTime: result.scoreAssignedTime,
            createdAt: result.createdAt,
            updatedAt: result.updatedAt
          },
          competition: {
            _id: competition._id,
            name: competition.competitionName,
            type: competition.competitionType,
            totalQuestions: competition.questions.length
          },
          student: {
            _id: student._id,
            name: `${student.studentFirstName} ${student.studentLastName}`,
            email: student.studentEmail,
            grade: student.grade || 'N/A',
            school: student.school || 'N/A'
          },
          questionDetails
        }
      });
    } catch (error) {
      console.error('Error in getResultDetails:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve result details',
        error: error.message
      });
    }
  },

  // Get results for all submissions in a competition
  getCompetitionResults: async (req, res) => {
    try {
      const { id } = req.params; // Competition ID
      const Result = require('../models/result');

      // Verify competition exists
      const competition = await Competition.findById(id);
      if (!competition) {
        return res.status(404).json({
          success: false,
          message: 'Competition not found'
        });
      }

      // Find all results for this competition
      const results = await Result.find({ competitionId: id });

      // Get detailed information for each result
      const detailedResults = await Promise.all(
        results.map(async (result) => {
          // Get student information
          const student = await Student.findById(result.studentId)
            .select('studentFirstName studentLastName studentEmail grade school');

          return {
            resultId: result._id,
            scoreAssignedTime: result.scoreAssignedTime,
            student: student ? {
              id: student._id,
              name: `${student.studentFirstName} ${student.studentLastName}`,
              email: student.studentEmail,
              grade: student.grade || 'N/A',
              school: student.school || 'N/A'
            } : { name: 'Unknown Student' },
            totalScore: result.totalScore,
            percentageScore: result.percentageScore.toFixed(2),
            questionsCount: result.results.length,
            correctAnswers: result.results.filter(r => r.isCorrect).length
          };
        })
      );

      // Sort results by score (descending)
      detailedResults.sort((a, b) => b.totalScore - a.totalScore);

      // Get top performers
      const topPerformers = detailedResults.slice(0, 3);

      // Log the action
      console.log(`[${CURRENT_DATE_TIME}] Admin ${CURRENT_USER} viewed results for competition: ${competition.competitionName} (ID: ${competition._id})`);

      res.status(200).json({
        success: true,
        data: {
          competition: {
            id: competition._id,
            name: competition.competitionName,
            type: competition.competitionType
          },
          topPerformers,
          allResults: detailedResults,
          stats: {
            totalParticipants: detailedResults.length,
            averageScore: detailedResults.length > 0
              ? (detailedResults.reduce((sum, r) => sum + r.totalScore, 0) / detailedResults.length).toFixed(2)
              : 0
          }
        }
      });
    } catch (error) {
      console.error('Error in getCompetitionResults:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve competition results',
        error: error.message
      });
    }
  },

  // Feedback management controllers

  // Get all feedback with filtering and pagination
  getAllFeedback: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;

      // Prepare filter based on query parameters
      const filter = {};

      if (req.query.type) {
        filter.feedbackType = req.query.type;
      }

      if (req.query.search) {
        filter.$or = [
          { name: { $regex: req.query.search, $options: 'i' } },
          { email: { $regex: req.query.search, $options: 'i' } },
          { feedback: { $regex: req.query.search, $options: 'i' } }
        ];
      }

      if (req.query.source) {
        filter.source = req.query.source;
      }

      // Rating filter
      if (req.query.minRating) {
        filter.ratingGeneral = { $gte: parseInt(req.query.minRating) };
      }

      // Date range filter
      if (req.query.startDate && req.query.endDate) {
        filter.createdAt = {
          $gte: new Date(req.query.startDate),
          $lte: new Date(req.query.endDate)
        };
      }

      // Count total feedback matching filter
      const totalFeedback = await Feedback.countDocuments(filter);

      // Get feedback with pagination
      const feedbackList = await Feedback.find(filter)
        .sort({ createdAt: -1 }) // Sort by newest first
        .skip(skip)
        .limit(limit);

      // Log the action
      console.log(`[${CURRENT_DATE_TIME}] Admin ${CURRENT_USER} viewed feedback list`);

      res.status(200).json({
        success: true,
        data: {
          feedback: feedbackList,
          pagination: {
            total: totalFeedback,
            page,
            pages: Math.ceil(totalFeedback / limit),
            limit
          }
        }
      });
    } catch (error) {
      console.error("Error in getAllFeedback:", error);
      res.status(500).json({
        success: false,
        message: "Failed to retrieve feedback",
        error: error.message
      });
    }
  },

  // Get single feedback by ID
  getFeedbackById: async (req, res) => {
    try {
      const { id } = req.params;

      const feedback = await Feedback.findById(id);

      if (!feedback) {
        return res.status(404).json({
          success: false,
          message: "Feedback not found"
        });
      }

      // Log the action
      console.log(`[${CURRENT_DATE_TIME}] Admin ${CURRENT_USER} viewed feedback ID: ${id}`);

      res.status(200).json({
        success: true,
        data: { feedback }
      });
    } catch (error) {
      console.error("Error in getFeedbackById:", error);
      res.status(500).json({
        success: false,
        message: "Failed to retrieve feedback details",
        error: error.message
      });
    }
  },

  // Create new feedback (for users, not only admin)
  createFeedback: async (req, res) => {
    try {
      const {
        name,
        email,
        feedback,
        feedbackType,
        source,
        ratingGeneral,
        ratingEase,
        ratingSupport,
        specificFeatures,
        contactConsent,
        occupation
      } = req.body;

      // Validate required fields
      if (!name || !email || !feedback) {
        return res.status(400).json({
          success: false,
          message: "Missing required fields"
        });
      }

      // Validate email format
      if (!validateEmail(email)) {
        return res.status(400).json({
          success: false,
          message: "Invalid email format"
        });
      }

      // Create new feedback
      const newFeedback = new Feedback({
        name,
        email,
        feedback,
        feedbackType: feedbackType || 'general',
        source: source || 'website',
        ratingGeneral: ratingGeneral || 0,
        ratingEase: ratingEase || 0,
        ratingSupport: ratingSupport || 0,
        specificFeatures: specificFeatures || [],
        contactConsent: contactConsent || false,
        occupation: occupation || '',
        submittedAt: new Date()
      });

      await newFeedback.save();

      // Log the action (using source IP for non-logged in users)
      const sourceIP = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
      console.log(`[${new Date().toISOString()}] New feedback submitted by ${name} (${email}) from IP: ${sourceIP}`);

      res.status(201).json({
        success: true,
        message: "Feedback submitted successfully",
        data: { 
          feedbackId: newFeedback._id,
          reference: `FDB-${Math.floor(Math.random() * 90000) + 10000}-${new Date().getFullYear().toString().substring(2)}`
        }
      });
    } catch (error) {
      console.error("Error in createFeedback:", error);
      res.status(500).json({
        success: false,
        message: "Failed to submit feedback",
        error: error.message
      });
    }
  },

  // Delete feedback
  deleteFeedback: async (req, res) => {
    try {
      const { id } = req.params;

      // Check if feedback exists
      const feedback = await Feedback.findById(id);
      if (!feedback) {
        return res.status(404).json({
          success: false,
          message: "Feedback not found"
        });
      }

      // Store feedback info for logging
      const feedbackEmail = feedback.email;
      const feedbackType = feedback.feedbackType;

      // Delete feedback
      await Feedback.findByIdAndDelete(id);

      // Log the action
      console.log(`[${CURRENT_DATE_TIME}] Admin ${CURRENT_USER} deleted feedback from ${feedbackEmail} (Type: ${feedbackType})`);

      res.status(200).json({
        success: true,
        message: "Feedback deleted successfully"
      });
    } catch (error) {
      console.error("Error in deleteFeedback:", error);
      res.status(500).json({
        success: false,
        message: "Failed to delete feedback",
        error: error.message
      });
    }
  },

  // Get feedback statistics and metrics
  getFeedbackStats: async (req, res) => {
    try {
      // Get total count
      const totalFeedback = await Feedback.countDocuments();

      // Get counts by type
      const typeStats = await Feedback.aggregate([
        { $group: { _id: "$feedbackType", count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]);

      // Get counts by source
      const sourceStats = await Feedback.aggregate([
        { $group: { _id: "$source", count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]);

      // Get average ratings
      const ratingStats = await Feedback.aggregate([
        {
          $group: {
            _id: null,
            avgGeneralRating: { $avg: "$ratingGeneral" },
            avgEaseRating: { $avg: "$ratingEase" },
            avgSupportRating: { $avg: "$ratingSupport" },
            totalRated: { $sum: { $cond: [{ $gt: ["$ratingGeneral", 0] }, 1, 0] } }
          }
        }
      ]);

      // Get top mentioned features
      const featureStats = await Feedback.aggregate([
        { $unwind: "$specificFeatures" },
        { $group: { _id: "$specificFeatures", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 5 }
      ]);

      // Get recent feedback trends (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const trendData = await Feedback.aggregate([
        { 
          $match: { 
            submittedAt: { $gte: thirtyDaysAgo } 
          } 
        },
        {
          $group: {
            _id: { 
              $dateToString: { format: "%Y-%m-%d", date: "$submittedAt" } 
            },
            count: { $sum: 1 },
            avgRating: { $avg: "$ratingGeneral" }
          }
        },
        { $sort: { _id: 1 } }
      ]);

      // Log the action
      console.log(`[${CURRENT_DATE_TIME}] Admin ${CURRENT_USER} viewed feedback statistics`);

      res.status(200).json({
        success: true,
        data: {
          totalFeedback,
          typeBreakdown: typeStats,
          sourceBreakdown: sourceStats,
          ratings: ratingStats.length > 0 ? {
            general: ratingStats[0].avgGeneralRating.toFixed(1),
            ease: ratingStats[0].avgEaseRating.toFixed(1),
            support: ratingStats[0].avgSupportRating.toFixed(1),
            totalRated: ratingStats[0].totalRated
          } : {
            general: 0,
            ease: 0,
            support: 0,
            totalRated: 0
          },
          topFeatures: featureStats,
          recentTrends: trendData
        }
      });
    } catch (error) {
      console.error("Error in getFeedbackStats:", error);
      res.status(500).json({
        success: false,
        message: "Failed to retrieve feedback statistics",
        error: error.message
      });
    }
  },

  // Mark feedback as reviewed
  updateFeedbackStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const { status, adminNotes } = req.body;

      // Find feedback
      const feedback = await Feedback.findById(id);
      if (!feedback) {
        return res.status(404).json({
          success: false,
          message: "Feedback not found"
        });
      }

      // Update status
      feedback.status = status || feedback.status;
      
      // Add admin notes if provided
      if (adminNotes) {
        feedback.adminNotes = adminNotes;
      }
      
      // Update review information
      feedback.reviewedBy = req.admin._id;
      feedback.reviewedAt = new Date();

      await feedback.save();

      // Log the action
      console.log(`[${CURRENT_DATE_TIME}] Admin ${CURRENT_USER} updated feedback status to ${status} for ID: ${id}`);

      res.status(200).json({
        success: true,
        message: "Feedback status updated successfully",
        data: {
          feedbackId: feedback._id,
          status: feedback.status,
          reviewedAt: feedback.reviewedAt
        }
      });
    } catch (error) {
      console.error("Error in updateFeedbackStatus:", error);
      res.status(500).json({
        success: false,
        message: "Failed to update feedback status",
        error: error.message
      });
    }
  }

  // Other admin functionalities can be added here
};

module.exports = adminDashboardController;