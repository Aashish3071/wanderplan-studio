import { useState } from 'react';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link';
import {
  Calendar,
  MapPin,
  Image as ImageIcon,
  Users,
  Info,
  ArrowLeft,
  Calendar as CalendarIcon,
  CheckCircle,
  Loader2,
} from 'lucide-react';
import { TripStatus } from '@prisma/client';
import axios from 'axios';

export default function NewTrip() {
  const { data: session, status } = useSession({
    required: false,
  });

  const router = useRouter();

  const [formData, setFormData] = useState({
    title: '',
    destination: '',
    startDate: '',
    endDate: '',
    description: '',
    isPublic: false,
    status: 'PLANNING' as TripStatus,
    coverImage: null as File | null,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFormData((prev) => ({
        ...prev,
        coverImage: e.target.files![0],
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSuccessMessage('');

    try {
      // Validate dates
      if (!validateDateRange()) {
        throw new Error('End date must be after start date');
      }

      // Send data to API
      const tripData = {
        title: formData.title,
        description: formData.description || '',
        destination: formData.destination,
        startDate: formData.startDate,
        endDate: formData.endDate,
        isPublic: formData.isPublic,
        status: formData.status,
      };

      // Call the API to create the trip
      const response = await axios.post('/api/trips', tripData);

      if (!response.data.success) {
        throw new Error(response.data.error || 'Failed to create trip');
      }

      // Handle cover image upload if provided
      if (formData.coverImage && response.data.data.id) {
        const imageData = new FormData();
        imageData.append('coverImage', formData.coverImage);

        await axios.post(`/api/trips/${response.data.data.id}/cover-image`, imageData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      }

      setSuccessMessage('Trip created successfully!');

      // Redirect after showing success message
      setTimeout(() => {
        router.push('/trips');
      }, 2000);
    } catch (err: any) {
      console.error('Error creating trip:', err);
      setError(err.message || 'Failed to create trip. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const validateDateRange = () => {
    if (!formData.startDate || !formData.endDate) return true;

    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);

    return start <= end;
  };

  if (status === 'loading') {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>;
  }

  return (
    <>
      <Head>
        <title>Create New Trip | WanderPlan Studio</title>
      </Head>

      <div className="min-h-screen bg-gray-50 pb-12">
        {/* Header */}
        <div className="mb-6 border-b border-gray-200 bg-white">
          <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
            <div className="flex items-center">
              <Link href="/trips" className="mr-4 text-gray-500 hover:text-gray-700">
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Create New Trip</h1>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          {/* Form */}
          <div className="overflow-hidden rounded-lg bg-white shadow">
            <form onSubmit={handleSubmit} className="p-6">
              {error && (
                <div className="mb-6 border-l-4 border-red-400 bg-red-50 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <Info className="h-5 w-5 text-red-400" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-red-700">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              {successMessage && (
                <div className="mb-6 border-l-4 border-green-400 bg-green-50 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <CheckCircle className="h-5 w-5 text-green-400" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-green-700">{successMessage}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* Trip Title */}
                <div className="col-span-2">
                  <label htmlFor="title" className="mb-1 block text-sm font-medium text-gray-700">
                    Trip Title*
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    required
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g. Summer in Paris"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>

                {/* Destination */}
                <div className="col-span-2 md:col-span-1">
                  <label
                    htmlFor="destination"
                    className="mb-1 block text-sm font-medium text-gray-700"
                  >
                    Destination*
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <MapPin className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="destination"
                      name="destination"
                      required
                      value={formData.destination}
                      onChange={handleChange}
                      placeholder="e.g. Paris, France"
                      className="block w-full rounded-md border-gray-300 pl-10 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                  </div>
                </div>

                {/* Status */}
                <div className="col-span-2 md:col-span-1">
                  <label htmlFor="status" className="mb-1 block text-sm font-medium text-gray-700">
                    Trip Status
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  >
                    <option value="DRAFT">Draft</option>
                    <option value="PLANNING">Planning</option>
                    <option value="CONFIRMED">Confirmed</option>
                  </select>
                </div>

                {/* Date Range */}
                <div className="col-span-2 grid grid-cols-2 gap-4 md:col-span-1">
                  <div>
                    <label
                      htmlFor="startDate"
                      className="mb-1 block text-sm font-medium text-gray-700"
                    >
                      Start Date*
                    </label>
                    <div className="relative rounded-md shadow-sm">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <CalendarIcon className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="date"
                        id="startDate"
                        name="startDate"
                        required
                        value={formData.startDate}
                        onChange={handleChange}
                        className="block w-full rounded-md border-gray-300 pl-10 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="endDate"
                      className="mb-1 block text-sm font-medium text-gray-700"
                    >
                      End Date*
                    </label>
                    <div className="relative rounded-md shadow-sm">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <CalendarIcon className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="date"
                        id="endDate"
                        name="endDate"
                        required
                        value={formData.endDate}
                        onChange={handleChange}
                        className="block w-full rounded-md border-gray-300 pl-10 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      />
                    </div>
                  </div>
                  {formData.startDate && formData.endDate && !validateDateRange() && (
                    <p className="col-span-2 text-sm text-red-600">
                      End date must be after start date
                    </p>
                  )}
                </div>

                {/* Description */}
                <div className="col-span-2">
                  <label
                    htmlFor="description"
                    className="mb-1 block text-sm font-medium text-gray-700"
                  >
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={4}
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="What are you planning for this trip?"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>

                {/* Cover Image */}
                <div className="col-span-2">
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Cover Image
                  </label>
                  <div className="mt-1 flex justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pb-6 pt-5">
                    <div className="space-y-1 text-center">
                      <div className="flex text-sm text-gray-600">
                        <label
                          htmlFor="coverImage"
                          className="relative cursor-pointer rounded-md bg-white font-medium text-blue-600 focus-within:outline-none hover:text-blue-500"
                        >
                          <div className="flex flex-col items-center">
                            <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                            <span>Upload a file</span>
                            <input
                              id="coverImage"
                              name="coverImage"
                              type="file"
                              className="sr-only"
                              onChange={handleImageChange}
                              accept="image/*"
                            />
                          </div>
                        </label>
                      </div>
                      <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                      {formData.coverImage && (
                        <div className="mt-2">
                          <p className="text-sm text-gray-700">
                            Selected: {(formData.coverImage as File).name}
                          </p>
                          {URL.createObjectURL && (
                            <img
                              src={URL.createObjectURL(formData.coverImage)}
                              alt="Preview"
                              className="mx-auto mt-2 h-24 w-auto rounded-md"
                            />
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Privacy Setting */}
                <div className="col-span-2">
                  <div className="relative flex items-start">
                    <div className="flex h-5 items-center">
                      <input
                        id="isPublic"
                        name="isPublic"
                        type="checkbox"
                        checked={formData.isPublic}
                        onChange={handleChange}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="isPublic" className="font-medium text-gray-700">
                        Make this trip public
                      </label>
                      <p className="text-gray-500">Public trips can be discovered by other users</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-end border-t border-gray-200 pt-6">
                <Link
                  href="/trips"
                  className="mr-3 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={isSubmitting || !validateDateRange()}
                  className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="-ml-1 mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    'Create Trip'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
