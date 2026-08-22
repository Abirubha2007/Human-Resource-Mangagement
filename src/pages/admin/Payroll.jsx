import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  Coins, 
  Clock, 
  CheckCircle,
  FileCheck,
  Search
} from 'lucide-react';
import { PageHeader, Card, StatCard, Badge, Button } from '../../components/UI';
import { Table, Pagination } from '../../components/Table';
import { payrollService } from '../../services/payrollService';
import { useToast } from '../../context/ToastContext';

const AdminPayroll = () => {
  const { showToast } = useToast();

  const [slips, setSlips] = useState([]);
  const [filteredSlips, setFilteredSlips] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters state
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Stats calculation
  const [summary, setSummary] = useState({
    totalPayout: 0,
    processedCount: 0,
    pendingCount: 0,
    processedAmount: 0
  });

  const loadPayroll = async () => {
    setIsLoading(true);
    try {
      const data = await payrollService.getAll();
      setSlips(data);
      setFilteredLeaves(data); // wait, let's make sure we set it correctly
      setFilteredSlips(data);

      // Compute stats
      const total = data.reduce((acc, curr) => acc + (curr.netSalary || 0), 0);
      const processed = data.filter(s => s.status === 'Processed');
      const pending = data.filter(s => s.status === 'Pending');
      const procAmount = processed.reduce((acc, curr) => acc + (curr.netSalary || 0), 0);

      setSummary({
        totalPayout: total,
        processedCount: processed.length,
        pendingCount: pending.length,
        processedAmount: procAmount
      });
    } catch (err) {
      showToast("Could not load payroll database.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPayroll();
  }, []);

  // Filter effect
  useEffect(() => {
    let result = slips;

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(s => 
        s.employeeName.toLowerCase().includes(q) || 
        s.employeeId.toLowerCase().includes(q)
      );
    }

    if (statusFilter) {
      result = result.filter(s => s.status === statusFilter);
    }

    setFilteredSlips(result);
    setCurrentPage(1);
  }, [search, statusFilter, slips]);

  const handleProcessPayout = async (id, e) => {
    e.stopPropagation();
    try {
      await payrollService.processPayout(id);
      showToast("Payout successfully processed.");
      loadPayroll();
    } catch (err) {
      showToast("Failed to process payment.", "error");
    }
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val || 0);
  };

  const paginatedData = filteredSlips.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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
    {
      header: 'Basic Salary',
      key: 'basicSalary',
      render: (row) => formatCurrency(row.basicSalary)
    },
    {
      header: 'Allowances',
      key: 'allowances',
      render: (row) => (
        <span className="text-green-700 font-semibold">+{formatCurrency(row.allowances)}</span>
      )
    },
    {
      header: 'Deductions',
      key: 'deductions',
      render: (row) => (
        <span className="text-red-650 font-semibold">-{formatCurrency(row.deductions)}</span>
      )
    },
    {
      header: 'Net Salary',
      key: 'netSalary',
      render: (row) => (
        <span className="font-bold text-charcoal-900 font-sans">{formatCurrency(row.netSalary)}</span>
      )
    },
    {
      header: 'Status',
      key: 'status',
      render: (row) => (
        <Badge variant={row.status === 'Processed' ? 'green' : 'amber'}>
          {row.status}
        </Badge>
      )
    },
    {
      header: 'Processed On',
      key: 'processedDate',
      render: (row) => (
        <span className="text-xs text-charcoal-500 font-semibold">{row.processedDate}</span>
      )
    },
    {
      header: 'Actions',
      key: 'actions',
      className: 'text-right',
      render: (row) => {
        if (row.status === 'Processed') {
          return (
            <div className="flex items-center justify-end text-green-700 gap-1 text-[10px] font-bold uppercase tracking-wider select-none">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Paid</span>
            </div>
          );
        }

        return (
          <div className="flex items-center justify-end" onClick={e => e.stopPropagation()}>
            <Button
              variant="primary"
              size="sm"
              icon={FileCheck}
              onClick={(e) => handleProcessPayout(row.id, e)}
            >
              Pay Salary
            </Button>
          </div>
        );
      }
    }
  ];

  return (
    <div className="flex flex-col gap-6">
      
      {/* Page Title */}
      <PageHeader
        title="Payroll Operations"
        subtitle="Manage salary disbursements, allowances, and monthly compensation ledger."
      />

      {/* Financial Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <Card className="flex items-center gap-4 hover:shadow-card transition-shadow">
          <div className="p-3 bg-charcoal-950 rounded-lg text-white shadow-subtle shrink-0">
            <Coins className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-charcoal-400 uppercase tracking-wider">Total Monthly Payroll</p>
            <h4 className="text-lg font-bold text-charcoal-900 mt-0.5">{formatCurrency(summary.totalPayout)}</h4>
          </div>
        </Card>

        <Card className="flex items-center gap-4 hover:shadow-card transition-shadow">
          <div className="p-3 bg-green-50 rounded-lg text-green-700 border border-green-105 shadow-subtle shrink-0">
            <CheckCircle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-charcoal-400 uppercase tracking-wider">Disbursed Payout</p>
            <h4 className="text-lg font-bold text-green-700 mt-0.5">{formatCurrency(summary.processedAmount)}</h4>
          </div>
        </Card>

        <Card className="flex items-center gap-4 hover:shadow-card transition-shadow">
          <div className="p-3 bg-amber-50 rounded-lg text-amber-700 border border-amber-105 shadow-subtle shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-charcoal-400 uppercase tracking-wider">Pending Payout</p>
            <h4 className="text-lg font-bold text-amber-700 mt-0.5">
              {formatCurrency(summary.totalPayout - summary.processedAmount)}
            </h4>
          </div>
        </Card>

        <Card className="flex items-center gap-4 hover:shadow-card transition-shadow">
          <div className="p-3 bg-charcoal-50 rounded-lg text-charcoal-700 border border-charcoal-100 shadow-subtle shrink-0">
            <CreditCard className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-charcoal-400 uppercase tracking-wider">Disbursement Rate</p>
            <h4 className="text-lg font-bold text-charcoal-900 mt-0.5">
              {slips.length > 0 ? `${Math.round((summary.processedCount / slips.length) * 100)}%` : '0%'}
            </h4>
          </div>
        </Card>

      </div>

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
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs font-semibold border border-charcoal-200 rounded-lg p-2 bg-white focus:outline-none focus:border-charcoal-900"
          >
            <option value="">All Statuses</option>
            <option value="Processed">Processed</option>
            <option value="Pending">Pending</option>
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

      {/* Main Table view */}
      <div>
        <Table
          columns={columns}
          data={paginatedData}
          isLoading={isLoading}
          emptyStateText="No payroll records found"
          emptyStateDescription="We couldn't locate any compensation ledger files matching the search filters."
        />
        <Pagination
          currentPage={currentPage}
          totalItems={filteredSlips.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
        />
      </div>

    </div>
  );
};

export default AdminPayroll;
