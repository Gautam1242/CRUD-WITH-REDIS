// src/components/FormBuilder.jsx
import React, { useState } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { HiOutlineDotsVertical, HiOutlineTrash } from "react-icons/hi";

// Field templates
const fieldTypes = [
  { id: "heading", label: "Heading", type: "heading" },
  { id: "subheading", label: "Subheading", type: "subheading" },
  { id: "text", label: "Text Field", type: "text" },
  { id: "password", label: "Password Field", type: "password" },
  { id: "textarea", label: "Textarea", type: "textarea" },
  { id: "time", label: "Time Field", type: "time" },
  {
    id: "checkbox",
    label: "Checkbox Group",
    type: "checkbox",
    options: ["Option 1", "Option 2"],
  },
  {
    id: "radio",
    label: "Radio Group",
    type: "radio",
    options: ["Option 1", "Option 2"],
  },
  {
    id: "select",
    label: "Select Dropdown",
    type: "select",
    options: ["Option 1", "Option 2"],
  },
  { id: "file", label: "File Upload", type: "file" },
];

const uid = () => Math.random().toString(36).substring(2, 9);

// Inline editable text
function EditableText({ text, onChange, className }) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(text);

  const commit = () => {
    setEditing(false);
    onChange(value);
  };

  return editing ? (
    <input
      autoFocus
      className={`border rounded px-1 py-0.5 text-sm ${className}`}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onBlur={commit}
      onKeyDown={(e) => {
        if (e.key === "Enter") commit();
      }}
    />
  ) : (
    <span
      className={`cursor-pointer ${className}`}
      onClick={() => setEditing(true)}
    >
      {text || "Click to edit"}
    </span>
  );
}

// Sortable field item
function SortableItem({
  field,
  onUpdate,
  onRemove,
  onAddOption,
  onUpdateOption,
  preview,
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: field.uid });

  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`${
        preview
          ? "mb-6"
          : "bg-white border rounded-lg shadow p-4 mb-4"
      }`}
    >
      {/* Top bar: drag + delete */}
      {!preview && (
        <div className="flex items-center justify-between mb-3">
          <button
            type="button"
            {...attributes}
            {...listeners}
            className="p-1 rounded hover:bg-gray-100"
          >
            <HiOutlineDotsVertical className="w-5 h-5 text-gray-500" />
          </button>
          <button
            type="button"
            className="text-red-500 hover:text-red-700 p-1"
            onClick={() => onRemove(field.uid)}
          >
            <HiOutlineTrash className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Render field types */}
      {field.type === "heading" && (
        <h2 className="text-xl font-bold mb-4 border-b pb-1">
          <EditableText
            text={field.label}
            onChange={(val) => onUpdate(field.uid, "label", val)}
          />
        </h2>
      )}

      {field.type === "subheading" && (
        <h4 className="text-md font-semibold text-gray-600 mb-2">
          <EditableText
            text={field.label}
            onChange={(val) => onUpdate(field.uid, "label", val)}
          />
        </h4>
      )}

      {["text", "password", "file", "time"].includes(field.type) && (
        <div className="mb-3">
          <label className="block text-sm font-medium mb-1">
            <EditableText
              text={field.label}
              onChange={(val) => onUpdate(field.uid, "label", val)}
            />
          </label>
          <input
            type={field.type}
            className="w-full border rounded px-2 py-1"
            disabled={!preview}
          />
        </div>
      )}

      {field.type === "textarea" && (
        <div className="mb-3">
          <label className="block text-sm font-medium mb-1">
            <EditableText
              text={field.label}
              onChange={(val) => onUpdate(field.uid, "label", val)}
            />
          </label>
          <textarea
            className="w-full border rounded px-2 py-1"
            rows={3}
            disabled={!preview}
          />
        </div>
      )}

      {field.type === "select" && (
        <div className="mb-3">
          <label className="block text-sm font-medium mb-1">
            <EditableText
              text={field.label}
              onChange={(val) => onUpdate(field.uid, "label", val)}
            />
          </label>
          <select
            className="w-full border rounded px-2 py-1"
            disabled={!preview}
          >
            {field.options?.map((opt, i) => (
              <option key={i}>{opt}</option>
            ))}
          </select>
          {!preview && (
            <div className="mt-2 space-y-1">
              {field.options?.map((opt, i) => (
                <EditableText
                  key={i}
                  text={opt}
                  onChange={(val) => onUpdateOption(field.uid, i, val)}
                  className="block text-xs text-gray-600"
                />
              ))}
              <button
                type="button"
                className="text-blue-600 text-sm hover:underline"
                onClick={() => onAddOption(field.uid)}
              >
                + Add Option
              </button>
            </div>
          )}
        </div>
      )}

      {(field.type === "radio" || field.type === "checkbox") && (
        <div className="mb-3">
          <label className="block text-sm font-medium mb-1">
            <EditableText
              text={field.label}
              onChange={(val) => onUpdate(field.uid, "label", val)}
            />
          </label>
          <div className="space-y-1">
            {field.options?.map((opt, i) => (
              <label key={i} className="flex items-center gap-2">
                <input type={field.type} disabled={!preview} />
                {preview ? (
                  <span className="text-sm">{opt}</span>
                ) : (
                  <EditableText
                    text={opt}
                    onChange={(val) => onUpdateOption(field.uid, i, val)}
                    className="text-sm"
                  />
                )}
              </label>
            ))}
            {!preview && (
              <button
                type="button"
                className="text-blue-600 text-sm hover:underline"
                onClick={() => onAddOption(field.uid)}
              >
                + Add Option
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Main builder
export default function FormBuilder() {
  const [formFields, setFormFields] = useState([]);
  const [preview, setPreview] = useState(false);
  const sensors = useSensors(useSensor(PointerSensor));

  // Add field
  const addField = (template) => {
    const newField = {
      ...template,
      uid: uid(),
      label: template.label,
      options: template.options ? [...template.options] : undefined,
    };
    setFormFields((prev) => [...prev, newField]);
  };

  // Update field
  const updateField = (uidVal, key, value) => {
    setFormFields((prev) =>
      prev.map((f) => (f.uid === uidVal ? { ...f, [key]: value } : f))
    );
  };

  // Update option
  const updateOption = (uidVal, index, value) => {
    setFormFields((prev) =>
      prev.map((f) =>
        f.uid === uidVal
          ? {
              ...f,
              options: f.options.map((opt, i) => (i === index ? value : opt)),
            }
          : f
      )
    );
  };

  // Add option
  const addOption = (uidVal) => {
    setFormFields((prev) =>
      prev.map((f) =>
        f.uid === uidVal
          ? {
              ...f,
              options: [
                ...(f.options || []),
                `Option ${f.options.length + 1}`,
              ],
            }
          : f
      )
    );
  };

  // Remove field
  const removeField = (uidVal) => {
    setFormFields((prev) => prev.filter((f) => f.uid !== uidVal));
  };

  // Reorder
  const handleDragEnd = ({ active, over }) => {
    if (!over) return;
    if (active.id !== over.id) {
      const oldIndex = formFields.findIndex((f) => f.uid === active.id);
      const newIndex = formFields.findIndex((f) => f.uid === over.id);
      setFormFields((fields) => arrayMove(fields, oldIndex, newIndex));
    }
  };

  return (
    <div className="p-6 flex gap-6">
      {/* Left: Palette */}
      {!preview && (
        <div className="w-1/4 bg-gray-50 border rounded p-4">
          <h3 className="font-bold mb-3">Available Fields</h3>
          {fieldTypes.map((f) => (
            <button
              key={f.id}
              className="w-full text-left mb-2 px-3 py-2 border rounded bg-white hover:bg-gray-100 text-sm"
              onClick={() => addField(f)}
            >
              {f.label}
            </button>
          ))}
        </div>
      )}

      {/* Right: Canvas */}
      <div className="flex-1">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-bold">
            {preview ? "Preview Form" : "Canvas"}
          </h3>
          <button
            className="px-3 py-1 border rounded bg-blue-600 text-white text-sm"
            onClick={() => setPreview(!preview)}
          >
            {preview ? "Back to Builder" : "Preview Form"}
          </button>
        </div>

        <div
          className={`${
            preview
              ? "bg-white shadow-lg border p-8 max-w-2xl mx-auto"
              : "bg-gray-100 border rounded p-4 min-h-[300px]"
          }`}
        >
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={formFields.map((f) => f.uid)}
              strategy={verticalListSortingStrategy}
            >
              {formFields.length === 0 && !preview && (
                <div className="text-sm text-gray-500">
                  No fields yet — add from the left.
                </div>
              )}
              {formFields.map((field) => (
                <SortableItem
                  key={field.uid}
                  field={field}
                  onUpdate={updateField}
                  onRemove={removeField}
                  onAddOption={addOption}
                  onUpdateOption={updateOption}
                  preview={preview}
                />
              ))}
            </SortableContext>
          </DndContext>
        </div>
      </div>
    </div>
  );
}
