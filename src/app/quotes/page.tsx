'use client';

import { useState, useEffect } from 'react';
import { Card, Title, TextInput, Button, Select, SelectItem, NumberInput } from "@tremor/react";

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
  const [error, setError] = useState('');

  useEffect(() => {
    fetchQuotes();
    fetchClients();
  }, []);

  const fetchQuotes = async () => {
    try {
      const response = await fetch('/api/quotes');
      const data = await response.json();
      setQuotes(data);
    } catch (error) {
      console.error('Error fetching quotes:', error);
      setError('Error loading quotes');
    }
  };

  const fetchClients = async () => {
    try {
      const response = await fetch('/api/clients');
      const data = await response.json();
      setClients(data);
    } catch (error) {
      console.error('Error fetching clients:', error);
      setError('Error loading clients');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

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
    } catch (error) {
      console.error('Error:', error);
      setError('Error creating quote');
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
    } catch (error) {
      console.error('Error:', error);
      setError('Error deleting quote');
    }
  };

  const propertyTypes = [
    { value: 'house', label: 'House' },
    { value: 'apartment', label: 'Apartment' },
    { value: 'office', label: 'Office' },
    { value: 'land', label: 'Land' },
    { value: 'other', label: 'Other' }
  ];

  const conditions = [
    { value: 'excellent', label: 'Excellent' },
    { value: 'good', label: 'Good' },
    { value: 'fair', label: 'Fair' },
    { value: 'needs_work', label: 'Needs Work' }
  ];

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">
        <Title>Quotes Management</Title>

        {/* Add Quote Form */}
        <Card className="bg-white p-6">
          <h2 className="text-xl font-semibold mb-6">Create New Quote</h2>
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Client Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-700">Client Information</h3>
              <div className="w-full">
                <Select
                  value={formData.client}
                  onValueChange={(value) => setFormData({ ...formData, client: value })}
                  placeholder="Select Client"
                  required
                >
                  {clients.map((client) => (
                    <SelectItem key={client._id} value={client._id}>
                      {client.name}
                    </SelectItem>
                  ))}
                </Select>
              </div>
            </div>

            {/* Property Details Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-700">Property Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TextInput
                  placeholder="Property Address"
                  value={formData.propertyDetails.address}
                  onChange={(e) => setFormData({
                    ...formData,
                    propertyDetails: { ...formData.propertyDetails, address: e.target.value }
                  })}
                  required
                />

                <Select
                  value={formData.propertyDetails.type}
                  onValueChange={(value) => setFormData({
                    ...formData,
                    propertyDetails: { ...formData.propertyDetails, type: value as PropertyDetails['type'] }
                  })}
                  placeholder="Property Type"
                  required
                >
                  {propertyTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </Select>

                <div className="relative">
                  <NumberInput
                    placeholder="Size (m²)"
                    value={formData.propertyDetails.size}
                    onValueChange={(value) => setFormData({
                      ...formData,
                      propertyDetails: { ...formData.propertyDetails, size: value }
                    })}
                    required
                  />
                  <span className="absolute right-10 top-1/2 transform -translate-y-1/2 text-gray-500">m²</span>
                </div>

                <Select
                  value={formData.propertyDetails.condition}
                  onValueChange={(value) => setFormData({
                    ...formData,
                    propertyDetails: { ...formData.propertyDetails, condition: value as PropertyDetails['condition'] }
                  })}
                  placeholder="Property Condition"
                  required
                >
                  {conditions.map((condition) => (
                    <SelectItem key={condition.value} value={condition.value}>
                      {condition.label}
                    </SelectItem>
                  ))}
                </Select>

                <div className="relative">
                  <NumberInput
                    placeholder="Bedrooms"
                    value={formData.propertyDetails.bedrooms}
                    onValueChange={(value) => setFormData({
                      ...formData,
                      propertyDetails: { ...formData.propertyDetails, bedrooms: value }
                    })}
                  />
                  <span className="absolute right-10 top-1/2 transform -translate-y-1/2 text-gray-500">rooms</span>
                </div>

                <div className="relative">
                  <NumberInput
                    placeholder="Bathrooms"
                    value={formData.propertyDetails.bathrooms}
                    onValueChange={(value) => setFormData({
                      ...formData,
                      propertyDetails: { ...formData.propertyDetails, bathrooms: value }
                    })}
                  />
                  <span className="absolute right-10 top-1/2 transform -translate-y-1/2 text-gray-500">baths</span>
                </div>
              </div>
            </div>

            {/* Quote Details Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-700">Quote Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <NumberInput
                    placeholder="Total Amount"
                    value={formData.totalAmount}
                    onValueChange={(value) => setFormData({ ...formData, totalAmount: value })}
                    required
                  />
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                </div>

                <div className="relative">
                  <input
                    type="date"
                    value={formData.validUntil}
                    onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    required
                  />
                  <label className="absolute -top-2 left-2 bg-white px-1 text-xs text-gray-500">Valid Until</label>
                </div>

                <div className="col-span-2">
                  <TextInput
                    placeholder="Additional Notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            
            <div className="flex justify-end pt-4">
              <Button
                type="submit"
                loading={isLoading}
                className="bg-primary-600 hover:bg-primary-700"
              >
                Create Quote
              </Button>
            </div>
          </form>
        </Card>

        {/* Quotes List */}
        <Card className="bg-white">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Property
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Valid Until
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {quotes.map((quote) => (
                  <tr key={quote._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{quote.client.name}</div>
                      <div className="text-sm text-gray-500">{quote.client.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{quote.propertyDetails.address}</div>
                      <div className="text-sm text-gray-500">
                        {quote.propertyDetails.size}m² • {quote.propertyDetails.bedrooms} beds • {quote.propertyDetails.bathrooms} baths
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        ${quote.totalAmount.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                        ${quote.status === 'accepted' ? 'bg-green-100 text-green-800' :
                          quote.status === 'rejected' ? 'bg-red-100 text-red-800' :
                          quote.status === 'sent' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'}`}>
                        {quote.status.charAt(0).toUpperCase() + quote.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(quote.validUntil).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleDelete(quote._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
