
import { useState } from "react";
import { AppLayout } from "../components/layout/AppLayout";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Plus, Edit, Trash2, MapPin } from "lucide-react";
import { trpc } from "../lib/trpc/client";
import { useActiveOrganization } from "../lib/auth/client";
import { useToast } from "../hooks/use-toast";

export default function Locations() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const { data: activeOrg } = useActiveOrganization();
  const { toast } = useToast();

  const { data: locations, refetch } = trpc.locations.getAll.useQuery(
    { organizationId: activeOrg?.id || "" },
    { enabled: !!activeOrg?.id }
  );

  const createMutation = trpc.locations.create.useMutation({
    onSuccess: () => {
      toast({ title: "Location created successfully" });
      refetch();
      setIsCreateOpen(false);
      setFormData({ name: "", description: "" });
    },
    onError: (error) => {
      toast({ 
        title: "Error creating location", 
        description: error.message,
        variant: "destructive" 
      });
    },
  });

  const updateMutation = trpc.locations.update.useMutation({
    onSuccess: () => {
      toast({ title: "Location updated successfully" });
      refetch();
      setIsEditOpen(false);
      setEditingLocation(null);
      setFormData({ name: "", description: "" });
    },
    onError: (error) => {
      toast({ 
        title: "Error updating location", 
        description: error.message,
        variant: "destructive" 
      });
    },
  });

  const deleteMutation = trpc.locations.delete.useMutation({
    onSuccess: () => {
      toast({ title: "Location deleted successfully" });
      refetch();
    },
    onError: (error) => {
      toast({ 
        title: "Error deleting location", 
        description: error.message,
        variant: "destructive" 
      });
    },
  });

  const handleCreate = () => {
    if (!activeOrg?.id) return;
    
    createMutation.mutate({
      name: formData.name,
      description: formData.description,
      organizationId: activeOrg.id,
    });
  };

  const handleUpdate = () => {
    if (!activeOrg?.id || !editingLocation) return;
    
    updateMutation.mutate({
      id: editingLocation.id,
      name: formData.name,
      description: formData.description,
      organizationId: activeOrg.id,
    });
  };

  const handleDelete = (id: string) => {
    if (!activeOrg?.id) return;
    
    if (confirm("Are you sure you want to delete this location?")) {
      deleteMutation.mutate({
        id,
        organizationId: activeOrg.id,
      });
    }
  };

  const openEdit = (location: any) => {
    setEditingLocation(location);
    setFormData({
      name: location.name,
      description: location.description || "",
    });
    setIsEditOpen(true);
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Locations</h1>
            <p className="text-muted-foreground">
              Manage your inventory locations and warehouses
            </p>
          </div>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Location
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Location</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter location name"
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Enter location description (optional)"
                  />
                </div>
                <div className="flex gap-2">
                  <Button 
                    onClick={handleCreate} 
                    disabled={!formData.name || createMutation.isPending}
                    className="flex-1"
                  >
                    {createMutation.isPending ? "Creating..." : "Create Location"}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setIsCreateOpen(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              All Locations
            </CardTitle>
            <CardDescription>
              {locations?.length || 0} location{locations?.length !== 1 ? 's' : ''} total
            </CardDescription>
          </CardHeader>
          <CardContent>
            {locations && locations.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {locations.map((location) => (
                    <TableRow key={location.id}>
                      <TableCell className="font-medium">{location.name}</TableCell>
                      <TableCell>{location.description || "-"}</TableCell>
                      <TableCell>{new Date(location.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEdit(location)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(location.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8">
                <MapPin className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No locations found</h3>
                <p className="text-muted-foreground mb-4">
                  Get started by creating your first location
                </p>
                <Button onClick={() => setIsCreateOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Location
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Location</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-name">Name</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter location name"
                />
              </div>
              <div>
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter location description (optional)"
                />
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={handleUpdate} 
                  disabled={!formData.name || updateMutation.isPending}
                  className="flex-1"
                >
                  {updateMutation.isPending ? "Updating..." : "Update Location"}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setIsEditOpen(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
}
