"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Palette,
  Type,
  Layout,
  Eye,
  Save,
  RotateCcw,
  Paintbrush,
  AlignLeft,
  AlignCenter,
  AlignRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

interface TemplateColors {
  primary: string;
  secondary: string;
  accent: string;
  text: string;
  background: string;
}

interface TemplateLayout {
  headerStyle: "minimal" | "bold" | "creative";
  logoPosition: "left" | "center" | "right";
  colorScheme: TemplateColors;
  fontFamily: string;
  showBorder: boolean;
  showWatermark: boolean;
}

interface InvoiceTemplate {
  name: string;
  description: string;
  layout: TemplateLayout;
}

const colorPresets = [
  {
    name: "Professional Blue",
    colors: {
      primary: "#2563eb",
      secondary: "#64748b",
      accent: "#0ea5e9",
      text: "#1e293b",
      background: "#ffffff",
    },
  },
  {
    name: "Modern Green",
    colors: {
      primary: "#059669",
      secondary: "#6b7280",
      accent: "#10b981",
      text: "#111827",
      background: "#ffffff",
    },
  },
  {
    name: "Elegant Purple",
    colors: {
      primary: "#7c3aed",
      secondary: "#64748b",
      accent: "#8b5cf6",
      text: "#1e293b",
      background: "#ffffff",
    },
  },
  {
    name: "Warm Orange",
    colors: {
      primary: "#ea580c",
      secondary: "#6b7280",
      accent: "#f97316",
      text: "#111827",
      background: "#ffffff",
    },
  },
];

const fontOptions = [
  { label: "Inter", value: "Inter, sans-serif" },
  { label: "Helvetica", value: "Helvetica, Arial, sans-serif" },
  { label: "Times New Roman", value: "Times New Roman, serif" },
  { label: "Roboto", value: "Roboto, sans-serif" },
  { label: "Open Sans", value: "Open Sans, sans-serif" },
];

export default function TemplateDesigner() {
  const [template, setTemplate] = useState<InvoiceTemplate>({
    name: "My Custom Template",
    description: "A professional invoice template",
    layout: {
      headerStyle: "minimal",
      logoPosition: "left",
      colorScheme: colorPresets[0].colors,
      fontFamily: "Inter, sans-serif",
      showBorder: false,
      showWatermark: false,
    },
  });

  const [previewMode, setPreviewMode] = useState(false);

  const updateLayout = (key: keyof TemplateLayout, value: any) => {
    setTemplate((prev) => ({
      ...prev,
      layout: {
        ...prev.layout,
        [key]: value,
      },
    }));
  };

  const updateColor = (colorKey: keyof TemplateColors, value: string) => {
    setTemplate((prev) => ({
      ...prev,
      layout: {
        ...prev.layout,
        colorScheme: {
          ...prev.layout.colorScheme,
          [colorKey]: value,
        },
      },
    }));
  };

  const applyColorPreset = (colors: TemplateColors) => {
    setTemplate((prev) => ({
      ...prev,
      layout: {
        ...prev.layout,
        colorScheme: colors,
      },
    }));
  };

  const resetTemplate = () => {
    setTemplate({
      name: "My Custom Template",
      description: "A professional invoice template",
      layout: {
        headerStyle: "minimal",
        logoPosition: "left",
        colorScheme: colorPresets[0].colors,
        fontFamily: "Inter, sans-serif",
        showBorder: false,
        showWatermark: false,
      },
    });
  };

  const saveTemplate = () => {
    // Save template logic
    console.log("Saving template:", template);
  };

  // Mock invoice data for preview
  const mockInvoiceData = {
    invoiceNumber: "INV-2024-001",
    company: {
      name: "Your Company Name",
      address: "123 Business Street\nCity, State 12345",
      phone: "+1 (555) 123-4567",
      email: "hello@company.com",
      logoUrl: "/placeholder-logo.png",
    },
    customer: {
      name: "John Doe",
      address: "456 Customer Ave\nCustomer City, State 67890",
      email: "john@example.com",
    },
    items: [
      {
        description: "Web Design Services",
        quantity: 1,
        price: 1500,
        total: 1500,
      },
      { description: "Logo Design", quantity: 2, price: 250, total: 500 },
    ],
    subtotal: 2000,
    tax: 200,
    total: 2200,
    issueDate: "2024-01-15",
    dueDate: "2024-02-15",
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center"
      >
        <div>
          <h1 className="text-3xl font-bold">Template Designer</h1>
          <p className="text-gray-600 mt-1">
            Create and customize your invoice templates
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => setPreviewMode(!previewMode)}
            className="flex items-center gap-2"
          >
            <Eye size={16} />
            {previewMode ? "Edit" : "Preview"}
          </Button>
          <Button
            variant="outline"
            onClick={resetTemplate}
            className="flex items-center gap-2"
          >
            <RotateCcw size={16} />
            Reset
          </Button>
          <Button onClick={saveTemplate} className="flex items-center gap-2">
            <Save size={16} />
            Save Template
          </Button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Design Controls */}
        {!previewMode && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1 space-y-6"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Paintbrush size={18} />
                  Template Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="template-name">Template Name</Label>
                  <Input
                    id="template-name"
                    value={template.name}
                    onChange={(e) =>
                      setTemplate({ ...template, name: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="template-description">Description</Label>
                  <Input
                    id="template-description"
                    value={template.description}
                    onChange={(e) =>
                      setTemplate({ ...template, description: e.target.value })
                    }
                  />
                </div>
              </CardContent>
            </Card>

            <Tabs defaultValue="colors" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="colors">Colors</TabsTrigger>
                <TabsTrigger value="layout">Layout</TabsTrigger>
                <TabsTrigger value="styling">Styling</TabsTrigger>
              </TabsList>

              <TabsContent value="colors" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Palette size={18} />
                      Color Scheme
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      {colorPresets.map((preset, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          className="h-auto p-3 flex flex-col items-start"
                          onClick={() => applyColorPreset(preset.colors)}
                        >
                          <div className="flex gap-2 mb-2">
                            <div
                              className="w-4 h-4 rounded"
                              style={{ backgroundColor: preset.colors.primary }}
                            />
                            <div
                              className="w-4 h-4 rounded"
                              style={{ backgroundColor: preset.colors.accent }}
                            />
                          </div>
                          <span className="text-sm">{preset.name}</span>
                        </Button>
                      ))}
                    </div>

                    <Separator />

                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label>Primary Color</Label>
                          <div className="flex gap-2 items-center">
                            <Input
                              type="color"
                              value={template.layout.colorScheme.primary}
                              onChange={(e) =>
                                updateColor("primary", e.target.value)
                              }
                              className="w-12 h-8 p-1 border"
                            />
                            <Input
                              value={template.layout.colorScheme.primary}
                              onChange={(e) =>
                                updateColor("primary", e.target.value)
                              }
                              className="flex-1 text-sm"
                            />
                          </div>
                        </div>
                        <div>
                          <Label>Secondary Color</Label>
                          <div className="flex gap-2 items-center">
                            <Input
                              type="color"
                              value={template.layout.colorScheme.secondary}
                              onChange={(e) =>
                                updateColor("secondary", e.target.value)
                              }
                              className="w-12 h-8 p-1 border"
                            />
                            <Input
                              value={template.layout.colorScheme.secondary}
                              onChange={(e) =>
                                updateColor("secondary", e.target.value)
                              }
                              className="flex-1 text-sm"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label>Accent Color</Label>
                          <div className="flex gap-2 items-center">
                            <Input
                              type="color"
                              value={template.layout.colorScheme.accent}
                              onChange={(e) =>
                                updateColor("accent", e.target.value)
                              }
                              className="w-12 h-8 p-1 border"
                            />
                            <Input
                              value={template.layout.colorScheme.accent}
                              onChange={(e) =>
                                updateColor("accent", e.target.value)
                              }
                              className="flex-1 text-sm"
                            />
                          </div>
                        </div>
                        <div>
                          <Label>Text Color</Label>
                          <div className="flex gap-2 items-center">
                            <Input
                              type="color"
                              value={template.layout.colorScheme.text}
                              onChange={(e) =>
                                updateColor("text", e.target.value)
                              }
                              className="w-12 h-8 p-1 border"
                            />
                            <Input
                              value={template.layout.colorScheme.text}
                              onChange={(e) =>
                                updateColor("text", e.target.value)
                              }
                              className="flex-1 text-sm"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="layout" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Layout size={18} />
                      Layout Options
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Header Style</Label>
                      <Select
                        value={template.layout.headerStyle}
                        onValueChange={(
                          value: "minimal" | "bold" | "creative"
                        ) => updateLayout("headerStyle", value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="minimal">Minimal</SelectItem>
                          <SelectItem value="bold">Bold</SelectItem>
                          <SelectItem value="creative">Creative</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Logo Position</Label>
                      <div className="flex gap-2 mt-2">
                        {[
                          { value: "left", icon: AlignLeft, label: "Left" },
                          {
                            value: "center",
                            icon: AlignCenter,
                            label: "Center",
                          },
                          { value: "right", icon: AlignRight, label: "Right" },
                        ].map(({ value, icon: Icon, label }) => (
                          <Button
                            key={value}
                            variant={
                              template.layout.logoPosition === value
                                ? "default"
                                : "outline"
                            }
                            size="sm"
                            onClick={() =>
                              updateLayout(
                                "logoPosition",
                                value as "left" | "center" | "right"
                              )
                            }
                            className="flex items-center gap-1"
                          >
                            <Icon size={14} />
                            {label}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="styling" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Type size={18} />
                      Typography & Style
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Font Family</Label>
                      <Select
                        value={template.layout.fontFamily}
                        onValueChange={(value) =>
                          updateLayout("fontFamily", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {fontOptions.map((font) => (
                            <SelectItem key={font.value} value={font.value}>
                              {font.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="show-border">Show Border</Label>
                        <Switch
                          id="show-border"
                          checked={template.layout.showBorder}
                          onCheckedChange={(checked) =>
                            updateLayout("showBorder", checked)
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <Label htmlFor="show-watermark">Show Watermark</Label>
                        <Switch
                          id="show-watermark"
                          checked={template.layout.showWatermark}
                          onCheckedChange={(checked) =>
                            updateLayout("showWatermark", checked)
                          }
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </motion.div>
        )}

        {/* Preview */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className={previewMode ? "col-span-full" : "lg:col-span-2"}
        >
          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle>Preview</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div
                className="min-h-[800px] bg-white p-8"
                style={{
                  fontFamily: template.layout.fontFamily,
                  color: template.layout.colorScheme.text,
                  border: template.layout.showBorder
                    ? `2px solid ${template.layout.colorScheme.primary}`
                    : "none",
                }}
              >
                {/* Header */}
                <div
                  className={`mb-8 ${
                    template.layout.headerStyle === "bold"
                      ? "bg-gradient-to-r p-6 rounded-lg"
                      : template.layout.headerStyle === "creative"
                        ? "relative overflow-hidden p-6 rounded-xl"
                        : "pb-6 border-b-2"
                  }`}
                  style={{
                    backgroundColor:
                      template.layout.headerStyle !== "minimal"
                        ? template.layout.colorScheme.primary
                        : "transparent",
                    borderColor:
                      template.layout.headerStyle === "minimal"
                        ? template.layout.colorScheme.primary
                        : "transparent",
                    color:
                      template.layout.headerStyle !== "minimal"
                        ? "#ffffff"
                        : template.layout.colorScheme.text,
                  }}
                >
                  {template.layout.headerStyle === "creative" && (
                    <div
                      className="absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-20"
                      style={{
                        backgroundColor: template.layout.colorScheme.accent,
                      }}
                    />
                  )}

                  <div
                    className={`flex items-start ${
                      template.layout.logoPosition === "center"
                        ? "flex-col items-center text-center"
                        : template.layout.logoPosition === "right"
                          ? "flex-row-reverse justify-between"
                          : "justify-between"
                    }`}
                  >
                    {/* Company Info */}
                    <div
                      className={
                        template.layout.logoPosition === "center"
                          ? "order-2 mt-4"
                          : ""
                      }
                    >
                      <h1 className="text-3xl font-bold mb-2">
                        {mockInvoiceData.company.name}
                      </h1>
                      <div className="text-sm opacity-90 whitespace-pre-line">
                        {mockInvoiceData.company.address}
                      </div>
                      <div className="text-sm mt-2 opacity-90">
                        {mockInvoiceData.company.phone} •{" "}
                        {mockInvoiceData.company.email}
                      </div>
                    </div>

                    {/* Logo Placeholder */}
                    <div
                      className={`${
                        template.layout.logoPosition === "center"
                          ? "order-1"
                          : ""
                      }`}
                    >
                      <div
                        className="w-20 h-20 rounded-lg flex items-center justify-center text-xs font-medium"
                        style={{
                          backgroundColor:
                            template.layout.headerStyle !== "minimal"
                              ? "rgba(255,255,255,0.2)"
                              : template.layout.colorScheme.accent,
                          color:
                            template.layout.headerStyle !== "minimal"
                              ? "#ffffff"
                              : "#ffffff",
                        }}
                      >
                        LOGO
                      </div>
                    </div>
                  </div>
                </div>

                {/* Invoice Details */}
                <div className="grid grid-cols-2 gap-8 mb-8">
                  <div>
                    <h2
                      className="text-lg font-semibold mb-4"
                      style={{ color: template.layout.colorScheme.primary }}
                    >
                      Bill To:
                    </h2>
                    <div className="space-y-1">
                      <div className="font-medium">
                        {mockInvoiceData.customer.name}
                      </div>
                      <div className="text-sm whitespace-pre-line">
                        {mockInvoiceData.customer.address}
                      </div>
                      <div className="text-sm">
                        {mockInvoiceData.customer.email}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="mb-4">
                      <h1
                        className="text-4xl font-bold mb-2"
                        style={{ color: template.layout.colorScheme.primary }}
                      >
                        INVOICE
                      </h1>
                      <div className="text-sm space-y-1">
                        <div>
                          <strong>Invoice #:</strong>{" "}
                          {mockInvoiceData.invoiceNumber}
                        </div>
                        <div>
                          <strong>Date:</strong>{" "}
                          {new Date(
                            mockInvoiceData.issueDate
                          ).toLocaleDateString()}
                        </div>
                        <div>
                          <strong>Due Date:</strong>{" "}
                          {new Date(
                            mockInvoiceData.dueDate
                          ).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Items Table */}
                <div className="mb-8">
                  <table className="w-full">
                    <thead>
                      <tr
                        style={{
                          backgroundColor: template.layout.colorScheme.primary,
                          color: "#ffffff",
                        }}
                      >
                        <th className="text-left p-3 font-semibold">
                          Description
                        </th>
                        <th className="text-center p-3 font-semibold">Qty</th>
                        <th className="text-right p-3 font-semibold">Price</th>
                        <th className="text-right p-3 font-semibold">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockInvoiceData.items.map((item, index) => (
                        <tr
                          key={index}
                          className={index % 2 === 0 ? "bg-gray-50" : ""}
                          style={{
                            backgroundColor:
                              index % 2 === 0
                                ? `${template.layout.colorScheme.accent}10`
                                : "transparent",
                          }}
                        >
                          <td className="p-3 border-b border-gray-200">
                            {item.description}
                          </td>
                          <td className="p-3 border-b border-gray-200 text-center">
                            {item.quantity}
                          </td>
                          <td className="p-3 border-b border-gray-200 text-right">
                            ${item.price.toFixed(2)}
                          </td>
                          <td className="p-3 border-b border-gray-200 text-right font-medium">
                            ${item.total.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Totals */}
                <div className="flex justify-end mb-8">
                  <div className="w-80">
                    <div className="space-y-2">
                      <div className="flex justify-between py-2">
                        <span>Subtotal:</span>
                        <span>${mockInvoiceData.subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between py-2">
                        <span>Tax:</span>
                        <span>${mockInvoiceData.tax.toFixed(2)}</span>
                      </div>
                      <div
                        className="flex justify-between py-3 border-t-2 text-xl font-bold"
                        style={{
                          borderColor: template.layout.colorScheme.primary,
                          color: template.layout.colorScheme.primary,
                        }}
                      >
                        <span>Total:</span>
                        <span>${mockInvoiceData.total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div
                  className="text-center text-sm"
                  style={{ color: template.layout.colorScheme.secondary }}
                >
                  <div className="mb-2">Thank you for your business!</div>
                  <div>Payment is due within 30 days of invoice date.</div>
                </div>

                {/* Watermark */}
                {template.layout.showWatermark && (
                  <div
                    className="absolute inset-0 flex items-center justify-center pointer-events-none"
                    style={{
                      fontSize: "120px",
                      fontWeight: "bold",
                      color: `${template.layout.colorScheme.primary}05`,
                      transform: "rotate(-45deg)",
                      zIndex: 0,
                    }}
                  >
                    INVOICE
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
