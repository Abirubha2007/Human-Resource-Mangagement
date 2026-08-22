SET FOREIGN_KEY_CHECKS = 0;
-- Dayflow HRMS PostgreSQL Database Schema

-- Drop existing tables if they exist (clean setup)
DROP TABLE IF EXISTS payroll ;
DROP TABLE IF EXISTS leave_balances ;
DROP TABLE IF EXISTS leave_requests ;
DROP TABLE IF EXISTS attendance ;
DROP TABLE IF EXISTS employees ;
DROP TABLE IF EXISTS users ;
DROP TABLE IF EXISTS departments ;

-- 1. Departments Table
CREATE TABLE departments (
    id VARCHAR(50) PRIMARY KEY, -- e.g., 'DEP-01'
    name VARCHAR(100) UNIQUE NOT NULL,
    head VARCHAR(100) DEFAULT 'TBD',
    status VARCHAR(50) DEFAULT 'Active',
    budget VARCHAR(50) DEFAULT '₹0',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Users Table (Authentication Credentials)
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'hr', 'employee')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Employees Table
CREATE TABLE employees (
    id VARCHAR(50) PRIMARY KEY, -- e.g., 'EMP-2026-001'
    user_id INTEGER UNIQUE REFERENCES users(id) ON DELETE SET NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(50),
    address TEXT,
    department VARCHAR(100) REFERENCES departments(name) ON UPDATE CASCADE ON DELETE SET NULL,
    job_title VARCHAR(100),
    joining_date DATE DEFAULT (CURRENT_DATE),
    status VARCHAR(50) DEFAULT 'Active',
    role VARCHAR(50) DEFAULT 'employee',
    avatar VARCHAR(500),
    basic_salary NUMERIC(12,2) DEFAULT 50000.00,
    allowances NUMERIC(12,2) DEFAULT 10000.00,
    deductions NUMERIC(12,2) DEFAULT 5000.00,
    net_salary NUMERIC(12,2) DEFAULT 55000.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Attendance Table
CREATE TABLE attendance (
    id INT AUTO_INCREMENT PRIMARY KEY,
    date DATE NOT NULL DEFAULT (CURRENT_DATE),
    employee_id VARCHAR(50) NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    check_in VARCHAR(20), -- e.g., "08:50 AM"
    check_out VARCHAR(20), -- e.g., "05:30 PM"
    working_hours VARCHAR(50) DEFAULT '0 hrs', -- e.g., "8.5 hrs"
    status VARCHAR(50) DEFAULT 'Present' CHECK (status IN ('Present', 'Absent', 'Late', 'On Leave')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_employee_date UNIQUE (employee_id, date)
);

-- 5. Leave Requests Table
CREATE TABLE leave_requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id VARCHAR(50) NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    leave_type VARCHAR(100) NOT NULL CHECK (leave_type IN ('Annual Leave', 'Sick Leave', 'Unpaid Leave')),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    reason TEXT,
    status VARCHAR(50) DEFAULT 'Pending' CHECK (status IN ('Pending', 'Approved', 'Rejected')),
    applied_on DATE DEFAULT (CURRENT_DATE),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. Leave Balances Table
CREATE TABLE leave_balances (
    employee_id VARCHAR(50) PRIMARY KEY REFERENCES employees(id) ON DELETE CASCADE,
    annual_total INT DEFAULT 18,
    annual_used INT DEFAULT 0,
    annual_remaining INT DEFAULT 18,
    sick_total INT DEFAULT 12,
    sick_used INT DEFAULT 0,
    sick_remaining INT DEFAULT 12,
    unpaid_total INT DEFAULT 10,
    unpaid_used INT DEFAULT 0,
    unpaid_remaining INT DEFAULT 10,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. Payroll Table
CREATE TABLE payroll (
    id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id VARCHAR(50) NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    basic_salary NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    allowances NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    deductions NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    net_salary NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    status VARCHAR(50) DEFAULT 'Pending' CHECK (status IN ('Pending', 'Processed')),
    payout_month VARCHAR(50) NOT NULL, -- e.g. "August 2026"
    processed_date VARCHAR(50) DEFAULT '-',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance and rapid searches
CREATE INDEX idx_employees_department ON employees(department);
CREATE INDEX idx_attendance_date ON attendance(date);
CREATE INDEX idx_attendance_employee ON attendance(employee_id);
CREATE INDEX idx_leave_requests_employee ON leave_requests(employee_id);
CREATE INDEX idx_payroll_employee ON payroll(employee_id);

SET FOREIGN_KEY_CHECKS = 1;
