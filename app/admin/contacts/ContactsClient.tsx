"use client";

import { useState, useTransition } from "react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Search, Eye, Loader2 } from "lucide-react";
import { updateContactStatus } from "../actions";
import { toast } from "sonner";

const statusColors: Record<string, string> = {
  new: "bg-blue-100 text-blue-800 border-blue-200",
  "in-progress": "bg-orange-100 text-orange-800 border-orange-200",
  resolved: "bg-green-100 text-green-800 border-green-200",
};

export default function ContactsClient({ data }: { data: any[] }) {
  const [search, setSearch] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const filtered = data.filter(
    (row) =>
      row.name?.toLowerCase().includes(search.toLowerCase()) ||
      row.email?.toLowerCase().includes(search.toLowerCase()) ||
      row.inquiry_type?.toLowerCase().includes(search.toLowerCase()),
  );

  async function handleStatusChange(id: string, status: string) {
    setUpdatingId(id);
    startTransition(async () => {
      const result = await updateContactStatus(id, status);
      if (result.success) {
        toast.success("Status updated");
      } else {
        toast.error("Update failed");
      }
      setUpdatingId(null);
    });
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          placeholder="Search by name, email or inquiry type..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50/80">
              <TableHead className="font-semibold text-gray-700">Name</TableHead>
              <TableHead className="font-semibold text-gray-700">Contact</TableHead>
              <TableHead className="font-semibold text-gray-700">Inquiry Type</TableHead>
              <TableHead className="font-semibold text-gray-700">Message</TableHead>
              <TableHead className="font-semibold text-gray-700">Date</TableHead>
              <TableHead className="font-semibold text-gray-700">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10 text-gray-400">
                  No inquiries found
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((row) => (
                <TableRow key={row.id} className="hover:bg-gray-50/50 transition-colors">
                  <TableCell>
                    <p className="font-medium text-gray-800 text-sm">{row.name}</p>
                  </TableCell>
                  <TableCell>
                    <p className="text-xs text-gray-700">{row.email}</p>
                    <p className="text-xs text-gray-400">{row.phone}</p>
                  </TableCell>
                  <TableCell>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-lg border border-gray-200">
                      {row.inquiry_type}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <button className="flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-800 transition-colors">
                          <Eye className="w-3.5 h-3.5" />
                          View Message
                        </button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Message from {row.name}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-3 pt-2">
                          <div className="grid grid-cols-2 gap-3 text-sm">
                            <div>
                              <p className="text-gray-400 text-xs">Email</p>
                              <p className="font-medium">{row.email}</p>
                            </div>
                            <div>
                              <p className="text-gray-400 text-xs">Phone</p>
                              <p className="font-medium">{row.phone}</p>
                            </div>
                            <div>
                              <p className="text-gray-400 text-xs">Inquiry Type</p>
                              <p className="font-medium">{row.inquiry_type}</p>
                            </div>
                            <div>
                              <p className="text-gray-400 text-xs">Date</p>
                              <p className="font-medium">{new Date(row.created_at).toLocaleDateString()}</p>
                            </div>
                          </div>
                          <div>
                            <p className="text-gray-400 text-xs mb-1">Message</p>
                            <p className="text-sm text-gray-700 bg-gray-50 rounded-xl p-4 border border-gray-100 leading-relaxed">
                              {row.message}
                            </p>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                  <TableCell className="text-xs text-gray-400">
                    {new Date(row.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {updatingId === row.id ? (
                      <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                    ) : (
                      <Select
                        defaultValue={row.status || "new"}
                        onValueChange={(val) => handleStatusChange(row.id, val)}
                      >
                        <SelectTrigger className={`w-32 h-7 text-xs border rounded-lg ${statusColors[row.status || "new"]}`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="new">New</SelectItem>
                          <SelectItem value="in-progress">In Progress</SelectItem>
                          <SelectItem value="resolved">Resolved</SelectItem>
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
