import React, { useState, useEffect } from 'react';
import { PageHeader, Card, StatCard, Badge } from '../../components/UI';
import { Table, Pagination } from '../../components/Table';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { attendanceService } from '../../services/attendanceService';
import { 
  CheckCircle, 
  Clock, 
  XCircle, 
  HelpCircle,
  Calendar,
  Filter
} from 'lucide-react';

const EmployeeAttendance = () => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [records, setRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters state
  const [dateFilter, setDateFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Personal statistics
  const [stats, setStats] = useState({
    present: 0,
    late: 0,
    absent: 0,
    avgHours: "0.0 hrs"
  });

  const loadAttendance = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const logs = await attendanceService.getByEmployeeId(user.id);
      setRecords(logs);
      setFilteredRecords(logs);

      // Compute statistics
      const presentCount = logs.filter(r => r.status === 'Present').length;
      const lateCount = logs.filter(r => r.status === 'Late').length;
      const absentCount = logs.filter(r => r.status === 'Absent').length;
      
      let sumHours = 0;
      let countHours = 0;
      logs.forEach(r => {
        if (r.workingHours && r.workingHours !== "0 hrs") {
          const hrs = parseFloat(r.workingHours);
          if (!isNaN(hrs)) {
            sumHours += hrs;
            countHours++;
          }
        }
      });
      const avg = countHours > 0 ? (sumHours / countHours).toFixed(1) : "0.0";

      setStats({
        present: presentCount,
        late: lateCount,
        absent: absentCount,
        avgHours: `${avg} hrs`
      });
    } catch (err) {
      showToast("Could not load attendance sheet.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAttendance();
  }, [user]);

  // Filters application
  useEffect(() => {
    let result = records;

    if (dateFilter) {
      result = result.filter(rec => rec.date === dateFilter);
    }

    if (statusFilter) {
      result = result.filter(rec => rec.status === statusFilter);
    }

    setFilteredRecords(result);
    setCurrentPage(1);
  }, [dateFilter, statusFilter, records]);

  const paginatedData = filteredRecords.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const columns = [
    { header: 'Date', key: 'date' },
    { 
      header: 'Check In', 
      key: 'checkIn',
      render: (row) => row.checkIn || <span className="text-charcoal-350">—</span>
    },
    { 
      header: 'Check Out', 
      key: 'checkOut',
      render: (row) => row.checkOut || <span className="text-charcoal-350">—</span>
    },
    { 
      header: 'Working Hours', 
      key: 'workingHours',
      render: (row) => (
        <span className="font-semibold text-charcoal-700">{row.workingHours}</span>
      )
    },
    {
      header: 'Status',
      key: 'status',
      render: (row) => {
        const variants = {
          Present: 'green',
          Late: 'amber',
          Absent: 'red',
          'On Leave': 'gray'
        };
        return <Badge variant={variants[row.status]}>{row.status}</Badge>;
      }
    }
  ];

  return (
    <div className="flex flex-col gap-6 font-sans">
      
      {/* Page Title */}
      <PageHeader
        title="My Attendance Logs"
        subtitle="Review your past shift check-ins, working hours, and shift duration summaries."
      />

      {/* Stats summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <Card className="flex items-center gap-4">
          <div className="p-3 bg-green-50 rounded-lg text-green-700 border border-green-105 shadow-subtle shrink-0">
            <CheckCircle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-charcoal-400 uppercase tracking-wider">Days Present</p>
            <h4 className="text-lg font-bold text-charcoal-900 mt-0.5">{stats.present}</h4>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="p-3 bg-amber-50 rounded-lg text-amber-700 border border-amber-105 shadow-subtle shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-charcoal-400 uppercase tracking-wider">Late Clockings</p>
            <h4 className="text-lg font-bold text-charcoal-900 mt-0.5">{stats.late}</h4>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="p-3 bg-red-50 rounded-lg text-red-700 border border-red-105 shadow-subtle shrink-0">
            <XCircle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-charcoal-400 uppercase tracking-wider">Absent Days</p>
            <h4 className="text-lg font-bold text-charcoal-900 mt-0.5">{stats.absent}</h4>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="p-3 bg-charcoal-950 text-white rounded-lg shadow-subtle shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-charcoal-350 uppercase tracking-wider">Average Daily Hours</p>
            <h4 className="text-lg font-bold text-white mt-0.5">{stats.avgHours}</h4>
          </div>
        </Card>

      </div>

      {/* Filters panel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 bg-white border border-charcoal-100 rounded-xl shadow-subtle">
        
        <div className="flex items-center gap-1.5 text-xs text-charcoal-500 font-semibold bg-charcoal-50 border border-charcoal-200 px-3 py-2 rounded-lg">
          <Filter className="w-3.5 h-3.5" />
          <span>Filters:</span>
        </div>

        <div className="flex items-center gap-2 flex-wrap text-xs">
          
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="font-semibold border border-charcoal-200 rounded-lg p-2 bg-white focus:outline-none focus:border-charcoal-950"
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="font-semibold border border-charcoal-200 rounded-lg p-2 bg-white focus:outline-none focus:border-charcoal-950"
          >
            <option value="">All Statuses</option>
            <option value="Present">Present</option>
            <option value="Late">Late</option>
            <option value="Absent">Absent</option>
            <option value="On Leave">On Leave</option>
          </select>

          {(dateFilter || statusFilter) && (
            <button 
              onClick={() => { setDateFilter(''); setStatusFilter(''); }}
              className="font-bold text-red-650 hover:underline px-2"
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
          emptyStateText="No attendance logs found"
          emptyStateDescription="We couldn't locate any attendance logs matching the filters."
        />
        <Pagination
          currentPage={currentPage}
          totalItems={filteredRecords.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
        />
      </div>

    </div>
  );
};

export default EmployeeAttendance;
