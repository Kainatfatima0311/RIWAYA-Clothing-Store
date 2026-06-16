import { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import {
  useDashboardSnapshotQuery,
  useListEmployeesQuery,
  useCreateEmployeeMutation,
  useUpdateEmployeeMutation,
  useDeleteEmployeeMutation,
  useSetEmployeeStatusMutation,
} from '@/api/peopleApi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { PageSpinner } from '@/components/ui/Spinner';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { DataTable } from '@/components/admin/DataTable';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { EmployeeFormModal } from '@/pages/admin/Employees';
import { formatPrice, formatDate } from '@/lib/format';
import { apiErrorMessage } from '@/lib/apiError';
import {
  ShoppingBag,
  Wallet,
  Boxes,
  AlertTriangle,
  Users,
  Truck,
  Package,
  Warehouse as WarehouseIcon,
  UserCog,
  Plus,
  Pencil,
  Trash2,
  ArrowRight,
  Wallet as PayrollIcon,
} from 'lucide-react';

const Tile = ({ icon: Icon, label, value, sub, tone = 'default' }) => (
  <Card className="hover-lift">
    <CardContent className="pt-6">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs text-muted-foreground">{label}</div>
          <div className="text-2xl font-semibold mt-1">{value}</div>
          {sub && <div className="text-xs text-muted-foreground mt-1">{sub}</div>}
        </div>
        <Icon className={`h-8 w-8 ${tone === 'warn' ? 'text-amber-500' : tone === 'danger' ? 'text-destructive' : 'text-primary'}`} />
      </div>
    </CardContent>
  </Card>
);

const SAL_SUFFIX = { monthly: 'mo', weekly: 'wk', daily: 'day', hourly: 'hr' };
const EMP_STATUSES = ['active', 'on_leave', 'suspended', 'terminated', 'resigned', 'probation'];

// Rough monthly-equivalent so we can show one payroll headline across mixed frequencies.
const toMonthly = (e) => {
  const s = Number(e.salary) || 0;
  switch (e.salaryFrequency) {
    case 'weekly': return s * 4.33;
    case 'daily': return s * 26;
    case 'hourly': return s * 26 * 8;
    default: return s; // monthly
  }
};

export default function Dashboard() {
  const { data, isLoading } = useDashboardSnapshotQuery();
  if (isLoading) return <PageSpinner />;
  const d = data?.data;

  return (
    <div className="space-y-6">
      <div className="animate-fade-up">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Real-time snapshot of RIWAYA operations</p>
      </div>

      {!d ? (
        <p className="text-muted-foreground">No snapshot data yet. Start by adding warehouses, products, and stock.</p>
      ) : (
        <>
          {/* Today */}
          <section>
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Today</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Tile icon={ShoppingBag} label="Orders" value={d.today.orders} />
              <Tile icon={Wallet} label="Revenue booked" value={formatPrice(d.today.revenue)} />
              <Tile icon={Wallet} label="Payments received" value={formatPrice(d.today.paymentsReceived)} sub={`${d.today.paymentCount} payments`} />
              <Tile icon={ShoppingBag} label="Pending orders" value={d.operations.pendingOrders} tone="warn" />
            </div>
          </section>

          {/* Month */}
          <section>
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">This Month</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Tile icon={ShoppingBag} label="Orders" value={d.month.orders} />
              <Tile icon={Wallet} label="Revenue" value={formatPrice(d.month.revenue)} />
              <Tile icon={Wallet} label="Collected" value={formatPrice(d.month.paymentsReceived)} sub={`${d.month.paymentCount} payments`} />
              <Tile icon={Users} label="New customers" value={d.month.newCustomers} />
            </div>
          </section>

          {/* Inventory + Operations */}
          <section className="grid lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader><CardTitle className="text-base">Inventory health</CardTitle></CardHeader>
              <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Tile icon={AlertTriangle} label="Out of stock" value={d.inventory.outOfStock} tone="danger" />
                <Tile icon={Boxes} label="Low stock" value={d.inventory.lowStock} tone="warn" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="text-base">Operations</CardTitle></CardHeader>
              <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Tile icon={Truck} label="Shipped orders" value={d.operations.shippedOrders} />
                <Tile icon={Truck} label="Open POs" value={d.operations.openPurchaseOrders} />
              </CardContent>
            </Card>
          </section>

          {/* Catalog + People */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Tile icon={Package} label="Published products" value={d.catalog.publishedProducts} />
            <Tile icon={WarehouseIcon} label="Warehouses" value={d.catalog.warehouses} />
            <Tile icon={Users} label="Total customers" value={d.people.totalCustomers} />
            <Tile icon={Users} label="Active employees" value={d.people.activeEmployees} />
          </section>
        </>
      )}

      {/* Employees management (add / edit / remove directly from the dashboard) */}
      <EmployeesPanel />
    </div>
  );
}

function EmployeesPanel() {
  const { data, isLoading } = useListEmployeesQuery({ limit: 100, sort: '-joiningDate' });
  const employees = data?.data || [];

  const [create, { isLoading: creating }] = useCreateEmployeeMutation();
  const [update, { isLoading: updating }] = useUpdateEmployeeMutation();
  const [setStatus] = useSetEmployeeStatusMutation();
  const [remove, { isLoading: deleting }] = useDeleteEmployeeMutation();

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [confirmId, setConfirmId] = useState(null);

  const activeCount = employees.filter((e) => e.status === 'active').length;
  const payroll = employees
    .filter((e) => e.status === 'active')
    .reduce((sum, e) => sum + toMonthly(e), 0);

  const handleSave = async (values) => {
    try {
      if (editing) await update({ id: editing._id, ...values }).unwrap();
      else await create(values).unwrap();
      toast.success(editing ? 'Employee updated' : 'Employee added');
      setModalOpen(false);
    } catch (err) { toast.error(apiErrorMessage(err, 'Failed to save')); }
  };

  const handleSetStatus = async (id, status) => {
    try {
      await setStatus({ id, status }).unwrap();
      toast.success('Status updated');
    } catch (err) { toast.error(apiErrorMessage(err, 'Failed to update status')); }
  };

  const columns = [
    {
      key: 'name', label: 'Employee',
      render: (r) => (
        <div>
          <div className="font-medium">{r.name}</div>
          <div className="text-xs text-muted-foreground font-mono">{r.employeeCode}</div>
        </div>
      ),
    },
    { key: 'designation', label: 'Designation', render: (r) => r.designation || '—' },
    { key: 'department', label: 'Dept', render: (r) => <Badge variant="outline" className="capitalize">{r.department}</Badge> },
    { key: 'phone', label: 'Phone', render: (r) => r.phone || '—' },
    {
      key: 'salary', label: 'Salary',
      render: (r) => <span className="font-medium">{formatPrice(r.salary)}<span className="text-xs text-muted-foreground">/{SAL_SUFFIX[r.salaryFrequency] || r.salaryFrequency || ''}</span></span>,
    },
    { key: 'joiningDate', label: 'Joined', render: (r) => formatDate(r.joiningDate) },
    {
      key: 'status', label: 'Status',
      render: (r) => (
        <Select value={r.status} onChange={(e) => handleSetStatus(r._id, e.target.value)} className="h-8 text-xs w-32">
          {EMP_STATUSES.map((s) => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
        </Select>
      ),
    },
    {
      key: 'actions', label: '', className: 'text-right',
      render: (r) => (
        <div className="flex items-center justify-end gap-1">
          <button onClick={() => { setEditing(r); setModalOpen(true); }} className="p-1.5 hover:bg-accent/30 rounded transition-colors" title="Edit"><Pencil className="h-4 w-4" /></button>
          <button onClick={() => setConfirmId(r._id)} className="p-1.5 hover:bg-destructive/10 text-destructive rounded transition-colors" title="Remove"><Trash2 className="h-4 w-4" /></button>
        </div>
      ),
    },
  ];

  return (
    <Card>
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <CardTitle className="text-base flex items-center gap-2"><UserCog className="h-5 w-5 text-primary" /> Employees</CardTitle>
        <div className="flex items-center gap-2">
          <Link to="/admin/employees" className="text-sm text-primary inline-flex items-center gap-1 hover:gap-2 transition-all">
            Manage all <ArrowRight className="h-4 w-4" />
          </Link>
          <Button size="sm" onClick={() => { setEditing(null); setModalOpen(true); }}><Plus className="h-4 w-4 mr-1" /> Add employee</Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-lg border bg-muted/30 p-4">
            <div className="text-xs text-muted-foreground">Active employees</div>
            <div className="text-2xl font-semibold mt-1">{activeCount}</div>
          </div>
          <div className="rounded-lg border bg-muted/30 p-4">
            <div className="text-xs text-muted-foreground">Total on record</div>
            <div className="text-2xl font-semibold mt-1">{employees.length}</div>
          </div>
          <div className="rounded-lg border bg-muted/30 p-4">
            <div className="text-xs text-muted-foreground flex items-center gap-1"><PayrollIcon className="h-3.5 w-3.5" /> Est. monthly payroll</div>
            <div className="text-2xl font-semibold mt-1">{formatPrice(payroll)}</div>
          </div>
        </div>

        <DataTable
          columns={columns}
          data={employees}
          loading={isLoading}
          empty="No employees yet. Click “Add employee” to create your first one."
        />
      </CardContent>

      <EmployeeFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        initial={editing}
        onSubmit={handleSave}
        loading={creating || updating}
      />
      <ConfirmDialog
        open={!!confirmId}
        onClose={() => setConfirmId(null)}
        title="Remove employee?"
        description="This permanently deletes the employee record."
        onConfirm={async () => {
          try { await remove(confirmId).unwrap(); toast.success('Employee removed'); setConfirmId(null); }
          catch (err) { toast.error(apiErrorMessage(err, 'Failed to remove')); }
        }}
        loading={deleting}
      />
    </Card>
  );
}
