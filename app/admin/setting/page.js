"use client";

import { useState } from "react";
import { settings } from "./settings";
import { supabase } from "@/app/_lib/supabaseClient";

export default function DynamicSettingsForm() {
  const initialState = Object.fromEntries(
    settings.map((setting) => [setting.slug, setting.default])
  );

  const [formData, setFormData] = useState(initialState);

  const handleChange = (slug, value) => {
    setFormData((prev) => ({ ...prev, [slug]: value }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  const updates = Object.entries(formData).map(([slug, value]) => ({
    slug,
    value: value.toString(), 
  }));

  try {
    const { error } = await supabase
      .from("settings")
      .upsert(updates, { onConflict: "slug" });

    if (error) {
      console.error("Error updating settings:", error.message);
      alert("❌ Error updating settings.");
    } else {
      alert("✅ Settings updated successfully.");
    }
  } catch (err) {
    console.error("Unexpected error:", err);
    alert("❌ Unexpected error.");
  }
};

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-xl mx-auto p-4">
      {settings.map((setting) => (
        <div key={setting.slug} className="flex flex-col gap-2">
          <label className="font-medium">{setting.name}</label>

          {setting.type === "select" && (
            <select
              value={formData[setting.slug]}
              onChange={(e) => handleChange(setting.slug, e.target.value)}
              className="border rounded px-3 py-2"
            >
              {setting.options.map((option) => (
                <option key={option} value={option}>
                  {option.toUpperCase()}
                </option>
              ))}
            </select>
          )}

          {setting.type === "boolean" && (
            <input
              type="checkbox"
              checked={formData[setting.slug]}
              onChange={(e) => handleChange(setting.slug, e.target.checked)}
            />
          )}

          {setting.type === "number" && (
            <input
              type="number"
              value={formData[setting.slug]}
              onChange={(e) =>
                handleChange(setting.slug, Number(e.target.value))
              }
              className="border rounded px-3 py-2"
            />
          )}
        </div>
      ))}

      <button
        type="submit"
        className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
      >
        Save Settings
      </button>
    </form>
  );
}
