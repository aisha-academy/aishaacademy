"use client";

import { useState, useTransition } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Search, Loader2 } from "lucide-react";
import { updateEnrollmentStatus } from "../actions";
import { toast } from "sonner";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  confirmed: "bg-green-100 text-green-800 border-green-200",
  cancelled: "bg-red-100 text-red-800 border-red-200",
};

function EnrollmentTable({
  data,
  tableKey,
}: {
  data: any[];
  tableKey: "online_enrollments" | "physical_enrollments";
}) {
  const [search, setSearch] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const filtered = data.filter(
    (row) =>
      row.student_name?.toLowerCase().includes(search.toLowerCase()) ||
      row.email?.toLowerCase().includes(search.toLowerCase()) ||
      row.program?.toLowerCase().includes(search.toLowerCase()),
  );

  async function handleStatusChange(
    id: string,
    status: string,
    email?: string,
    name?: string,
  ) {
    setUpdatingId(id);
    startTransition(async () => {
      const result = await updateEnrollmentStatus(id, status, tableKey, email, name);
      if (result.success) {
        toast.success("Status updated successfully");
      } else {
        toast.error("Failed to update status");
      }
      setUpdatingId(null);
    });
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          placeholder="Search by name, email or program..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50/80">
              <TableHead className="font-semibold text-gray-700">Student</TableHead>
              <TableHead className="font-semibold text-gray-700">Parent</TableHead>
              <TableHead className="font-semibold text-gray-700">Program</TableHead>
              <TableHead className="font-semibold text-gray-700">Contact</TableHead>
              <TableHead className="font-semibold text-gray-700">City</TableHead>
              <TableHead className="font-semibold text-gray-700">Date</TableHead>
              <TableHead className="font-semibold text-gray-700">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10 text-gray-400">
                  No enrollments found
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((row) => (
                <TableRow key={row.id} className="hover:bg-gray-50/50 transition-colors">
                  <TableCell>
                    <p className="font-medium text-gray-800 text-sm">{row.student_name}</p>
                    <p className="text-xs text-gray-400">{row.gender} · Age {row.age}</p>
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">{row.parent_name}</TableCell>
                  <TableCell>
                    <span className="inline-block bg-amber-50 text-amber-700 text-xs px-2 py-1 rounded-lg font-medium border border-amber-100">
                      {row.program}
                    </span>
                  </TableCell>
                  <TableCell>
                    <p className="text-xs text-gray-700">{row.email}</p>
                    <p className="text-xs text-gray-400">{row.phone}</p>
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">{row.city}</TableCell>
                  <TableCell className="text-xs text-gray-400">
                    {new Date(row.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {updatingId === row.id ? (
                      <Loader2 className="w-4 h-4 animate-spin text-amber-500" />
                    ) : (
                      <Select
                        defaultValue={row.status || "pending"}
                        onValueChange={(val) =>
                          handleStatusChange(row.id, val, row.email, row.student_name)
                        }
                      >
                        <SelectTrigger className={`w-32 h-7 text-xs border rounded-lg ${statusColors[row.status || "pending"]}`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="confirmed">Confirmed</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <p className="text-xs text-gray-400 text-right">
        Showing {filtered.length} of {data.length} records
      </p>
    </div>
  );
}

export default function EnrollmentsClient({
  onlineData,
  physicalData,
}: {
  onlineData: any[];
  physicalData: any[];
}) {
  return (
    <Tabs defaultValue="online">
      <TabsList className="mb-6 bg-gray-100/80">
        <TabsTrigger value="online" className="data-[state=active]:bg-white">
          Online Classes
          <span className="ml-2 bg-amber-100 text-amber-700 text-xs px-1.5 py-0.5 rounded-full font-medium">
            {onlineData.length}
          </span>
        </TabsTrigger>
        <TabsTrigger value="physical" className="data-[state=active]:bg-white">
          Physical Classes
          <span className="ml-2 bg-blue-100 text-blue-700 text-xs px-1.5 py-0.5 rounded-full font-medium">
            {physicalData.length}
          </span>
        </TabsTrigger>
      </TabsList>
      <TabsContent value="online">
        <EnrollmentTable data={onlineData} tableKey="online_enrollments" />
      </TabsContent>
      <TabsContent value="physical">
        <EnrollmentTable data={physicalData} tableKey="physical_enrollments" />
      </TabsContent>
    </Tabs>
  );
}
