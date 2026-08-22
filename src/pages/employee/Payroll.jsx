import React, { useState, useEffect } from 'react';
import { PageHeader, Card, Badge, Button } from '../../components/UI';
import { Table, Pagination } from '../../components/Table';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { payrollService } from '../../services/payrollService';
import { 
  CreditCard, 
  Download, 
  FileCheck, 
  ShieldCheck,
  CheckCircle,
  Coins
} from 'lucide-react';

const EmployeePayroll = () => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [slips, setSlips] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Selected slip detail
  const [selectedSlip, setSelectedSlip] = useState(null);

  useEffect(() => {
    const fetchPayroll = async () => {
      if (!user) return;
      setIsLoading(true);
      try {
        const logs = await payrollService.getByEmployeeId(user.id);
        setSlips(logs);
        if (logs.length > 0) {
          // Select newest slip by default
          setSelectedSlip(logs[0]);
        }
      } catch (err) {
        showToast("Could not load payroll logs.", "error");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPayroll();
  }, [user]);

  const handleDownloadSlip = (slip) => {
    showToast(`Downloading salary slip for ${slip.payoutMonth}...`, "info");
    setTimeout(() => {
      showToast(`Payslip for ${slip.payoutMonth} downloaded successfully.`);
    }, 1200);
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val || 0);
  };

  const paginatedData = slips.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const columns = [
    { header: 'Month', key: 'payoutMonth' },
    {
      header: 'Net Salary',
      key: 'netSalary',
      render: (row) => <span className="font-bold text-charcoal-900">{formatCurrency(row.netSalary)}</span>
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
    { header: 'Paid On', key: 'processedDate' },
    {
      header: 'Actions',
      key: 'actions',
      className: 'text-right',
      render: (row) => (
        <div className="flex items-center justify-end" onClick={e => e.stopPropagation()}>
          <button
            onClick={() => handleDownloadSlip(row)}
            className="p-1 text-charcoal-700 hover:text-charcoal-950 flex items-center gap-1 text-xs font-semibold"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Slip</span>
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="flex flex-col gap-6 font-sans">
      
      {/* Page Title */}
      <PageHeader
        title="My Compensation & Payslips"
        subtitle="Review payouts records, compensation splits, and download salary slip files."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Left Side: Payslips logs list */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <Card>
            <h4 className="text-sm font-bold text-charcoal-950 font-sans pb-3 border-b border-charcoal-50 mb-4">
              Payout Ledger History
            </h4>

            <Table
              columns={columns}
              data={paginatedData}
              isLoading={isLoading}
              onRowClick={(row) => setSelectedSlip(row)}
              emptyStateText="No slips processed yet"
              emptyStateDescription="We couldn't locate any compensation ledger records."
            />
            <Pagination
              currentPage={currentPage}
              totalItems={slips.length}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
            />
          </Card>
        </div>

        {/* Right Side: Selected slip breakdown details */}
        <div className="w-full">
          {isLoading ? (
            <Card className="h-64 flex items-center justify-center">
              <span className="animate-spin rounded-full h-8 w-8 border-2 border-charcoal-200 border-t-charcoal-900" />
            </Card>
          ) : selectedSlip ? (
            <Card className="animate-fade-in border border-charcoal-150">
              <div className="flex items-center justify-between pb-3 border-b border-charcoal-50 mb-4">
                <div>
                  <h4 className="text-sm font-bold text-charcoal-900 font-sans">Payslip Breakdown</h4>
                  <span className="text-[10px] text-charcoal-400 font-semibold">{selectedSlip.payoutMonth}</span>
                </div>
                <Badge variant={selectedSlip.status === 'Processed' ? 'green' : 'amber'}>
                  {selectedSlip.status}
                </Badge>
              </div>

              <div className="space-y-3.5 text-xs font-semibold">
                
                <div className="flex justify-between items-center py-2 border-b border-charcoal-50 text-charcoal-500">
                  <span>Basic Salary</span>
                  <span className="text-charcoal-900">{formatCurrency(selectedSlip.basicSalary)}</span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-charcoal-50 text-charcoal-500">
                  <span>Allowances (HRA, Travel, etc.)</span>
                  <span className="text-green-700">+{formatCurrency(selectedSlip.allowances)}</span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-charcoal-50 text-charcoal-500">
                  <span>Deductions (Taxes, PF, etc.)</span>
                  <span className="text-red-650">-{formatCurrency(selectedSlip.deductions)}</span>
                </div>

                <div className="flex justify-between items-center py-3 text-sm font-bold bg-charcoal-50 px-3 rounded-lg text-charcoal-900 font-sans mt-4">
                  <span>Net Take-Home Salary</span>
                  <span>{formatCurrency(selectedSlip.netSalary)}</span>
                </div>

              </div>

              <Button
                variant="primary"
                size="lg"
                icon={Download}
                onClick={() => handleDownloadSlip(selectedSlip)}
                className="w-full mt-6 font-bold py-2.5"
              >
                Download Salary Slip PDF
              </Button>

              <div className="text-[9px] text-center text-charcoal-400 font-semibold mt-4 flex items-center justify-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Digitally signed and processed by HR operations.</span>
              </div>
            </Card>
          ) : (
            <Card className="p-8 text-center text-charcoal-400 font-semibold">
              No payslip selected. Click a row to view breakdown.
            </Card>
          )}
        </div>

      </div>

    </div>
  );
};

export default EmployeePayroll;
