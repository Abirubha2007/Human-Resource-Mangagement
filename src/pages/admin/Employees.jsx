import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Filter, 
  Eye, 
  Edit2, 
  Trash2, 
  Briefcase 
} from 'lucide-react';
import { PageHeader, Button, Input, Select, Badge, Avatar } from '../../components/UI';
import { Table, Pagination } from '../../components/Table';
import { Modal, ConfirmDialog } from '../../components/Modal';
import { employeeService } from '../../services/employeeService';
import { useToast } from '../../context/ToastContext';

const Employees = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  // Data states
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Search & Filter state
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Modal control states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState('add'); // 'add' or 'edit'
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
  
  // Confirm Delete control
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Form Fields
  const [formFields, setFormFields] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    department: 'Engineering',
    jobTitle: '',
    joiningDate: new Date().toISOString().split('T')[0],
    status: 'Active',
    basicSalary: '',
    allowances: '',
    deductions: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  const departments = [
    { value: 'Engineering', label: 'Engineering' },
    { value: 'Marketing', label: 'Marketing' },
    { value: 'Sales', label: 'Sales' },
    { value: 'Human Resources', label: 'Human Resources' },
    { value: 'Finance', label: 'Finance' }
  ];

  const statuses = [
    { value: 'Active', label: 'Active' },
    { value: 'Inactive', label: 'Inactive' }
  ];

  const loadEmployees = async () => {
    setIsLoading(true);
    try {
      const data = await employeeService.getAll();
      setEmployees(data);
      setFilteredEmployees(data);
    } catch (err) {
      showToast("Could not load employee records.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  // Handle Search and Filtering
  useEffect(() => {
    let result = employees;

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(emp => 
        emp.firstName.toLowerCase().includes(q) || 
        emp.lastName.toLowerCase().includes(q) || 
        emp.id.toLowerCase().includes(q) || 
        emp.email.toLowerCase().includes(q)
      );
    }

    if (deptFilter) {
      result = result.filter(emp => emp.department === deptFilter);
    }

    if (statusFilter) {
      result = result.filter(emp => emp.status === statusFilter);
    }

    setFilteredEmployees(result);
    setCurrentPage(1); // reset to page 1 on search change
  }, [search, deptFilter, statusFilter, employees]);

  // Pagination calculation
  const paginatedData = filteredEmployees.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleOpenAddModal = () => {
    setFormMode('add');
    setSelectedEmployeeId(null);
    setFormFields({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      department: 'Engineering',
      jobTitle: '',
      joiningDate: new Date().toISOString().split('T')[0],
      status: 'Active',
      basicSalary: '',
      allowances: '',
      deductions: ''
    });
    setFormErrors({});
    setIsFormOpen(true);
  };

  const handleOpenEditModal = (emp, e) => {
    e.stopPropagation();
    setFormMode('edit');
    setSelectedEmployeeId(emp.id);
    setFormFields({
      firstName: emp.firstName,
      lastName: emp.lastName,
      email: emp.email,
      phone: emp.phone || '',
      address: emp.address || '',
      department: emp.department,
      jobTitle: emp.jobTitle,
      joiningDate: emp.joiningDate,
      status: emp.status,
      basicSalary: emp.salaryDetails?.basicSalary || '',
      allowances: emp.salaryDetails?.allowances || '',
      deductions: emp.salaryDetails?.deductions || ''
    });
    setFormErrors({});
    setIsFormOpen(true);
  };

  const validateForm = () => {
    const errs = {};
    if (!formFields.firstName) errs.firstName = "First name is required.";
    if (!formFields.lastName) errs.lastName = "Last name is required.";
    if (!formFields.email) {
      errs.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(formFields.email)) {
      errs.email = "Invalid email format.";
    }
    if (!formFields.jobTitle) errs.jobTitle = "Job title is required.";
    
    // Validate Salary fields
    if (formFields.basicSalary && isNaN(Number(formFields.basicSalary))) errs.basicSalary = "Must be a number.";
    if (formFields.allowances && isNaN(Number(formFields.allowances))) errs.allowances = "Must be a number.";
    if (formFields.deductions && isNaN(Number(formFields.deductions))) errs.deductions = "Must be a number.";

    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSaveEmployee = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSaving(true);
    try {
      if (formMode === 'add') {
        await employeeService.create(formFields);
        showToast("Employee added successfully.");
      } else {
        await employeeService.update(selectedEmployeeId, formFields);
        showToast("Employee details updated.");
      }
      setIsFormOpen(false);
      loadEmployees();
    } catch (err) {
      showToast(err.message || "Failed to save record.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleOpenDelete = (id, e) => {
    e.stopPropagation();
    setSelectedEmployeeId(id);
    setIsDeleteOpen(true);
  };

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    try {
      await employeeService.delete(selectedEmployeeId);
      showToast("Employee record deleted.");
      setIsDeleteOpen(false);
      loadEmployees();
    } catch (err) {
      showToast("Deletion failed.", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  // Define Columns for the Table component
  const columns = [
    {
      header: 'Employee',
      key: 'name',
      render: (row) => (
        <div className="flex items-center gap-3">
          <Avatar src={row.avatar} name={`${row.firstName} ${row.lastName}`} size="sm" />
          <div className="leading-tight">
            <span className="font-bold text-charcoal-900 block font-sans">{row.firstName} {row.lastName}</span>
            <span className="text-[10px] text-charcoal-400 font-semibold">{row.email}</span>
          </div>
        </div>
      )
    },
    { header: 'ID', key: 'id' },
    { header: 'Department', key: 'department' },
    { header: 'Job Title', key: 'jobTitle' },
    { header: 'Joining Date', key: 'joiningDate' },
    {
      header: 'Status',
      key: 'status',
      render: (row) => (
        <Badge variant={row.status === 'Active' ? 'green' : 'gray'}>
          {row.status}
        </Badge>
      )
    },
    {
      header: 'Actions',
      key: 'actions',
      className: 'text-right',
      render: (row) => (
        <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => navigate(`/admin/employees/${row.id}`)}
            className="p-1.5 border border-charcoal-200 rounded-lg hover:bg-charcoal-50 text-charcoal-600 transition-colors"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </button>
          
          <button
            onClick={(e) => handleOpenEditModal(row, e)}
            className="p-1.5 border border-charcoal-200 rounded-lg hover:bg-charcoal-50 text-charcoal-600 transition-colors"
            title="Edit Profile"
          >
            <Edit2 className="w-4 h-4" />
          </button>

          {row.role !== 'admin' && (
            <button
              onClick={(e) => handleOpenDelete(row.id, e)}
              className="p-1.5 border border-transparent rounded-lg hover:bg-red-50 text-red-650 hover:border-red-150 transition-colors"
              title="Delete Record"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="flex flex-col gap-6">
      
      {/* Header section */}
      <PageHeader
        title="Employees Directory"
        subtitle="Manage profiles, payroll, and structural alignments of team members."
        actions={
          <Button variant="primary" size="md" icon={Plus} onClick={handleOpenAddModal}>
            Add Employee
          </Button>
        }
      />

      {/* Filter panel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 bg-white border border-charcoal-100 rounded-xl shadow-subtle">
        
        {/* Search */}
        <div className="relative flex-1 max-w-md flex items-center">
          <Search className="absolute left-3 w-4 h-4 text-charcoal-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by ID, name, email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full text-xs bg-charcoal-50 border border-charcoal-200 rounded-lg pl-9 pr-3 py-2.5 transition-all focus:outline-none focus:bg-white focus:border-charcoal-900 focus:ring-1 focus:ring-charcoal-900 placeholder:text-charcoal-400"
          />
        </div>

        {/* Dropdown Filters */}
        <div className="flex items-center gap-2 flex-wrap">
          
          <div className="flex items-center gap-1.5 text-xs text-charcoal-500 font-semibold bg-charcoal-50 border border-charcoal-200 px-3 py-2 rounded-lg">
            <Filter className="w-3.5 h-3.5" />
            <span>Filters:</span>
          </div>

          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="text-xs font-semibold border border-charcoal-200 rounded-lg p-2 bg-white focus:outline-none focus:border-charcoal-900"
          >
            <option value="">All Departments</option>
            {departments.map(d => (
              <option key={d.value} value={d.value}>{d.label}</option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs font-semibold border border-charcoal-200 rounded-lg p-2 bg-white focus:outline-none focus:border-charcoal-900"
          >
            <option value="">All Statuses</option>
            {statuses.map(s => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>

          {(search || deptFilter || statusFilter) && (
            <button 
              onClick={() => { setSearch(''); setDeptFilter(''); setStatusFilter(''); }}
              className="text-xs font-bold text-red-650 hover:underline px-2"
            >
              Clear Filters
            </button>
          )}

        </div>

      </div>

      {/* Main Table view */}
      <div>
        <Table
          columns={columns}
          data={paginatedData}
          isLoading={isLoading}
          onRowClick={(row) => navigate(`/admin/employees/${row.id}`)}
          emptyStateText="No employees found"
          emptyStateDescription="No employee profiles matched your filter parameters."
        />
        <Pagination
          currentPage={currentPage}
          totalItems={filteredEmployees.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* Form Modal (Add / Edit) */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={formMode === 'add' ? 'Add New Employee' : 'Edit Employee Profile'}
        size="lg"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsFormOpen(false)} disabled={isSaving}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSaveEmployee} isLoading={isSaving}>
              {formMode === 'add' ? 'Add Employee' : 'Save Changes'}
            </Button>
          </>
        }
      >
        <form className="flex flex-col gap-4">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="First Name"
              placeholder="First name"
              value={formFields.firstName}
              onChange={(e) => setFormFields(prev => ({ ...prev, firstName: e.target.value }))}
              error={formErrors.firstName}
            />
            <Input
              label="Last Name"
              placeholder="Last name"
              value={formFields.lastName}
              onChange={(e) => setFormFields(prev => ({ ...prev, lastName: e.target.value }))}
              error={formErrors.lastName}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Email Address"
              placeholder="email@company.com"
              type="email"
              value={formFields.email}
              onChange={(e) => setFormFields(prev => ({ ...prev, email: e.target.value }))}
              error={formErrors.email}
            />
            <Input
              label="Phone Number"
              placeholder="+91 99999 99999"
              value={formFields.phone}
              onChange={(e) => setFormFields(prev => ({ ...prev, phone: e.target.value }))}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Department"
              value={formFields.department}
              onChange={(e) => setFormFields(prev => ({ ...prev, department: e.target.value }))}
              options={departments}
            />
            <Input
              label="Job Title"
              placeholder="e.g. Senior Software Engineer"
              value={formFields.jobTitle}
              onChange={(e) => setFormFields(prev => ({ ...prev, jobTitle: e.target.value }))}
              error={formErrors.jobTitle}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Joining Date"
              type="date"
              value={formFields.joiningDate}
              onChange={(e) => setFormFields(prev => ({ ...prev, joiningDate: e.target.value }))}
            />
            <Select
              label="Status"
              value={formFields.status}
              onChange={(e) => setFormFields(prev => ({ ...prev, status: e.target.value }))}
              options={statuses}
            />
          </div>

          <Input
            label="Home Address"
            placeholder="Address location..."
            value={formFields.address}
            onChange={(e) => setFormFields(prev => ({ ...prev, address: e.target.value }))}
          />

          <div className="border-t border-charcoal-100 pt-4 mt-2">
            <h4 className="text-xs font-bold text-charcoal-900 mb-3 font-sans tracking-wide uppercase">Compensation Details (Monthly)</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="Basic Salary (₹)"
                placeholder="Basic"
                value={formFields.basicSalary}
                onChange={(e) => setFormFields(prev => ({ ...prev, basicSalary: e.target.value }))}
                error={formErrors.basicSalary}
              />
              <Input
                label="Allowances (₹)"
                placeholder="Allowances"
                value={formFields.allowances}
                onChange={(e) => setFormFields(prev => ({ ...prev, allowances: e.target.value }))}
                error={formErrors.allowances}
              />
              <Input
                label="Deductions (₹)"
                placeholder="Deductions"
                value={formFields.deductions}
                onChange={(e) => setFormFields(prev => ({ ...prev, deductions: e.target.value }))}
                error={formErrors.deductions}
              />
            </div>
          </div>

        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Employee Record?"
        message="Are you sure you want to delete this profile? This will remove all their contract records, attendance history, and payslips."
        confirmLabel="Delete Record"
        variant="danger"
        isLoading={isDeleting}
      />

    </div>
  );
};

export default Employees;
