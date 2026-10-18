"use client";

import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import { useConfirmation } from "../../context/confirmationContext";
import { toast } from "@/hooks/use-toast";

export default function TaxonomyManager({ branches, categories, adminRequest, onChange }) {
  const confirm = useConfirmation();
  const [branchName, setBranchName] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [kind, setKind] = useState("other");
  const [branch, setBranch] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => { if (!branches.some((item) => item.name === branch)) setBranch(branches[0]?.name || ""); }, [branches, branch]);
  async function mutate(body, method) {
    if (busy) return;
    if (method === "DELETE" && !(await confirm({ title: `Remove ${body.kind}?`, description: `Remove “${body.kind === "branch" ? body.branch : body.name}” from available choices. Products must be moved or removed first; historical orders are kept.`, action: "Remove" }))) return;
    setBusy(true); setError("");
    try {
      const result = await adminRequest("/api/admin/taxonomy", { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      onChange(result);
      if (method === "POST") { setBranchName(""); setCategoryName(""); }
      toast({ title: method === "POST" ? "Catalog choice added" : "Catalog choice removed" });
    } catch (requestError) { setError(requestError.message); toast({ variant: "destructive", title: "Could not update catalog choices", description: requestError.message }); }
    finally { setBusy(false); }
  }
  return <details className="my-6 rounded-2xl border border-black/15 p-5"><summary className="cursor-pointer font-serif text-2xl">Branches & categories</summary><p className="mt-3 text-sm leading-6 text-black/55">Create named branches and choose their product type. Categories belong to a branch. Empty choices can be removed; products and order history are never cascaded away.</p>{error && <p role="alert" className="mt-4 text-sm text-red-900">{error}</p>}<div className="mt-6 grid gap-8 md:grid-cols-2"><section><h2 className="mb-4 text-sm font-medium">Branches</h2><form onSubmit={(event) => { event.preventDefault(); mutate({ kind: "branch", name: branchName, product_kind: kind }, "POST"); }} className="grid gap-3"><label className="text-xs">New branch name<input aria-label="New branch name" required maxLength={60} value={branchName} onChange={(event) => setBranchName(event.target.value)} className="mt-2 w-full rounded-lg border border-black/20 bg-transparent p-3"/></label><label className="text-xs">Product type<select aria-label="Branch product type" value={kind} onChange={(event) => setKind(event.target.value)} className="mt-2 w-full rounded-lg border border-black/20 bg-transparent p-3"><option value="other">Other artwork</option><option value="bag">Bags</option><option value="silver">Silver / plated pieces</option></select></label><button disabled={busy} className="rounded-full bg-black px-5 py-3 text-xs text-white disabled:opacity-40">Add branch</button></form><ul className="mt-5 divide-y divide-black/10">{branches.map((item) => <li key={item.name} className="flex items-center justify-between gap-3 py-3 text-sm"><span>{item.name} <small className="text-black/45">/ {item.product_kind}</small></span><button type="button" disabled={busy} aria-label={`Remove branch ${item.name}`} onClick={() => mutate({ kind: "branch", branch: item.name }, "DELETE")} className="rounded-full border border-black/15 p-2"><Trash2 size={14}/></button></li>)}</ul></section><section><h2 className="mb-4 text-sm font-medium">Categories</h2><form onSubmit={(event) => { event.preventDefault(); mutate({ kind: "category", branch, name: categoryName }, "POST"); }} className="grid gap-3"><label className="text-xs">Parent branch<select aria-label="Category parent branch" required value={branch} onChange={(event) => setBranch(event.target.value)} className="mt-2 w-full rounded-lg border border-black/20 bg-transparent p-3"><option value="" disabled>Choose branch</option>{branches.map((item) => <option key={item.name}>{item.name}</option>)}</select></label><label className="text-xs">New category name<input aria-label="New category name" required maxLength={80} value={categoryName} onChange={(event) => setCategoryName(event.target.value)} className="mt-2 w-full rounded-lg border border-black/20 bg-transparent p-3"/></label><button disabled={busy || !branch} className="rounded-full bg-black px-5 py-3 text-xs text-white disabled:opacity-40">Add category</button></form><ul className="mt-5 divide-y divide-black/10">{categories.filter((item) => item.branch === branch).map((item) => <li key={item.name} className="flex items-center justify-between gap-3 py-3 text-sm"><span>{item.name}</span><button type="button" disabled={busy} aria-label={`Remove category ${item.name}`} onClick={() => mutate({ kind: "category", branch, name: item.name }, "DELETE")} className="rounded-full border border-black/15 p-2"><Trash2 size={14}/></button></li>)}</ul></section></div></details>;
}
