# Dayflow HRMS API Documentation

Base URL: `http://localhost:5000/api`

---

## 1. Authentication APIs

### Register a User
* **Method**: `POST`
* **Endpoint**: `/auth/register`
* **Authentication**: None
* **Request Body**:
```json
{
  "employeeId": "EMP-2026-025",
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@dayflow.com",
  "password": "password123",
  "role": "employee"
}
```
* **Success Response (201 Created)**:
```json
{
  "success": true,
  "message": "Account created successfully!"
}
```
* **Error Response (409 Conflict / 400 Bad Request)**:
```json
{
  "success": false,
  "message": "Operation failed",
  "error": "Email already registered."
}
```

---

### Login
* **Method**: `POST`
* **Endpoint**: `/auth/login`
* **Authentication**: None
* **Request Body**:
```json
{
  "email": "admin@dayflow.com",
  "password": "admin123"
}
```
* **Success Response (200 OK)**:
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "EMP-2026-001",
      "firstName": "John",
      "lastName": "Doe",
      "email": "admin@dayflow.com",
      "phone": "+91 98765 43210",
      "address": "102, Skyline Towers...",
      "department": "Human Resources",
      "jobTitle": "HR Director",
      "joiningDate": "2023-01-15",
      "status": "Active",
      "role": "admin",
      "avatar": "https://...",
      "salaryDetails": {
        "basicSalary": 120000,
        "allowances": 30000,
        "deductions": 10000,
        "netSalary": 140000
      }
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```
* **Error Response (401 Unauthorized)**:
```json
{
  "success": false,
  "message": "Authentication failed",
  "error": "Invalid email address or password."
}
```

---

### Get Current User Profile
* **Method**: `GET`
* **Endpoint**: `/auth/me`
* **Authentication**: Bearer Token
* **Success Response (200 OK)**:
```json
{
  "success": true,
  "message": "Profile retrieved successfully",
  "data": {
    "user": { ... }
  }
}
```

---

## 2. Employee APIs

### Get All Employees
* **Method**: `GET`
* **Endpoint**: `/employees`
* **Authentication**: Bearer Token
* **Role Requirements**: `admin` or `hr`
* **Query Params**: `search`, `department`, `status`, `page`, `limit`
* **Success Response (200 OK)**:
```json
{
  "success": true,
  "message": "Employees retrieved successfully",
  "data": {
    "employees": [ ... ],
    "pagination": {
      "totalItems": 8,
      "totalPages": 1,
      "currentPage": 1,
      "limit": 10
    }
  }
}
```

---

### Get Employee by ID
* **Method**: `GET`
* **Endpoint**: `/employees/:id`
* **Authentication**: Bearer Token
* **Role Requirements**: `admin`, `hr`, or the owner Employee
* **Success Response (200 OK)**:
```json
{
  "success": true,
  "message": "Employee retrieved successfully",
  "data": { ... }
}
```

---

### Create Employee
* **Method**: `POST`
* **Endpoint**: `/employees`
* **Authentication**: Bearer Token
* **Role Requirements**: `admin` or `hr`
* **Request Body**:
```json
{
  "firstName": "Developer",
  "lastName": "Two",
  "email": "dev.two@dayflow.com",
  "department": "Engineering",
  "jobTitle": "Backend Engineer",
  "basicSalary": 60000
}
```
* **Success Response (201 Created)**:
```json
{
  "success": true,
  "message": "Employee created successfully",
  "data": { ... }
}
```

---

### Update Employee
* **Method**: `PUT`
* **Endpoint**: `/employees/:id`
* **Authentication**: Bearer Token
* **Role Requirements**: `admin` or `hr`
* **Request Body**:
```json
{
  "jobTitle": "Lead Backend Engineer",
  "basicSalary": 90000
}
```
* **Success Response (200 OK)**:
```json
{
  "success": true,
  "message": "Employee updated successfully",
  "data": { ... }
}
```

---

### Delete Employee
* **Method**: `DELETE`
* **Endpoint**: `/employees/:id`
* **Authentication**: Bearer Token
* **Role Requirements**: `admin` or `hr`
* **Success Response (200 OK)**:
```json
{
  "success": true,
  "message": "Employee and related records deleted successfully"
}
```

---

### Update Self Profile
* **Method**: `PUT`
* **Endpoint**: `/employees/me`
* **Authentication**: Bearer Token
* **Request Body**:
```json
{
  "phone": "+91 88888 77777",
  "address": "New Home Address"
}
```
* **Success Response (200 OK)**:
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": { ... }
}
```

---

## 3. Attendance APIs

### Check In
* **Method**: `POST`
* **Endpoint**: `/attendance/check-in`
* **Authentication**: Bearer Token
* **Success Response (201 Created)**:
```json
{
  "success": true,
  "message": "Checked in successfully",
  "data": {
    "id": 16,
    "date": "2026-08-22",
    "employeeId": "EMP-2026-002",
    "checkIn": "08:50 AM",
    "checkOut": "",
    "workingHours": "0 hrs",
    "status": "Present"
  }
}
```

---

### Check Out
* **Method**: `POST`
* **Endpoint**: `/attendance/check-out`
* **Authentication**: Bearer Token
* **Success Response (200 OK)**:
```json
{
  "success": true,
  "message": "Checked out successfully",
  "data": {
    "id": 16,
    "date": "2026-08-22",
    "employeeId": "EMP-2026-002",
    "checkIn": "08:50 AM",
    "checkOut": "05:30 PM",
    "workingHours": "8.7 hrs",
    "status": "Present"
  }
}
```

---

### Get Self Attendance History
* **Method**: `GET`
* **Endpoint**: `/attendance/me`
* **Authentication**: Bearer Token
* **Query Params**: `today` (`true` to get today's record specifically)
* **Success Response (200 OK)**:
```json
{
  "success": true,
  "data": [ ... ]
}
```

---

### Get Attendance Summary Statistics
* **Method**: `GET`
* **Endpoint**: `/attendance/summary`
* **Authentication**: Bearer Token
* **Success Response (200 OK - Admin)**:
```json
{
  "success": true,
  "data": {
    "totalEmployees": 8,
    "presentToday": 3,
    "onLeave": 1,
    "absent": 4,
    "details": {
      "present": 2,
      "late": 1,
      "onLeave": 1,
      "absent": 4
    }
  }
}
```

---

## 4. Leave APIs

### Apply for Leave
* **Method**: `POST`
* **Endpoint**: `/leaves`
* **Authentication**: Bearer Token
* **Request Body**:
```json
{
  "leaveType": "Annual Leave",
  "startDate": "2026-08-25",
  "endDate": "2026-08-28",
  "reason": "Family vacation"
}
```
* **Success Response (201 Created)**:
```json
{
  "success": true,
  "message": "Leave application submitted successfully",
  "data": { ... }
}
```

---

### Get Self Leave Balance
* **Method**: `GET`
* **Endpoint**: `/leaves/me/balance`
* **Authentication**: Bearer Token
* **Success Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "annualLeave": { "total": 18, "used": 4, "remaining": 14 },
    "sickLeave": { "total": 12, "used": 4, "remaining": 8 },
    "unpaidLeave": { "total": 10, "used": 2, "remaining": 8 }
  }
}
```

---

### Approve / Reject Leave
* **Method**: `PATCH`
* **Endpoint**: `/leaves/:id/approve` or `/leaves/:id/reject`
* **Authentication**: Bearer Token
* **Role Requirements**: `admin` or `hr`
* **Success Response (200 OK)**:
```json
{
  "success": true,
  "message": "Leave request updated successfully",
  "data": { ... }
}
```

---

## 5. Payroll APIs

### Process / Update Payroll Salary Details
* **Method**: `POST`
* **Endpoint**: `/payroll`
* **Authentication**: Bearer Token
* **Role Requirements**: `admin` or `hr`
* **Request Body**:
```json
{
  "employeeId": "EMP-2026-002",
  "basicSalary": 150000,
  "allowances": 35000,
  "deductions": 15000,
  "payoutMonth": "August 2026"
}
```
* **Success Response (201 Created)**:
```json
{
  "success": true,
  "message": "Payroll details processed successfully",
  "data": { ... }
}
```

---

## 6. Department APIs

### Get All Departments
* **Method**: `GET`
* **Endpoint**: `/departments`
* **Authentication**: Bearer Token
* **Success Response (200 OK)**:
```json
{
  "success": true,
  "data": [
    {
      "id": "DEP-01",
      "name": "Engineering",
      "employeeCount": 3,
      "head": "Michael Brown",
      "status": "Active",
      "budget": "₹15,00,000"
    },
    ...
  ]
}
```

---

## 7. Dashboard APIs

### Get Admin Dashboard Metrics
* **Method**: `GET`
* **Endpoint**: `/dashboard/admin`
* **Authentication**: Bearer Token
* **Role Requirements**: `admin` or `hr`
* **Success Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "metrics": {
      "totalEmployees": 8,
      "presentToday": 3,
      "employeesOnLeave": 1,
      "pendingRequests": 2,
      "payrollSummary": {
        "totalPayroll": 907000,
        "avgBasic": 120833.33
      }
    },
    "departmentDistribution": [ ... ],
    "recentLeaves": [ ... ]
  }
}
```
