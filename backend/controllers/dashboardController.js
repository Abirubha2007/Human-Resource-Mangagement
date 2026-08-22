const db = require('../config/database');

const dashboardController = {
  getAdminSummary: async (req, res, next) => {
    const today = new Date().toISOString().split('T')[0];

    try {
      // 1. Total Employees
      const empCountRes = await db.query("SELECT COUNT(*) FROM employees WHERE status = 'Active'");
      const totalEmployees = parseInt(empCountRes.rows[0].count) || 0;

      // 2. Present Today (Present + Late)
      const presentRes = await db.query(
        "SELECT COUNT(*) FROM attendance WHERE date = ? AND status IN ('Present', 'Late')",
        [today]
      );
      const presentToday = parseInt(presentRes.rows[0].count) || 0;

      // 3. Employees on Leave Today
      const leaveRes = await db.query(
        "SELECT COUNT(*) FROM attendance WHERE date = ? AND status = 'On Leave'",
        [today]
      );
      const employeesOnLeave = parseInt(leaveRes.rows[0].count) || 0;

      // 4. Pending Leave Requests
      const pendingRes = await db.query(
        "SELECT COUNT(*) FROM leave_requests WHERE status = 'Pending'"
      );
      const pendingRequests = parseInt(pendingRes.rows[0].count) || 0;

      // 5. Payroll Summary
      const payrollRes = await db.query(
        "SELECT SUM(net_salary) as total_net, AVG(basic_salary) as avg_basic FROM payroll WHERE payout_month = 'August 2026'"
      );
      const totalPayroll = Number(payrollRes.rows[0].total_net) || 0;
      const avgBasic = Number(payrollRes.rows[0].avg_basic) || 0;

      // 6. Department Distribution
      const deptDistRes = await db.query(
        `SELECT d.name, COALESCE(e.count, 0) as value
         FROM departments d
         LEFT JOIN (
           SELECT department, COUNT(*) as count 
           FROM employees 
           GROUP BY department
         ) e ON d.name = e.department`
      );
      const departmentDistribution = deptDistRes.rows.map(r => ({
        name: r.name,
        value: parseInt(r.value)
      }));

      // 7. Recent Leave Requests (max 5)
      const recentLeavesRes = await db.query(
        `SELECT lr.*, (e.first_name || ' ' || e.last_name) as employee_name
         FROM leave_requests lr
         JOIN employees e ON lr.employee_id = e.id
         ORDER BY lr.applied_on DESC, lr.id DESC LIMIT 5`
      );
      const recentLeaves = recentLeavesRes.rows.map(r => ({
        id: r.id,
        employeeId: r.employee_id,
        employeeName: r.employee_name,
        leaveType: r.leave_type,
        startDate: new Date(r.start_date).toISOString().split('T')[0],
        endDate: new Date(r.end_date).toISOString().split('T')[0],
        reason: r.reason,
        status: r.status,
        appliedOn: new Date(r.applied_on).toISOString().split('T')[0]
      }));

      res.status(200).json({
        success: true,
        data: {
          metrics: {
            totalEmployees,
            presentToday,
            employeesOnLeave,
            pendingRequests,
            payrollSummary: {
              totalPayroll,
              avgBasic
            }
          },
          departmentDistribution,
          recentLeaves
        }
      });
    } catch (error) {
      next(error);
    }
  },

  getEmployeeSummary: async (req, res, next) => {
    const employeeId = req.user.employeeId;
    const today = new Date().toISOString().split('T')[0];

    try {
      // 1. Today's Attendance
      const attRes = await db.query(
        'SELECT * FROM attendance WHERE employee_id = ? AND date = ?',
        [employeeId, today]
      );
      const todayAttendance = attRes.rows[0] ? {
        checkIn: attRes.rows[0].check_in || '',
        checkOut: attRes.rows[0].check_out || '',
        workingHours: attRes.rows[0].working_hours || '0 hrs',
        status: attRes.rows[0].status
      } : {
        checkIn: '',
        checkOut: '',
        workingHours: '0 hrs',
        status: 'Absent'
      };

      // 2. Working Hours summary (total present days, average hours)
      const hoursRes = await db.query(
        `SELECT 
           COUNT(*) as days,
           COALESCE(SUM(CAST(SPLIT_PART(working_hours, ' ', 1) AS NUMERIC)), 0) as total_hours
         FROM attendance 
         WHERE employee_id = ? AND status IN ('Present', 'Late')`,
        [employeeId]
      );
      const workingHours = {
        totalDays: parseInt(hoursRes.rows[0].days) || 0,
        totalHours: (parseFloat(hoursRes.rows[0].total_hours) || 0).toFixed(1) + ' hrs'
      };

      // 3. Leave Information
      const balRes = await db.query(
        'SELECT * FROM leave_balances WHERE employee_id = ?',
        [employeeId]
      );
      const leaveInformation = balRes.rows[0] ? {
        annual: { total: balRes.rows[0].annual_total, used: balRes.rows[0].annual_used, remaining: balRes.rows[0].annual_remaining },
        sick: { total: balRes.rows[0].sick_total, used: balRes.rows[0].sick_used, remaining: balRes.rows[0].sick_remaining },
        unpaid: { total: balRes.rows[0].unpaid_total, used: balRes.rows[0].unpaid_used, remaining: balRes.rows[0].unpaid_remaining }
      } : {
        annual: { total: 18, used: 0, remaining: 18 },
        sick: { total: 12, used: 0, remaining: 12 },
        unpaid: { total: 10, used: 0, remaining: 10 }
      };

      // 4. Payroll summary
      const payRes = await db.query(
        `SELECT * FROM payroll 
         WHERE employee_id = ? AND status = 'Processed' 
         ORDER BY payout_month DESC LIMIT 1`,
        [employeeId]
      );
      const payrollSummary = payRes.rows[0] ? {
        basicSalary: Number(payRes.rows[0].basic_salary),
        allowances: Number(payRes.rows[0].allowances),
        deductions: Number(payRes.rows[0].deductions),
        netSalary: Number(payRes.rows[0].net_salary),
        payoutMonth: payRes.rows[0].payout_month
      } : null;

      res.status(200).json({
        success: true,
        data: {
          todayAttendance,
          workingHours,
          leaveInformation,
          payrollSummary
        }
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = dashboardController;
