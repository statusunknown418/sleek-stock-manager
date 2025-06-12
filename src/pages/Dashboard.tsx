
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Package, Users, MapPin, TrendingUp, AlertTriangle, DollarSign } from "lucide-react";
import { AppLayout } from "../components/layout/AppLayout";
import { useActiveOrganization } from "../lib/auth/client";
import { trpc } from "../lib/trpc/client";

const StatCard = ({ 
  title, 
  value, 
  description, 
  icon: Icon, 
  color = "text-primary" 
}: {
  title: string;
  value: string | number;
  description: string;
  icon: any;
  color?: string;
}) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className={`h-4 w-4 ${color}`} />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <p className="text-xs text-muted-foreground">{description}</p>
    </CardContent>
  </Card>
);

export function Dashboard() {
  const { data: activeOrg } = useActiveOrganization();
  
  const { data: products } = trpc.products.getAll.useQuery(
    { organizationId: activeOrg?.id || "" },
    { enabled: !!activeOrg?.id }
  );

  const { data: locations } = trpc.locations.getAll.useQuery(
    { organizationId: activeOrg?.id || "" },
    { enabled: !!activeOrg?.id }
  );

  const { data: categories } = trpc.categories.getAll.useQuery(
    { organizationId: activeOrg?.id || "" },
    { enabled: !!activeOrg?.id }
  );

  const totalProducts = products?.length || 0;
  const totalLocations = locations?.length || 0;
  const totalCategories = categories?.length || 0;
  const lowStockCount = products?.filter(p => (p.minStockLevel || 0) > 0).length || 0;

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of your inventory management system
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Products"
            value={totalProducts}
            description="Active products in inventory"
            icon={Package}
          />
          <StatCard
            title="Locations"
            value={totalLocations}
            description="Storage locations"
            icon={MapPin}
          />
          <StatCard
            title="Categories"
            value={totalCategories}
            description="Product categories"
            icon={TrendingUp}
          />
          <StatCard
            title="Low Stock Alerts"
            value={lowStockCount}
            description="Products below minimum"
            icon={AlertTriangle}
            color="text-destructive"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Latest inventory movements and updates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center space-x-4 text-sm">
                    <div className="w-2 h-2 bg-primary rounded-full" />
                    <div className="flex-1">
                      <p className="font-medium">Stock updated for Product {i}</p>
                      <p className="text-muted-foreground">2 hours ago</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Common tasks and shortcuts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-accent/50 cursor-pointer transition-colors">
                <Package className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-medium text-sm">Add New Product</p>
                  <p className="text-xs text-muted-foreground">Create a new inventory item</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-accent/50 cursor-pointer transition-colors">
                <MapPin className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-medium text-sm">Manage Locations</p>
                  <p className="text-xs text-muted-foreground">Add or edit storage locations</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-accent/50 cursor-pointer transition-colors">
                <Users className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-medium text-sm">Invite Team Member</p>
                  <p className="text-xs text-muted-foreground">Add someone to your organization</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}

export default Dashboard;
