"use client";

import { MATERIAL_OPTIONS, SIZE_OPTIONS, STONE_OPTIONS, productKind } from "../../_lib/commerce/product-options";

function OptionChoices({ label, options, selected, onChange, disabled, hint }) {
  const choices = options;
  return (
    <fieldset disabled={disabled} className="min-w-0 space-y-3 disabled:opacity-40">
      <legend className="text-[9px] uppercase tracking-[.18em] text-black/60">{label}</legend>
      {hint && <p className="text-xs leading-5 text-black/50">{hint}</p>}
      <div className="flex flex-wrap gap-2">
        {choices.map((option) => (
          <button key={option} type="button" aria-pressed={selected.includes(option)}
            onClick={() => onChange(selected.includes(option) ? selected.filter((value) => value !== option) : [...selected, option])}
            className="rounded-full border border-black/20 px-3 py-2 text-xs transition-colors aria-pressed:border-black aria-pressed:bg-black aria-pressed:text-[var(--paper)] hover:border-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black disabled:cursor-not-allowed disabled:hover:border-black/20">
            {option}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

export default function ProductOptionFields({ form, setForm }) {
  const isBag = productKind(form) !== "silver";
  const stoneNames = (form.stone_options || []).map((item) => typeof item === "string" ? item : item.name);
  function setField(key, value) { setForm((previous) => ({ ...previous, [key]: value })); }
  function setStones(names) {
    setForm((previous) => ({ ...previous, stone_options: names.map((name) => previous.stone_options.find((item) => item?.name === name) || { name }), stone_required: names.length > 0 && !names.includes("None") && previous.stone_required }));
  }
  return (
    <section className="min-w-0 space-y-6 rounded-2xl border border-black/10 p-5 sm:col-span-2" aria-labelledby="product-options-heading">
      <div>
        <h3 id="product-options-heading" className="font-serif text-2xl">Piece options</h3>
        <p className="mt-2 text-xs leading-5 text-black/55">{isBag ? "Metal, sizing, stone and gold options do not apply to bags. These fields are disabled and are not saved." : "Select the options you actually offer. Multiple selections are welcome; sizes follow the selected size type."}</p>
      </div>
      <OptionChoices label="Materials" options={MATERIAL_OPTIONS} selected={form.material_options} onChange={(value) => setField("material_options", value)} disabled={isBag}/>
      <label className="block text-[9px] uppercase tracking-[.18em] text-black/60">
        Size type
        <select aria-label="Size type" disabled={isBag} value={form.size_type} onChange={(event) => setForm((previous) => ({ ...previous, size_type: event.target.value, size_options: [] }))}
          className="mt-2 w-full border-b border-black/20 bg-transparent py-3 text-sm normal-case tracking-normal outline-none focus:border-black disabled:cursor-not-allowed disabled:opacity-40">
          <option value="none">Choose size type</option><option value="one_size">One size</option><option value="ring">Ring size</option><option value="bracelet">Bracelet size</option><option value="necklace">Necklace length</option>
        </select>
      </label>
      <OptionChoices label="Size options" options={SIZE_OPTIONS[form.size_type] || []} selected={form.size_options} onChange={(value) => setField("size_options", value)} disabled={isBag}
        hint={form.size_type === "none" ? "Choose a size type above to see the available sizes." : "Choose each size available for this piece."}/>
      <OptionChoices label="Stone options" options={STONE_OPTIONS} selected={stoneNames} onChange={setStones} disabled={isBag} hint="Choose None for a stone-free piece, or select the stone choices you offer."/>
      <fieldset disabled={isBag} className="grid gap-5 disabled:opacity-40 sm:grid-cols-2">
        <legend className="sr-only">Stone and gold settings</legend>
        <label className="flex items-center gap-3 text-sm"><input type="checkbox" checked={!!form.stone_required} onChange={(event) => setForm((previous) => ({ ...previous, stone_required: event.target.checked, stone_options: event.target.checked ? previous.stone_options.filter((stone) => (typeof stone === "string" ? stone : stone.name) !== "None") : previous.stone_options }))} className="accent-black"/> Stone selection required</label>
        <label className="flex items-center gap-3 text-sm"><input type="checkbox" checked={!!form.gold_available} onChange={(event) => setForm((previous) => ({ ...previous, gold_available: event.target.checked, gold_price_eur: event.target.checked ? previous.gold_price_eur : "", gold_price_try: event.target.checked ? previous.gold_price_try : "" }))} className="accent-black"/> 14K gold plating can be ordered</label>
        {[["gold_price_eur", "Gold-plated price (€)"], ["gold_price_try", "Gold-plated price (₺)"]].map(([key, label]) => <label key={key} className="text-[9px] uppercase tracking-[.18em] text-black/60">{label}<input type="number" min="0" step="0.01" value={form[key] ?? ""} onChange={(event) => setField(key, event.target.value)} className="mt-2 w-full border-b border-black/20 bg-transparent py-3 text-sm normal-case tracking-normal outline-none focus:border-black disabled:cursor-not-allowed"/></label>)}
      </fieldset>
      <label className="block text-[9px] uppercase tracking-[.18em] text-black/60">Customization note<textarea value={form.customization_note} onChange={(event) => setField("customization_note", event.target.value)} rows={2} placeholder={isBag ? "Optional bag personalization or made-to-order note." : "Optional made-to-order or stone note."} className="mt-2 w-full rounded-xl border border-black/15 bg-transparent p-3 text-sm normal-case tracking-normal outline-none focus:border-black"/></label>
    </section>
  );
}
