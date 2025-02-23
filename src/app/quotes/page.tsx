'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Home,
  Building2,
  Building,
  Palmtree,
  FileQuestion,
  Calendar,
  DollarSign,
  CheckCircle2,
  XCircle,
  FileEdit,
  Send,
  Trash2
} from "lucide-react";

interface Client {
  _id: string;
  name: string;
  email: string;
}

interface PropertyDetails {
  address: string;
  type: 'house' | 'apartment' | 'office' | 'land' | 'other';
  size: number;
  bedrooms: number;
  bathrooms: number;
  condition: 'excellent' | 'good' | 'fair' | 'needs_work';
}

interface Quote {
  _id: string;
  client: Client;
  propertyDetails: PropertyDetails;
  status: 'draft' | 'sent' | 'accepted' | 'rejected';
  totalAmount: number;
  validUntil: string;
  notes?: string;
}

const propertyTypes = [
  { value: 'house', label: 'House', icon: Home },
  { value: 'apartment', label: 'Apartment', icon: Building2 },
  { value: 'office', label: 'Office', icon: Building },
  { value: 'land', label: 'Land', icon: Palmtree },
  { value: 'other', label: 'Other', icon: FileQuestion },
];

const propertyConditions = [
  { value: 'excellent', label: 'Excellent' },
  { value: 'good', label: 'Good' },
  { value: 'fair', label: 'Fair' },
  { value: 'needs_work', label: 'Needs Work' },
];

const statusColors: Record<Quote['status'], "default" | "secondary" | "destructive" | "outline"> = {
  draft: 'default',
  sent: 'secondary',
  accepted: 'outline',
  rejected: 'destructive',
};

export default function QuotesPage() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [formData, setFormData] = useState({
    client: '',
    propertyDetails: {
      address: '',
      type: 'house',
      size: 0,
      bedrooms: 0,
      bathrooms: 0,
      condition: 'good'
    },
    totalAmount: 0,
    validUntil: '',
    notes: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const fetchQuotes = useCallback(async () => {
    try {
      const response = await fetch('/api/quotes');
      const data = await response.json();
      setQuotes(data);
    } catch (error) {
      console.error('Error fetching quotes:', error);
    }
  }, []);

  const fetchClients = useCallback(async () => {
    try {
      const response = await fetch('/api/clients');
      const data = await response.json();
      setClients(data);
    } catch (error) {
      console.error('Error fetching clients:', error);
    }
  }, []);

  useEffect(() => {
    fetchQuotes();
    fetchClients();
  }, [fetchQuotes, fetchClients]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/quotes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Error creating quote');
      }

      setFormData({
        client: '',
        propertyDetails: {
          address: '',
          type: 'house',
          size: 0,
          bedrooms: 0,
          bathrooms: 0,
          condition: 'good'
        },
        totalAmount: 0,
        validUntil: '',
        notes: ''
      });
      fetchQuotes();
      console.log('Quote created successfully');
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this quote?')) return;

    try {
      const response = await fetch(`/api/quotes/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Error deleting quote');
      }

      fetchQuotes();
      console.log('Quote deleted successfully');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const getStatusIcon = (status: Quote['status']) => {
    switch (status) {
      case 'draft':
        return <FileEdit className="h-4 w-4" />;
      case 'sent':
        return <Send className="h-4 w-4" />;
      case 'accepted':
        return <CheckCircle2 className="h-4 w-4" />;
      case 'rejected':
        return <XCircle className="h-4 w-4" />;
    }
  };

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Quotes</h2>
      </div>
      <Separator />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-3 p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="client">Client</Label>
              <Select
                value={formData.client}
                onValueChange={(value) => setFormData({ ...formData, client: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a client" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((client) => (
                    <SelectItem key={client._id} value={client._id}>
                      {client.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Property Details</Label>
              <Card className="p-4 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    placeholder="Property address"
                    value={formData.propertyDetails.address}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        propertyDetails: { ...formData.propertyDetails, address: e.target.value },
                      })
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Type</Label>
                  <Select
                    value={formData.propertyDetails.type}
                    onValueChange={(value: 'house' | 'apartment' | 'office' | 'land' | 'other') =>
                      setFormData({
                        ...formData,
                        propertyDetails: { ...formData.propertyDetails, type: value },
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {propertyTypes.map(({ value, label, icon: Icon }) => (
                        <SelectItem key={value} value={value}>
                          <div className="flex items-center space-x-2">
                            <Icon className="h-4 w-4" />
                            <span>{label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="size">Size (m²)</Label>
                    <Input
                      id="size"
                      type="number"
                      min="0"
                      value={formData.propertyDetails.size}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          propertyDetails: {
                            ...formData.propertyDetails,
                            size: parseInt(e.target.value) || 0,
                          },
                        })
                      }
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="condition">Condition</Label>
                    <Select
                      value={formData.propertyDetails.condition}
                      onValueChange={(value: 'excellent' | 'good' | 'fair' | 'needs_work') =>
                        setFormData({
                          ...formData,
                          propertyDetails: { ...formData.propertyDetails, condition: value },
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {propertyConditions.map(({ value, label }) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bedrooms">Bedrooms</Label>
                    <Input
                      id="bedrooms"
                      type="number"
                      min="0"
                      value={formData.propertyDetails.bedrooms}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          propertyDetails: {
                            ...formData.propertyDetails,
                            bedrooms: parseInt(e.target.value) || 0,
                          },
                        })
                      }
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bathrooms">Bathrooms</Label>
                    <Input
                      id="bathrooms"
                      type="number"
                      min="0"
                      value={formData.propertyDetails.bathrooms}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          propertyDetails: {
                            ...formData.propertyDetails,
                            bathrooms: parseInt(e.target.value) || 0,
                          },
                        })
                      }
                      required
                    />
                  </div>
                </div>
              </Card>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="totalAmount">Total Amount</Label>
                <div className="relative">
                  <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="totalAmount"
                    type="number"
                    min="0"
                    className="pl-8"
                    value={formData.totalAmount}
                    onChange={(e) =>
                      setFormData({ ...formData, totalAmount: parseInt(e.target.value) || 0 })
                    }
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="validUntil">Valid Until</Label>
                <div className="relative">
                  <Calendar className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="validUntil"
                    type="date"
                    className="pl-8"
                    value={formData.validUntil}
                    onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                placeholder="Additional notes..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Quote"}
            </Button>
          </form>
        </Card>

        <Card className="col-span-4 p-6">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client</TableHead>
                  <TableHead>Property</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {quotes.map((quote) => (
                  <TableRow key={quote._id}>
                    <TableCell className="font-medium">{quote.client.name}</TableCell>
                    <TableCell>
                      <div className="flex flex-col space-y-1">
                        <div className="flex items-center space-x-2">
                          {(() => {
                            const IconComponent = propertyTypes.find(t => t.value === quote.propertyDetails.type)?.icon;
                            return IconComponent ? <IconComponent className="h-4 w-4" /> : null;
                          })()}
                          <span className="text-sm">
                            {quote.propertyDetails.address}
                          </span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {quote.propertyDetails.size}m² • {quote.propertyDetails.bedrooms} bed • {quote.propertyDetails.bathrooms} bath
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <DollarSign className="h-4 w-4" />
                        <span>{quote.totalAmount.toLocaleString()}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusColors[quote.status]} className="flex w-fit items-center space-x-1">
                        {getStatusIcon(quote.status)}
                        <span>{quote.status.charAt(0).toUpperCase() + quote.status.slice(1)}</span>
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(quote._id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>
    </div>
  );
}
