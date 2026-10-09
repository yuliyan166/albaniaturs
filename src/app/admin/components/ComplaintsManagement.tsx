'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { AlertTriangle, MessageSquare, Clock, User } from 'lucide-react';

export default function ComplaintsManagement() {
  const [complaints, setComplaints] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const supabase = createClient();

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      // In production, create a separate complaints table
      // For now, this would query a complaints table if it exists
      setComplaints([{
        id: '1',
        customerName: 'John Doe',
        email: 'john@example.com',
        subject: 'Service Quality Issue',
        description: 'The accommodation was not as described.',
        status: 'pending',
        createdAt: new Date().toISOString(),
      }]);
      
      setLoading(false);
    } catch (err) {
      console.error('Error fetching complaints:', err);
    }
  };

  const updateComplaintStatus = async (complaintId: string, status: 'resolved' | 'closed') => {
    try {
      // In production, update the complaint status in the database
      console.log(`Updating complaint ${complaintId} to ${status}`);
      
      setComplaints(prev => prev.map(c => 
        c.id === complaintId ? { ...c, status } : c
      ));
    } catch (err: any) {
      alert('Failed to update complaint: ' + err.message);
    }
  };

  const getStatusBadge = (status: string) => {
    const statuses: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      in_progress: 'bg-blue-100 text-blue-800',
      resolved: 'bg-green-100 text-green-800',
      closed: 'bg-gray-100 text-gray-800',
    };
    return statuses[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <AlertTriangle className="animate-spin mx-auto text-blue-600" size={32} />
          <p className="mt-4 text-gray-600">Loading complaints...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <AlertTriangle className="text-yellow-600" size={24} />
        <h2 className="text-2xl font-bold text-gray-900">Complaints Management</h2>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <p className="text-sm text-gray-500">Pending</p>
          <p className="text-2xl font-bold text-yellow-600 mt-1">
            {complaints.filter(c => c.status === 'pending').length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <p className="text-sm text-gray-500">In Progress</p>
          <p className="text-2xl font-bold text-blue-600 mt-1">
            {complaints.filter(c => c.status === 'in_progress').length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <p className="text-sm text-gray-500">Resolved</p>
          <p className="text-2xl font-bold text-green-600 mt-1">
            {complaints.filter(c => c.status === 'resolved').length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <p className="text-sm text-gray-500">Closed</p>
          <p className="text-2xl font-bold text-gray-600 mt-1">
            {complaints.filter(c => c.status === 'closed').length}
          </p>
        </div>
      </div>

      {/* Complaints List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {complaints.map((complaint) => (
          <div key={complaint.id} className="p-6 border-b last:border-0 hover:bg-gray-50 transition-colors">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="bg-yellow-100 p-3 rounded-lg">
                  <AlertTriangle className="text-yellow-600" size={24} />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900">{complaint.subject}</h4>
                  <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                    <div className="flex items-center gap-1">
                      <User size={14} />
                      <span>{complaint.customerName}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock size={14} />
                      <span>{new Date(complaint.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <p className="mt-2 text-gray-700">{complaint.description}</p>
                </div>
              </div>
              
              <div className="flex flex-col items-end gap-2">
                <span className={`px-3 py-1 rounded-md text-xs font-medium ${getStatusBadge(complaint.status)}`}>
                  {complaint.status}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => updateComplaintStatus(complaint.id, 'resolved')}
                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg text-xs font-medium flex items-center gap-1 transition-colors"
                  >
                    <MessageSquare size={14} />
                    Resolve
                  </button>
                  <button
                    onClick={() => updateComplaintStatus(complaint.id, 'closed')}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded-lg text-xs font-medium flex items-center gap-1 transition-colors"
                  >
                    <MessageSquare size={14} />
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
