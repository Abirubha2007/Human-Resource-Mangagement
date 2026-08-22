import React, { useState, useEffect } from 'react';
import { 
  Check, 
  X, 
  FileText, 
  Filter, 
  Search,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';
import { PageHeader, Card, Badge, Button } from '../../components/UI';
import { Table, Pagination } from '../../components/Table';
import { Modal, ConfirmDialog } from '../../components/Modal';
import { leaveService } from '../../services/leaveService';
import { useToast } from '../../context/ToastContext';

const AdminLeaves = () => {
  const { showToast } = useToast();

  const [leaves, setLeaves] = useState([]);
  const [filteredLeaves, setFilteredLeaves] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters state
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Confirmation state
  const [confirmState, setConfirmState] = useState({
    isOpen: false,
    type: 'approve', // 'approve' or 'reject'
    id: null,
    loading: false
  });

  // Details Modal state
  const [detailsState, setDetailsState] = useState({
    isOpen: false,
    request: null
  });

  const loadLeaves = async () => {
    setIsLoading(true);
    try {
      const data = await leaveService.getAll();
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
  }, []);

  // Filter effect
  useEffect(() => {
    let result = leaves;

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(lv => 
        lv.employeeName.toLowerCase().includes(q) || 
        lv.employeeId.toLowerCase().includes(q)
      );
    }

    if (statusFilter) {
      result = result.filter(lv => lv.status === statusFilter);
    }

    setFilteredLeaves(result);
    setCurrentPage(1);
  }, [search, statusFilter, leaves]);

  const paginatedData = filteredLeaves.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleOpenConfirm = (id, type) => {
    setConfirmState({
      isOpen: true,
      type,
      id,
      loading: false
    });
  };

  const handleConfirmAction = async () => {
    setConfirmState(prev => ({ ...prev, loading: true }));
    try {
      const { id, type } = confirmState;
      if (type === 'approve') {
        await leaveService.approve(id);
        showToast("Leave request approved successfully.");
      } else {
        await leaveService.reject(id);
        showToast("Leave request rejected successfully.");
      }
      setConfirmState({ isOpen: false, type: 'approve', id: null, loading: false });
      loadLeaves();
    } catch (err) {
      showToast("Operation failed.", "error");
      setConfirmState(prev => ({ ...prev, loading: false }));
    }
  };

  const columns = [
    {
      header: 'Employee',
      key: 'employeeName',
      render: (row) => (
        <div>
          <span className="font-bold text-charcoal-900 block font-sans">{row.employeeName}</span>
          <span className="text-[10px] text-charcoal-400 font-semibold">{row.employeeId}</span>
        </div>
      )
    },
    { header: 'Leave Type', key: 'leaveType' },
    { 
      header: 'Start Date', 
      key: 'startDate'
    },
    { 
      header: 'End Date', 
      key: 'endDate'
    },
    {
      header: 'Reason',
      key: 'reason',
      render: (row) => (
        <button
          onClick={() => setDetailsState({ isOpen: true, request: row })}
          className="text-xs text-charcoal-950 font-bold hover:underline flex items-center gap-1 text-left"
        >
          <FileText className="w-3.5 h-3.5" />
          <span className="max-w-[150px] truncate">{row.reason}</span>
        </button>
      )
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
    },
    {
      header: 'Actions',
      key: 'actions',
      className: 'text-right',
      render: (row) => {
        if (row.status !== 'Pending') {
          return <span className="text-[10px] text-charcoal-400 font-semibold uppercase">Closed</span>;
        }

        return (
          <div className="flex items-center justify-end gap-1.5" onClick={e => e.stopPropagation()}>
            <button
              onClick={() => handleOpenConfirm(row.id, 'approve')}
              className="p-1 text-green-600 hover:bg-green-50 border border-transparent hover:border-green-200 rounded-lg transition-all"
              title="Approve Request"
            >
              <Check className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleOpenConfirm(row.id, 'reject')}
              className="p-1 text-red-650 hover:bg-red-50 border border-transparent hover:border-red-200 rounded-lg transition-all"
              title="Reject Request"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      }
    }
  ];

  return (
    <div className="flex flex-col gap-6">
      
      {/* Page Title */}
      <PageHeader
        title="Leave Requests"
        subtitle="Manage employee requests for paid and sick leaves, and update balances."
      />

      {/* Filter panel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 bg-white border border-charcoal-100 rounded-xl shadow-subtle">
        
        {/* Search */}
        <div className="relative flex-1 max-w-sm flex items-center">
          <Search className="absolute left-3 w-4 h-4 text-charcoal-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search employee..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full text-xs bg-charcoal-50 border border-charcoal-200 rounded-lg pl-9 pr-3 py-2.5 transition-all focus:outline-none focus:bg-white focus:border-charcoal-900 focus:ring-1 focus:ring-charcoal-900 placeholder:text-charcoal-400"
          />
        </div>

        {/* Dropdowns */}
        <div className="flex items-center gap-2">
          
          <div className="flex items-center gap-1.5 text-xs text-charcoal-500 font-semibold bg-charcoal-50 border border-charcoal-200 px-3 py-2 rounded-lg">
            <Filter className="w-3.5 h-3.5" />
            <span>Filters:</span>
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs font-semibold border border-charcoal-200 rounded-lg p-2 bg-white focus:outline-none focus:border-charcoal-900"
          >
            <option value="">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>

          {(search || statusFilter) && (
            <button 
              onClick={() => { setSearch(''); setStatusFilter(''); }}
              className="text-xs font-bold text-red-650 hover:underline px-2"
            >
              Clear Filters
            </button>
          )}

        </div>

      </div>

      {/* Table view */}
      <div>
        <Table
          columns={columns}
          data={paginatedData}
          isLoading={isLoading}
          emptyStateText="No leave requests found"
          emptyStateDescription="There are no pending or logged leave requests that match your criteria."
        />
        <Pagination
          currentPage={currentPage}
          totalItems={filteredLeaves.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* Details Dialog */}
      <Modal
        isOpen={detailsState.isOpen}
        onClose={() => setDetailsState({ isOpen: false, request: null })}
        title="Leave Request Details"
        size="md"
        footer={
          <Button variant="secondary" onClick={() => setDetailsState({ isOpen: false, request: null })}>
            Close
          </Button>
        }
      >
        {detailsState.request && (
          <div className="space-y-4">
            <div className="flex items-center gap-4 bg-charcoal-50/50 p-4 border border-charcoal-100 rounded-xl">
              <div>
                <p className="text-[10px] text-charcoal-400 font-bold uppercase tracking-wider">Employee Name</p>
                <p className="text-sm font-bold text-charcoal-900 font-sans mt-0.5">{detailsState.request.employeeName}</p>
                <p className="text-xs text-charcoal-400 font-semibold">{detailsState.request.employeeId}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] text-charcoal-400 font-bold uppercase">Leave Type</p>
                <p className="text-xs font-semibold text-charcoal-900 mt-1">{detailsState.request.leaveType}</p>
              </div>
              <div>
                <p className="text-[10px] text-charcoal-400 font-bold uppercase">Applied On</p>
                <p className="text-xs font-semibold text-charcoal-900 mt-1">{detailsState.request.appliedOn}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] text-charcoal-400 font-bold uppercase">Start Date</p>
                <p className="text-xs font-semibold text-charcoal-900 mt-1">{detailsState.request.startDate}</p>
              </div>
              <div>
                <p className="text-[10px] text-charcoal-400 font-bold uppercase">End Date</p>
                <p className="text-xs font-semibold text-charcoal-900 mt-1">{detailsState.request.endDate}</p>
              </div>
            </div>

            <div>
              <p className="text-[10px] text-charcoal-400 font-bold uppercase">Reason for Leave</p>
              <div className="p-3 bg-charcoal-50 border border-charcoal-100 rounded-lg text-xs mt-1 text-charcoal-700 leading-relaxed font-semibold">
                {detailsState.request.reason}
              </div>
            </div>

            <div>
              <p className="text-[10px] text-charcoal-400 font-bold uppercase">Status</p>
              <div className="mt-1">
                <Badge variant={detailsState.request.status === 'Approved' ? 'green' : detailsState.request.status === 'Pending' ? 'amber' : 'red'}>
                  {detailsState.request.status}
                </Badge>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={confirmState.isOpen}
        onClose={() => setConfirmState(prev => ({ ...prev, isOpen: false }))}
        onConfirm={handleConfirmAction}
        title={confirmState.type === 'approve' ? "Approve Leave Request" : "Reject Leave Request"}
        message={confirmState.type === 'approve' 
          ? "Are you sure you want to approve this leave request? This will deduct the days from their remaining balance." 
          : "Are you sure you want to reject this leave request? The employee will be notified."
        }
        confirmLabel={confirmState.type === 'approve' ? "Approve" : "Reject Request"}
        variant={confirmState.type === 'approve' ? 'primary' : 'danger'}
        isLoading={confirmState.loading}
      />

    </div>
  );
};

export default AdminLeaves;
