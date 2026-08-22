-- Dayflow HRMS PostgreSQL Database Seed Data

-- 1. Insert Departments
INSERT INTO departments (id, name, head, status, budget) VALUES
('DEP-01', 'Engineering', 'Michael Brown', 'Active', '₹15,00,000'),
('DEP-02', 'Marketing', 'Emily Davis', 'Active', '₹5,00,000'),
('DEP-03', 'Sales', 'David Wilson', 'Active', '₹7,50,000'),
('DEP-04', 'Human Resources', 'John Doe', 'Active', '₹3,00,000'),
('DEP-05', 'Finance', 'Jessica Taylor', 'Active', '₹2,50,000');

-- 2. Insert Users (Authentications)
-- Passwords:
-- admin@dayflow.com -> admin123
-- employee@dayflow.com -> employee123
-- All others -> password123
INSERT INTO users (id, email, password_hash, role) VALUES
(1, 'admin@dayflow.com', '$2a$10$BiTzWitCIT69c4Wd73cQ4.Io2E7IF59k4CGQOGUID4SqRC4U13xwW', 'admin'),
(2, 'employee@dayflow.com', '$2a$10$oNC1Oo6aoXZL17HCWLX9YupkM8W3JktGARYo9GJMgsaRwdthBP06K', 'employee'),
(3, 'michael.b@dayflow.com', '$2a$10$I4vdAgeobtfOuCNEBmV/LuqzRV/SfeVKaJ1N4yEvk4Ek7ODoBbgLq', 'employee'),
(4, 'emily.d@dayflow.com', '$2a$10$I4vdAgeobtfOuCNEBmV/LuqzRV/SfeVKaJ1N4yEvk4Ek7ODoBbgLq', 'employee'),
(5, 'david.w@dayflow.com', '$2a$10$I4vdAgeobtfOuCNEBmV/LuqzRV/SfeVKaJ1N4yEvk4Ek7ODoBbgLq', 'employee'),
(6, 'jessica.t@dayflow.com', '$2a$10$I4vdAgeobtfOuCNEBmV/LuqzRV/SfeVKaJ1N4yEvk4Ek7ODoBbgLq', 'employee'),
(7, 'daniel.m@dayflow.com', '$2a$10$I4vdAgeobtfOuCNEBmV/LuqzRV/SfeVKaJ1N4yEvk4Ek7ODoBbgLq', 'employee'),
(8, 'james.t@dayflow.com', '$2a$10$I4vdAgeobtfOuCNEBmV/LuqzRV/SfeVKaJ1N4yEvk4Ek7ODoBbgLq', 'employee');

-- Adjust the sequence for users table after seeding ids
SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));

-- 3. Insert Employees
INSERT INTO employees (id, user_id, first_name, last_name, email, phone, address, department, job_title, joining_date, status, role, avatar, basic_salary, allowances, deductions, net_salary) VALUES
('EMP-2026-001', 1, 'John', 'Doe', 'admin@dayflow.com', '+91 98765 43210', '102, Skyline Towers, Sector 62, Noida, UP, India', 'Human Resources', 'HR Director', '2023-01-15', 'Active', 'admin', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop', 120000.00, 30000.00, 10000.00, 140000.00),
('EMP-2026-002', 2, 'Sarah', 'Johnson', 'employee@dayflow.com', '+91 98765 43211', '405, Green Meadows Apt, Outer Ring Road, Bengaluru, Karnataka, India', 'Engineering', 'Senior Frontend Engineer', '2024-05-10', 'Active', 'employee', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=256&auto=format&fit=crop', 150000.00, 35000.00, 15000.00, 170000.00),
('EMP-2026-003', 3, 'Michael', 'Brown', 'michael.b@dayflow.com', '+91 98765 43212', '12, Rosewood Lane, Koramangala, Bengaluru, India', 'Engineering', 'Backend Tech Lead', '2022-09-01', 'Active', 'employee', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=256&auto=format&fit=crop', 180000.00, 40000.00, 20000.00, 200000.00),
('EMP-2026-004', 4, 'Emily', 'Davis', 'emily.d@dayflow.com', '+91 98765 43213', '7B, Magnolia Apartments, Bandra West, Mumbai, India', 'Marketing', 'Growth Marketing Lead', '2024-02-18', 'Active', 'employee', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=256&auto=format&fit=crop', 95000.00, 20000.00, 8000.00, 107000.00),
('EMP-2026-005', 5, 'David', 'Wilson', 'david.w@dayflow.com', '+91 98765 43214', '88, Palm Tree Lane, Jayanagar, Bengaluru, India', 'Sales', 'Enterprise Account Executive', '2023-11-01', 'Active', 'employee', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=256&auto=format&fit=crop', 80000.00, 50000.00, 10000.00, 120000.00),
('EMP-2026-006', 6, 'Jessica', 'Taylor', 'jessica.t@dayflow.com', '+91 98765 43215', '15/3, Alpine Valley Road, Pune, Maharashtra, India', 'Finance', 'Senior Finance Analyst', '2024-07-01', 'Active', 'employee', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=256&auto=format&fit=crop', 110000.00, 25000.00, 10000.00, 125000.00),
('EMP-2026-007', 7, 'Daniel', 'Martinez', 'daniel.m@dayflow.com', '+91 98765 43216', 'Flat 203, Serene Heights, Gachibowli, Hyderabad, India', 'Engineering', 'QA Engineer', '2025-01-10', 'Active', 'employee', 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=256&auto=format&fit=crop', 75000.00, 15000.00, 6000.00, 84000.00),
('EMP-2026-008', 8, 'James', 'Thomas', 'james.t@dayflow.com', '+91 98765 43217', '56-C, Pearl Enclave, OMR, Chennai, Tamil Nadu, India', 'Human Resources', 'HR Specialist', '2024-10-15', 'Active', 'employee', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=256&auto=format&fit=crop', 70000.00, 15000.00, 5000.00, 80000.00);

-- 4. Insert Leave Balances
INSERT INTO leave_balances (employee_id, annual_total, annual_used, annual_remaining, sick_total, sick_used, sick_remaining, unpaid_total, unpaid_used, unpaid_remaining) VALUES
('EMP-2026-001', 18, 0, 18, 12, 0, 12, 10, 0, 10),
('EMP-2026-002', 18, 4, 14, 12, 4, 8, 10, 2, 8),
('EMP-2026-003', 18, 6, 12, 12, 2, 10, 10, 0, 10),
('EMP-2026-004', 18, 5, 13, 12, 1, 11, 10, 0, 10),
('EMP-2026-005', 18, 0, 18, 12, 0, 12, 10, 0, 10),
('EMP-2026-006', 18, 0, 18, 12, 0, 12, 10, 0, 10),
('EMP-2026-007', 18, 0, 18, 12, 0, 12, 10, 0, 10),
('EMP-2026-008', 18, 0, 18, 12, 0, 12, 10, 0, 10);

-- 5. Insert Attendance Records (Historical + Today)
INSERT INTO attendance (date, employee_id, check_in, check_out, working_hours, status) VALUES
-- Today (2026-08-22)
('2026-08-22', 'EMP-2026-002', '08:50 AM', '', '2.5 hrs', 'Present'),
('2026-08-22', 'EMP-2026-003', '09:15 AM', '', '2.1 hrs', 'Late'),
('2026-08-22', 'EMP-2026-004', '', '', '0 hrs', 'On Leave'),
('2026-08-22', 'EMP-2026-005', '08:45 AM', '', '2.6 hrs', 'Present'),
('2026-08-22', 'EMP-2026-006', '', '', '0 hrs', 'Absent'),

-- Yesterday (2026-08-21)
('2026-08-21', 'EMP-2026-002', '08:55 AM', '05:30 PM', '8.5 hrs', 'Present'),
('2026-08-21', 'EMP-2026-003', '09:05 AM', '06:00 PM', '8.9 hrs', 'Present'),
('2026-08-21', 'EMP-2026-004', '', '', '0 hrs', 'On Leave'),
('2026-08-21', 'EMP-2026-005', '08:50 AM', '05:15 PM', '8.4 hrs', 'Present'),
('2026-08-21', 'EMP-2026-006', '09:20 AM', '05:00 PM', '7.6 hrs', 'Late'),

-- Day Before Yesterday (2026-08-20)
('2026-08-20', 'EMP-2026-002', '09:02 AM', '06:12 PM', '9.1 hrs', 'Present'),
('2026-08-20', 'EMP-2026-003', '08:58 AM', '05:45 PM', '8.7 hrs', 'Present'),
('2026-08-20', 'EMP-2026-004', '09:12 AM', '05:05 PM', '7.8 hrs', 'Late'),
('2026-08-20', 'EMP-2026-005', '08:48 AM', '05:30 PM', '8.7 hrs', 'Present'),
('2026-08-20', 'EMP-2026-006', '08:50 AM', '05:40 PM', '8.8 hrs', 'Present');

-- 6. Insert Leave Requests
INSERT INTO leave_requests (employee_id, leave_type, start_date, end_date, reason, status, applied_on) VALUES
('EMP-2026-002', 'Annual Leave', '2026-08-25', '2026-08-28', 'Family trip to Shimla', 'Pending', '2026-08-20'),
('EMP-2026-003', 'Sick Leave', '2026-08-18', '2026-08-19', 'High fever and flu symptoms', 'Approved', '2026-08-17'),
('EMP-2026-004', 'Annual Leave', '2026-08-22', '2026-08-26', 'Personal work / relocation planning', 'Approved', '2026-08-15'),
('EMP-2026-005', 'Unpaid Leave', '2026-09-01', '2026-09-05', 'Exam preparation', 'Pending', '2026-08-21'),
('EMP-2026-006', 'Sick Leave', '2026-08-10', '2026-08-10', 'Dental appointment', 'Rejected', '2026-08-09');

-- 7. Insert Payroll Records
INSERT INTO payroll (employee_id, basic_salary, allowances, deductions, net_salary, status, payout_month, processed_date) VALUES
('EMP-2026-001', 120000.00, 30000.00, 10000.00, 140000.00, 'Processed', 'August 2026', '2026-08-20'),
('EMP-2026-002', 150000.00, 35000.00, 15000.00, 170000.00, 'Processed', 'August 2026', '2026-08-20'),
('EMP-2026-003', 180000.00, 40000.00, 20000.00, 200000.00, 'Processed', 'August 2026', '2026-08-20'),
('EMP-2026-004', 95000.00, 20000.00, 8000.00, 107000.00, 'Processed', 'August 2026', '2026-08-20'),
('EMP-2026-005', 80000.00, 50000.00, 10000.00, 120000.00, 'Pending', 'August 2026', '-'),
('EMP-2026-006', 110000.00, 25000.00, 10000.00, 125000.00, 'Processed', 'August 2026', '2026-08-20');
