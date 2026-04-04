"use client";

import { useState, useTransition } from "react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Search, Download, Trash2, Loader2, Mail } from "lucide-react";
import { deleteNewsletterSub } from "../actions";
import { toast } from "sonner";

export default function NewsletterClient({ data }: { data: any[] }) {
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const filtered = data.filter((row) =>
    row.email?.toLowerCase().includes(search.toLowerCase()),
  );

  function exportCSV() {
    const csv = ["Email,Status,Subscribed Date"];
    data.forEach((row) => {
      csv.push(`${row.email},${row.status || "active"},${new Date(row.created_at).toLocaleDateString()}`);
    });
    const blob = new Blob([csv.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `newsletter-subscribers-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("CSV exported successfully!");
  }

  async function handleDelete(id: string) {
    if (!confirm("Remove this subscriber?")) return;
    setDeletingId(id);
    startTransition(async () => {
      const result = await deleteNewsletterSub(id);
      if (result.success) {
        toast.success("Subscriber removed");
      } else {
        toast.error("Failed to remove subscriber");
      }
      setDeletingId(null);
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search by email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <button
          onClick={exportCSV}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-xl transition-all shadow-sm"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      {/* Summary */}
      <div className="flex items-center gap-2 px-4 py-3 bg-green-50 border border-green-100 rounded-xl">
        <Mail className="w-4 h-4 text-green-600" />
        <p className="text-sm text-green-700 font-medium">
          Total subscribers: <strong>{data.length}</strong>
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50/80">
              <TableHead className="font-semibold text-gray-700">#</TableHead>
              <TableHead className="font-semibold text-gray-700">Email Address</TableHead>
              <TableHead className="font-semibold text-gray-700">Status</TableHead>
              <TableHead className="font-semibold text-gray-700">Subscribed Date</TableHead>
              <TableHead className="font-semibold text-gray-700">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10 text-gray-400">
                  No subscribers found
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((row, i) => (
                <TableRow key={row.id} className="hover:bg-gray-50/50 transition-colors">
                  <TableCell className="text-gray-400 text-sm">{i + 1}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-green-100 flex items-center justify-center text-green-600 text-xs font-bold">
                        {row.email?.[0]?.toUpperCase()}
                      </div>
                      <span className="text-sm font-medium text-gray-800">{row.email}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-lg font-medium border ${
                      row.status === "active" || !row.status
                        ? "bg-green-100 text-green-700 border-green-200"
                        : "bg-gray-100 text-gray-600 border-gray-200"
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${row.status === "active" || !row.status ? "bg-green-500" : "bg-gray-400"}`} />
                      {row.status || "active"}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm text-gray-500">
                    {new Date(row.created_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </TableCell>
                  <TableCell>
                    {deletingId === row.id ? (
                      <Loader2 className="w-4 h-4 animate-spin text-red-400" />
                    ) : (
                      <button
                        onClick={() => handleDelete(row.id)}
                        className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                        title="Remove subscriber"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <p className="text-xs text-gray-400 text-right">
        Showing {filtered.length} of {data.length} subscribers
      </p>
    </div>
  );
}
