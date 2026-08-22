import React, { useState, useEffect } from 'react';
import { PageHeader, Card, StatCard, Badge, Button, Input, Select } from '../../components/UI';
import { Table, Pagination } from '../../components/Table';
import { Modal } from '../../components/Modal';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { leaveService } from '../../services/leaveService';
import { 
  Calendar, 
  Plus, 
  Filter, 
  FileText,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react';

const EmployeeLeaves = () => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [leaves, setLeaves] = useState([]);
  const [filteredLeaves, setFilteredLeaves] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters state
  const [statusFilter, setStatusFilter] = useState('');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Apply Modal state
  const [isApplyOpen, setIsApplyOpen] = useState(false);
  const [formFields, setFormFields] = useState({
    leaveType: 'Annual Leave',
    startDate: '',
    endDate: '',
    reason: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [isApplying, setIsApplying] = useState(false);

  const loadLeaves = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const data = await leaveService.getByEmployeeId(user.id);
      setLeaves(data);
      setFilteredLeaves(data);
    } catch (err) {
      showToast("Could not load leave requests.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadLeaves();
  }, [user]);

  // Filters application
  useEffect(() => {
    if (statusFilter) {
      setFilteredLeaves(leaves.filter(l => l.status === statusFilter));
    } else {
      setFilteredLeaves(leaves);
    }
    setCurrentPage(1);
  }, [statusFilter, leaves]);

  const validateForm = () => {
    const errs = {};
    if (!formFields.startDate) errs.startDate = "Start date is required.";
    if (!formFields.endDate) errs.endDate = "End date is required.";
    if (!formFields.reason) errs.reason = "Reason is required.";
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleApply = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsApplying(true);
    try {
      await leaveService.apply(user.id, `${user.firstName} ${user.lastName}`, formFields);
      showToast("Leave request applied successfully. Awaiting HR review.");
      setIsApplyOpen(false);
      setFormFields({ leaveType: 'Annual Leave', startDate: '', endDate: '', reason: '' });
      loadLeaves();
    } catch (err) {
      showToast(err.message || "Failed to submit request.", "error");
    } finally {
      setIsApplying(false);
    }
  };

  const paginatedData = filteredLeaves.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const columns = [
    { header: 'Leave Type', key: 'leaveType' },
    { header: 'Start Date', key: 'startDate' },
    { header: 'End Date', key: 'endDate' },
    { 
      header: 'Reason', 
      key: 'reason',
      render: (row) => (
        <span className="font-semibold text-charcoal-700 max-w-sm block truncate" title={row.reason}>
          {row.reason}
        </span>
      )
    },
    { 
      header: 'Applied On', 
      key: 'appliedOn'
    },
    {
      header: 'Status',
      key: 'status',
      render: (row) => {
        const variants = {
          Approved: 'green',
          Pending: 'amber',
          Rejected: 'red'
        };
        return <Badge variant={variants[row.status]}>{row.status}</Badge>;
      }
    }
  ];

  return (
    <div className="flex flex-col gap-6 font-sans">
      
      {/* Page Title */}
      <PageHeader
        title="Leave Request History"
        subtitle="Manage and track your leave request approvals, category balances, and details."
        actions={
          <Button variant="primary" size="md" icon={Plus} onClick={() => setIsApplyOpen(true)}>
            Apply for Leave
          </Button>
        }
      />

      {/* Filters panel */}
      <div className="flex items-center justify-between gap-4 p-4 bg-white border border-charcoal-100 rounded-xl shadow-subtle text-xs">
        <div className="flex items-center gap-1.5 text-xs text-charcoal-500 font-semibold bg-charcoal-50 border border-charcoal-200 px-3 py-2 rounded-lg">
          <Filter className="w-3.5 h-3.5" />
          <span>Filters:</span>
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="font-semibold border border-charcoal-200 rounded-lg p-2 bg-white focus:outline-none focus:border-charcoal-950"
        >
          <option value="">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      {/* Main logs Table */}
      <div>
        <Table
          columns={columns}
          data={paginatedData}
          isLoading={isLoading}
          emptyStateText="No requests logged"
          emptyStateDescription="We couldn't locate any leave requests matching the filters."
        />
        <Pagination
          currentPage={currentPage}
          totalItems={filteredLeaves.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* Form Modal */}
      <Modal
        isOpen={isApplyOpen}
        onClose={() => setIsApplyOpen(false)}
        title="Apply for Leave"
        size="md"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsApplyOpen(false)} disabled={isApplying}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleApply} isLoading={isApplying}>
              Apply Request
            </Button>
          </>
        }
      >
        <form className="flex flex-col gap-4">
          
          <Select
            label="Leave Type"
            value={formFields.leaveType}
            onChange={(e) => setFormFields(prev => ({ ...prev, leaveType: e.target.value }))}
            options={[
              { value: 'Annual Leave', label: 'Annual Leave (Paid)' },
              { value: 'Sick Leave', label: 'Sick Leave (Medical)' },
              { value: 'Unpaid Leave', label: 'Unpaid Leave' }
            ]}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Start Date"
              type="date"
              value={formFields.startDate}
              onChange={(e) => setFormFields(prev => ({ ...prev, startDate: e.target.value }))}
              error={formErrors.startDate}
            />
            <Input
              label="End Date"
              type="date"
              value={formFields.endDate}
              onChange={(e) => setFormFields(prev => ({ ...prev, endDate: e.target.value }))}
              error={formErrors.endDate}
            />
          </div>

          <Input
            label="Reason for Request"
            placeholder="Please detail reason..."
            value={formFields.reason}
            onChange={(e) => setFormFields(prev => ({ ...prev, reason: e.target.value }))}
            error={formErrors.reason}
          />

        </form>
      </Modal>

    </div>
  );
};

export default EmployeeLeaves;
